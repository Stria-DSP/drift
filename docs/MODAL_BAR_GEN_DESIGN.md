# Modal Bar Synth — gen~ Implementation

## Current Working Architecture

The modal bar synth uses a **single combined codebox** (`modal_bar.codebox`) that contains both the exciter and one resonator. This stays within the gen~ codebox History limit (5 variables) while keeping the code clean and maintainable.

**Key insight:** Instead of splitting exciter/resonator into separate codeboxes, we combine them into one unit that represents a single mode. To get 8 modes, we create **8 instances** of this codebox in the gen~ patcher, each with a different frequency ratio.

---

## File Structure

```
src/modal_bar/
├── modal_bar.codebox    # Combined exciter + resonator (one mode)
└── modal_bar.gendsp     # Gen~ patcher with 8 codebox instances
```

---

## modal_bar.codebox — One Complete Mode

**Inlets:**
1. `gate` - Trigger/velocity (0 or 0.01-1.0)
2. `base_freq` - Fundamental frequency in Hz
3. `ratio` - Frequency multiplier for this mode (e.g., 1.0, 2.756, 5.423...)
4. `decay` - Tau (decay time) in seconds (0.1 to 5.0)
5. `softness` - Mallet softness, 0=hard (1ms), 1=soft (10ms)
6. `force` - Output gain (0.0 to 1.0)
7. `sr_hz` - Sample rate in Hz

**Outlets:**
1. `out1` - Resonator output (soft-limited with tanh)

**History variables (5):**
- `gate_prev` - Previous gate sample (for trigger detection)
- `exc_phase` - Exciter phase (0 to 1)
- `velocity` - Sampled velocity on trigger
- `y_prev_1` - Resonator delay 1 sample
- `y_prev_2` - Resonator delay 2 samples

**What it does:**
1. **Trigger detection:** Rising edge on gate (0→positive)
2. **Exciter:** Generates Hanning-windowed burst scaled by velocity
   - Duration: 1ms (hard) to 10ms (soft) based on softness parameter
   - Phase ramps 0→1 over duration samples
3. **Resonator:** Two-pole IIR filter excited by the burst
   - Frequency: `base_freq * ratio`
   - Decay: Exponential with time constant `decay` (tau)
4. **Output:** Soft limiting with `tanh(force * y_new * 0.5)`

---

## gen~ Patcher Structure (modal_bar.gendsp)

To create the full 8-mode bar, the gen~ patcher contains:

```
[in 1 gate] ─────────┬──────────┬──────────┬──── (fanned to all 8)
[in 2 base_freq] ────┼──────────┼──────────┼──── (fanned to all 8)
[samplerate~] ───────┼──────────┼──────────┼──── (fanned to all 8)
                     ↓          ↓          ↓
[sig~ 1.0] ──→ [codebox mode_1] (ratio = 1.0)
[sig~ 2.756] → [codebox mode_2] (ratio = 2.756)
[sig~ 5.423] → [codebox mode_3] (ratio = 5.423)
  ... (8 total) ...
                     ↓          ↓          ↓
                     └──[+~]────┴──[+~]────┘
                            ↓
                        [*~ 0.125]  (divide by 8)
                            ↓
                        [out~ 1]
```

**Shared inputs:**
- `in 1`: Gate/velocity signal
- `in 2`: Base frequency (fundamental pitch in Hz)
- Params: `decay`, `softness`, `force` (accessible to all codeboxes)

**Per-mode constants:**
- Each codebox gets a different `ratio` value via `[sig~ <ratio>]`
- Material presets (wood/metal/glass/stone) are different ratio sets

---

## Material Frequency Ratios

Load these into the ratio inlets (or use Data + peek for switching):

### Wood (uniform wooden bar)
```
1.0 2.572 4.644 6.984 9.723 12.0 14.756 17.687
```

### Metal (uniform aluminum bar)
```
1.0 2.756 5.423 8.988 13.448 18.68 24.566 31.147
```

### Glass (wine glass)
```
1.0 2.32 4.25 6.63 9.38 12.5 16.0 19.9
```

### Stone (Tibetan bowl, 180mm)
```
1.0 2.778 5.181 8.163 11.661 15.638 19.99 24.65
```

---

## Parameter Ranges

### decay (tau)
- **Range:** 0.1 to 5.0 seconds
- **Default:** 1.0 second (marimba-like)
- **Mapping:** 
  - 0.1s = very short, damped, dry
  - 1.0s = medium, natural wood
  - 5.0s = very long, bell-like metal

### softness (mallet hardness)
- **Range:** 0.0 to 1.0 (dimensionless)
- **Default:** 0.5 (medium rubber)
- **Effect:**
  - 0.0 = hard (1ms burst, bright)
  - 0.5 = medium (5.5ms burst)
  - 1.0 = soft (10ms burst, warm)

