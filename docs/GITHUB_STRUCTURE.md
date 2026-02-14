# GitHub Structure: Stria

Documentation of Stria's GitHub organization structure, repository conventions, and organizational principles.

---

## 1. Organization Overview

**GitHub Organization:** [Stria-DSP](https://github.com/Stria-DSP)

**Purpose:** Stria is a brand creating algorithmic music tools. The GitHub organization houses all product repositories, each representing a distinct Max for Live device or plugin.

**Positioning:** "Logic, not AI" — deterministic, transparent algorithmic tools for music production.

---

## 2. Current Repository Structure

### 2.1 Active Repositories

| Repository | URL | Description | Status |
|------------|-----|-------------|--------|
| **drift** | [Stria-DSP/drift](https://github.com/Stria-DSP/drift) | Phase-based generative sequencer for Ableton Live (Max for Live) with struck-bar physical modeling synthesizer | Active development |

### 2.2 Repository Organization

Each product repository follows this structure:

```
product-name/
├── .cursor/              # Cursor IDE configuration and rules
│   └── rules/           # Agent rules and project context
├── docs/                # Product documentation
│   ├── BRAND_AND_MARKETING_STRATEGY.md
│   ├── PATCH_ARCHITECTURE.md
│   ├── SIGNAL_CHAIN.md
│   └── [feature-specific docs]
├── research/            # Research notes and references
│   ├── technical.md
│   ├── market.md
│   └── [domain research]
├── src/                 # Source code (Max patches, gen~, etc.)
│   ├── [product].maxpat
│   └── [supporting files]
├── scripts/             # Build and utility scripts
├── PROJECT_BRIEF.md     # Single source of truth for product
├── MVP_PLAN.md         # Development roadmap
├── GTM_PLAN.md         # Go-to-market strategy
├── README.md           # User-facing documentation
└── VERSION             # Semantic version number
```

---

## 3. Repository Naming Conventions

### 3.1 Product Repository Names

**Format:** Single lowercase word (no hyphens, no descriptors)

**Rationale:** Aligns with Stria's product naming philosophy — evocative single words, not descriptive phrases.

| ✅ Correct | ❌ Incorrect |
|-----------|-------------|
| `drift` | `drift-sequencer` |
| `fold` | `folding-engine` |
| `shift` | `phase-shifter` |
| `loop` | `loop-tool-pro` |

### 3.2 Supporting Repositories (Future)

For shared libraries, documentation sites, or tools:

**Format:** Lowercase with hyphens for clarity

Examples:
- `stria-docs` — Marketing/documentation website
- `stria-shared` — Shared Max abstractions or gen~ code
- `stria-presets` — Cross-product preset library

---

## 4. Branch Strategy

### 4.1 Primary Branches

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `main` | Stable releases; production-ready code | Protected; requires review |
| `develop` | Integration branch for features | Optional protection |
| `feature/*` | Individual features or experiments | No protection |
| `release/*` | Release preparation | Protected |

### 4.2 Branch Naming

**Features:** `feature/short-description`  
**Fixes:** `fix/issue-description`  
**Releases:** `release/v1.2.3`  
**Experiments:** `experiment/idea-name`

Examples:
- `feature/modal-bar-synth`
- `fix/transport-sync`
- `release/v0.1.0`
- `experiment/euclidean-rhythm`

---

## 5. Version Control and Releases

### 5.1 Semantic Versioning

All products use **semantic versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes or major new features (e.g., 1.0.0 → 2.0.0)
- **MINOR:** New features, backward-compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH:** Bug fixes, minor improvements (e.g., 1.0.0 → 1.0.1)

Version is stored in `VERSION` file at repository root.

### 5.2 Release Process

1. **Development** on `feature/*` branches
2. **Merge** to `develop` for integration
3. **Create** `release/vX.Y.Z` branch
4. **Test** and finalize in release branch
5. **Merge** to `main` and tag with `vX.Y.Z`
6. **GitHub Release** with changelog and `.amxd` artifact
7. **Deploy** to Gumroad/distribution channels

### 5.3 Release Assets

Each GitHub release includes:
- `.amxd` device file (compiled Max for Live device)
- `README.pdf` or `README.md` (user documentation)
- `CHANGELOG.md` excerpt for that version
- Optional: Demo presets, audio examples

---

## 6. Repository Access and Permissions

### 6.1 Visibility

**Current Policy:** All product repositories are **public**

**Rationale:**
- Transparency aligns with "logic, not AI" positioning
- Enables community contributions and feedback
- Max for Live patches are somewhat transparent by nature
- Actual value is in the complete, polished product

**Future Consideration:** Private repos for:
- Pre-release products (until launch)
- Premium features or enterprise versions
- Proprietary synthesis algorithms (if any)

### 6.2 Team Structure

| Role | Permissions | Members |
|------|-------------|---------|
| **Owner** | Full admin access | @jdavancens |
| **Maintainer** | Write + admin settings | Core team (future) |
| **Contributor** | Write access to specific repos | Collaborators (future) |
| **Community** | Fork and PR | Public |

---

## 7. Future Repository Plan

### 7.1 Planned Product Repositories

Based on [docs/OTHER_IDEAS.md](OTHER_IDEAS.md) and product roadmap:

| Repository | Product Name | Description | Target |
|------------|--------------|-------------|--------|
| `drift` | **Drifter** | Phase-based generative sequencer (current) | ✅ Active |
| `fold` | **Folder** | L-system / recursive sequencer | Future |
| `shift` | **Shifter** | Markov-chain style transfer | Future |
| `tile` | **Tiler** | Wang tiling / aperiodic patterns | Future |
| `meta` | **Meta** | Meta-Hodos parameter sequencer | Future |

### 7.2 Infrastructure Repositories

| Repository | Purpose | Priority |
|------------|---------|----------|
| `stria-docs` | Marketing website (fors.fm-style) | Post-launch |
| `stria-shared` | Shared Max abstractions, gen~ objects | v1.1+ |
| `stria-presets` | Cross-product preset library | Post-launch |
| `.github` | Organization-wide templates, workflows | Low |

---

## 8. Documentation Standards

### 8.1 Required Files (All Product Repos)

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | User-facing: what it is, how to install, quick start | End users |
| `PROJECT_BRIEF.md` | Technical spec, design decisions, context | Developers/contributors |
| `MVP_PLAN.md` | Development roadmap and phases | Project management |
| `GTM_PLAN.md` | Go-to-market strategy | Marketing/launch |
| `CHANGELOG.md` | Version history and changes | Users + developers |
| `LICENSE` | Software license (TBD: proprietary or open-source) | Legal |

### 8.2 Optional Files

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Guidelines for community contributions |
| `CODE_OF_CONDUCT.md` | Community behavior standards |
| `ARCHITECTURE.md` | Deep technical architecture (alternative to PROJECT_BRIEF) |
| `DEVELOPMENT.md` | Setup guide for developers |

---

## 9. Workflow and Automation

### 9.1 GitHub Actions (Current)

No automated workflows currently configured.

### 9.2 Planned Automation

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `test.yml` | Push to `develop` | Run Max patch validation |
| `release.yml` | Tag `vX.Y.Z` | Build `.amxd`, create GitHub release |
| `docs.yml` | Push to `main` | Deploy docs to GitHub Pages |
| `lint.yml` | Pull request | Check Max patch formatting |

---

## 10. Integration with Development Tools

### 10.1 Cursor IDE

All repositories include `.cursor/` directory with:
- **Rules** (`patch-architecture-doc.mdc`, `drift-project.mdc`, etc.)
- **Agent context** for AI-assisted development
- **Project-specific conventions**

These rules ensure consistency across development sessions and context windows.

### 10.2 Version Control for Max Patches

**Challenge:** Max patches are JSON; diffs can be noisy.

**Strategy:**
- Commit complete patches as single units
- Use descriptive commit messages: "Add modal bar synthesis to gen~"
- Tag significant architectural changes
- Optional: Use `git diff --word-diff` for Max patch reviews
- Future: Consider Max patch comparison tools

---

## 11. Licensing and Commercial Use

### 11.1 Current License

**Status:** TBD (needs decision before v1.0 launch)

**Options:**
- **Proprietary:** Closed-source; users license the compiled `.amxd`
- **Source-available:** Code visible (as is), but not open-source licensed
- **Dual:** Open core + paid premium features
- **Open-source:** MIT/GPL with commercial support model

**Recommendation:** Start **proprietary** or **source-available** to protect commercial value while maintaining transparency.

### 11.2 RNBO Export

When exporting to VST3/AU via RNBO:
- No RNBO licensing fee below $200k/year revenue
- Stria owns the exported C++ code
- VST3 plugins require Steinberg SDK (free, open-source)
- AU plugins require Apple Developer ID ($99/year)

See [research/rnbo.md](../research/rnbo.md) for details.

---

## 12. Communication Channels

### 12.1 GitHub-Based

| Channel | Purpose |
|---------|---------|
| **Issues** | Bug reports, feature requests, questions |
| **Discussions** | Community Q&A, show-and-tell, ideas |
| **Pull Requests** | Code contributions from community |
| **Releases** | Announcements of new versions |

### 12.2 External (Planned)

- **Discord/Slack:** Real-time community chat (post-launch)
- **Email/Newsletter:** Product updates, tutorials (Gumroad + Mailchimp)
- **YouTube:** Demos, tutorials, artist features
- **Reddit:** r/MaxMSP, r/ableton for launch announcements

---

## 13. Backup and Continuity

### 13.1 GitHub as Source of Truth

All code, documentation, and project history lives in GitHub. No external dependencies for source control.

### 13.2 Local Development

Developers should:
- Clone repositories locally
- Work on feature branches
- Push frequently to remote
- Tag releases consistently

### 13.3 Disaster Recovery

**If GitHub becomes unavailable:**
- All team members have local clones
- Can migrate to GitLab, Bitbucket, or self-hosted Git
- Repository structure is Git-native; not locked to GitHub

---

## 14. Contribution Guidelines (Future)

When Stria accepts community contributions:

### 14.1 Types of Contributions

- **Bug fixes:** Always welcome
- **Feature additions:** Discuss in Issues first
- **Presets/patches:** Artist packs via separate repo
- **Documentation:** Improvements, translations

### 14.2 Process

1. **Fork** the repository
2. **Create** a feature branch (`feature/your-idea`)
3. **Implement** with clear commits
4. **Test** thoroughly (Max patch doesn't crash)
5. **Submit** PR with description of changes
6. **Review** by maintainers
7. **Merge** if approved

---

## 15. Summary

**Organization:** [Stria-DSP](https://github.com/Stria-DSP)  
**Current repos:** `drift` (active development)  
**Future repos:** One per product (fold, shift, tile, etc.) + infrastructure  
**Naming:** Single lowercase words for products  
**Versioning:** Semantic versioning (MAJOR.MINOR.PATCH)  
**Visibility:** Public by default  
**Documentation:** PROJECT_BRIEF, MVP_PLAN, GTM_PLAN, README, CHANGELOG  

This structure supports Stria's goals:
- **Transparent:** Open development, clear documentation
- **Professional:** Consistent conventions, clear versioning
- **Scalable:** One repo per product; easy to add new tools
- **Community-ready:** Issues, Discussions, PRs for future engagement

For updates to this structure, see commit history of this file or contact @jdavancens.

---

*Last updated: February 14, 2026*
