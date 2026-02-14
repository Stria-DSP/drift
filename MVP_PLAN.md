# MVP Plan: Phasing & Interference Engine

Plan for the first shippable version as a **Max for Live device**. Goal: prove the core phasing experience with a user-defined pattern, then iterate.

---

## 1. MVP scope

### In scope

| Feature | MVP detail |
|--------|------------|
| **Primary sequence** | User-defined via a **simple step sequencer** (e.g. 8 or 16 steps, one note per step; pitch + gate). No clip import yet. |
| **Playheads** | **2 playheads** (simplest phasing). Same pattern, different phase/rate. |
| **Master clock** | DAW transport–synced; drives both playheads. |
| **Drift** | One global **Drift** parameter so playheads slide relative to each other (Reichian feel). |
| **Scale** | **Scale/root** selector so output stays in key (simple quantize to scale). |
| **MIDI out** | Sends notes to one MIDI track (Ableton device standard). |
| **Snapshot** | **“Record to clip”** or **“Copy last N bars”** — enough to capture a moment; not full 64-bar drag-drop. |
| **Struck-bar synth** | **Built-in physical modeling synth (struck bars)** so Drifter works as a complete instrument. Sequencer drives internal bar sound; MIDI out still available. Can ship with final MVP phase or v1.1 if scope is tight. |
| **Platform** | **M4L only**; no RNBO/VST in MVP. |

### Out of scope (post-MVP)

- RNBO export / VST3/AU (Phase 2).
- Third and fourth playheads (add after 2 feels good).
- Coincidence-only triggering (optional mode; add when core phasing is solid).
- Prime-length loop selector (fixed length, e.g. 16 steps, is enough for MVP).
- MIDI clip input / “use clip as pattern” (v2).
- Fancy phase visualization (Lissajous, etc.); optional simple display or placeholder.
- 64-bar rolling buffer with drag-drop MIDI file export.

---

## 2. Phases and deliverables

### Phase 1: Clock + one playhead (foundation)

**Goal:** Transport-synced master clock; one playhead reads a **fixed** pattern and outputs MIDI.

**Tasks:**

1. Create M4L device shell (Live.device, UI panel).
2. Implement master clock from DAW transport (e.g. `transport` + `phasor~` with note-value rate, lock).
3. Store a minimal **pattern** in memory (e.g. 16 steps: pitch + on/off per step). Hardcoded or from a `coll`/list.
4. Single playhead: phase 0→1 over one “pattern length”; at each step boundary, if step is on, send MIDI note.
5. MIDI out to track (noteout or Live API).
6. Verify in Live: start/stop, tempo change; notes land on the grid.

**Deliverable:** One playhead playing a fixed 16-step pattern, in sync.  
**Rough effort:** 1–2 weeks at ~5–10 hrs/week.

---

### Phase 2: Second playhead + drift

**Goal:** Two playheads over the same pattern; second has a **rate multiplier** and **drift** so they phase.

**Tasks:**

1. Add second playhead with its own phase: `phase2 = (master_phase * rate_multiplier + drift_offset) % 1.0`.
2. Expose **Rate** (or multiplier) and **Drift** (e.g. 0–0.01) as device parameters.
3. Both playheads read from the same pattern; combine or interleave note output (no coincidence logic yet — both can trigger).
4. Tune so phasing is audible and musical (drift range, rate difference).
5. Optional: simple **mix** or **balance** between playhead 1 and 2 level/velocity.

**Deliverable:** Two playheads phasing over the same pattern; user can hear and control drift.  
**Rough effort:** ~1 week at ~5–10 hrs/week.

---

### Phase 3: Step sequencer (user-defined pattern)

**Goal:** User edits the primary sequence inside the device.

**Tasks:**

1. Replace hardcoded pattern with **step grid UI**: 8 or 16 steps, pitch per step (e.g. note name or MIDI number), gate on/off.
2. Persist pattern in device (Live device state / `pattrstorage` or equivalent).
3. Playheads read from this pattern; loop length = number of steps.
4. Keep Drift and Rate parameters; ensure step boundaries stay sample-accurate when pattern length is used in clock math.

**Deliverable:** User can program the pattern; phasing works as in Phase 2.  
**Rough effort:** 1–2 weeks at ~5–10 hrs/week.

---

### Phase 4: Scale quantization + basic polish

**Goal:** Output stays in key; device feels usable.

**Tasks:**

