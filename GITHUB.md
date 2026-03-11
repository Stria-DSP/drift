# Stria GitHub Organization

Documentation of the Stria-DSP GitHub organization structure, repository conventions, and development workflow.

---

## Organization

**GitHub:** [https://github.com/Stria-DSP](https://github.com/Stria-DSP)

**Owner:** @jdavancens

**Purpose:** Houses all Stria algorithmic music tool products — Max for Live devices, RNBO exports, and supporting infrastructure.

**Brand:** Stria — "Logic, not AI" — deterministic, transparent algorithmic tools for music production.

---

## Current Structure

### Workspace Layout

```
/Users/josephdavancens/dev/stria/
├── drift/                    # Product: Drifter (phase sequencer)
├── reference_code/           # Code references and examples
├── brand/                    # Brand assets and guidelines
├── knowledge-base/           # Shared knowledge and research
├── GITHUB.md                # This file
└── stria.code-workspace     # VS Code workspace config
```

### GitHub Repositories

| Repository | Product | Description | Status |
|------------|---------|-------------|--------|
| [drift](https://github.com/Stria-DSP/drift) | **Drifter** | Phase-based generative sequencer with struck-bar synth | 🟢 Active |

### Planned Repositories

| Name | Product | Description | Priority |
|------|---------|-------------|----------|
| `fold` | **Folder** | L-system / recursive sequencer | Future |
| `shift` | **Shifter** | Markov-chain style transfer | Future |
| `tile` | **Tiler** | Wang tiling / aperiodic patterns | Future |
| `meta` | **Meta** | Meta-Hodos parameter sequencer | Future |

### Infrastructure Repositories (Future)

| Name | Purpose | When |
|------|---------|------|
| `stria-docs` | Marketing website (fors.fm-style) | Post-launch |
| `stria-shared` | Shared Max abstractions, gen~ code | v1.1+ |
| `stria-presets` | Cross-product preset library | Post-launch |
| `.github` | Organization-wide templates, workflows | As needed |

---

## Naming Conventions

### Product Repositories

**Format:** Single lowercase word (no hyphens, no descriptors)

**Philosophy:** Evocative names like Fors (Opal, Pivot, Mass, Void) — not descriptive labels.

| ✅ Good | ❌ Bad |
|--------|--------|
| `drift` | `drift-sequencer` |
| `fold` | `folding-engine` |
| `shift` | `phase-shifter-pro` |
| `loop` | `loop-tool-2024` |

### Infrastructure Repositories

**Format:** `stria-purpose` (kebab-case for clarity)

Examples:
- `stria-docs` — Marketing/documentation site
- `stria-shared` — Shared code libraries
- `stria-presets` — Preset collections

---

## Repository Template

Each product repository follows this structure (drift as reference):

```
product-name/
├── .cursor/              # Cursor IDE rules and AI context
│   └── rules/           # Agent rules for development
├── docs/                 # Technical documentation
│   ├── BRAND_AND_MARKETING_STRATEGY.md
│   ├── PATCH_ARCHITECTURE.md
│   ├── SIGNAL_CHAIN.md
│   └── [feature-specific docs]
├── research/             # Research notes and references
│   ├── technical.md
│   ├── market.md
│   ├── process_music.md
│   └── max8_reference.md
├── src/                  # Source code
│   ├── [product].maxpat # Main Max patcher
│   └── [gen~, js, etc.] # Supporting code
├── scripts/              # Build and utility scripts
├── PROJECT_BRIEF.md      # Single source of truth
├── MVP_PLAN.md          # Development roadmap
├── GTM_PLAN.md          # Go-to-market strategy
├── README.md            # User-facing documentation
├── CHANGELOG.md         # Version history
├── VERSION              # Semantic version number
├── Makefile             # Build automation
├── requirements.txt     # Python dependencies (if any)
└── .gitignore           # Git ignore rules
```

---

## Versioning

All products use **semantic versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes or major new features (e.g., 1.0.0 → 2.0.0)
- **MINOR:** New features, backward-compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH:** Bug fixes, minor improvements (e.g., 1.0.0 → 1.0.1)

**Stored in:** `VERSION` file at repository root (single line, e.g., `0.1.0`)

**Git tags:** Use `v` prefix, e.g., `v1.0.0`

**Example:**
```bash
# Update version
echo "1.0.0" > VERSION

# Commit and tag
git add VERSION
git commit -m "Bump version to 1.0.0"
git tag v1.0.0
git push origin main --tags
```

---

## Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|-----------|
| `main` | Stable releases, production-ready | Protected |
| `develop` | Integration branch for features | Optional |
| `feature/*` | Individual features or experiments | None |
| `fix/*` | Bug fixes | None |
| `release/*` | Release preparation (e.g., `release/v1.0.0`) | Protected |

### Branch Naming

**Features:** `feature/short-description`  
**Fixes:** `fix/issue-description`  
**Releases:** `release/vX.Y.Z`  
**Experiments:** `experiment/idea-name`

**Examples:**
- `feature/modal-bar-synth`
- `fix/transport-sync-drift`
- `release/v0.1.0`
- `experiment/euclidean-rhythm`

---

## Git Workflow

### Development Flow

1. **Start feature:** `git checkout -b feature/my-feature`
2. **Develop and commit:** Regular commits with clear messages
3. **Merge to develop:** `git checkout develop && git merge feature/my-feature`
4. **Test:** Integration testing on `develop`
5. **Release prep:** `git checkout -b release/v1.0.0`
6. **Finalize:** Update VERSION, CHANGELOG, test thoroughly
7. **Release:** Merge to `main`, tag, push
8. **Deploy:** Create GitHub Release, upload `.amxd`, distribute

### Commit Messages

**Format:** Clear, concise, imperative mood

**Good examples:**
- `Add modal bar synthesis to gen~`
- `Fix transport sync drift on playhead 2`
- `Update scale quantization algorithm`
- `Bump version to 1.0.0`

**Bad examples:**
- `updated stuff`
- `WIP`
- `trying to fix the thing`

---

## Release Process

### Creating a Release

1. **Prepare release branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update version and changelog**
   ```bash
   echo "1.0.0" > VERSION
   # Edit CHANGELOG.md with new version notes
   git add VERSION CHANGELOG.md
   git commit -m "Prepare release v1.0.0"
   ```

3. **Test thoroughly**
   - Load in fresh Ableton session
   - Test all features
   - Verify MIDI out, internal synth
   - Check different tempos, start/stop

4. **Merge to main and tag**
   ```bash
   git checkout main
   git merge release/v1.0.0
   git tag v1.0.0
   git push origin main --tags
   ```

5. **Create GitHub Release**
   - Go to https://github.com/Stria-DSP/drift/releases/new
   - Select tag `v1.0.0`
   - Title: `Drifter v1.0.0`
   - Description: Copy from CHANGELOG.md
   - Attach: `drifter.amxd`, README.pdf, demo presets

6. **Deploy to channels**
   - Upload to Gumroad
   - Post to maxforlive.com
   - Announce on socials, Reddit

### Release Assets

Each GitHub release should include:
- **`.amxd` file** — Compiled Max for Live device
- **README.pdf** or **README.md** — User documentation
- **CHANGELOG excerpt** — What's new in this version
- **Demo presets** (optional) — Example patterns
- **Audio examples** (optional) — Sound demos

---

## Remote Configuration

### Setting Up a New Repository

```bash
# Initialize git (if new project)
git init
git add .
git commit -m "Initial commit"

# Add remote pointing to Stria-DSP organization
git remote add origin git@github.com:Stria-DSP/REPO-NAME.git

# Push to GitHub
git push -u origin main
```

### Transferring from Personal to Organization

If you've created a repo under your personal account first:

```bash
# Transfer via GitHub web UI or CLI
gh repo transfer REPO-NAME Stria-DSP

# Update local remote
git remote set-url origin git@github.com:Stria-DSP/REPO-NAME.git

# Verify
git remote -v
```

### Current Repository Remotes

**drift:**
```bash
origin  git@github.com:Stria-DSP/drift.git (fetch)
origin  git@github.com:Stria-DSP/drift.git (push)
```

---

## Repository Access

### Visibility

**Default:** Public

**Rationale:**
- Transparency aligns with "logic, not AI" positioning
- Max for Live patches are somewhat transparent by nature
- Enables community contributions and feedback
- Actual commercial value is in the polished, complete product

**Exceptions:**
- Pre-release products (private until launch)
- Proprietary synthesis algorithms (if any)
- Premium features (if dual-licensing)

### Team Structure

| Role | Permissions | Members |
|------|-------------|---------|
| **Owner** | Full admin access | @jdavancens |
| **Maintainer** | Write + admin settings | Core team (future) |
| **Contributor** | Write to specific repos | Collaborators (future) |
| **Community** | Fork and submit PRs | Public |

---

## Documentation Standards

### Required Files (All Product Repos)

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | User guide: install, use, quick start | End users |
| `PROJECT_BRIEF.md` | Technical spec and design decisions | Developers |
| `MVP_PLAN.md` | Development roadmap | Project management |
| `GTM_PLAN.md` | Go-to-market strategy | Marketing |
| `CHANGELOG.md` | Version history | Users + devs |
| `LICENSE` | Software license | Legal |

### Optional Files

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Contribution guidelines for community |
| `CODE_OF_CONDUCT.md` | Community behavior standards |
| `DEVELOPMENT.md` | Developer setup and workflow |
| `ARCHITECTURE.md` | Deep technical architecture |

---

## Max for Live Specifics

### Version Control Challenges

**Problem:** Max patches are JSON — diffs can be noisy and hard to review.

**Strategy:**
- Commit complete patches as single units
- Use descriptive commit messages
- Tag architectural changes
- Consider `git diff --word-diff` for reviews
- Save before committing (Max auto-formats JSON)

### Build Artifacts

**`.amxd` files are NOT committed to Git**

**Why:**
- Binary format (frozen Max patch)
- Large file size
- Should be built from source

**Distribution:**
- Attach to GitHub Releases
- Upload to Gumroad, maxforlive.com
- Users download `.amxd`, not source

### Development Workflow

```bash
# Edit patch in Max
open src/drift.maxpat

# Save changes
# (Max saves as JSON to src/drift.maxpat)

# Commit source
git add src/drift.maxpat
git commit -m "Add velocity parameter to step sequencer"

# Build device (manual in Max)
# File → Save as Live Device → drifter.amxd

# Create distribution zip
make dist

# Release (attach drifter-0.1.0.zip to GitHub Release)
```

---

## Licensing

### Current Status

**Decision pending:** Needs resolution before v1.0 launch

### Options

1. **Proprietary (closed source)**
   - Code visible on GitHub (source-available)
   - Users license the compiled `.amxd`
   - Commercial distribution only through Stria channels

2. **Open source with commercial license**
   - MIT or GPL for core code
   - Compiled product sold commercially
   - Community can fork and modify

3. **Dual licensing**
   - Open core (basic features)
   - Premium features (paid)

4. **Fully open source**
   - Free to use and modify
   - Revenue from support, presets, or donations

**Recommendation:** Start with **proprietary/source-available** to protect commercial value while maintaining transparency.

### RNBO Export Licensing

- No RNBO fee below **$200k/year revenue**
- Stria owns exported C++ code
- VST3 plugins: Steinberg SDK (free, open-source)
- AU plugins: Apple Developer ID ($99/year)

See `drift/research/rnbo.md` for details.

---

## Communication Channels

### GitHub-Based

| Channel | Purpose | URL |
|---------|---------|-----|
| **Issues** | Bug reports, feature requests | github.com/Stria-DSP/drift/issues |
| **Discussions** | Q&A, show-and-tell, ideas | github.com/Stria-DSP/drift/discussions |
| **Pull Requests** | Community code contributions | github.com/Stria-DSP/drift/pulls |
| **Releases** | Version announcements | github.com/Stria-DSP/drift/releases |

### External (Planned)

- **Discord/Slack** — Real-time community chat (post-launch)
- **Email/Newsletter** — Product updates via Gumroad + Mailchimp
- **YouTube** — Demos, tutorials, artist features
- **Reddit** — r/MaxMSP, r/ableton for announcements
- **Twitter/Mastodon** — Quick updates, engagement

---

## Automation and CI/CD

### Current

No automated workflows configured yet.

### Planned (GitHub Actions)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `test.yml` | Push to `develop` | Validate Max patch structure |
| `release.yml` | Tag `vX.Y.Z` | Build artifacts, create GitHub Release |
| `docs.yml` | Push to `main` | Deploy docs to GitHub Pages |
| `lint.yml` | Pull request | Check formatting, conventions |

### Max Patch Validation

Can't fully compile `.amxd` in CI (requires Max app), but can:
- Validate JSON structure
- Check for required objects
- Verify file references (e.g., `pattern_default.txt`)
- Lint JavaScript code

---

## Brand Alignment

All repositories follow Stria brand guidelines (see `brand/` and `drift/docs/BRAND_AND_MARKETING_STRATEGY.md`):

### Voice
- **Confident, not loud:** No "revolutionary," "game-changing"
- **Minimal:** Short sentences, clear ideas
- **Expert-led:** Mention process music, algorithms, research
- **No AI hype:** Say "logic," "rules," "transparent" — not "AI-powered"

### Naming
- **Products:** Single evocative words (drift, fold, shift)
- **Brand:** Stria (parent company)
- **Marketing names:** Drifter, Folder, Shifter, etc.

### Positioning
- **"Logic, not AI"** — Deterministic, transparent tools
- **Artist-driven** — DMA-led, research-grade
- **Human-designed** — Generative without the black box

### Reference
- **Fors** (fors.fm) — Model for boutique M4L products

---

## Contributing (Future)

When Stria accepts community contributions:

### Process

1. **Fork** the repository
2. **Create** a feature branch (`feature/your-idea`)
3. **Implement** with clear commits
4. **Test** thoroughly (doesn't crash, works in Live)
5. **Submit** PR with clear description
6. **Review** by maintainers
7. **Merge** if approved

### Types of Contributions Welcome

- **Bug fixes** — Always appreciated
- **Feature additions** — Discuss in Issues first
- **Documentation** — Improvements, clarifications
- **Presets/patches** — Artist packs (separate repo)
- **Translations** — UI text, documentation

Guidelines will be formalized in `CONTRIBUTING.md` when ready.

---

## Quick Reference

### Commands

```bash
# Clone a repo
git clone git@github.com:Stria-DSP/drift.git

# Check remote
git remote -v

# Update remote to organization
git remote set-url origin git@github.com:Stria-DSP/REPO.git

# Create and push new tag
git tag v1.0.0
git push origin v1.0.0

# Build distribution (in drift/)
make dist
```

### Links

| Resource | URL |
|----------|-----|
| **Organization** | https://github.com/Stria-DSP |
| **Drift repo** | https://github.com/Stria-DSP/drift |
| **Drift releases** | https://github.com/Stria-DSP/drift/releases |
| **Report bug** | https://github.com/Stria-DSP/drift/issues |

---

## Related Documentation

### In This Workspace

- `drift/PROJECT_BRIEF.md` — Drift technical spec
- `drift/MVP_PLAN.md` — Development roadmap
- `drift/GTM_PLAN.md` — Go-to-market strategy
- `drift/docs/BRAND_AND_MARKETING_STRATEGY.md` — Brand voice and positioning
- `drift/docs/PATCH_ARCHITECTURE.md` — Drift architecture diagram
- `brand/` — Brand assets and guidelines
- `knowledge-base/` — Shared research and knowledge

### External

- [Cycling '74 RNBO](https://rnbo.cycling74.com/)
- [RNBO Export Licensing FAQ](https://support.cycling74.com/hc/en-us/articles/10730637742483-RNBO-Export-Licensing-FAQ)
- [Fors](https://fors.fm/) — Reference model for boutique M4L

---

*Organization: Stria-DSP*  
*Owner: Joseph Davancens (@jdavancens)*  
*Last updated: February 14, 2026*
