# Other Ideas: Plugin & Device Concepts

Brainstorm doc for future products beyond the Phasing Engine. No commitment—just capture concepts, mechanics, and angles. Move promising ones into PROJECT_BRIEF or a proper spec when ready.

---

## How to use this doc

- **Add ideas** using the template below (or freeform).
- **Tag** with: `M4L` / `VST` / `both`, `algorithmic` / `effect` / `instrument` / `utility`, and rough **effort** (S/M/L).
- **Steal from:** DMA research, process music, [research/process_music.md](../research/process_music.md), [research/market.md](../research/market.md) competitors, gaps in existing tools.

---

## Idea template (copy and fill)

```markdown
### [Name or working title]
- **One-liner:** 
- **Mechanic / process:** 
- **Input:** (MIDI, audio, params, none)
- **Output:** (MIDI, audio, both)
- **Why it's different:** 
- **Market angle / tagline:** 
- **Effort:** S / M / L | M4L first? Y/N
- **Notes:**
```

---

## Already noted (from PROJECT_BRIEF)

### L-system / recursive sequencer
- **One-liner:** Fractal branching MIDI from a small seed; one rule set grows into large, self-similar structures.
- **Mechanic:** Lindenmayer systems: user defines a short seed (e.g. 3 notes) and replacement rules (e.g. "A → A-B-C"). Sequence is "grown" by iteration; recursion depth = complexity.
- **Input:** Seed pattern + rules (or presets). Optional: scale, length cap.
- **Output:** MIDI.
- **Why different:** Not random, not grid—explicit generative grammar. Bach-like self-similarity, minimalism, organic growth.
- **Market angle:** "Fractal composition." "Grow a piece from one idea."
- **Effort:** M | M4L first Y.
- **Notes:** UI = "Growth" slider (recursion depth); could pair with scale quantize.

---

### Markov-chain style transfer
- **One-liner:** MIDI effect that re-interprets your phrase through weighted transition matrices trained on a style (e.g. counterpoint, bebop, IDM).
- **Mechanic:** Python (or Max) builds transition matrices from MIDI datasets; device applies them so input notes suggest next notes by probability. User dials "50% Bach / 50% Bebop" or loads a style.
- **Input:** MIDI in + style (preset or user-loaded matrix).
- **Output:** MIDI.
- **Why different:** "Curated logic"—transparent stats, not neural net. User chooses style; no prompt, no black box.
- **Market angle:** "Logic, not AI." "Style as math."
- **Effort:** M–L (data pipeline + UI) | M4L with node.script or external could work.
- **Notes:** Need to clarify licensing/curation of training MIDI; or ship with 2–3 built-in styles.

---

### Constraint-based Euler sequencer
- **One-liner:** Rhythm and/or pitch from number-theoretic rules (e.g. co-primality, totient); "geometric" patterns that feel broken but are mathematically structured.
- **Mechanic:** Step index and a "seed" number; trigger when gcd(step, seed) = 1 (or other rule). Optional: Euler totient for density. Pitch can follow same or related rule.
- **Input:** Seed, scale, length, maybe rule selector.
- **Output:** MIDI.
- **Why different:** Niche but distinctive—appeals to mathy/IDM crowd. Deterministic, tweakable.
- **Market angle:** "Geometric harmony." "Rhythm from number theory."
- **Effort:** S–M | M4L Y. Circular or gear-like UI could be memorable.

---

## Brainstorm prompts

Use these to generate more concepts. Fill in the template for any that stick.

**From process music**
- Additive process (Glass): one phrase, add/subtract notes over time → sequencer or MIDI effect?
- Clapping Music–style: one pattern, one part shifts by N beats every M bars—single device?
- Pulse + cells (In C–like): user defines cells; device plays them with controllable overlap/density?

**From algorithmic composition**
- Stochastic rhythm (Xenakis-style): probability distributions over duration and accent, not notes?
- Cellular automata: grid state → pitch or velocity; Rule 110, etc.?
- Chaos / strange attractors: 2D trajectory maps to pitch and time?
- Markov on rhythm only (transition between beat patterns)?
- Canon builder: user input becomes 2–4 voices with delay and transposition (round, infinite canon)?

**From "logic not AI" positioning**
- Any device that exposes a **single** clear rule (one equation, one grammar, one process) and makes it playable.
- "Explainable generative": every note has a visible reason (e.g. "step 7 + seed 11 = trigger").

**From market gaps (see research/market.md)**
- What do Fors, Dillon Bastan, Sugar Bytes *not* do? (e.g. pure MIDI, no synthesis? Score/notation? Microtonal?)
- Tools for **microtonal** or non-12EDO that stay M4L/VST and DAW-native?
- "Process music in a box" as a product line (Phase = first; Additive = second; Canon = third)?

