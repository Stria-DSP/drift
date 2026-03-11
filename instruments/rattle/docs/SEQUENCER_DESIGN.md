# Sequencer Design

Technical specification for the Rattle step sequencer (gate + accent channels, variable length, performance simulation).

---

## 1. Overview

Rattle's sequencer drives the shaker synth with two parallel channels:

- **Gate channel:** On/off per step (triggers shaker onset).
- **Accent channel:** 0–127 per step (modulates shaker energy/brightness).

Variable length (1–64 steps) allows non-power-of-two patterns (e.g. 7, 13) for evolving rhythms.

---

## 2. Sequencer Architecture

### 2.1 Clock & Transport Sync

| Component | Function |
|-----------|----------|
| **Master clock** | `phasor~ 1n @lock 1` (one cycle per note value, transport-synced) |
| **Step length** | User sets note value (1/4, 1/8, 1/16, 1/32) → `phasor~` frequency |
| **Step index** | `phasor~` output → `* num_steps` → `floor` → step index (0–63) |

**Example:** 16-step pattern at 1/16 notes:

```
phasor~ 16n @lock 1  → output 0–1 over one 16th note
phasor~ * 16         → 0–16
floor(phasor~ * 16)  → step index 0–15
```

### 2.2 Pattern Storage

**Option 1: `coll` (Max native)**

- Two `coll` objects: "gate_pattern" and "accent_pattern".
- Each `coll` entry: `step_index value` (e.g. `0 1`, `1 0`, `2 1`, ...).
- Lookup: step index → `coll` → gate (0/1) or accent (0–127).

**Option 2: `live.step`**

- Built-in Max for Live step sequencer UI.
- Two rows: gate (on/off), accent (velocity-style).
- Pros: UI included; easy editing.
- Cons: Fixed UI; less flexible for custom performance params.

**Rattle choice:** Start with `live.step` (Option 2) for MVP; migrate to custom `coll` + UI (Option 1) if needed for advanced features.

### 2.3 Variable Length

User sets step count (1–64):

- Sequencer cycles when step index reaches `num_steps`.
- Non-power-of-two OK (e.g. 7 steps at 1/16 notes = 7/16 bar pattern).
- Useful for polyrhythm: gate and accent can have independent lengths (e.g. gate = 8, accent = 5 → overlap every 40 steps).

**Max implementation:**

```
[phasor~ 16n @lock 1]
|
[* 64]  (max steps)
|
[% $num_steps]  (wrap at user-defined length)
|
[floor]
|
step_index (0 to num_steps-1)
```

---

## 3. Gate Channel

### 3.1 Function

- **On (1):** Trigger shaker onset (impulse burst).
- **Off (0):** Silence (no trigger).

### 3.2 Implementation

**Trigger detection:**

- Step index changes (0 → 1 → 2 → ...) → edge detector → trigger pulse.
- Lookup gate value from pattern: if gate == 1, send trigger to shaker synth; else skip.

**Max patch:**

```
[step_index]
|
[change]  (detect index change)
|
[select 1]  (only when gate == 1)
|
[trigger_shaker]
```

---

## 4. Accent Channel

### 4.1 Function

- **Value 0–127:** Modulates shaker energy (amplitude + brightness).
- **0:** No accent (base level).
- **127:** Full accent (max energy/brightness).

### 4.2 Implementation

**Lookup and scaling:**

- Step index → lookup accent value (0–127) from pattern.
- Normalize to 0–1: `accent_normalized = accent_value / 127.0`.
- Send to shaker synth: modulate impulse amplitude, resonator Q, or brightness.

**Max patch:**

```
[step_index]
|
[coll accent_pattern]  (or live.step accent row)
|
[/ 127.]  (normalize)
|
[accent_param → shaker_synth]
```

**Shaker synth response:**

- Amplitude: `base_amplitude * (1.0 + accent_normalized)`.
- Brightness: `resonator_freq * (1.0 + 0.5 * accent_normalized)`.
- Particle count: `base_particles + (accent_normalized * extra_particles)`.

---

## 5. Performance Simulation

### 5.1 Timing Humanization

**Goal:** Subtle timing offsets per step (avoid robotic grid).

**Implementation:**

