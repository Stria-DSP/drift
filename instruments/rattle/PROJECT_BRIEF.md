# Rattle — Project Brief & Technical Spec

Single source of truth for the Rattle project (Stria's second algorithmic music tool). DMA + SE background. Created Feb 2026.

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

### 2.1 Product Overview

**Rattle** (by Stria) — Shaker simulator with performance-aware step sequencing. No samples; pure synthesis. Variable-length patterns, accent channel, humanized timing, back-and-forth motion dynamics. Based on Luke DuBois' shaker object, extended for modern production.

### 2.2 Why Rattle

- **Gap in market:** Most shaker/percussion plugins are sample-based or generic synths. Few offer physics-informed synthesis + performance simulation in one device.
- **Compositional fit:** Shakers are essential in minimalism, electroacoustic, and groove-based music. Rattle offers control over performance nuance (accent, motion) that samples can't match.
- **Technical interest:** Particle collision models, resonance, and timing humanization are tractable in Max/gen~; good candidate for RNBO export.

### 2.3 Pricing & Distribution

- **Target:** Boutique single device ~$30–$49.
- **Distribution:** Gumroad, maxforlive.com, later Isotonik Studios / Plugin Boutique for VST (RNBO export).
- **Positioning:** "Performance-aware shaker synth" — not "AI-powered," but "physics-informed" and "humanized by design."

---

## 3. Technical Spec: Shaker Model & Sequencer

### 3.1 Shaker Synthesis (Luke DuBois foundation)

Luke DuBois' shaker object (circa early 2000s) models a shaker as:

1. **Particle collision:** Multiple particles inside a container; collision events generate impulses.
2. **Resonance:** Impulses excite a resonator (bandpass filter or modal resonance) to produce the shaker "body" sound.
3. **Shake rate:** Controls collision frequency (how often particles hit the container).

**Rattle extensions:**

- **Accent response:** Accent step → increased particle energy → louder, brighter collision.
- **Motion dynamics:** Back-and-forth shaking (simulated by modulating shake rate or particle velocity) affects brightness and density.
- **Damping control:** User adjusts resonator decay time (short = staccato shaker, long = sustained resonance).

### 3.2 Step Sequencer

| Feature | Spec |
|---------|------|
| **Length** | Variable, 1–64 steps (non-power-of-two OK; e.g. 7, 13 for evolving patterns). |
| **Channels** | **Gate:** On/off per step (onset trigger). **Accent:** 0–127 per step (emphasis level). |
| **Timing** | Locked to DAW transport; supports 1/4, 1/8, 1/16, 1/32 note resolution. |
| **Humanization** | Optional timing offset per step (±0–50ms); subtle variation to avoid robotic feel. |

### 3.3 Performance Simulation

**Three layers:**

1. **Accent → energy:** Accent value modulates particle collision strength (amplitude + brightness).
2. **Motion → rate modulation:** Simulates back-and-forth shaking by gently modulating shake rate over time (LFO or per-step variance).
3. **Timing looseness:** Per-step timing offset (Gaussian noise, ±adjustable ms) so onsets aren't perfectly quantized.

### 3.4 Implementation (Max/MSP + gen~)

| Layer | Approach |
|-------|----------|
| **Shaker synth** | gen~ for particle collision (impulse train) + resonator (bandpass or modal). Reference DuBois' shaker; extend with accent and motion params. |
| **Sequencer** | `live.step` or custom step grid (coll/multislider); gate and accent channels stored separately. |
| **Timing** | `phasor~ 1n @lock 1` for transport sync; humanization via `randomsrc~` or small delay offsets. |
| **Audio out** | Shaker synth → optional reverb/filter → `plugout~`. |

### 3.5 UI / UX

- **Step grid:** Two rows (gate, accent); click to toggle gate, drag to set accent level.
- **Performance controls:** Accent depth (0–100%), timing looseness (0–50ms), motion depth (0–100%).
- **Shaker params:** Shake intensity (base collision rate), damping (resonator decay), brightness (filter cutoff or modal mix).
- **Visualization:** Optional: waveform or particle animation (low priority for MVP).

### 3.6 Commercial / UX Features

- **Preset system:** Factory presets (light shaker, heavy shaker, maracas-style, tambourine-style).
- **Pattern save/load:** Export/import patterns as text or Max dict.
- **MIDI out (optional):** Gate channel can also send MIDI for triggering external shaker samples or instruments.

### 3.7 Deployment Phases

| Phase | Deliverable | Purpose |
|-------|-------------|---------|
| **1** | M4L device | Validate shaker model and performance feel with Ableton users. |
| **2** | RNBO → VST3/AU | Broaden to non-Ableton users; list on Gumroad / Itch.io, later retailers. |
| **Price** | $30–$49 | Position as "Performance-Aware Shaker Synth." |

---

## 4. Shaker Physics & References

### 4.1 Luke DuBois' Shaker

- **Source:** Part of DuBois' Max/MSP percussive instrument suite (early 2000s).
- **Core idea:** Particle collision events trigger impulses; resonator shapes the output.
- **Parameters:** Shake rate, number of particles, resonance Q/frequency, amplitude.
- **Rattle approach:** Use DuBois' model as foundation; add accent, motion, and sequencer integration.

### 4.2 Physics-Informed Extensions

- **Particle energy:** Accent step → higher initial velocity → louder collision.
- **Motion profile:** Back-and-forth shaking modulates shake rate over time (e.g. sine LFO or per-step variance).
- **Resonator:** Bandpass filter (simple) or modal synthesis (2–4 modes for realistic body resonance).

### 4.3 Research References

- **Max/MSP:** `noise~`, `random~`, `biquad~` or `reson~` for resonator; gen~ for particle logic.
- **Literature:** Physical modeling of shaken idiophone instruments (e.g. Cook, Bilbao).
- **Similar products:** None directly comparable; closest are Mutable Instruments Rings (modal), XLN Audio XO (sample-based).

---

## 5. Roadmap & Next Steps

### 5.1 MVP Phases

| Phase | Goal | Key tasks |
|-------|------|-----------|
| **1** | Shaker synth core | Implement particle collision + resonator in gen~; test accent response. |
| **2** | Step sequencer | Gate + accent channels; variable length; transport sync. |
| **3** | Performance simulation | Timing humanization, motion dynamics, accent → energy mapping. |
| **4** | UI | Step grid (live.step or custom); performance controls; shaker params. |
| **5** | Package & launch | Save as .amxd; soft launch on Gumroad/maxforlive.com. |

### 5.2 Post-MVP (v1.1)

- **Polyrhythm mode:** Run gate and accent at different step lengths (e.g. gate = 8, accent = 5).
- **Humanization profiles:** Preset timing curves (tight, loose, swing).
- **MIDI out:** Gate channel sends MIDI for external triggering.
- **Multi-shaker:** Layer 2–3 shaker voices with independent patterns for dense textures.

---

## 6. Go-to-Market (Brief)

- **Target customer:** Ableton producers, electronic/minimalist composers, sound designers.
- **Value prop:** "Physics-informed shaker with performance feel—no samples, just synthesis."
- **Launch:** Soft launch on r/ableton, r/MaxMSP, Gumroad; collect feedback for v1.1.
- **Marketing angle:** Educational content ("How I built a shaker synth from Luke DuBois' model") + demo videos (Rattle in a minimal track).

---

*Document created Feb 2026. For implementation details, see [docs/](docs/) and [research/](research/).*
