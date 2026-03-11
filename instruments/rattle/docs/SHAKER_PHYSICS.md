# Shaker Physics & Synthesis Model

Technical reference for the Rattle shaker synthesis engine. Based on Luke DuBois' shaker object with extensions for performance simulation.

---

## 1. Luke DuBois' Shaker Model

### 1.1 Core Concept

Luke DuBois' shaker (early 2000s Max/MSP) models a shaker as a container with multiple particles:

- **Particles:** Small objects that collide with container walls and each other.
- **Collision events:** Each collision generates an impulse (short click/pop).
- **Resonance:** Impulses excite a resonator (the "body" of the shaker) that shapes the output timbre.
- **Shake rate:** Controls how often collisions occur (faster shaking = more frequent collisions = denser sound).

### 1.2 Parameters

| Parameter | Function |
|-----------|----------|
| **Shake rate** | Collision frequency (Hz); higher = more dense |
| **Num particles** | More particles = more collision events per shake |
| **Resonance frequency** | Center frequency of the resonator (body pitch) |
| **Resonance Q** | Bandwidth of the resonator (narrow = ringing, wide = noisy) |
| **Amplitude** | Overall output level |

### 1.3 Implementation in Max/MSP

**DuBois' approach (simplified):**

1. **Impulse generation:** `noise~` + `gate~` or `random~` to create collision events.
2. **Shake rate clock:** `phasor~` or `metro` to trigger collision events at variable intervals.
3. **Resonator:** `reson~` or `biquad~` (bandpass filter) to shape impulses into shaker body sound.
4. **Output:** Sum of impulses through resonator → amplifier → out.

**Reference:** DuBois' instrument suite (Max objects circa 2000–2005); see research/dubois_shaker_notes.md for implementation details.

---

## 2. Rattle Extensions

### 2.1 Accent Response

**Goal:** Accented steps sound louder and brighter (more energy).

**Implementation:**

- **Amplitude:** Accent level (0–127) scales impulse amplitude (1.0 = normal, 2.0 = accented).
- **Brightness:** Accent increases resonator cutoff frequency or adds a second, higher resonance mode.
- **Particle energy:** Higher accent → more particles triggered per collision event → denser burst.

**Max/gen~ approach:**

```
accent_value (0–127) → normalize to 0–1 → scale impulse amplitude
accent_value → scale resonator Q (higher accent → sharper resonance)
```

### 2.2 Motion Dynamics

**Goal:** Simulate back-and-forth shaking motion (affects shake rate and brightness).

**Implementation:**

- **Motion LFO:** Slow sine wave (0.5–2 Hz) modulates shake rate (e.g. ±20% around base rate).
- **Brightness modulation:** Motion also modulates resonator cutoff (forward motion = brighter, backward = darker).
- **Per-step variance:** Optional: each step has a slight random offset in shake rate (±5–10%) to simulate hand motion.

**Max/gen~ approach:**

```
base_shake_rate + (motion_lfo * motion_depth) → shake_rate
shake_rate → phasor~ frequency → collision trigger
```

### 2.3 Timing Humanization

**Goal:** Avoid robotic grid; onsets have subtle timing offsets.

**Implementation:**

- **Per-step offset:** Each step trigger has a small random delay (Gaussian noise, ±0–50ms).
- **User control:** Timing looseness parameter (0–100%) scales the offset range.
- **Note:** Humanization is applied to onset time, not to the internal shake rate (which continues smoothly).

**Max approach:**

```
step trigger → delay~ (random offset 0–50ms) → shaker impulse
offset = randomsrc~ * timing_looseness_param
```

---

## 3. Resonator Design

### 3.1 Simple Resonator (MVP)

**Bandpass filter (`reson~` or `biquad~`):**

- **Pros:** Fast, simple, one parameter (center freq + Q).
- **Cons:** Single resonance mode; less realistic than multi-mode.

**Parameters:**

- Center frequency: 2–6 kHz (typical shaker body resonance).
- Q: 5–20 (higher = more ringing, lower = more noise).

### 3.2 Modal Resonator (Post-MVP)

**2–4 resonance modes (modal synthesis):**

- Each mode has frequency, amplitude, and decay time.
- Modes are tuned to shaker-like partials (e.g. f0, 1.5*f0, 2.3*f0, 3.8*f0).
- Accent can emphasize higher modes (brighter).

**Implementation in gen~:**

```
impulse → [mode1: reson~ f1 q1] + [mode2: reson~ f2 q2] + ... → sum → out
accent → scale mode2/mode3 amplitude (brighter)
```

**Reference:** Fors Mass (modal bar synth), Cook's physical modeling papers.

---

## 4. Gen~ Implementation Notes

### 4.1 Particle Collision

**Approach 1: Impulse train**

- `phasor~` at shake rate → threshold detector → impulse (1 sample pulse).
- Multiple particles: sum of N `phasor~` objects at slightly different rates (jittered).

**Approach 2: Noise gating**

- `noise~` → `gate~` triggered by shake rate clock.
- Simpler but less physically accurate.

**Rattle choice:** Start with Approach 1 (impulse train) for MVP; extend with jittered rates for multi-particle in v1.1.

### 4.2 Resonator in gen~

**Option 1: `reson~` or `biquad~` (Max native)**

- Works in gen~ but limited control.

**Option 2: Custom biquad in gen~**

- More control over Q, frequency modulation, etc.
- Use standard biquad filter code (see Max gen~ examples).

**Option 3: Modal synthesis (custom)**

- Implement multiple biquad filters in parallel.
- Sum outputs with amplitude scaling.

**Rattle choice:** Start with `reson~` (Option 1) for MVP; migrate to custom biquad (Option 2) or modal (Option 3) for v1.1.

---

## 5. References & Further Reading

- **Luke DuBois:** Max/MSP shaker object (circa 2000–2005); see research/dubois_shaker_notes.md.
- **Perry Cook:** "Real Sound Synthesis for Interactive Applications" (physical modeling, shakers).
- **Julius Smith:** "Physical Audio Signal Processing" (modal synthesis, resonators).
- **Cycling '74:** Max gen~ reference, `reson~` object, `biquad~` object.

---

*Document created Feb 2026. For implementation details, see src/rattle.maxpat and gen~ patches.*
