# Stria Knowledge Base

RAG-optimized knowledge database for fast retrieval of concepts, patterns, and technical decisions learned during Stria plugin development.

## Purpose

This repository is a **searchable knowledge base** for:
- Technical patterns and solutions (Max/MSP, RNBO, gen~, physical modeling)
- Design decisions and rationale
- Algorithmic composition concepts
- Synthesis and DSP knowledge
- Common problems and solutions
- Best practices and conventions

## Structure

```
knowledge-base/
├── concepts/          # High-level concepts (phasing, L-systems, modal synthesis)
├── technical/         # Technical patterns (Max objects, gen~ code, RNBO export)
├── synthesis/         # Synthesis and DSP knowledge (physical models, filters, effects)
├── algorithms/        # Algorithmic composition techniques
├── decisions/         # Design decisions and trade-offs
├── problems-solutions/ # Common problems and their solutions
└── references/        # External resources, papers, links
```

## Document Format

Each document follows a RAG-friendly structure:

```markdown
# Concept Name

**Tags**: #tag1 #tag2 #tag3
**Related**: [[Other Concept]], [[Related Doc]]
**Context**: Where this applies (e.g. "Drift", "All sequencers", "Physical modeling")

## Summary

One-paragraph summary for quick retrieval.

## Details

[Detailed explanation]

## Examples

[Code, patches, or usage examples]

## References

[Links, papers, related docs]
```

## Usage

### Adding New Knowledge

1. Choose appropriate directory based on type
2. Create markdown file with descriptive name (kebab-case)
3. Use RAG-friendly format (see template above)
4. Add tags for searchability
5. Link to related concepts
6. Commit with clear message

### Searching

This repo is designed for:
- **Full-text search** (grep, ripgrep)
- **RAG/vector search** (embed and index for semantic search)
- **Tag-based filtering** (search for `#max-msp`, `#physical-modeling`, etc.)
- **Link traversal** (follow `[[Related]]` links between concepts)

### RAG Integration

To use with RAG:
1. Embed all markdown files using your preferred model (e.g. OpenAI embeddings, local model)
2. Store in vector database (e.g. Pinecone, Weaviate, local FAISS)
3. Query with natural language: "How do I sync to DAW transport in Max?"
4. Retrieve relevant docs with context

## Maintenance

- **Update regularly**: Add new concepts as you learn them
- **Keep docs atomic**: One concept per file; link between files
- **Tag consistently**: Use consistent tag vocabulary
- **Version control**: Commit frequently; each commit = knowledge checkpoint

## Quick Reference Tags

Common tags to use:

**By Technology:**
- `#max-msp`, `#rnbo`, `#gen~`, `#m4l`, `#vst`, `#au`

**By Domain:**
- `#sequencing`, `#synthesis`, `#physical-modeling`, `#effects`, `#timing`, `#midi`

**By Concept:**
- `#phasing`, `#l-systems`, `#tiling`, `#modal-synthesis`, `#struck-bar`, `#transport-sync`

**By Product:**
- `#drift`, `#future-product`

**By Type:**
- `#pattern`, `#solution`, `#decision`, `#best-practice`, `#pitfall`

---

*Last updated: February 2026*