**From your DMA / background**
- One technique from your thesis that could be "one knob, one process"?
- Algorithmic techniques from papers you love that aren’t yet in a commercial plugin?

**Utility / workflow**
- Max for Live utility that fixes a specific Ableton pain (e.g. phase-align loops, extract groove, humanize only certain params)?
- RNBO export of a **tiny** effect (e.g. one weird filter or tremolo) to test the pipeline?

---

## New ideas (add below)

### Meta-Hodos sequencer (James Tenney)
- **One-liner:** A sequencer that structures MIDI into perceptual units ("clangs") and orders them by gestalt factors—cohesion and segregation—so form follows how we hear.
- **Mechanic / process:** Tenney's *Meta-Hodos* (1961) defines the **clang** as a basic gestalt unit: a group of sounds perceived as one coherent whole. **Sequences** are successions of clangs. Gestalt factors (proximity, similarity, contrast, gap) determine what coheres vs. what segregates. The device could: (1) let the user define or generate small units (e.g. 2–8 notes or a rhythm cell) as candidate clangs; (2) apply parametric rules—duration, density, interval size, silence—so that the next event either *continues* the current clang (cohesion) or *starts a new one* (segregation); (3) output a sequence of clangs with optional "formal factors" (e.g. clang length, sequence-level repetition). Parameters map to Tenney's factors: e.g. "similarity threshold," "gap for segregation," "max clang duration."
- **Input:** User-defined cells or rules; scale; global tempo. Optional: MIDI in that gets "re-clanged" (re-segmented by the engine).
- **Output:** MIDI.
- **Why it's different:** No other sequencer explicitly models *perceptual* grouping. Form is driven by cognition (how we chunk and separate), not grids or randomness. Fits "research-grade" and DMA lineage; Tenney was Reich's colleague and influenced process music.
- **Market angle:** "Form from perception." "Sequence by how we hear." "Meta-Hodos in the rack." Appeals to composers and theorists as well as producers who want structural depth.
- **Effort:** L (theory → clear UI is non-trivial; need to simplify Tenney's taxonomy into a few knobs or modes). M4L first Y; could use coll/scripts for rules.
- **Notes:** Tenney's *META Meta-Hodos* (1975/77) extends the framework; might inform "advanced" mode. His own algorithmic work used statistical feedback and Markov-like balance—could hybridize with the Markov-style-transfer idea (style = gestalt profile). Primary source: *Meta-Hodos and META Meta-Hodos* (Frog Peak, 1988); Monoskop has PDF.

---

### Tiling / crystallography / group theory sequencer
- **One-liner:** A sequencer that uses tiling, crystal symmetry, or symmetry groups to generate and transform patterns—one tile or motif, repeated and reflected by the math of structure.
- **Mechanic / process:** **Tiling:** A small pattern (rhythm, pitch contour, or 2D block) is repeated to fill time or a pitch×time grid. Options: periodic (simple repeat), or aperiodic (e.g. Penrose-like substitution rules) so the pattern never repeats the same way. **Crystallography:** Crystal structures are described by space groups (rotation, reflection, translation). Map a "unit cell" (e.g. a few notes or a beat pattern) to lattice points; apply the group’s symmetry operations to get all equivalent positions—output is the orbit of the motif under the group. **Group theory:** Use finite symmetry groups (cyclic C_n, dihedral D_n, or small wallpaper groups) to generate variations: e.g. one bar + "apply D_4" gives rotations and flips (retrograde, inversion in time or pitch). User picks group and seed; device fills a grid or sequence with the orbit. Could combine: one 2D tile + wallpaper group = full "crystal" of MIDI.
- **Input:** User-defined tile/motif (step pattern or short MIDI); choice of tiling mode (periodic / substitution / space group); scale; grid size. Optional: "unit cell" editor for 2D (pitch × time).
- **Output:** MIDI (or 2D grid that drives MIDI).
- **Why it's different:** No mainstream sequencer exposes symmetry groups or crystallographic structure as the core mechanic. Deterministic, visual (tiling is easy to show), and mathematically deep—appeals to pattern-heads and the "geometric harmony" crowd. Connects to Euler/constraint idea (number theory) and L-systems (substitution) but with a distinct visual/structural flavor.
- **Market angle:** "Structure from symmetry." "One tile, infinite crystal." "Sequence by the math of repeating patterns." Strong for generative, IDM, and modular users.
- **Effort:** M–L. Tiling and dihedral (C_n, D_n) are S–M; full wallpaper/space groups are L (17 wallpaper groups, 230 space groups—subset is enough). M4L first Y; 2D grid UI helps.
- **Notes:** Penrose tiling and substitution systems have existing music/sequencer lit (e.g. Guerino Mazzola). Wallpaper groups: Conway notation or crystallographic notation; start with 2–3 (e.g. p4m, pmm). Group theory: dihedral D_n = rotations + reflections of n-gon; natural for "retrograde and invert this bar" as a single action. Could ship "Tiling" (periodic + one substitution) first, add "Crystal mode" (space group) later.

---

### Space-filling, top-down, division-based sequencer
- **One-liner:** A sequencer that fills time (or a grid) by recursive subdivision—top-down division of the span—with note order or emphasis following a space-filling curve so structure is hierarchical and the path is deterministic.
- **Mechanic / process:** **Top-down division:** Start with one full span (e.g. one bar or 16 steps). Recursively subdivide: first split in two (or by ratio—2:1, golden, user choice), then subdivide each part, and repeat to a chosen depth. Result is a binary (or n-ary) tree of time segments. **Division-based:** The sequencer’s logic is “how time is cut,” not “which step is next.” Parameters: split ratio per level, depth, maybe uneven divisions (e.g. 3+5 instead of 4+4). **Space-filling:** The order in which sub-regions are “visited” or triggered can follow a space-filling curve: e.g. **Hilbert curve** (fills 2D with a single path that stays locally close), **Z-order / Morton curve** (quadtree traversal), **boustrophedon** (alternating left-right), or **spiral**. Map the 1D sequence of visited cells to MIDI: which step gets a note, or velocity/emphasis by position in the path. So the same division tree can yield different feels depending on traversal (Hilbert = clustered, Z-order = blocky, serpentine = scan-line). Optional: 2D grid (pitch × time) so the curve fills a plane and pitch is read from the path.
- **Input:** Span (bar length or step count); division mode (binary, ratio, depth); traversal curve (Hilbert, Z-order, serpentine, spiral); scale; optional seed pattern for “what” goes in each cell (pitch set, velocity rule).
- **Output:** MIDI (trigger/velocity per step, or continuous path as pitch+time).
- **Why it's different:** Most sequencers are left-to-right or Euclidean; this one is **structural**—you hear the hierarchy of divisions and the chosen path through them. Space-filling curves are rare in music tools; they give a single, deterministic order that feels both organic and mathematical. Fits “geometric,” “algorithmic,” and “one process, audible” without being random.
- **Market angle:** "Structure from division." "One span, one path." "Sequence by how time is split." Appeals to rhythm nerds and generative/IDM.
- **Effort:** M. Division tree is S–M; Hilbert/Z-order in 1D or 2D is well-documented. UI: depth slider, ratio, curve selector. M4L first Y.
- **Notes:** Related to “additive” rhythm (building up from small units) but inverted—here we start big and subdivide. Could pair with Euclidean or L-system for “what” sits in each cell. Hilbert in 2D (pitch×time) makes “melodic” paths that jump around the grid in a characteristic way.

---

### L-system for nested tuplets
- **One-liner:** Use an L-system (Lindenmayer replacement rules) to generate **nested tuplet** structure—each symbol expands into a tuplet, and tuplets can contain tuplets, so rhythm becomes a fractal hierarchy.
- **Mechanic / process:** **L-system:** Start with an axiom (e.g. "A") and rules (e.g. A → A B A, B → B A). Each iteration replaces symbols; the string grows. **Nested tuplets:** Map symbols to **tuplet types** (e.g. A = 3:2, B = 5:4, C = 2:1 straight). A string like "A B A" means "3-tuplet, 5-tuplet, 3-tuplet" at the top level. **Nesting:** A symbol can expand not into a fixed duration but into a *sub-sequence* of tuplets. So "A" might mean "divide this span into a 3-tuplet, and inside each of the 3 slots apply rule B." Recursion depth = how many levels of nesting (e.g. level 0 = one bar as 3; level 1 = each third is 5; level 2 = each fifth of that is 2…). The L-system string (or its derivation tree) determines *which* tuplet type at each node. Result: polyrhythmic, self-similar rhythm that is fully deterministic from axiom + rules + depth. Optionally map another L-system or a separate rule to **pitch** (e.g. which scale degree per attack) so melody and rhythm share the same generative grammar.
- **Input:** Axiom; 1–3 production rules (symbol → string of symbols); mapping of symbols to tuplet ratios (3:2, 5:4, 7:4, etc.); recursion depth; tempo/base duration; optional scale for pitch.
- **Output:** MIDI (onset times from the nested grid, optionally pitches from the same or a parallel L-system).
- **Why it's different:** Tuplet sequencers usually fix one level (e.g. "3 over 2"); here the *structure* of nesting is generated by a grammar, so you get complex, coherent polyrhythms that still feel like one process. L-systems are known for melody/contour; applying them to **rhythm hierarchy** is a clear niche. Strong "one rule, infinite depth" story.
- **Market angle:** "Rhythm from grammar." "Nested tuplets, grown by rule." "Polyrhythm as L-system." Appeals to rhythm programmers, contemporary percussion, and IDM.
- **Effort:** M. L-system engine is S; mapping to timing (nested subdivision) is M—need a clean time model (span → split by ratio, recurse). M4L or Max with recursion/script; RNBO for deterministic timing. M4L first Y.
- **Notes:** Distinct from the existing "L-system / recursive sequencer" idea (which is pitch/melody from a seed). This one is **rhythm-only** (or rhythm-first); could later merge so one L-system drives both rhythm and pitch. Reference: Conlon Nancarrow's nested tuplets; various "grammar for rhythm" papers. Keep ratio set small (3, 5, 7) for playability.

---

### Composite instruments: sequencer + synth + effects + modulation

- **One-liner:** Full instruments that combine an algorithmic sequencer, a compact synth engine, and effect(s), with **modulation** as a first-class feature—algorithmic or structural processes as mod sources so sequence, pitch, and timbre share one logic.
- **Mechanic / process:** **Composite:** One device = sequencer (one of our concepts: phase, L-system, tiling, Meta-Hodos, etc.) + sound source (osc/fm/granular/physical model—keep it focused) + 1–2 effects (filter, delay, reverb, saturation). **Modulation:** Instead of only LFOs and envelopes, expose **algorithmic or structural signals** as mod sources: e.g. current **phase** of playheads (from Phasing Engine) → filter cutoff and delay time; **L-system derivation depth** or symbol at step → oscillator detune or effect mix; **tiling coordinate** or **space-filling path index** → pan or resonance; **clang boundary** (Meta-Hodos) → reverb decay. Matrix or simple routing: N sources × M destinations. Optional: **feedback**—effect output (e.g. delay feedback level) or envelope follower → mod input so the sound shapes its own modulation. Result: one "process" drives rhythm, pitch, and timbre in a coherent way; turning one knob changes the whole character.
- **Input:** Sequencer params (as per the chosen algorithm); synth params (osc type, filter, etc.); effect params; modulation routing (sources → destinations, amount). Optional: macro knobs that scale multiple params together.
- **Output:** Audio (and optionally MIDI out for external gear).
- **Why it's different:** Most plugins separate sequencer, synth, and effects. Fors Opal (seq + 4 synths + 2 effects + param locks) and Sugar Bytes (seq + synth + mod) show the market for all-in-one; our angle is **algorithmic mod sources**—the same process that generates the pattern also modulates the sound, so structure and timbre are unified. "One process, one instrument."
- **Market angle:** "Process as instrument." "Sequence, sound, and modulation from one logic." "Algorithmic groovebox." Appeals to live performers and "one device" users; premium price ($59–99) justified by depth.
- **Effort:** L. Combines sequencer dev + synth/fx (or integration of existing engines) + mod matrix. Start with one sequencer type (e.g. phase) + one synth + one effect + 3–5 mod sources; expand. M4L first to prototype; RNBO or native for VST.
- **Notes:** Reference: Fors Opal (seq + Gem/Mass/Dust/Slate + Void/Flux + param locks, probability); Output Arcade (macro modulation); Dillon Bastan (particles → sound + mod). **Possible variants:**
  - **Phase instrument:** Phasing Engine sequencer + simple 2-op FM or wavetable + filter + delay; phase and drift as mod sources (filter, delay time, pitch bend).
  - **L-system instrument:** L-system (melody or rhythm) drives notes; same L-system string or depth modulates filter, grain size, or effect wet.
  - **Tiling instrument:** Tiling/space-filling sequencer + synth; tile index or path position → pan, filter, or reverb pre-delay.
  - **Meta-Hodos instrument:** Clang/sequence boundaries as gates or triggers for envelope, or "clang length" as a mod amount for reverb or delay feedback.
  - **Mod matrix as product:** A smaller product could be "algorithmic mod source" plugin (outputs CV or MIDI CC from phase, L-system, tiling, etc.) that users patch into their existing synths—validates demand before building a full composite.

---

## Prioritization (optional)

When you want to compare ideas, score roughly (1–3) on:
- **Excitement** — would you use it?
- **Fit** — aligns with "artist-driven logic," process music, DMA?
- **Build cost** — time and complexity (S/M/L)?
- **Market** — clear audience and price point?

Then pick one to spec next (e.g. in PROJECT_BRIEF §4 or a new one-pager).
