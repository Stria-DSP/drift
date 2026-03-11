# Waveguide String Synthesis (Karplus-Strong)

**Tags**: #waveguide #karplus-strong #string #physical-modeling #synthesis #tendril
**Related**: [[Struck-Bar Physical Modeling]], [[Modal Synthesis]], [[Delay Lines and Feedback]]
**Context**: Tendril (optional struck string synth), any plucked/struck string instruments

## Summary

Waveguide synthesis models vibrating strings (guitar, harp, berimbau) using delay lines and feedback. The **Karplus-Strong algorithm** (1983) is the classic approach: excite a delay line with noise, feed it back through a lowpass filter. Result: plucked/struck string sound with realistic pitch, decay, and brightness. Extensions add dispersion (inharmonic shimmer), dynamic damping, and sustain control.

## Why Waveguide for Tendril?

- **Bright, metallic, resonant**: Strings have distinct character vs. struck bars (Drift's marimba/vibes)
- **Sustain control**: Unlike percussive bars, strings can sustain (pluck → bow-like)
- **Computational efficiency**: Single delay line + filters; lighter than modal (sum of N sines)
- **Expressive**: Strike position, damping, dispersion = wide timbral range from one model
- **Optional integration**: Tendril can be pure MIDI sequencer or include internal string synth

---

## Core Concept: Karplus-Strong Algorithm

### Basic Idea

A string vibrates as a **traveling wave** that reflects at both ends. A **delay line** simulates the round-trip time (2× string length). **Feedback** with slight damping (lowpass filter) simulates energy loss.

### Algorithm (Original Karplus-Strong, 1983)

```
1. Excitation: Fill delay line with random noise (burst)
2. Loop:
   a. Read from delay line (output)
   b. Lowpass filter (average two adjacent samples)
   c. Write back to delay line (feedback)
3. Repeat until decay
```

**Result**: Noise → pitched tone at `samplerate / delay_length` Hz. Lowpass removes high frequencies over time → natural decay.

### Block Diagram

```
Excitation (noise burst or impulse)
  ↓
  +-----------------------+
  |                       |
  |   Delay Line          |  ← Length = samplerate / frequency
  |   (circular buffer)   |
  |                       |
  +-----------+-----------+
              |
              ↓
         Lowpass Filter  ← Damping (energy loss)
              |
              ↓
           Gain < 1.0    ← Decay control
              |
              ↓ (feedback)
        (back to delay input)
              |
              ↓
            Output
```

---

## Parameters

### 1. Pitch (Fundamental Frequency)

- **Delay length** (in samples) = `samplerate / frequency`
- Example: 440 Hz at 44.1 kHz → delay = 44100 / 440 = 100.23 samples
- **Fractional delay**: Use interpolation (linear, allpass, or Lagrange) for non-integer lengths

### 2. Damping (Brightness)

- **Lowpass cutoff**: Higher cutoff = brighter (more high frequencies persist); lower = duller
- Typical range: 200 Hz (very dull) to 10 kHz (very bright)
- **One-pole lowpass** (simplest): `y[n] = a * x[n] + (1 - a) * y[n-1]`, where `a` = cutoff / samplerate

### 3. Decay Time (Sustain)

- **Feedback gain** (< 1.0): Closer to 1.0 = longer sustain; closer to 0.0 = short pluck
- Relationship: `decay_time ≈ -3 * delay_length / (samplerate * log(gain))`
- Typical gain: 0.99 (short pluck) to 0.9999 (bow-like sustain)

### 4. Pluck Position (Harmonic Content)

- **Excitation filtering**: Pluck at center (antinode) suppresses even harmonics; pluck at edge (node) excites all harmonics
- **Implementation**: Filter noise burst before feeding to delay line
  - Center: Lowpass (suppresses high harmonics)
  - Edge: No filter or highpass (full spectrum)

### 5. Brightness / Dispersion (Inharmonic Shimmer)

- **Allpass filter** in feedback loop: Adds frequency-dependent delay → inharmonic partials (shimmer)
- Real strings have slight dispersion (stiffness); allpass simulates this
- **Tuning**: Allpass cutoff or Q adjusts shimmer amount (0 = harmonic, 1 = shimmer)

---

## Implementation

### gen~ (Max/MSP)

#### Basic Karplus-Strong (Monophonic)

```gen~
// Inputs
in1 trigger;       // Gate (note-on)
Param pitch (default 440);      // Hz
Param decay (default 0.995);    // Feedback gain
Param damping (default 5000);   // Lowpass cutoff (Hz)

// Excitation: noise burst on trigger
excitation = trigger > 0 ? noise() * 0.5 : 0;

// Delay line
delay_samples = samplerate / pitch;
History delay_buffer[8192];  // Max delay length (adjust as needed)
History write_index (0);

// Write excitation + feedback to delay
delay_buffer[write_index] = excitation + feedback_signal;
write_index = (write_index + 1) % delay_samples;

// Read from delay
read_index = (write_index - delay_samples + 8192) % 8192;
delayed = delay_buffer[read_index];

// Lowpass filter (one-pole)
a = damping / samplerate;  // Normalized cutoff
History filtered_prev (0);
filtered = a * delayed + (1 - a) * filtered_prev;
filtered_prev = filtered;

// Feedback
feedback_signal = filtered * decay;

// Output
out1 = delayed;
```

**Note**: This is pseudocode; actual gen~ uses `delay` object or `Data` buffer with modulo indexing.

#### Extended Model (Dispersion + Dynamic Damping)

```gen~
// Add allpass for dispersion
allpass_freq = 1000;  // Allpass cutoff
allpass_out = allpass(delayed, allpass_freq);

// Dynamic damping (envelope-controlled cutoff)
env = exponential_decay(trigger, 0.1);  // 100ms decay
cutoff_mod = 0.5;  // Modulation amount
cutoff = damping * (1 + env * cutoff_mod);

// Lowpass with dynamic cutoff
filtered = onepole(allpass_out, cutoff);

// Feedback
feedback_signal = filtered * decay;
```

### Max Patcher (MSP Objects)

```max
[mtof]  // MIDI note → Hz
  |
[/ 44100]  // Convert to delay time (seconds)
  |
[* 1000]  // Convert to ms
  |
[tapin~ 200]  // Delay line (max 200ms)
  |
[tapout~ $1]  // Variable delay (pitch)
  |
[onepole~ 5000]  // Lowpass (damping)
  |
[*~ 0.995]  // Feedback gain (decay)
  |
(feedback to [tapin~])
  |
[+~ excitation]  // Add noise burst
  |
output
```

### Excitation (Pluck/Strike)

```max
[trigger bang]  // Note-on
  |
[noise~]
  |
[*~ 0.5]  // Amplitude
  |
[line~ 0]  // Envelope (1ms burst)
  |
(to delay input)
```

---

## Extensions (Post-MVP)

### 1. Fractional Delay (Accurate Pitch)

For non-integer delay lengths (e.g. 100.23 samples), use **interpolation**:
- **Linear**: `y = (1 - frac) * x[n] + frac * x[n+1]`
- **Allpass**: First-order allpass filter (better phase response)
- **Lagrange**: Higher-order polynomial interpolation

### 2. Dispersion (Inharmonic Shimmer)

Add **allpass filter** in feedback loop:
- Frequency-dependent delay → inharmonic partials
- Real strings have dispersion due to stiffness
- Adjustable: allpass cutoff or Q controls shimmer amount

### 3. Dynamic Damping

Modulate **lowpass cutoff** with:
- Envelope (bright attack → dull sustain)
- Velocity (hard pluck → bright, soft pluck → dull)
- LFO (tremolo or vibrato-like brightness modulation)

### 4. Two-Polarization Model

Real strings vibrate in two perpendicular planes (horizontal + vertical). Use **two delay lines** (one per polarization) with slight coupling → richer, more realistic timbre.

### 5. Bowed String

Add **friction model** (continuous excitation instead of burst):
- **Stick-slip**: Velocity-dependent friction → sustained tone
- **Bow pressure** and **bow position** as parameters
- More complex; post-MVP or separate product

---

## Advantages

- **Computational efficiency**: One delay line + filters (vs. N oscillators for modal)
- **Realistic decay**: Natural energy loss via lowpass; sounds organic
- **Expressive**: Pluck position, damping, dispersion = wide timbral range
- **Polyphony**: Easy to duplicate (4–8 voices, each with own delay line)

---

## Challenges / Pitfalls

### 1. Aliasing (High Frequencies)

**Problem**: Excitation (noise burst) has energy above Nyquist; feedback can amplify aliasing.

**Solution**: 
- Lowpass-filter excitation (< samplerate / 2)
- Oversample (2x or 4x) then downsample
- Use `gen~` at higher sample rate

### 2. Fractional Delay (Pitch Accuracy)

**Problem**: Integer delay lengths = quantized pitch (sounds out of tune).

**Solution**: 
- Linear or allpass interpolation for fractional delay
- gen~ supports fractional delay via `delay` object with non-integer argument

### 3. Tuning Stability (Feedback Loop)

**Problem**: If feedback gain > 1.0 or filter has gain > 1.0, loop explodes.

**Solution**: 
- Always keep feedback gain < 1.0
- Check filter response (ensure no gain peaks)
- Clip output if needed (safety)

### 4. Initialization (First Note)

**Problem**: Delay line starts empty (silence); first note might be quiet or click.

**Solution**: 
- Pre-fill delay line with small noise burst on first note
- Or accept short "warm-up" (realistic for physical instruments)

### 5. Polyphony (Multiple Notes)

**Problem**: Monophonic model; overlapping notes interfere.

**Solution**: 
- Use `poly~` or `rnbo~ @voices N` for voice allocation
- Each voice = independent waveguide (delay + filters)
- MVP: monophonic; v1.1: 4–8 voices

---

## Comparison: Waveguide vs. Modal Synthesis

| Aspect | Waveguide (Karplus-Strong) | Modal (Struck Bar) |
|--------|---------------------------|---------------------|
| **Model** | Delay line + feedback (traveling wave) | Sum of damped sine waves (modes) |
| **Character** | Strings (guitar, harp, berimbau) | Bars, bells (marimba, vibes) |
| **Overtones** | Harmonic (+ optional dispersion) | Inharmonic (bar modes: f₂ = k² f₁) |
| **Computation** | Light (1 delay + filters) | Moderate (N oscillators) |
| **Sustain** | Adjustable (feedback gain) | Fixed decay (exponential) |
| **Brightness control** | Pluck position + lowpass cutoff | Strike position (mode excitation) |
| **Best for** | Plucked/struck strings | Struck bars, bells, idiophones |

**For Tendril**: Waveguide is ideal for optional struck string synthesis.

---

## References

### Papers

- **Karplus & Strong** (1983): "Digital Synthesis of Plucked-String and Drum Timbres" — original algorithm
- **Jaffe & Smith** (1983): "Extensions of the Karplus-Strong Plucked-String Algorithm" — dispersion, tuning, two-polarization
- **Vesa Välimäki** (1995): "Discrete-Time Modeling of Acoustic Tubes Using Fractional Delay Filters" — fractional delay, dispersion
- **Julius O. Smith III**: *Physical Audio Signal Processing* (online, free) — definitive waveguide reference

### Max/MSP

- **Objects**: `delay~`, `tapin~` / `tapout~`, `onepole~`, `allpass~`, `gen~`
- **gen~** `delay` object supports fractional delay
- **Cycling '74 examples**: Search for "Karplus-Strong" in Max forum/examples

### String Instrument Acoustics

- Plucked/struck strings (guitar, harp, etc.)
- Strike position affects harmonic content: edge = bright, center = warm
- Sustain controlled by damping and resonance
- Bright, metallic, percussive; variable sustain

---

## Related Concepts

- [[Struck-Bar Physical Modeling]] (Drift; modal synthesis comparison)
- [[Modal Synthesis]]
- [[Delay Lines and Feedback]]
- [[Fractional Delay and Interpolation]]
- [[Polyphony and Voice Allocation]]

---

*Last updated: February 2026 | Status: Planning (for Tendril)*
