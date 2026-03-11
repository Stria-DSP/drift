# Phasing and Interference

**Tags**: #phasing #reich #process-music #sequencing #drift
**Related**: [[Transport Sync in Max]], [[Multi-Playhead Architecture]]
**Context**: Drift (core concept), all phase-based sequencers

## Summary

Phasing is a compositional technique from minimalist/process music (Steve Reich) where two or more voices play the same pattern at slightly different rates, causing them to gradually shift out of sync. The resulting interference creates evolving patterns and textures from a single source idea—deterministic, musical, and transparent.

## Core Concept

### Reich-Style Phasing

- **One pattern**: A short repeating loop (melody, rhythm, or both)
- **Multiple voices**: 2+ playheads/performers
- **Rate difference**: Voices move at slightly different speeds (e.g. 1.0x vs 1.001x)
- **Gradual drift**: Over time, voices move from unison → offset → unison again
- **Audible process**: The listener hears the phase relationship changing

### Musical Results

- **Interference patterns**: New rhythms and textures emerge from alignment/misalignment
- **Long-form evolution**: Takes minutes or hours for full cycle (if rates are close)
- **Deterministic**: Same settings always produce same output; no randomness
- **Transparent**: Process is audible; listener can follow the drift

## Technical Implementation

### Multi-Clock Architecture

Use **independent playheads** reading from one shared pattern:

```
Master Clock (DAW-synced)
  ├─ Playhead 1: phase = (master_phase * rate1) % 1.0
  ├─ Playhead 2: phase = (master_phase * rate2) % 1.0
  └─ Playhead N: phase = (master_phase * rateN) % 1.0
```

### Rate and Drift

- **Rate**: Multiplier on master clock (e.g. 1.0, 1.01, 0.99)
- **Drift**: Additional per-cycle offset (e.g. +0.001 per bar) for slow Reich-style drift
- **Combined**: `phase = (master * rate + drift_accumulator) % 1.0`

### Interference Control

To avoid "mud" when all playheads trigger at once:

1. **Coincidence triggering**: Only fire note when 2+ playheads are within a phase window (e.g. < 0.05)
2. **Prime-length loops**: Use prime numbers (7, 11, 13) for pattern lengths so full cycle = LCM (very long)
3. **Scale quantization**: Force all output to one scale/key so harmonic density doesn't clash

## Applications

### Drift (Stria Product)

- 2 playheads (MVP) → 3–4 (v1.1+)
- User-defined step pattern (pitch + gate)
- Drift parameter (0–0.01 or similar)
- Scale quantization + snapshot
- Struck-bar synth for complete instrument

### Future Products

- **Polyrhythmic phasing**: Different pattern lengths per playhead (e.g. 7 vs 11 steps)
- **Harmonic phasing**: Same rhythm, different pitch transpositions
- **Timbral phasing**: Same pattern, different synth engines (Fors Opal-style)

## Design Considerations

### Musically

- **Drift range**: Too slow = boring; too fast = chaotic. Sweet spot: ~0.001–0.01 per cycle for audible drift.
- **Pattern length**: Short (4–8 steps) = clear interference; long (16+) = more variation.
- **Note density**: Sparse patterns phase more clearly; dense patterns can become mud.

### Technically

- **Sample accuracy**: Use `gen~` or `phasor~` for high-rate phase math; avoid timing drift.
- **DAW sync**: Lock to transport; use `transport` object + `phasor~` with note-value rate.
- **MIDI out**: Avoid double-triggers; use gates or debounce logic.

## Pitfalls

1. **Rounding errors**: Float phase accumulation can drift over time. Use modulo and periodic reset.
2. **Double triggers**: If playhead crosses step boundary twice in one sample block, you get double note. Gate for one block.
3. **Tempo changes**: If DAW tempo changes mid-play, phase can jump. Lock phase to DAW transport, not absolute time.

## References

- Steve Reich, *Piano Phase* (1967)
- Steve Reich, *Clapping Music* (1972)
- PROJECT_BRIEF.md §3 (Drift technical spec)
- research/process_music.md (Stria docs)
- Cycling '74 Max documentation: `phasor~`, `transport`, `rate~`

## Related Concepts

- [[Multi-Playhead Architecture]]
- [[Transport Sync in Max]]
- [[Modal Synthesis]] (struck-bar synth for Drift)
- [[Scale Quantization]]
- [[Prime-Length Loops]]
