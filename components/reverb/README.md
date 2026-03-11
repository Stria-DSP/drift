# Lexicon 225-Style Reverb

Schroeder-style reverb in gen~ with Lexicon-inspired controls. Mono in, stereo out. Decay times up to 60 seconds.

## Files

| File | Purpose |
|------|---------|
| `lexicon225.codebox` | GenExpr reverb algorithm (source) |
| `lexicon225.gendsp` | gen~ patcher with embedded codebox |
| `lexicon225_tester.maxpat` | Test patch: cycle~ source, param UI, ezdac~ |

## Usage

1. Open `lexicon225_tester.maxpat` in Max (with `lexicon225.gendsp` in the same folder or Max search path).
2. Turn on the ezdac~ to hear output.
3. Adjust params: decay (0.1–60 s), predelay (0–500 ms), diffusion, treble_decay, crossover, wet.

## Architecture

- **4 parallel feedback comb filters** — mutually prime delay lengths (~30–45 ms)
- **3 series allpass filters** — diffusion (Schroeder progression)
- **Crossover** — 6 dB/oct low/mid split for separate decay
- **Stereo matrix** — JCRev-style decorrelation for L/R

## Inlets (when used as gen~)

| Inlet | Param | Range |
|-------|-------|-------|
| 1 | signal | mono input |
| 2 | decay | 0.1–60 s (RT60) |
| 3 | predelay | 0–500 ms |
| 4 | diffusion | 0.3–0.9 |
| 5 | treble_decay | 0.3–1 |
| 6 | crossover | 200–800 Hz |
| 7 | wet | 0–1 |

## Workflow

To edit the algorithm: update `lexicon225.codebox`, then copy the code into the codebox in `lexicon225.gendsp` (or use gen~ export if configured).
