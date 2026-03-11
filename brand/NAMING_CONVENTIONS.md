# Naming Conventions: Stria

Guidelines for naming Stria products, features, and related assets. Consistency in naming builds brand recognition and signals craft.

---

## Brand Hierarchy

```
Stria (brand / parent)
  ├─ Drift (product 1)
  ├─ [Future single-word product] (product 2)
  ├─ [Future single-word product] (product 3)
  └─ Stria Suite (bundle, when applicable)
```

### Usage in Copy

- **Full name**: "Drift by Stria" or "Stria — Drift"
- **Short reference**: "Drift" (when context is clear)
- **Website / product page**: "Stria" in header/logo; "Drift" as product name
- **File names**: `drift.maxpat`, `drifter.amxd` (marketing name "Drifter" when needed)

---

## Product Naming Rules

### Core Principle: Single Evocative Word

All Stria products use **one word**—evocative, not descriptive. No suffixes (Pro, XL, Plus), no compounds (Phasing Engine, Sequencer Studio).

**Pattern**: Choose a word that suggests the **behavior** or **feel** of the process, not the technical category.

### Examples of Good Names

| Name | Process | Why It Works |
|------|---------|--------------|
| **Drift** | Phase-based sequencing: two playheads drift apart | Evokes movement, slow change, Reich-style phasing |
| **Fold** | L-system / recursive: pattern folds back on itself | Suggests recursion, fractal structure, self-similarity |
| **Tile** | Tiling / symmetry: one motif fills a grid | Clear visual metaphor; geometric |
| **Shift** | Additive process: notes shift in/out over time | Suggests gradual change (Glass-style) |
| **Loop** | Canon / round: one phrase loops and layers | Familiar concept; warm, inviting |
| **Nest** | Nested tuplets: tuplets within tuplets | Suggests hierarchy, containment |
| **Span** | Division-based: time span is subdivided | Suggests structure, top-down |
| **Clang** | Meta-Hodos: perceptual units (Tenney) | Direct reference; unique, memorable |
| **Crystal** | Crystallography / space groups: symmetry lattice | Beautiful, geometric, mathematical |
| **Branch** | L-system (tree-like growth) | Organic, generative, self-similar |

### Examples to Avoid

