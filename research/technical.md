# Technical Research

Notes for implementing the Phasing & Interference Engine in Max/MSP and RNBO. Focus: transport sync, phase/drift, and sample-accurate timing.

---

## 1. Transport and phasor sync (Max/MSP)

**Goal:** Master clock and sub-clocks must stay in sync with the DAW and with each other; phasing is controlled drift, not drift from sloppy sync.

### 1.1 Phasor~ with transport

- Use **tempo-relative time** as phasor~ arguments (e.g. `4n` quarter note, `16n` sixteenth) rather than raw Hz.
- Set **@lock 1** so the phasor only advances when transport is running and follows tempo changes.
- **Transport-controlled phasor~:** [UCI Max Cookbook](https://music.arts.uci.edu/dobrian/maxcookbook/transport-controlled-phasor) — lock to transport, note-value rate.

### 1.2 Common pitfalls

- Phasors drifting relative to transport beat readouts.
- Ramp not initializing at 0 consistently.
- Timing messages that look simultaneous actually arriving at different times.

**Mitigation:** Use **sample-and-hold (sah~)** at phasor cycle boundaries for discrete, synchronized events (e.g. step triggers).

### 1.3 Gen~ for phase logic

- **gen~** is better suited than raw MSP for high-rate phase math inside RNBO.
- **wrap** in gen~ handles phase wrapping cleanly (vs. pong~ in MSP).
- **history** in gen~ supports accumulation and state for timing-sensitive logic.
- Phaser slope modulation in gen~ gives more direct control over groove/swing than patching MSP by hand.  
  Ref: [Isotonik – Modulating Phaser Slopes in Max/MSP & Gen~](https://isotonikstudios.com/modulating-phaser-slopes-in-max-msp-gen-a-diy-guide-to-groove-and-swing/).

### 1.4 Independent playheads with shared master

- Master clock: transport + phasor~ (or gen~ equivalent) with lock.
- Sub-clocks: `Current_Phase = (Master_Phase * Rate_Multiplier) % 1.0`.
- **Drift:** Add a small per-cycle offset (e.g. 0.001) to one or more rate multipliers so playheads slide relative to each other (Reichian effect).
- For host automation, expose Drift Rate, Rate Multipliers, and (if used) Interference Window as RNBO parameters.

---

## 2. Steve Reich–style phasing (musical reference)

**Piano Phase (1967)** is the canonical reference for the Phasing Engine’s behavior.

- Two parts play the **same** short pattern (e.g. 12 notes).
- One part runs at a **slightly faster tempo**; no change of notes, only relative phase.
- As the faster part drifts ahead, the composite pattern passes through many distinct “interference” states.
- When the faster part has gained one full cycle, it’s one note ahead and the process can repeat or reset.

**Implementation takeaway:** Phasing is **tempo differential**, not random variation. In our case:

- Multiple playheads over the same (or related) patterns.
- Slightly different **rate multipliers** or **drift** so phase relationships evolve.
- Optionally trigger notes only when playheads **coincide** within a small phase window (interference constraint).

---

## 3. Sample-accurate timing and RNBO

- RNBO supports **sample-accurate events** and host **transport sync** (phasor~-style lock to host).
- Implement the **core phase/drift math in gen~** for stability and performance; keep message-rate logic minimal.
- **MIDI out:** Use RNBO’s note output (e.g. noteout or equivalent) to send the algorithmic stream to the host; ensure note-on/off timing is derived from the same phase model.

---

## 4. References (links)

- [Best way to sync a Phasor~ with transport?](https://cycling74.com/forums/best-way-to-sync-a-phasor-with-transport) — Cycling '74 Forum
- [Transport and Phasor Synchronisation](https://cycling74.com/forums/transport-and-phasor-synchronisation) — Cycling '74 Forum
- [Transport-controlled phasor~](https://music.arts.uci.edu/dobrian/maxcookbook/transport-controlled-phasor) — UCI Max Cookbook
- [Phaser Slope Modulation in Max/MSP & Gen~](https://isotonikstudios.com/modulating-phaser-slopes-in-max-msp-gen-a-diy-guide-to-groove-and-swing/) — Isotonik Studios
- [Piano Phase – Steve Reich](https://en.wikipedia.org/wiki/Piano_Phase) — Wikipedia
- [Programming Steve Reich's Piano Phase in SuperCollider](https://www.ezralafleur.com/programming-steve-reichs-piano-phase-in-supercollider/) — Ezra LaFleur (conceptual reference)
