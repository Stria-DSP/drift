# Rattle

**Rattle** is a Max for Live shaker simulator by Stria. Variable-length step sequencer with performance simulation—accents, motion, subtle timing variation. No samples; pure synthesis.

## What it is

- **Shaker synthesis:** Physics-informed model of shaker motion and collision, not sample playback.
- **Performance simulation:** Accents, back-and-forth motion, humanized timing (no robotic grid).
- **Variable-length sequencer:** Gate (onset) and accent channels; non-power-of-two lengths for evolving patterns.
- **Foundation:** Inspired by Luke DuBois' shaker object; extended with modern sequencing and performance nuance.

## How to use (MVP)

1. **Open in Live:** Drag `src/rattle.maxpat` into a MIDI track (or save as Live device and drop `rattle.amxd`).
2. **Pattern:** Load or edit the step pattern—gate channel triggers onsets, accent channel adds emphasis.
3. **Play:** Start transport. Sequencer cycles, driving the shaker synth with performance variation.
4. **Params:** Shake intensity, accent depth, timing looseness, damping/brightness.

## Building / testing

- **Sequencer:** Variable-length step grid (1–64 steps); separate gate and accent channels.
- **Shaker model:** Based on DuBois' shaker (particle collision + resonance); extended with accent and motion dynamics.
- **Performance:** Subtle timing offsets per step (humanization), accent → increased particle energy, back-and-forth motion affects brightness.

### Automated build

Max has no CLI for "save as Live device," so the .amxd is created manually; everything else is automated:

| Command | Action |
|--------|--------|
| `make check` | Verify `src/rattle.maxpat` exists |
| `make open` | Open `src/rattle.maxpat` in Max |
| `make build` | Run check, open patch, remind to save as .amxd |
| `make dist` | Zip `rattle.amxd` + README into `dist/rattle-<VERSION>.zip` |
| `make clean` | Remove `dist/` |

**Release flow:** Run `make build` → in Max: File → Save as Live Device → save as `rattle.amxd` → run `make dist`. Version is read from `VERSION` (default 0.1.0).

## Roadmap

- **Phase 1:** Shaker synthesis core (particle model, resonance, accent response).
- **Phase 2:** Step sequencer (gate + accent channels, variable length).
- **Phase 3:** Performance simulation (timing humanization, motion dynamics).
- **Phase 4:** UI (step grid, accent editor, performance controls).
- **Phase 5:** Save as .amxd, soft launch per GTM plan.

## Packaging and launch

- **Save as Live device:** In Max, open `src/rattle.maxpat`, then File → Save as Live Device. Save a copy as `rattle.amxd` in the project root for distribution.
- **Test:** New Live set, different tempos (e.g. 90, 120, 180), start/stop transport, save and reload the set.
- **Soft launch:** Gumroad or maxforlive.com, post in r/ableton and r/MaxMSP, collect feedback for v1.1 (polyrhythm mode, humanization profiles, MIDI out).

## Scripts

| Script | What it does |
|--------|----------------|
| `./scripts/build.sh` | Used by `make dist` to zip rattle.amxd and assets into `dist/`. |

## Requirements

- Ableton Live 10.1+ (Suite or Standard + Max for Live).
- macOS or Windows.

## Docs

- [PROJECT_BRIEF.md](PROJECT_BRIEF.md) — Product spec, technical details, shaker model, sequencer design.
- [docs/](docs/) — Full documentation (performance simulation, sequencer design, shaker physics).
- [research/](research/) — Luke DuBois' shaker reference, Max object docs, shaker physics papers.