| Bad Name | Why It's Bad | Fix |
|----------|--------------|-----|
| "Phasing Engine Pro" | Descriptive + suffix; sounds corporate | "Drift" |
| "Stria Phase Sequencer" | Brand + descriptor; no distinct identity | "Drift" |
| "DriftXL" or "Drift Plus" | Tier suffix; feels like feature-creep | Just "Drift"; add features without renaming |
| "The Ultimate Phaser" | Hype + descriptor; no craft | "Drift" |
| "AI Sequencer" | Buzzword + descriptor; off-brand | (We don't make AI tools) |
| "Recursive Melody Generator" | Long, descriptive; not memorable | "Fold" |

---

## Feature and Mode Naming

When naming **features** or **modes** within a product, use clear, specific terms. No marketing hype.

### Good Feature Names

- **Drift** (parameter: phase shift rate)
- **Rate** (playhead speed multiplier)
- **Snapshot** (capture current phrase)
- **Scale** (quantization to key)
- **Coincidence** (trigger mode: only when playheads overlap)
- **Recursion Depth** (L-system iterations)
- **Symmetry Group** (tiling/crystal mode)
- **Clang Length** (Meta-Hodos: unit size)

### Avoid

- "Intelligent Drift" (no "intelligent")
- "Smart Quantize" (no "smart")
- "Magic Capture" (no "magic")
- "Next-Gen Phasing" (no "next-gen")

---

## File and Asset Naming

### Repo / Project Names

- **Lowercase, hyphenated**: `drift`, `knowledge-base`, `stria-website`
- **No underscores or camelCase** in repo names

### Device Files

- **Max patch**: `drift.maxpat` (lowercase, product name)
- **M4L device**: `drifter.amxd` (lowercase, marketing name if different from internal)
- **Preset files**: `drift_preset_warm.json` (lowercase, underscored)

### Documentation

- **Uppercase, underscored**: `PROJECT_BRIEF.md`, `MVP_PLAN.md`, `BRAND_IDENTITY.md`
- **Lowercase for general docs**: `readme.md`, `changelog.md`

### Marketing Assets

- **Product pages**: `drift.html`, `fold.html`
- **Images**: `drift-hero.png`, `drift-screenshot-01.png` (lowercase, hyphenated)
- **Videos**: `drift-demo-v1.mp4` (lowercase, hyphenated, version if needed)

---

## Bundle and Suite Naming

When Stria has multiple products, bundles follow this pattern:

| Bundle Type | Name | Price Range |
|-------------|------|-------------|
| **Two products** | "Drift + Fold" (explicit) | $99–129 |
| **Three+ products** | "Stria Suite" or "Stria Collection" | $149–249 |
| **Product family** | "Stria Sequencer Bundle" (if all are sequencers) | Varies |

**Avoid**: "Ultimate Bundle," "Pro Pack," "Premium Suite"

---

## Parameter and Control Naming (UI)

When labeling knobs, sliders, and UI elements, use **clear, short names**. Prefer full words over abbreviations unless space is tight.

### Good Parameter Names

- **Drift** (not "Drf" or "Phase Shift")
- **Rate** (not "Rt" or "Speed")
- **Decay** (not "Dcy" or "Release")
- **Brightness** (not "Brt" or "Tone")
- **Mix** (not "Mx" or "Blend")

### When to Abbreviate

Only if:
1. Space is very limited (small UI panel)
2. Abbreviation is standard (e.g. "BPM," "MIDI," "LFO," "EQ")

**Examples:**
- "LFO Rate" (standard abbreviation)
- "MIDI Out" (standard)
- "Dcy" (only if "Decay" doesn't fit)

---

## Social Media and Handle Naming

### Brand Handles

- **Primary**: `@stria` or `@striamusic` (if `@stria` unavailable)
- **Avoid**: `@stria_official`, `@stria_audio`, `@stria_plugins` (feels corporate)

### Hashtags

- **#Stria** (brand)
- **#Drift** (product)
- **#LogicNotAI** (positioning)
- **#ProcessMusic** (heritage)
- **#AlgorithmicComposition** (niche)

**Avoid**: `#AI`, `#Generative` (too generic; not aligned with positioning)

---

## Version and Edition Naming

Stria products don't use "Pro," "Plus," "XL," or edition tiers. If you need to distinguish versions:

### By Platform

- **Drift for Max for Live** (explicit if needed)
- **Drift (VST3/AU)** (in parentheses or secondary line)

### By Major Version

- **Drift 1.0** → **Drift 2.0** (major version numbers only; internal)
- **Public-facing**: Just "Drift" (version in changelog, not product name)

### Pre-Release

- **Drift (Beta)** or **Drift (MVP)** (in title or tag; remove at v1.0)

**Never**: "Drift Pro," "Drift Lite," "Drift Ultimate"

---

## Naming New Products: Process

1. **Identify the core process** (phasing, L-system, tiling, etc.)
2. **Brainstorm evocative words** that suggest the behavior or feel (not technical category)
3. **Check domain and handle availability** (`productname.com`, `@productname`)
4. **Test pronunciation and memorability** (say it out loud; easy to spell?)
5. **Verify it aligns with brand** (single word, evocative, not descriptive)
6. **Lock it in** — add to [PRODUCT_LINE.md](PRODUCT_LINE.md)

### Brainstorm Bank (Unused Names)

Keep a list of unused but good names for future products:

- Shift, Loop, Nest, Span, Branch, Crystal, Clang, Weave, Spiral, Echo, Phase, Orbit, Cell, Grid, Path, Wave, Arc, Coil, Flux

---

## Checklist: Is This Name Good?

Before finalizing any product or feature name:

- [ ] Is it **one word** (or a clear compound like "Snapshot")? (No "Phasing Engine Pro")
- [ ] Is it **evocative**, not descriptive? (Suggests feel, not category)
- [ ] Is it **memorable and easy to spell**? (Say it out loud; test it)
- [ ] Does it **align with Stria's voice**? (Confident, clear, warm, no hype)
- [ ] Is it **available** (domain, handle, not trademarked by competitor)?
- [ ] Does it **fit the product family**? (Matches the single-word pattern)

If yes to all: use it.

---

*Last updated: February 2026 | See [PRODUCT_LINE.md](PRODUCT_LINE.md) for current and future product names.*
