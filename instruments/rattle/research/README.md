# Rattle Research

Technical references, Luke DuBois' shaker notes, Max object docs, and shaker physics papers.

## Contents

| File | Description |
|------|-------------|
| `dubois_shaker_notes.md` | Notes on Luke DuBois' shaker object (implementation, parameters, references) |
| `max8_reference.md` | Max 8 object reference (phasor~, reson~, biquad~, live.step, etc.) — copied from Drift |
| `shaker_physics.md` | Physics of shaken idiophones (particle collision, resonance, motion dynamics) |
| `performance_simulation.md` | Research on timing humanization, accent modeling, motion profiles |

## Luke DuBois' Shaker

Luke DuBois (composer, artist, DMA Columbia) created a suite of percussive instruments for Max/MSP in the early 2000s, including a shaker model:

- **Core idea:** Particle collision events trigger impulses; resonator shapes the output.
- **Parameters:** Shake rate, num particles, resonance freq/Q, amplitude.
- **Implementation:** `noise~` + `gate~` for impulses, `reson~` for resonator.

**Where to find:**

- DuBois' website (lukedubois.com) or archive.org snapshots.
- Max/MSP community forums (e.g. Cycling '74 forum, archived patches).
- Contact DuBois directly (NYU faculty) if needed for reference/permission.

**Rattle approach:** Use DuBois' model as foundation; extend with accent, motion, and sequencer integration. Credit DuBois in docs and device info.

## Max/MSP References

- **Max 8 User Guide:** See `max8_pdfs/Max9-UserGuide.pdf` (if downloaded).
- **Object reference pages:** Fetch with `python scripts/fetch_max_refpages.py` (see Drift's scripts).
- **Gen~ reference:** Cycling '74 website, Max tutorials.

## Shaker Physics

- **Perry Cook:** "Real Sound Synthesis for Interactive Applications" (Ch. 12: Percussive synthesis).
- **Julius Smith:** "Physical Audio Signal Processing" (modal synthesis, resonators).
- **Papers:** Search for "shaken idiophone model," "particle collision synthesis," "maraca modeling."

## Performance Simulation

- **Timing humanization:** Research on "groove quantize," "humanize MIDI," "swing curves."
- **Accent modeling:** Study drumming literature (accent = louder + brighter + more energy).
- **Motion dynamics:** Biomechanics of hand shaking (back-and-forth motion → rate modulation).

---

*Research directory created Feb 2026. Add notes and references as you explore DuBois' work and shaker physics.*
