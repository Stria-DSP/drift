# Stria Product Line

Overview of all Stria products: current (Drift) and future concepts. Each product embodies one clear algorithmic or compositional process.

---

## Product Strategy

- **One process per product** — Each tool is built around a single, clear algorithm or compositional technique
- **Single-word names** — Evocative, not descriptive (Drift, Fold, Shift, Loop)
- **Modular pricing** — Single devices $49–79; composite instruments $79–149; bundles when line expands
- **Platform path** — Max for Live first → RNBO export to VST3/AU for broader reach
- **Research-grade positioning** — DMA-led, process music heritage, transparent logic

---

## Current Products

### Drift (In Development)

**Phase-based generative sequencer + struck-bar physical modeling synthesizer**

| | |
|-|-|
| **Status** | MVP in development (Phase 1–5) |
| **Type** | Sequencer + instrument (internal synth) + MIDI out |
| **Process** | Reich-style phasing: two playheads drift over one user-defined pattern |
| **Platform** | Max for Live (M4L) → RNBO export to VST3/AU (Phase 2) |
| **Tagline** | "One pattern. Two playheads. Endless drift." |
| **Price** | $49–79 (single device); $99 (with future expansion to 3-4 playheads + advanced features) |
| **Appeal** | Phase music enthusiasts, generative producers, live performers; "complete instrument" (seq + sound) |
| **Docs** | See `drift/` repo: PROJECT_BRIEF.md, MVP_PLAN.md, GTM_PLAN.md, docs/BRAND_AND_MARKETING_STRATEGY.md |

**Core Features:**
- User-defined step pattern (pitch + gate)
- 2 playheads with independent phase and rate
- Drift parameter (Reichian phase shift)
- Built-in struck-bar physical model (modal synthesis: marimba/vibes character)
- Scale quantization + snapshot (capture current phrase)
- MIDI out (send pattern to external instruments)

**Post-MVP (v1.1+):**
- 3rd and 4th playheads
- Coincidence triggering (notes only when playheads overlap)
- Prime-length loops (7, 11, 13 steps)
- Phase visualization (Lissajous or circles)

---

## Future Products (Concepts)

These are ideas from research and brainstorming. Each needs a full spec before development. See `drift/docs/OTHER_IDEAS.md` for detailed mechanics.

### 1. L-System Sequencer

**Fractal/recursive sequencer: grow a pattern from one seed using Lindenmayer replacement rules**

| | |
|-|-|
| **Process** | L-system (Lindenmayer grammar): axiom + production rules → self-similar, branching patterns |
| **Type** | Sequencer (MIDI out) |
| **Name** | TBD (e.g. "Fold" or "Branch") |
| **Input** | Seed pattern (2–4 notes) + rules (e.g. A → A-B-C); recursion depth; scale |
| **Output** | MIDI (melody and/or rhythm) |
| **Appeal** | Composers, algorithmic/generative producers; "one idea grows organically" |
| **Effort** | M (medium) — L-system engine is straightforward; UI for rules needs care |
| **Platform** | M4L first → RNBO |
| **Price** | $49–69 |

**Key Differentiator:** Not random, not grid — explicit generative grammar (like plant growth or fractal branching). Bach-like self-similarity.

**Possible Variants:**
- Melody-focused (pitch from L-system)
- Rhythm-focused (nested tuplets from L-system; see below)
- Both (one L-system drives pitch and rhythm)

---

### 2. Tiling / Symmetry Sequencer

**Generate patterns using tiling, crystallography, or symmetry groups (one tile → full "crystal" by mathematical symmetry)**

| | |
|-|-|
| **Process** | Tiling (Penrose, substitution) or symmetry groups (dihedral D_n, wallpaper groups) applied to a motif |
| **Type** | Sequencer (MIDI out) or 2D grid → MIDI |
| **Name** | TBD (e.g. "Tile" or "Crystal") |
| **Input** | User-defined motif (step pattern or pitch contour); symmetry group or tiling rule; grid size |
| **Output** | MIDI (rhythm + pitch from tiled structure) |
| **Appeal** | IDM, modular, pattern enthusiasts; "geometric harmony" |
| **Effort** | M–L — Tiling and dihedral (C_n, D_n) are M; full wallpaper groups are L |
| **Platform** | M4L first → RNBO |
| **Price** | $59–79 (higher for visual 2D grid UI) |

**Key Differentiator:** Symmetry and structure as the core mechanic; visual (tiling is easy to show); appeals to "math + music" crowd.