- Generate random offset per step: Gaussian noise, ±0–50ms (user-adjustable via "looseness" param).
- Delay trigger by offset: `delay~ (offset_ms)`.
- Offset is recalculated each cycle (or per step) for variation.

**Max patch:**

```
[trigger_from_gate]
|
[random $timing_looseness]  (e.g. 0–50ms)
|
[delay~ $offset_ms]
|
[shaker_trigger]
```

**Note:** Offset is applied to trigger time, not to the internal shake rate (which continues smoothly).

### 5.2 Motion Dynamics

**Goal:** Simulate back-and-forth shaking motion.

**Implementation:**

- LFO (0.5–2 Hz) modulates shake rate: `shake_rate = base_rate * (1.0 + motion_lfo * motion_depth)`.
- Motion depth (0–100%) controlled by user.
- LFO can be free-running or synced to sequencer cycle.

**Max patch:**

```
[phasor~ 1 Hz]  (motion LFO)
|
[* $motion_depth]
|
[+ 1.]
|
[* $base_shake_rate]
|
[shake_rate → shaker_synth]
```

**Optional:** Per-step motion variance (each step has a slight random offset in shake rate, ±5–10%).

### 5.3 Accent Smoothing

**Goal:** Smooth transitions between accent levels (avoid clicks).

**Implementation:**

- Interpolate accent values between steps (line~) so changes are gradual.
- Smoothing time: 5–20ms (fast enough to preserve rhythm, slow enough to avoid clicks).

**Max patch:**

```
[accent_value]
|
[line~ $smooth_time]  (e.g. 10ms)
|
[accent_param → shaker_synth]
```

---

## 6. UI / UX

### 6.1 Step Grid (live.step or custom)

**MVP: `live.step`**

- Two rows: gate (on/off toggles), accent (0–127 velocity-style).
- User clicks to toggle gate, drags to set accent.
- `live.step` handles UI + pattern storage.

**Post-MVP: Custom UI**

- `multislider` for accent (continuous 0–127).
- `live.grid` or custom buttons for gate (on/off).
- More flexible layout; can add per-step timing offset, motion variance, etc.

### 6.2 Performance Controls

| Control | Function | Range |
|---------|----------|-------|
| **Timing looseness** | Per-step offset (humanization) | 0–100% (0 = tight grid, 100 = ±50ms) |
| **Motion depth** | LFO modulation of shake rate | 0–100% (0 = static, 100 = ±20% rate) |
| **Accent depth** | Scaling of accent response | 0–100% (0 = no accent, 100 = full) |

### 6.3 Sequencer Controls

| Control | Function | Range |
|---------|----------|-------|
| **Step length** | Number of steps in pattern | 1–64 |
| **Note value** | Step duration (1/4, 1/8, 1/16, 1/32) | Dropdown menu |
| **Gate length (opt)** | Run gate / accent at different lengths | Independent 1–64 |

---

## 7. Advanced Features (Post-MVP)

### 7.1 Polyrhythm Mode

- Gate and accent run at different step lengths (e.g. gate = 8, accent = 5).
- Overlap cycle = LCM(gate_length, accent_length) steps → long evolving patterns.

### 7.2 Humanization Profiles

- Preset timing curves: tight (±5ms), medium (±20ms), loose (±50ms), swing (offset every other step).
- User selects profile instead of raw looseness value.

### 7.3 MIDI Out

- Gate channel sends MIDI note-on/off (fixed pitch, e.g. C3) for external triggering.
- Accent value → MIDI velocity.
- Useful for layering Rattle pattern with external shaker samples or synths.

### 7.4 Per-Step Parameters

- Each step has additional params: timing offset, motion variance, resonator freq.
- Stored in expanded `coll` or custom data structure.
- UI: modal editor (click step → edit params in detail).

---

## 8. References & Further Reading

- **Max for Live:** `live.step` object, `live.grid`, `multislider`.
- **Max/MSP:** `coll`, `phasor~`, `change`, `delay~`, `line~`.
- **Sequencer design:** Study euclidean rhythm generators, probabilistic sequencers (e.g. Rebel Technology, Mutable Instruments).

---

*Document created Feb 2026. For implementation details, see src/rattle.maxpat.*
