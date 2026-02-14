# src

Source for the Drifter M4L device: main patcher, pattern data, and modal bar gen~ code.

## Layout

| File / folder | Purpose |
|---------------|---------|
| **drift.maxpat** | Main Max patcher (clock, playheads, pattern, UI). Save as Live device → `drifter.amxd`. |
| **pattern_default.txt** | Default step pattern. Format: `index pitch gate` per line (e.g. `0 60 1`). |
| **gen_sine_param.codebox** | Minimal gen~ test: Param frequency only, 0 inlets, sine out. Validates gen~ + setparam. |
| **modal_bar/** | Modal bar synth (struck-bar physical model). See below. |

## modal_bar/

gen~ struck-bar physical model. See [../docs/MODAL_BAR_GEN_DESIGN.md](../docs/MODAL_BAR_GEN_DESIGN.md) for implementation details and [../docs/MODAL_BAR_README.md](../docs/MODAL_BAR_README.md) for algorithm and usage.

| File | Use |
|------|-----|
| **modal_bar.codebox** | Combined exciter + single resonator (one mode). 7 inlets: gate, base_freq, ratio, decay, softness, force, sr_hz. 5 History variables. Replicate 8× with different ratios for full 8-mode bar. |
| **modal_bar.gendsp** | Complete 8-mode bar gen~ patcher. Contains 8 instances of modal_bar.codebox with material presets. Ready to use. |
