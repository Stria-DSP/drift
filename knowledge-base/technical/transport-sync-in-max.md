# Transport Sync in Max/MSP and M4L

**Tags**: #max-msp #m4l #timing #transport #daw-sync #technical
**Related**: [[Phasing and Interference]], [[Sample-Accurate Timing]]
**Context**: All M4L devices that need to sync with Ableton transport

## Summary

Transport sync in Max for Live means locking your device's clock to Ableton's transport (play/stop, tempo, time signature). Use `transport` object to get DAW state and `phasor~` with note-value rate for sample-accurate timing. Critical for sequencers and anything tempo-dependent.

## Core Pattern

### Basic Setup

```max
[transport]
  |
  @tempo, @timesig, @running
  |
  [phasor~ 1n @lock 1]  // 1 bar phasor, locked to transport
  |
  phase 0→1 over 1 bar, synced to DAW
```

### Key Objects

| Object | Purpose | Notes |
|--------|---------|-------|
| `transport` | Get DAW state (tempo, position, running) | Outputs tempo (BPM), time signature, play/stop |
| `phasor~ [rate] @lock 1` | Generate phase ramp (0→1) synced to transport | Rate in note values (1n, 2n, 4n, 8n, 16n); `@lock 1` = sync |
| `rate~` | Convert note values to frequency for phasor~ | Use if you need dynamic rate change |

### Note Value Syntax

- `1n` = 1 bar (whole note)
- `2n` = half note (2 per bar)
- `4n` = quarter note (4 per bar)
- `8n` = eighth note (8 per bar)
- `16n` = sixteenth note (16 per bar)

## Sample-Accurate Timing

### Why It Matters

In MSP (audio rate), one sample = ~0.02ms at 44.1kHz. For sequencing:
- **Control rate** (bang from `metro`) = ~1.4ms (64 samples at 44.1kHz). Not accurate enough for tight timing.
- **Audio rate** (`phasor~` + `sah~`) = sample-accurate. Notes land exactly on the grid.

### Pattern: Audio-Rate Sequencer Clock

```max
[transport]
  |
[phasor~ 16n @lock 1]  // 16th-note phasor
  |
[*~ 16]  // scale 0→1 to 0→16 (step index)
  |
[sah~ 0]  // sample-and-hold (detect step change)
  |
[change~]  // output only when step index changes
  |
[snapshot~]  // convert to int
  |
step_index (0–15)
```

### Explanation

1. `phasor~ 16n` ramps 0→1 over 16th note, locked to transport
2. `*~ 16` scales to step count (0→16 for 16-step sequencer)
3. `sah~` + `change~` detect when step index crosses integer boundary
4. `snapshot~` converts audio-rate signal to control-rate integer

Result: You get a bang (and step index) exactly when each 16th note starts, sample-accurate.

## Transport State

### Get Tempo and Time Signature

```max
[transport]
  |
[route tempo timesig running]
  |    |        |
tempo  ts     play/stop (0/1)
(BPM) (e.g. 4 4)
```

### Respond to Play/Stop

```max
[transport]
  |
[route running]
  |
[select 0 1]
  |    |
 stop  play
```

### Reset Phase on Play

```max
[transport]
  |
[route running]
  |
[change]  // only output when play state changes
  |
[select 0 1]
      |
    [phasor~ 16n @lock 1 @reset]  // send reset message when play starts
```

## Common Patterns for Sequencers

### Pattern 1: Step Sequencer (16 steps, quarter-note grid)

```max
[transport]
  |
[phasor~ 4n @lock 1]  // quarter-note phasor (4 per bar)
  |
[*~ 16]  // 16 steps per 4 bars (or adjust to taste)
  |
[sah~ 0] → [change~] → [snapshot~]
  |
step_index (0–15)
```

### Pattern 2: Multi-Playhead Phasing

```max
[transport]
  |
[phasor~ 1n @lock 1]  // master phasor (1 bar)
  |
  [*~ rate1]  [*~ rate2]  // independent rate multipliers
     |            |
  [%~ 1]       [%~ 1]  // wrap phase (modulo 1.0)
     |            |
 playhead1    playhead2
```

### Pattern 3: Drift Accumulation

```max
[transport]
  |
[phasor~ 1n @lock 1]  // master phasor
  |
[*~ rate]  // rate multiplier
  |
[+~ drift_signal]  // add slow drift (e.g. LFO or accumulator)
  |
[%~ 1]  // wrap to 0→1
  |
drifting_phase
```

## Pitfalls and Solutions

### Problem: Tempo Change Causes Jump

**Symptom**: When DAW tempo changes, phase jumps or sequencer gets out of sync.

**Solution**: Use `@lock 1` on `phasor~` so it locks to transport position, not absolute time.

```max
[phasor~ 16n @lock 1]  // @lock 1 = sync to transport position
```

### Problem: Double Triggers on Step Boundary

**Symptom**: When step index crosses from N to N+1, you get two notes.

**Solution**: Use `change~` to detect when value changes, not threshold. Only output once per transition.

```max
[sah~ 0] → [change~] → [snapshot~]  // change~ ensures one output per step
```

### Problem: Sequence Doesn't Start on Play

**Symptom**: Device starts but sequencer doesn't run until second bar.

**Solution**: Send `reset` or `phase 0` to phasor~ when transport starts.

```max
[transport]
  |
[route running]
  |
[change]
  |
[select 1]  // when play starts (0→1)
  |
[message reset]
  |
[phasor~ 16n @lock 1]
```

### Problem: Drift Over Long Playback

**Symptom**: Sequencer slowly drifts out of sync over minutes or hours.

**Solution**: Use transport-locked `phasor~` (not accumulator). If you need custom phase math, do it in `gen~` and periodically re-sync to transport position.

## gen~ Integration

For complex phase math (multi-playhead, drift, modulation), use `gen~`:

```gen
// Input: master_phase (from phasor~ 1n)
// Output: playhead_phase

in1 master_phase;
Param rate (default 1.0);
Param drift (default 0.001);

History drift_accum (0);

drift_accum = drift_accum + drift;  // accumulate drift per sample
phase = (master_phase * rate + drift_accum) % 1.0;

out1 phase;
```

**Advantage**: Sample-accurate, modular, exportable to RNBO.

## Testing Checklist

When implementing transport sync:

- [ ] Device starts and stops with DAW transport
- [ ] Tempo changes don't cause jumps or drift
- [ ] Time signature changes are handled (or ignored gracefully)
- [ ] Sequence resets to step 0 on play (if desired)
- [ ] Notes land exactly on the grid (use MIDI monitor or oscilloscope)
- [ ] No double triggers at step boundaries
- [ ] Device syncs correctly after save/reload

## References

- Cycling '74 Max documentation: `transport`, `phasor~`, `rate~`, `sah~`, `change~`
- research/technical.md (Stria Drift docs)
- Max for Live SDK: Transport sync examples
- [Ableton Max for Live Tutorials](https://help.ableton.com/hc/en-us/sections/206241415-Max-for-Live-Tutorials)

## Related Concepts

- [[Phasing and Interference]]
- [[Sample-Accurate Timing]]
- [[Multi-Playhead Architecture]]
- [[RNBO Export]]
