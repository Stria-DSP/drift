# Drift — Project Brief & Technical Spec

Single source of truth for the Drift project (Stria's first algorithmic music tool). DMA + SE background. Last updated from conversation export, Feb 2026.

---

## 1. Context & Profile

| | |
|--|--|
| **Credentials** | DMA in Composition, UC Santa Cruz — emphasis on algorithmic composition |
| **Day job** | Software Engineer |
| **Tech stack** | Max/MSP, Python; comfortable with C++ (JUCE optional) |
| **Goal** | Product-based side income: create once, sell many. Supplement day job. |
| **Positioning** | Human-designed algorithmic tools ("artist-driven logic"), not generative AI. Deterministic/stochastic, transparent math. |

---

## 2. Product Strategy

### 2.1 Chosen path: High-volume commercial strategy

- **Target revenue band:** ~$1,250–$3,500+/month (side hustle scale).
- **Primary route:** Max for Live (M4L) → RNBO export to VST3/AU. One strong "signature" product first, then suite/bundles.
- **Pricing:** Boutique single device ~$30–$60; focused generative/phase tool ~$49–$79; bundles $80–$150+.
- **Distribution:** Gumroad, Isotonik Studios, maxforlive.com (branding), later Plugin Boutique / ADSR for VST.
- **Marketing angle:** "Research-grade" / "DMA-led" algorithmic tools; educational content (e.g. "How I used [X] to write this track").

### 2.2 Why RNBO

- Prototype in Max (fast iteration), export C++ for VST/AU.
- No RNBO fee below $200k/year revenue; you own the exported code.
- Cloud compilation → VST3/AU without heavy local toolchain at first.
- Fits limited time: algorithmic logic in Max, optional custom UI wrapper later.

### 2.3 Product chosen for MVP

**Drifter** (by Stria) — Reich-style multi-playhead sequencer with prime-number loop lengths and phase drift, plus a **built-in struck-bar physical modeling synthesizer**. Sells as "Phase-Based Generative Workspace"; can be used as a complete instrument (sequence + sound) or as MIDI-only for external gear. Appeals to producers who want evolving patterns without AI.

---

## 3. Technical Spec: Phasing & Interference Engine

### 3.1 Core concept

- **Multi-clock architecture:** One master clock (DAW-synced); 3–4 independent playheads with floating-point phase offsets.
- **Phasing:** Drift parameter so playheads slide relative to each other (Reichian "Piano Phase" style).
- **Interference:** Notes can be triggered on playhead coincidence and/or by prime-length loops to create long, non-repeating but coherent patterns.

### 3.2 Primary sequence (how the pattern is created)

**Currently unspecified in the spec.** The playheads need something to read from—a loop or pattern. Design options:

| Option | Description | Pros / cons |
|--------|-------------|-------------|
| **A. User-defined** | User programs the sequence: step grid, piano roll, or a short MIDI clip that becomes the loop. Playheads run over it at different phases/rates. | Most Reich-like; user controls the "score." Requires a pattern editor or clip input in the device. |
| **B. Algorithmically generated** | Device generates the loop from parameters (e.g. scale, density, length, rhythm rule such as Euclidean or prime steps). Playheads then phase over this generated pattern. | Works out of the box; no need to draw notes. Less direct control over the raw material. |
| **C. MIDI input (live or clip)** | User feeds MIDI (from track or clip). Device treats it as the loop; playheads sample or stride through it. | Flexible; reuses existing material. Blurs toward "effect" and may need clear loop boundaries. |

**Recommendation for MVP:** **A** (user-defined) is the closest to Reich and gives the clearest "one pattern, many phases" story. Implement a simple **step sequencer or single-clip loop** inside the device so the user defines the primary sequence; playheads then phase over it. Option **B** can be a later mode (e.g. "Generate pattern from scale + length") for zero-friction jamming.

---

### 3.3 Core logic (clocks and interference)

**Master clock**

- Sync to DAW transport via `transport` and `phasor~`.
- Drives all sub-clocks.

**Sub-clocks (3–4 playheads)**

- Not simple grid divisions (1/8, 1/16). Use floating-point phase offsets.
- Phase update: `Current_Phase = (Master_Phase * Rate_Multiplier) % 1.0`.
- **Drift:** e.g. +0.001 per cycle so playheads slowly shift (classic phasing).

**Interference rules (avoid mud)**

- **Coincidence triggers:** Fire a note only when two (or more) playheads overlap within a phase window (e.g. &lt; 0.05).
- **Prime step lengths:** User sets loop lengths to primes (7, 11, 13, 17). Global loop = LCM → patterns take a long time to repeat.
- **Harmonic quantization:** All playhead outputs pass through a global scale constraint (e.g. `coll` or `m4l.balm`) so output stays in a user-defined key.

### 3.4 Sound source: struck-bar physical modeling synthesizer

Drifter includes a **struck-bar** physical model so the device works as a complete instrument (sequence → internal synth → audio) without requiring an external sound source. The sound character (marimba-, xylophone-, or vibes-like) fits process music and phase-based patterns—pitched, percussive, and clear under repetition.

| Aspect | Approach |
|--------|----------|
| **Model** | Struck bar (1D bar, struck at a point): modal synthesis with 2–4 partials, or waveguide/KS variant. Pitch from bar length/density; strike position and hardness for brightness and decay. |
| **Params** | Strike position, hardness/brightness, decay time, optional vibrato/tremolo; global tuning/transpose. Keep minimal for MVP; expand (bar material, damping) in v1.1. |
| **Routing** | Sequencer MIDI drives the bar synth internally; **MIDI out** remains available so users can send the same pattern to external instruments. Toggle or mix: internal only / external only / both. |
| **Implementation** | Max/MSP: `phasor~`-based modal bars or gen~; RNBO export: same model in gen~ or C++ so the VST is self-contained. Reference: Fors Mass (modal), classic modal bar literature. |

### 3.5 Implementation (RNBO + Max)

| Layer | Approach |
|-------|----------|
| **Phase / timing** | Implement in **gen~** for high-rate, sample-accurate math inside RNBO. |
| **Parameters** | Expose Drift Rate, Interference Window, Clock Ratios via RNBO parameters (host automation). |
| **Struck-bar synth** | Modal or waveguide bar in gen~; triggered by internal sequencer MIDI; audio out. |
| **MIDI out** | Use `noteout` (or RNBO equivalent) to send algorithmic stream to DAW (and optionally to internal synth). |
| **Sync** | RNBO host transport sync so sequences stay in time with DAW. |

### 3.6 Commercial / UX features

- **MIDI capture buffer:** 64-bar rolling buffer; user can drag-and-drop last ~minute of output as a MIDI file (capture "happy accidents").
- **Phase visualization:** e.g. Lissajous curve or concentric circles so user sees interference in real time.
- **Snapshot:** One-click capture of current phase state or current bar as MIDI.

### 3.7 Deployment phases

| Phase | Deliverable | Purpose |
|-------|-------------|---------|
| **1** | M4L device | Validate concept and timing with Ableton users; iterate on UX. |
| **2** | RNBO → VST3/AU | Broaden to non-Ableton users; list on Gumroad / Itch.io, later retailers. |
| **Price** | $49–$79 | Position as "Phase-Based Generative Workspace." |

---

## 4. Alternative concepts (for later)

- **L-system / recursive sequencer:** Fractal branching MIDI from a small seed (e.g. 3-note rule set).
- **Markov-chain style transfer:** MIDI re-interpreted through weighted transition matrices (style as math; see GTM/brand).
- **Constraint-based Euler sequencer:** Rhythm from number-theoretic rules (e.g. co-primality with step index); "geometric harmony."

**More ideas and brainstorm prompts:** [docs/OTHER_IDEAS.md](docs/OTHER_IDEAS.md).

---

## 5. References & research

- **Detailed research** is in the [research/](research/) directory:
  - [research/technical.md](research/technical.md) — gen~, phasor~, transport sync, Reich phasing, sample-accurate timing.
  - [research/rnbo.md](research/rnbo.md) — RNBO export, licensing (under/over $200k, VST3, Apple).
  - [research/market.md](research/market.md) — Market size, competitors (Fors, Dillon Bastan, Isotonik), distribution, pricing, revenue reality.
- **Quick links:** Cycling '74 RNBO, [RNBO Export Licensing FAQ](https://support.cycling74.com/hc/en-us/articles/10730637742483-RNBO-Export-Licensing-FAQ); Steinberg VST3; Gumroad, Isotonik, Plugin Boutique, ADSR, KVR.
- **Design:** Isotonik Studios / Fors for UI/UX bar; consider 99designs or Dribbble for plugin GUI if needed.

---

## 6. Next steps

- **MVP execution:** See **[MVP_PLAN.md](MVP_PLAN.md)** for the phased plan (clock → 2 playheads + drift → step sequencer → scale + snapshot → package and soft launch).
- **Go-to-market:** See **[GTM_PLAN.md](GTM_PLAN.md)** for target customer, positioning, pricing, channels, launch sequence, and metrics.
- **Brand and marketing strategy:** See **[docs/BRAND_AND_MARKETING_STRATEGY.md](docs/BRAND_AND_MARKETING_STRATEGY.md)** (Fors as model: voice, product page structure, visual direction).
- **Technical:** Build initial Drift clock in Max (master + sub-clocks in gen~); optional: Drift clock object list in a separate doc.
- **Post-MVP:** RNBO export, VST3/AU, then Gumroad/Itch and retailers (PROJECT_BRIEF §3.6).

---

*Document derived from conversation export (chat.pdf). For implementation details (e.g. Drift clock object list), see follow-up docs or conversation.*