**Possible Variants:**
- **Tiling mode**: Periodic or aperiodic (Penrose-like substitution)
- **Crystal mode**: Space groups (subset of 230 groups; e.g. p4m, pmm)
- **Group theory mode**: Dihedral D_n (rotation + reflection) for retrograde/inversion as one operation

---

### 3. Meta-Hodos Sequencer (James Tenney)

**Sequence by perceptual grouping: form follows gestalt factors (cohesion and segregation) rather than grids or randomness**

| | |
|-|-|
| **Process** | Tenney's *Meta-Hodos*: **clang** (gestalt unit) and **sequence** (succession of clangs); cohesion vs. segregation rules |
| **Type** | Sequencer (MIDI out) |
| **Name** | TBD (e.g. "Clang" or "Meta") |
| **Input** | User-defined cells (2–8 notes or rhythm); gestalt parameters (similarity, gap, duration); scale |
| **Output** | MIDI (rhythm + pitch structured by perceptual factors) |
| **Appeal** | Composers, theorists, "research-grade" users; unique conceptual angle |
| **Effort** | L (large) — Theory → UI is non-trivial; need to simplify Tenney's taxonomy |
| **Platform** | M4L first → RNBO |
| **Price** | $69–89 (premium for depth and novelty) |

**Key Differentiator:** No other sequencer models **perceptual grouping** explicitly. Form driven by cognition (how we chunk and separate), not grids or AI.

**References:** Tenney's *Meta-Hodos* (1961), *META Meta-Hodos* (1975/77); Frog Peak, Monoskop PDF.

---

### 4. Space-Filling / Division Sequencer

**Top-down recursive subdivision of time; traversal order follows a space-filling curve (Hilbert, Z-order, spiral) for deterministic, structured rhythm**

| | |
|-|-|
| **Process** | Recursive subdivision (binary tree or ratio-based); traversal via space-filling curve |
| **Type** | Sequencer (MIDI out) or 2D grid (pitch × time) |
| **Name** | TBD (e.g. "Divide" or "Span") |
| **Input** | Span (bar length); division mode (binary, ratio, depth); traversal (Hilbert, Z-order, serpentine, spiral); scale |
| **Output** | MIDI (trigger/velocity per step; pitch from path if 2D) |
| **Appeal** | Rhythm nerds, generative/IDM, modular |
| **Effort** | M — Division tree + Hilbert/Z-order are well-documented |
| **Platform** | M4L first → RNBO |
| **Price** | $49–69 |

**Key Differentiator:** Structural (you hear the hierarchy of divisions and the path); space-filling curves are rare in music tools.

**Possible Variants:**
- 1D (rhythm only; time is subdivided and traversed)
- 2D (pitch × time grid; Hilbert path "draws" the melody)

---

### 5. Nested Tuplet L-System

**L-system for rhythm: nested tuplet structure (3:2, 5:4, 7:4…) generated by replacement rules, creating fractal polyrhythms**

| | |
|-|-|
| **Process** | L-system symbols → tuplet types; recursion creates nested tuplets (3-tuplet contains 5-tuplet contains 2-straight…) |
| **Type** | Sequencer (MIDI out, rhythm-focused) |
| **Name** | TBD (e.g. "Tuplet" or "Nest") |
| **Input** | Axiom + rules (symbol → string); mapping (symbols to tuplet ratios); recursion depth; tempo |
| **Output** | MIDI (onset times from nested grid; optional pitch from parallel L-system or scale) |
| **Appeal** | Rhythm programmers, contemporary percussion, IDM, polyrhythm enthusiasts |
| **Effort** | M — L-system engine + nested subdivision timing model |
| **Platform** | M4L first → RNBO |
| **Price** | $49–69 |

**Key Differentiator:** Tuplet sequencers usually fix one level; this one generates **nested tuplet structure** from a grammar. "One rule, infinite depth."

**References:** Conlon Nancarrow's nested tuplets; various "grammar for rhythm" papers.

---

### 6. Composite Instruments (Sequencer + Synth + Modulation)

**Full instruments: algorithmic sequencer + synth engine + effect(s), with algorithmic processes as modulation sources**

