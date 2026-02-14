# Max 8 docs: download and RAG

Use Cycling '74 Max 8 documentation for offline reference and RAG (we're on Max 8; Max 9 docs/PDFs are often applicable).

## 1. Get the docs

Use a virtual environment so installs don’t touch the system Python:

```bash
python3 -m venv .venv && source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Option A: Ref pages (recommended for object lookup)

**Save as you look up:** When looking up a Max object (e.g. in Cursor), the [planedrifter-max](.cursor/rules/planedrifter-max.mdc) rule asks to save the fetched ref page to `research/max8_docs/refpages/<object>.md` (e.g. `phasor_tilde.md`). You can also run:

```bash
python scripts/save_refpage.py "live.grid"
python scripts/save_refpage.py "phasor~"
```

**Batch fetch:** To preload many objects at once:

```bash
python scripts/fetch_max_refpages.py
```

Output: `research/max8_docs/refpages/*.md` (coll, phasor_tilde, snapshot_tilde, etc.)

### Option B: PDFs (User Guide, LOM, Gen, etc.)

Cycling '74 lists PDFs at [docs.cycling74.com/pdfs](https://docs.cycling74.com/pdfs) (Max 9 PDFs; we're on Max 8, content is applicable). There is no separate "Gen guide" or "Gen object reference" PDF; **Gen is covered in the User Guide**. The download script also tries optional Gen-specific slugs (in case they are added later) and **copies any Gen-related PDFs from the Max application directory** if Max 8 or Max 9 is installed in `/Applications`.

```bash
./scripts/download_max_pdfs.sh
```

- **Download:** User Guide, Live Object Model, JS API, Node for Max API, plus optional Gen slugs (may 404).
- **Copy from app:** If `/Applications/Max 8.app` or `Max 9.app` exists, the script finds all `.pdf` files inside and copies any whose filename contains "gen" or "Gen" into `research/max8_pdfs/`.
- Output: `research/max8_pdfs/*.pdf`. If the server returns HTML instead of PDF, use your browser on the PDFs page and “Save as” the links.

## 2. Build the RAG index

From repo root:

```bash
pip install -r requirements.txt
python scripts/rag_max_docs.py build
```

This chunks markdown (and any PDFs in `research/max8_pdfs/`), embeds with `sentence-transformers` (all-MiniLM-L6-v2), and stores in `research/.rag_max8/` (Chromadb). Run after updating ref pages or adding PDFs.

## 3. Query

```bash
python scripts/rag_max_docs.py query "phasor~ lock transport"
python scripts/rag_max_docs.py query "coll list read file"
```

Prints the top-5 relevant chunks. Use this to pull Max 8 ref snippets into prompts or to double-check object behavior (see also [planedrifter-max](.cursor/rules/planedrifter-max.mdc) and [max8_reference.md](max8_reference.md)).

## Summary

| Step              | Command / location                          |
|-------------------|---------------------------------------------|
| Fetch ref pages   | `python scripts/fetch_max_refpages.py`      |
| Download PDFs     | `./scripts/download_max_pdfs.sh`            |
| Build RAG index   | `python scripts/rag_max_docs.py build`      |
| Query             | `python scripts/rag_max_docs.py query "…"`  |

Ignored by git: `research/max8_pdfs/`, `research/.rag_max8/` (see [.gitignore](../.gitignore)).
