# Struck-Bar Physical Modeling

**Tags**: #physical-modeling #modal-synthesis #struck-bar #percussion #synthesis #drift
**Related**: [[Modal Synthesis]], [[Waveguide Synthesis]], [[Pitch and Frequency]]
**Context**: Drift (built-in synth), any percussion or mallet instrument

## Summary

Struck-bar physical modeling simulates percussion instruments like marimbas, xylophones, and vibraphones. Uses **modal synthesis** (sum of resonant partials) or **waveguide** (1D string/bar). Pitch from bar length/density; timbre from strike position and hardness. Fits phase-based sequencing: clear pitch, percussive, works under repetition.

## Why Struck Bar for Drift?

- **Clear pitch**: Tuned percussion; works with melodies and harmony
- **Percussive**: Attack + decay; good for sequencing (no sustain needed)
- **Repetition-friendly**: Reich, process music use mallet instruments; doesn't fatigue ear
- **Minimal complexity**: 2–4 partials for MVP; expandable for depth
- **Self-contained**: Drift as complete instrument (seq + sound) without external synth

## Modal Synthesis Approach

### Core Idea

A struck bar vibrates in **modes** (resonant frequencies). Sum of damped sine waves = bar sound.

### Basic Formula

```
output = Σ(A_n * sin(2π * f_n * t) * e^(-d_n * t))
```

Where:
- `n` = mode number (1, 2, 3, …)
- `A_n` = amplitude of mode n
- `f_n` = frequency of mode n
- `d_n` = decay rate of mode n
- `t` = time since strike

### Mode Frequencies (Ideal Bar)

For a free-free bar (supported at two points, like marimba):

```
f_n = f_1 * k_n^2
```

Where `k_n` are mode constants:
- Mode 1: k₁ = 1.000 (fundamental)
- Mode 2: k₂ = 2.756
- Mode 3: k₃ = 5.404
- Mode 4: k₄ = 8.933

**Example**: If f₁ = 440 Hz (A4):
- f₁ = 440 Hz
- f₂ = 440 * 2.756² ≈ 3340 Hz
- f₃ = 440 * 5.404² ≈ 12,860 Hz
- f₄ = 440 * 8.933² ≈ 35,100 Hz

**Note**: Real bars deviate (tuning, overtone sharpening); use empirical ratios for specific timbres.

### Amplitude and Decay

- **Amplitude**: Higher modes = lower amplitude. Rule of thumb: `A_n = A_1 / n` or exponential falloff.
- **Decay**: Higher modes decay faster. `d_n = d_1 * n` or `d_n = d_1 * k_n`.

**Strike position** affects which modes are excited:
- Center: Even modes suppressed (2, 4, …)
- Edge: All modes strong
- Result: Center = warm; edge = bright

### Parameters

| Parameter | Effect | Range |
|-----------|--------|-------|
| **Pitch (f₁)** | Fundamental frequency (MIDI note) | 20 Hz – 10 kHz |
| **Strike position** | Harmonic content (center = warm, edge = bright) | 0.0 (center) – 1.0 (edge) |
| **Hardness** | Attack sharpness and high-frequency content | 0.0 (soft) – 1.0 (hard) |
| **Decay** | Length of sound (short = xylophone, long = vibes) | 0.1 s – 10 s |
| **Material** (optional) | Overtone ratios (wood vs metal) | Preset or continuous |

## Implementation in Max/gen~

### Basic Modal Bar (gen~)

```gen
// Inputs
in1 trigger;  // strike (impulse or gate)
Param pitch (default 440);  // fundamental (Hz)
Param decay (default 1.0);   // decay time (s)
Param brightness (default 0.5);  // strike position (0=center, 1=edge)

// Mode constants (free-free bar)
k1 = 1.0;
k2 = 2.756;
k3 = 5.404;
k4 = 8.933;

// Frequencies
f1 = pitch;
f2 = pitch * (k2 * k2);
f3 = pitch * (k3 * k3);
f4 = pitch * (k4 * k4);

// Amplitudes (adjusted by strike position)
a1 = 1.0;
a2 = (1.0 - brightness * 0.5) * 0.3;  // less for soft strike
a3 = brightness * 0.2;
a4 = brightness * 0.1;

// Decay rates (faster for higher modes)
d1 = 1.0 / decay;
d2 = d1 * k2;
d3 = d1 * k3;
d4 = d1 * k4;

// Trigger envelope (exponential decay)
env = trigger > 0 ? 1.0 : env * exp(-d1 * samplerate / 44100);

// Oscillators
osc1 = sin(phasor(f1)) * a1 * env * exp(-d1 * time_since_strike);
osc2 = sin(phasor(f2)) * a2 * env * exp(-d2 * time_since_strike);
osc3 = sin(phasor(f3)) * a3 * env * exp(-d3 * time_since_strike);
osc4 = sin(phasor(f4)) * a4 * env * exp(-d4 * time_since_strike);

out1 = (osc1 + osc2 + osc3 + osc4) * 0.25;  // mix
```

### Simplified Max Patcher (2 Modes)

