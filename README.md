# Drift

**Drifter** is the product: a phase-based generative sequencer for Ableton Live (Max for Live) by Stria. Two playheads drift over one pattern—Reich-style phasing, no AI.

## What it is

- **One pattern, two playheads:** You define an 8-step pattern (pitch + gate per step). Two playheads read it at slightly different rates so they phase relative to each other.
- **Built-in sound (optional):** Struck-bar physical model (Phase 4b) so you can use it as a full instrument; MIDI out remains for external synths.
- **Docs:** [PROJECT_BRIEF.md](PROJECT_BRIEF.md), [MVP_PLAN.md](MVP_PLAN.md), [.cursor/plans/](.cursor/plans/) for the development plan.

## How to use (MVP)

1. **Open in Live:** Drag `src/drift.maxpat` into a MIDI track (or save as Live device and drop `drifter.amxd`).
2. **Pattern:** The device loads `pattern_default.txt` from `src/` on init (8 steps: C major scale, steps 0–3 on, 4–7 off). Edit `src/pattern_default.txt` to change the default pattern (format: `index pitch gate` per line, e.g. `0 60 1`).
3. **Play:** Start transport. Playhead 1 runs at 1 bar per cycle; playhead 2 at 1.002 bars so they drift. Both send MIDI to the track.
4. **Enable / Level / Scale:** Use the device UI (Enable toggle, Level dial, Scale menu). Scale menu (C major / A minor) is for future scale quantization; pattern pitches are currently unquantized.
5. **Snapshot:** To capture the current output, record the MIDI track in Live (Record button); the phased pattern will be written to the clip.

## Building / testing

- **Master clock:** `phasor~ 1n @lock 1` (one cycle per bar, transport-synced).
- **Second playhead:** `phasor~ 1.002n @lock 1` for fixed drift.
- **Pattern:** Stored in `coll` "pattern" (and "pattern2" for playhead 2), loaded from `src/pattern_default.txt`.
- **MIDI out:** Both playheads → `makenote` → `midiout 0`.

### Automated build

Max has no CLI for “save as Live device,” so the .amxd is created manually; everything else is automated:

| Command | Action |
|--------|--------|
| `make check` | Verify `src/drift.maxpat` and `src/pattern_default.txt` exist |
| `make open` | Open `src/drift.maxpat` in Max |
| `make build` | Run check, open patch, remind to save as .amxd |
| `make dist` | Zip `drifter.amxd` + README + pattern into `dist/drifter-<VERSION>.zip` |
| `make clean` | Remove `dist/` |

**Release flow:** Run `make build` → in Max: File → Save as Live Device → save as `drifter.amxd` → run `make dist`. Version is read from `VERSION` (default 0.1.0).

## Roadmap

- **Phase 3:** Wire multislider + 8 toggles to coll; pattrstorage added for persistence.
- **Phase 4:** Scale quantization (wire Scale menu); velocity; snapshot (record track in Live for MVP).
- **Phase 4b:** Struck-bar physical model (internal synth); see PROJECT_BRIEF §3.4.
- **Phase 5:** Save as .amxd, soft launch per GTM_PLAN (Gumroad / maxforlive.com).

## Packaging and launch

- **Save as Live device:** In Max, open `src/drift.maxpat`, then File → Save as Live Device (or drag the patcher into an Ableton MIDI track and save the set; the device is then in the set). Save a copy as `drifter.amxd` in the project root for distribution.
- **Test:** New Live set, different tempos (e.g. 90, 120), start/stop transport, save and reload the set.
- **Soft launch:** Per [GTM_PLAN.md](GTM_PLAN.md): Gumroad or maxforlive.com, post in r/ableton and r/MaxMSP, collect feedback for v1.1 (coincidence mode, 3rd playhead, clip input).

## Scripts

| Script | What it does |
|--------|----------------|
| `./scripts/download_max_pdfs.sh` | Download Max User Guide, LOM, JS API, Node for Max PDFs to `research/max8_pdfs/`; optionally copy Gen-related PDFs from `/Applications/Max 8.app` if present. |
| `python scripts/save_refpage.py "phasor~"` | Fetch one Max 8 ref page and save to `research/max8_docs/refpages/<object>.md`. Use any object name (e.g. `live.grid`, `coll`). |
| `python scripts/fetch_max_refpages.py` | Batch fetch ref pages for common objects (coll, phasor~, snapshot~, etc.) into `research/max8_docs/refpages/`. |
| `python scripts/rag_max_docs.py build` | Build RAG index from ref pages + PDFs in `research/max8_pdfs/`. Requires `pip install -r requirements.txt` first. |
| `python scripts/rag_max_docs.py query "phasor~ lock"` | Query the RAG index; prints top-5 relevant chunks. |
| `scripts/build.sh` | Used by `make dist` to zip drifter.amxd and assets into `dist/`. |

**Docs workflow:** See [research/MAX_DOCS_RAG.md](research/MAX_DOCS_RAG.md) for the full flow (venv, download PDFs, build index, query).

## Requirements

- Ableton Live 10.1+ (Suite or Standard + Max for Live).
- macOS or Windows.