| | |
|-|-|
| **Process** | One of the above sequencers (phase, L-system, tiling, etc.) + compact synth (osc/FM/granular/physical model) + 1–2 effects + mod matrix: algorithmic signals (phase, L-system depth, tile index, clang boundary) → mod destinations (filter, delay, reverb, pitch) |
| **Type** | Complete instrument (audio out) + MIDI out |
| **Name** | TBD — could be variants of the sequencer names (e.g. "Drift Pro" = phase seq + bar + effects; "Fold Synth" = L-system + osc + filter) |
| **Input** | Sequencer params + synth params (osc, filter) + effect params + mod routing (sources → destinations, amount) |
| **Output** | Audio + MIDI out |
| **Appeal** | Live performers, "one device" users, producers; premium price justified by depth |
| **Effort** | L — Combines sequencer + synth/fx + mod matrix; start with one sequencer type + one synth + one effect |
| **Platform** | M4L → RNBO → VST3/AU (best as standalone plugin) |
| **Price** | $79–149 (premium all-in-one) |

**Key Differentiator:** Algorithmic mod sources — the same process that generates the pattern also modulates the sound, so structure and timbre are unified. "One process, one instrument."

**Possible Variants:**
- **Phase instrument**: Phasing Engine seq + 2-op FM or wavetable + filter + delay; phase and drift → mod
- **L-system instrument**: L-system seq + synth; L-system string/depth → filter, grain size, effect wet
- **Tiling instrument**: Tiling seq + synth; tile index or path position → pan, filter, reverb
- **Meta-Hodos instrument**: Clang boundaries → envelope gate, reverb decay

**Reference:** Fors Opal (seq + 4 synths + 2 effects + param locks); Sugar Bytes; Output Arcade (macro mod).

---

## Future Concepts (Brainstorm Stage)

These are less developed; see `drift/docs/OTHER_IDEAS.md` for prompts and templates.

- **Markov-chain style transfer** — MIDI effect: transition matrices from curated styles (counterpoint, bebop, IDM); "style as math"
- **Constraint-based Euler sequencer** — Rhythm/pitch from number theory (co-primality, totient); "geometric harmony"
- **Additive process sequencer** — Glass-style: one phrase, add/subtract notes over time
- **Clapping Music device** — One pattern, one part shifts by N beats every M bars
- **Canon builder** — User input → 2–4 voices with delay + transposition (round, infinite canon)
- **Stochastic rhythm (Xenakis-style)** — Probability distributions over duration and accent
- **Cellular automata** — Grid state → pitch or velocity; Rule 110, Game of Life, etc.
- **Chaos / strange attractors** — 2D trajectory (Lorenz, Rössler) → pitch and time
- **Microtonal tools** — Non-12EDO sequencers or utilities for DAW-native workflow

---

## Product Line Roadmap (Tentative)

| Phase | Product | Target | Notes |
|-------|---------|--------|-------|
| **1** | **Drift** (MVP) | M4L | Phase sequencer + struck-bar synth; validate core phasing |
| **1b** | **Drift** (RNBO export) | VST3/AU | Broaden to non-Ableton users |
| **2** | **L-System or Tiling** (pick one) | M4L → VST | Second algorithmic sequencer; expand line |
| **3** | **Composite instrument** (Phase or L-system + synth + fx) | VST3/AU | Premium all-in-one; higher price ($99–149) |
| **4** | **Bundle** (Drift + second sequencer + composite) | All platforms | Suite pricing ($149–249); establish "Stria Suite" |
| **5+** | More sequencers, utilities, effects | Ongoing | Expand line; bundles grow |

---

## Naming Conventions

All Stria products follow a **single evocative word** pattern. Not descriptive compounds.

**Examples of good names:**
- Drift, Fold, Shift, Loop, Tile, Crystal, Clang, Nest, Span, Branch

**Examples to avoid:**
- "Phasing Engine Pro" (descriptive + suffix)
- "Stria Phase Sequencer" (brand + descriptor)
- "Drifter XL" (product + tier suffix)

See [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) for full guidelines.

---

## Pricing Strategy

| Product Type | Price Range | Example |
|--------------|-------------|---------|
| **Single sequencer** | $49–79 | Drift, L-system, Tiling |
| **Composite instrument** | $79–149 | Phase instrument, L-system + synth + fx |
| **Bundle (2–3 devices)** | $99–149 | Drift + one other sequencer |
| **Suite (4+ devices)** | $149–249 | Full Stria line |

**Positioning:** Boutique/premium (Fors-level). Research-grade justifies higher price vs. mass-market plugins.

---

*Last updated: February 2026 | See `drift/docs/OTHER_IDEAS.md` for detailed concept mechanics.*
