# Luke DuBois' Shaker — Notes & Implementation

Research notes on Luke DuBois' shaker object for Max/MSP (early 2000s). Foundation for Rattle's shaker synthesis engine.

---

## 1. Luke DuBois — Background

- **Name:** Luke DuBois
- **Credentials:** DMA in Composition (Columbia); composer, artist, technologist
- **Affiliation:** NYU (Integrated Digital Media)
- **Work:** Algorithmic composition, data sonification, Max/MSP instruments
- **Website:** [lukedubois.com](http://lukedubois.com)

## 2. Shaker Object — Overview

DuBois created a suite of percussive instruments for Max/MSP (circa 2000–2005), including shaker, tambourine, and other idiophones.

**Shaker model:**

- **Concept:** Container with multiple particles; particles collide with walls and each other.
- **Output:** Collision events generate impulses; resonator shapes the timbre.
- **Parameters:** Shake rate (collision frequency), num particles, resonance freq/Q, amplitude.

**Use case:** Electronic music, live coding, interactive installations.

---

## 3. Implementation Details

### 3.1 Collision Events (Impulse Generation)

**Approach:**

- **Particles:** Modeled as discrete events, not continuous physics simulation.
- **Collision timing:** Random or quasi-random intervals based on shake rate.
- **Impulse:** Short pulse (1–2 samples) with amplitude proportional to particle "energy."

**Max/MSP objects:**

- `noise~` → white noise as impulse source.
- `gate~` → triggered by shake rate clock to create collision bursts.
- `random` or `drunk` → jitter timing for realism.

### 3.2 Shake Rate Clock

**Function:** Controls how often collisions occur.

**Implementation:**

- `phasor~` or `metro` at shake rate (Hz) triggers collision events.
- Higher shake rate → more frequent collisions → denser sound.

**Range:** 1–50 Hz (slow shaking to rapid shaking).

### 3.3 Resonator (Body Sound)

**Function:** Shapes impulses into shaker timbre.

**Implementation:**

- `reson~` (bandpass filter) with center freq + Q.
- Center freq: 2–6 kHz (typical shaker body resonance).
- Q: 5–20 (higher = more ringing, lower = more noise).

**Alternative:** Multiple `reson~` in parallel (modal synthesis) for richer timbre.

### 3.4 Amplitude Control

**Function:** Overall output level.

**Implementation:**

- `*~ $amplitude` at output.
- Can be modulated by shake rate (faster shaking → louder).

---

## 4. Parameters Summary

| Parameter | Function | Range | Max Object |
|-----------|----------|-------|------------|
| **Shake rate** | Collision frequency | 1–50 Hz | `phasor~` or `metro` |
| **Num particles** | Collision density | 1–10 | Multiple `gate~` or sum of impulses |
| **Resonance freq** | Body pitch | 2–6 kHz | `reson~` center freq |
| **Resonance Q** | Body ringing | 5–20 | `reson~` Q |
| **Amplitude** | Output level | 0–1 | `*~` |

---

## 5. Rattle Extensions

### 5.1 Accent Response

**DuBois' model:** No built-in accent (constant particle energy).

**Rattle addition:**

- Accent value (0–127) → scale impulse amplitude and resonator Q.
- Accented collision = louder + brighter (higher Q or added high-frequency mode).

### 5.2 Motion Dynamics

**DuBois' model:** Static shake rate (no motion simulation).

**Rattle addition:**

- LFO modulates shake rate (simulate back-and-forth motion).
- LFO can be synced to transport.
- Motion also modulates resonator cutoff (forward motion = brighter, backward = darker).

### 5.3 Sequencer Integration

**DuBois' model:** Continuous shaking (no step sequencer).

**Rattle addition:**

- Step sequencer (gate + accent) triggers shaker onsets.
- Gate channel = on/off per step; accent channel = energy per step.

---

## 6. Where to Find DuBois' Shaker

### 6.1 Public Archives

- **lukedubois.com:** Check for Max patches or links to archived projects.
- **archive.org:** Search for "Luke DuBois Max MSP" or "DuBois shaker."
- **Cycling '74 forum:** Old posts or patch sharing threads (pre-2010).

### 6.2 Academic Sources

- **DuBois' papers:** Search Google Scholar for "Luke DuBois" + "Max/MSP" or "algorithmic composition."
- **DMA dissertation (Columbia):** May include technical appendices with Max patches.

### 6.3 Contact

- **Email:** luke.dubois@nyu.edu (NYU faculty page).
- **Request:** Permission to use/reference shaker model in Rattle; offer to credit/cite.

---

## 7. References & Further Reading

### 7.1 DuBois' Work

- **Website:** [lukedubois.com](http://lukedubois.com)
- **Projects:** "Fashionably Late for the Relationship" (data sonification), "Billboard" (text analysis), "Hindsight is Always 20/20" (presidential portraits).
- **Instruments:** Max/MSP percussion suite (shaker, tambourine, etc.).

### 7.2 Shaker Physics

- **Perry Cook:** "Real Sound Synthesis for Interactive Applications" (Ch. 12: Percussive synthesis).
- **Julius Smith:** "Physical Audio Signal Processing" (modal synthesis).
- **Papers:** "Maraca modeling" (search Google Scholar).

### 7.3 Max/MSP

- **Cycling '74:** Max reference, `reson~`, `biquad~`, `phasor~`, `gate~`, `noise~`.
- **Tutorials:** Max for Live sequencer, gen~ basics.

---

## 8. Credit & Attribution

**Rattle credits:**

- "Shaker synthesis based on Luke DuBois' shaker model (circa 2000s)."
- Include in device info, README, and documentation.
- If using DuBois' code directly, request permission and cite.

---

*Research notes created Feb 2026. Update as you explore DuBois' work and implement the shaker model.*
