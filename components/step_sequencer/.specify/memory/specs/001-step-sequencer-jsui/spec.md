# Feature Specification: Step sequencer jsui

**Feature**: 001-step-sequencer-jsui  
**Status**: Implemented  
**Source of truth**: SPEC.md (protocol and behavior); this file aligns with Spec Kit structure.

## User scenarios

### User story 1 – Edit pattern (gate, pitch, accent) (P1)
User edits the sequencer by toggling gates, clicking the piano-roll grid to set pitch per step, and toggling accents. Changes are sent to the patch as list index pitch gate accent so the pattern store (coll) stays in sync.

**Acceptance:** Given the jsui is loaded, when the user clicks a gate/accent cell or a grid cell, then outlet 0 sends list with the correct index, effective pitch, gate, and accent; and the UI redraws.

### User story 2 – Octave and scale (P1)
User selects octave -1/0/+1 and optionally supplies a scale mask (list of MIDI pitches). Grid edits snap to the scale when the mask is non-empty; output pitch is base + 12×octave.

**Acceptance:** Given a scale mask list on inlet 4, when the user clicks the grid, the step’s pitch is set to the nearest allowed pitch in range. Given octave change, outlet 1 sends fullpattern and effective pitches on subsequent edits reflect the new octave.

### User story 3 – Resize and load pattern (P2)
User resizes the jsui box; layout and grid scale. User or patch sends setpattern to load a full pattern; UI reflects it and outlet 1 sends fullpattern.

**Acceptance:** onresize(w,h) recomputes layout and redraws. setpattern (selector or flat list) loads triples into steps; outlet 1 emits fullpattern; paint shows the new pattern.

## Requirements

- **FR-001:** Six inlets (num_steps, pitch_low, pitch_high, octave, scale_mask, setpattern) and two outlets (step list, fullpattern) per SPEC.md §2.
- **FR-002:** Layout: octave row, gate row, piano-roll grid, accent row; hit-testing maps clicks to the correct region and step/pitch.
- **FR-003:** Effective pitch = base_pitch + 12×octave clamped 0–127. Scale mask snaps grid edits when non-empty.
- **FR-004:** Build produces a single Max-compatible script; npm run check validates required globals.

## Success criteria

- **SC-001:** SPEC.md acceptance criteria (§8) hold.
- **SC-002:** npm run build && npm run check pass.
- **SC-003:** In Max, jsui loads dist/step_sequencer.js and responds to inlets and clicks as specified.