```max
[mtof]  // MIDI note → Hz
  |
[f $1]  // store fundamental
  |
  [* 1]        [* 7.59]  // mode 1 and mode 2 (approx k₂²)
    |              |
[cycle~]      [cycle~]  // sine oscillators
    |              |
[*~ 1.0]      [*~ 0.3]  // amplitude
    |              |
[*~ $2]       [*~ $2]   // envelope (from [adsr~] or [line~])
      \            /
        \        /
          [+~]  // sum
            |
          output
```

### Envelope (ADSR or Exponential Decay)

For percussive:
- **Attack**: 0–5 ms (sharp strike)
- **Decay/Release**: 100 ms – 5 s (xylophone vs vibes)
- **Sustain**: 0 (no sustain; percussive)

Use `[line~]` or `[adsr~]` to generate envelope.

## Waveguide Alternative

For more interaction and modulation, use **waveguide** (1D bar):

- Delay line (length = pitch)
- Feedback filter (damping = decay)
- Allpass filters (dispersion = inharmonic overtones)

**Pros**: More flexible; can modulate during sustain
**Cons**: More complex; requires tuning for stable pitch

**Reference**: Karplus-Strong, Jaffe-Smith extended models.

## Timbre Control

### Material Presets

| Material | k₂ (approx) | Decay Ratio | Character |
|----------|-------------|-------------|-----------|
| **Wood (marimba)** | 2.76 | Fast decay | Warm, mellow |
| **Metal (vibes)** | 2.76 | Slow decay | Bright, ringing |
| **Plastic** | 2.5–3.0 | Medium | Synthetic, toy-like |

### Strike Hardness

- **Soft (mallet)**: Lower high modes; smooth attack
- **Hard (metal)**: Strong high modes; sharp attack

**Implementation**: Scale high-mode amplitudes by hardness; shape attack envelope (soft = 5–10ms, hard = 1–2ms).

### Strike Position

- **Center (antinode)**: Odd modes strong, even modes weak → warm, fundamental-heavy
- **Edge (node)**: All modes strong → bright, overtone-rich

**Implementation**: Map position (0→1) to mode amplitudes:
```
a2 = base_amp * (0.5 + 0.5 * position)  // even modes stronger at edge
a3 = base_amp * (0.3 + 0.7 * position)  // odd modes always present
```

## Integration with Drift

### Internal Routing

```
Step Sequencer (pitch + gate)
  |
  [internal MIDI or direct to synth]
  |
Struck-Bar Synth (gen~ or Max patch)
  |
  [audio out] → [mixer] → [reverb/effects] → device output
  
Optional:
  [MIDI out] → external instruments (parallel)
```

### Parameters for Drift

| UI Control | Maps To | Range |
|------------|---------|-------|
| **Decay** | Bar decay time | 0.1–5 s |
| **Brightness** | Strike position or hardness | 0.0–1.0 |
| **Tune** | Global transpose (semitones) | -24 to +24 |
| **(Future)** Material, vibrato, tremolo | Overtone ratios, LFO | Various |

Keep minimal for MVP; expand in v1.1.

## Advantages for Drift

1. **Self-contained**: No need to load external instrument
2. **Fits aesthetic**: Process music (Reich) often uses mallet percussion
3. **Clear under repetition**: Percussive decay; no sustain pile-up
4. **Pitch-accurate**: Tuned percussion; works with melodies and harmony
5. **Expressive**: Strike position and hardness give variation without complexity

## MVP Scope

For **Drift MVP**:
- **2 modes** (fundamental + first overtone) — enough for recognizable bar timbre
- **3 params**: Decay, Brightness, Tune (transpose)
- **Fixed material** (wood/marimba character)
- **Simple envelope**: Exponential decay, no vibrato/tremolo

**Post-MVP (v1.1)**:
- 3–4 modes for richer timbre
- Material selector (wood/metal/plastic)
- Vibrato/tremolo (LFO on pitch or amplitude)
- Per-step velocity → hardness mapping

## Pitfalls

1. **Aliasing**: High modes (f₃, f₄) can alias at 44.1 kHz. Use oversampling or filter out above Nyquist.
2. **Tuning**: If overtone ratios are off, bar sounds synthetic. Use empirical values for target instrument.
3. **Envelope clicks**: Abrupt attack or release can click. Use 1–2ms ramp.
4. **Polyphony**: Multiple notes overlap. Use voice allocation (e.g. 4–8 voices) or accept monophonic for MVP.

## References

- **Papers**: "Synthesis of the Singing Voice" (Jaffe, Smith) — waveguide; "Modal Synthesis" (Adrien) — modal bars
- **Fors Mass**: Modal percussion synth (reference for M4L modal implementation)
- **Cycling '74 examples**: `gen~` modal synthesis tutorials
- **Books**: *Physical Audio Signal Processing* by Julius O. Smith III (online, free)

## Related Concepts

- [[Modal Synthesis]]
- [[Waveguide Synthesis]]
- [[Polyphony and Voice Allocation]]
- [[Pitch and Frequency]]
- [[Attack and Decay Envelopes]]