### force (output gain)
- **Range:** 0.0 to 1.0
- **Default:** 0.5
- **Effect:** Scales resonator output before limiting

---

## Velocity Sensitivity

The codebox automatically extracts velocity from the gate amplitude:

1. **Trigger detection:** `(gate > 0) && (gate_prev <= 0)`
2. **Velocity capture:** Sample gate value on trigger, clamp to 0.01-1.0
3. **Exciter scaling:** Window amplitude scales with velocity
4. **Output:** Final level proportional to strike force

**Usage:** Send gate values between 0.01 (soft) and 1.0 (hard) as the trigger signal.

---

## Adding Material Morphing (Optional)

To interpolate between wood/metal/glass/stone:

### In Max (outside gen~):
```
[pictslider 2D] → interpolate 4 material ratio lists
     ↓
[buffer~ current_ratios 8] ← computed ratios
     ↓
[message: ratios current_ratios( → [gen~]
```

### Inside gen~:
```
[data ratios 8]  ← receives interpolated ratios from Max
     ↓
[peek ratios 0] → [codebox mode_1]
[peek ratios 1] → [codebox mode_2]
  ... etc
```

Then the user can morph between materials in real-time via the 2D pad.

---

## Why This Architecture?

### Advantages:
1. **Simple:** One codebox file, replicate 8 times
2. **Stays within limits:** 5 History variables per codebox instance
3. **Modular:** Each mode is self-contained
4. **RNBO-compatible:** Pure gen~ objects and codebox export cleanly
5. **DRY:** Edit one codebox file, all modes update

### Compared to split design:
- **Split (old plan):** Exciter codebox → 8× (expr + 2 history objects) → complex wiring
- **Combined (current):** 8× same codebox → simple parallel structure

### Tradeoffs:
- Exciter logic duplicated 8 times (but same trigger fires all simultaneously)
- Slightly more CPU than shared exciter (negligible in practice)
- Much simpler to understand, maintain, and debug

---

## Implementation Notes

### Exciter phase update
The critical pattern for reliable History updates:
```c
// Read History first
curr_phase = exc_phase;

// Calculate new value
new_phase = trigger ? 0. : (should_increment ? incremented : 1.);

// Write History last
exc_phase = new_phase;
```

**Avoid:** Nested ternaries that directly assign to History. Use temp variables.

### Soft limiting
Output uses `tanh` for smooth saturation:
```c
out1 = tanh(force * y_new * 0.5);
```

Multiplying by 0.5 before tanh gives gentle compression. Adjust for more/less drive.

### Sample rate handling
Always pass sample rate as inlet (not Param) to ensure correct timing if host SR changes:
```c
inv_sr = 1. / sr_hz;
phase_inc = inv_sr / (exc_dur_sec + 1e-6);
```

---

## Using the Gen~ Patcher

1. **In Max:** Create `[gen~ modal_bar]`
2. **Connect inputs:**
   - Inlet 1: Gate/velocity (0 or 0.01-1.0)
   - Inlet 2: Base frequency (Hz) from `[mtof]` or frequency source
3. **Set parameters:**
   - `[prepend decay]` → gen~ (0.1 to 5.0)
   - `[prepend softness]` → gen~ (0.0 to 1.0)
   - `[prepend force]` → gen~ (0.0 to 1.0)
4. **Output:** Outlet 1 is the mixed 8-mode bar sound

### Example patch:
```
[mtof] ← MIDI pitch
   |
[sig~]
   |
[gen~ modal_bar] ← [toggle] (gate)
   ↑              ↑
[prepend decay]  [prepend softness]
   ↑              ↑
[0.1 - 5.0]     [0.0 - 1.0]
   
   ↓
[dac~]
```

---

## File Reference

### modal_bar.codebox
**Purpose:** Combined exciter + single-mode resonator  
**Location:** `src/modal_bar/modal_bar.codebox`  
**Use:** Import into gen~ codebox objects (8 instances for full bar)

### modal_bar.gendsp
**Purpose:** Complete 8-mode bar patcher  
**Location:** `src/modal_bar/modal_bar.gendsp`  
**Use:** Reference implementation showing how to wire 8 codebox instances

---

## Summary

The working modal bar implementation uses a **combined exciter + resonator codebox** approach:
- ✅ Stays within 5 History variable limit
- ✅ Simple, maintainable architecture
- ✅ RNBO-exportable for VST/AU builds
- ✅ Velocity-sensitive with automatic trigger detection
- ✅ Built-in soft limiting
- ✅ Real-time parameter control (decay, softness, force)

Each codebox is a complete "mode" of the bar. Create 8 instances with different frequency ratios to get the full timbre.
