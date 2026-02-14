#!/usr/bin/env python3
"""
RAG over Max 8 docs: build index from research/max8_docs (and optional PDFs), query from CLI.
Usage:
  python scripts/rag_max_docs.py build     # build/rebuild vector index
  python scripts/rag_max_docs.py query "phasor~ lock transport"
"""
from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_ROOT / "research" / "max8_docs"
PDFS_DIR = REPO_ROOT / "research" / "max8_pdfs"
CHROMA_DIR = REPO_ROOT / "research" / ".rag_max8"
CHUNK_SIZE = 600
CHUNK_OVERLAP = 100


def _ensure_deps() -> None:
    try:
        import chromadb
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("Missing deps. Install with: pip install chromadb sentence-transformers", file=sys.stderr)
        sys.exit(1)


def _chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def _ingest_markdown() -> list[tuple[str, str, dict]]:
    """Return list of (id, text, metadata)."""
    items = []
    if not DOCS_DIR.exists():
        return items
    for path in DOCS_DIR.rglob("*.md"):
        rel = path.relative_to(DOCS_DIR)
        text = path.read_text(encoding="utf-8")
        for i, chunk in enumerate(_chunk_text(text)):
            doc_id = f"{rel.stem}_{i}"
            items.append((doc_id, chunk, {"source": str(rel)}))
    return items


def _ingest_pdfs() -> list[tuple[str, str, dict]]:
    """Extract text from PDFs in research/max8_pdfs if present."""
    items = []
    try:
        from pypdf import PdfReader
    except ImportError:
        return items
    if not PDFS_DIR.exists():
        return items
    for path in PDFS_DIR.glob("*.pdf"):
        try:
            reader = PdfReader(path)
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                for j, chunk in enumerate(_chunk_text(text)):
                    doc_id = f"pdf_{path.stem}_p{i}_{j}"
                    items.append((doc_id, chunk, {"source": f"pdf:{path.name}", "page": i + 1}))
        except Exception as e:
            print(f"  skip {path.name}: {e}", file=sys.stderr)
    return items


def build_index() -> None:
    _ensure_deps()
    import chromadb
    from sentence_transformers import SentenceTransformer

    all_docs = _ingest_markdown() + _ingest_pdfs()
    if not all_docs:
        print("No docs found. Run scripts/fetch_max_refpages.py first, or add PDFs to research/max8_pdfs.", file=sys.stderr)
        sys.exit(1)

    ids = [d[0] for d in all_docs]
    texts = [d[1] for d in all_docs]
    metadatas = [d[2] for d in all_docs]

    print(f"Chunked {len(all_docs)} segments from Max docs.")
    print("Embedding with sentence-transformers...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts, show_progress_bar=True)

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    try:
        client.delete_collection("max8_docs")
    except Exception:
        pass
    coll = client.create_collection("max8_docs", metadata={"description": "Max 8 documentation chunks"})

    # Chroma expects list of lists for add()
    coll.add(ids=ids, embeddings=embeddings.tolist(), documents=texts, metadatas=metadatas)
    print(f"Index saved to {CHROMA_DIR}")


def query_index(q: str, top_k: int = 5) -> None:
    _ensure_deps()
    import chromadb
    from sentence_transformers import SentenceTransformer

    if not CHROMA_DIR.exists():
        print("No index. Run: python scripts/rag_max_docs.py build", file=sys.stderr)
        sys.exit(1)

    model = SentenceTransformer("all-MiniLM-L6-v2")
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    coll = client.get_collection("max8_docs")
    q_embedding = model.encode([q]).tolist()
    results = coll.query(query_embeddings=q_embedding, n_results=min(top_k, 20), include=["documents", "metadatas"])

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    for i, (doc, meta) in enumerate(zip(docs, metas), 1):
        print(f"\n--- Result {i} (source: {meta.get('source', '?')}) ---")
        print(doc[:1200] + ("..." if len(doc) > 1200 else ""))


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: build | query <question>", file=sys.stderr)
        sys.exit(1)
    cmd = sys.argv[1].lower()
    if cmd == "build":
        build_index()
    elif cmd == "query":
        question = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else ""
        if not question:
            print("Usage: query <question>", file=sys.stderr)
            sys.exit(1)
        query_index(question)
    else:
        print("Unknown command. Use: build | query <question>", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