1. **Scale/root** selector (e.g. C major, A minor, one or two scale types). Quantize playhead output pitches to the selected scale (e.g. `coll` with scale degrees or m4l.balm if available).
2. **Velocity** or intensity (e.g. global velocity, or per-step if time).
3. **Snapshot:** “Record to clip” — on button press, record next 1–4 bars of MIDI output into a new clip on the same track (or copy to clipboard / simple buffer). Simplify if Live API is painful; minimum: “user can capture current phrase.”
4. UI cleanup: labels, ranges, default values, device name and short description.

**Deliverable:** Scale-quantized output, snapshot, and a presentable M4L device.  
**Rough effort:** ~1 week at ~5–10 hrs/week.

---

### Phase 4b: Struck-bar physical modeling synth (optional for MVP)

**Goal:** Drifter works as a full instrument: sequence drives an internal sound source so users can play it without loading another synth.

**Tasks:**

1. Implement a **struck-bar** physical model (modal synthesis with 2–4 partials, or simple waveguide/KS bar). Pitch from note number; strike position and hardness for brightness/decay.
2. Route sequencer MIDI to the bar synth internally; audio out from device. Keep **MIDI out** so users can still send pattern to external instruments (toggle or both).
3. Expose minimal bar params: decay, brightness/strike position, optional global tune. Keep UI small.
4. Test phasing patterns through the bar sound—ensure the character works with repetition and drift.

**Deliverable:** Drifter as sequencer + internal bar synth + MIDI out.  
**Rough effort:** ~1–2 weeks at ~5–10 hrs/week.  
**Note:** Can ship in v1.1 if MVP is prioritized as sequencer-only first.

---

### Phase 5: Package and soft launch

**Goal:** Others can install and use it; get feedback.

**Tasks:**

1. Test on a clean Live set (different tempos, start/stop, save/reload).
2. Write a **short readme** (what it is, how to use, 3–5 steps).
3. Package as .amxd (or current M4L format); optional .alp if you use Pack format.
4. **Soft launch:** Put on Gumroad (or free on maxforlive.com) with a “beta” or “MVP” label; share in one or two places (e.g. r/ableton, r/MaxMSP, Isotonik forum if allowed).
5. Collect feedback; list “v1.1” ideas (coincidence mode, 3rd playhead, clip input, etc.).

**Deliverable:** Downloadable M4L device + readme; first external users.  
**Rough effort:** ~3–5 days.

---

## 3. Order and dependencies

```
Phase 1 (clock + 1 playhead)
    → Phase 2 (+ 2nd playhead, drift)
        → Phase 3 (step sequencer)
            → Phase 4 (scale + snapshot + polish)
                → Phase 4b (struck-bar synth; optional)
                    → Phase 5 (package + launch)
```

- **Phase 1** is the only parallel-free start; everything else builds on it.
- **Phase 3** can start once Phase 2’s timing is stable (same clock, just replace pattern source).
- **Phase 4** can overlap with late Phase 3 (e.g. scale while finishing step grid).

---

## 4. Success criteria for MVP

- [ ] One M4L device that loads in Live 11/12.
- [ ] User can define a pattern (step sequencer) and hear two playheads phase over it, in sync with the DAW.
- [ ] Drift and at least one “rate” or “multiplier” control are exposed and musical.
- [ ] Output is scale-quantized; user can choose key/scale.
- [ ] User can capture the current output (snapshot / record to clip or equivalent).
- [ ] *(Optional)* Built-in struck-bar synth: user can hear the phased pattern through the internal bar sound without loading another instrument; MIDI out still works.
- [ ] Device is packaged and available for download; at least one other person has used it and given feedback.

---

## 5. Risks and de-scope options

| Risk | Mitigation |
|------|------------|
| Transport sync in M4L is flaky | Use well-documented pattern (phasor~ + note values + lock); refer to [research/technical.md](research/technical.md). If needed, start with internal BPM and add transport later. |
| Step sequencer UI takes too long | Ship with 8 steps first; or a minimal “pitch list” (e.g. 16 numbers) and add grid later. |
| Snapshot/record to clip is complex | De-scope to “user can record the track in Live as usual”; add proper snapshot in v1.1. |

---

## 6. After MVP (v1.1+)

- Add 3rd (and optionally 4th) playhead.
- Coincidence mode: trigger only when playheads overlap in phase.
- Prime-length loop option (7, 11, 13, 17 steps).
- “Use clip as pattern” (MIDI input).
- Phase visualization (Lissajous or circles).
- RNBO export path and VST3/AU build (see PROJECT_BRIEF §3.6).

---

*Total rough timeline: 5–7 weeks at ~5–10 hrs/week, depending on familiarity with M4L and Max timing. Adjust phase length to your schedule; keep Phase 1 and 2 as the non-negotiable core.*
