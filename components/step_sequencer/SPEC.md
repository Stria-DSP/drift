# Step sequencer jsui — specification

This document is the single source of truth for behavior, message protocol, and invariants.

---

## 1. Purpose and scope

- **What:** A Max **jsui** script that provides a resizable step sequencer UI: piano-roll-style pitch grid with per-cell states (off, on, on+accent). Scale degrees 0..n−1. The sequencer is the **source of truth** for step data.
- **In scope:** Message protocol, internal data model, layout regions, hit-testing and edit behavior.
- **Out of scope:** Max patch wiring, playback; those are described in integration docs.

---

## 2. Message protocol

### 2.1 Inlet (single)

| Message | Semantics |
|---------|-----------|
| **highlight** *index* | Set the active (highlighted) step column to *index* and redraw. No outlet output. |
| **getdata** | Output full sequence to outlet: **clear** then **store** *index* *pitch* *gate* *accent* for each step 0..numsteps−1. |
| **set** *index* *pitch* *gate* *accent* | Update step *index* with given pitch (scale degree 0..numpitches−1), gate (0|1), accent (0|1). |
| **numsteps** *n* | Set number of steps (columns). Clamped to [1, MAX_STEPS]. Default 8. |
| **numpitches** *n* | Set number of pitches (rows). Scale degrees 0..n−1. |
| **fgcolor** *r* *g* *b* | Foreground color (0–1 RGB). Default white. |
| **bgcolor** *r* *g* *b* | Background color (0–1 RGB). Default black. |
| **list** *fgcolor\|bgcolor* *r* *g* *b* | Same as above via list message. |

### 2.2 Outlet (single)

| Message | When |
|---------|------|
| **clear** | Start of a full data sync (see below). |
| **store** *index* *pitch* *gate* *accent* | One row per step 0..numsteps−1, sent after **clear** in a sync. |

Emitted: when **getdata** is received; after **set**, **numsteps**, or **numpitches**; and after a user grid click (deferred so outlet is not called synchronously from onclick).

### 2.3 Coll sync

The patch should connect the outlet to the pattern **coll**. **clear** clears the coll; **store** *i* *p* *g* *a* stores one row at index *i* with pitch, gate, accent. The patch may add a force column (e.g. derived from accent) when writing; see integration docs.

---

## 3. Data model

- **Per-step:** Each step *i* (0 ≤ *i* < MAX_STEPS) has:
  - *pitch*: scale degree in [0, numpitches−1].
  - *gate*: 0 or 1.
  - *accent*: 0 or 1.
- **Global state:** numsteps, numpitches, fgColor, bgColor, highlightCol, layout-derived values.
- **Invariants:**
  - 1 ≤ numsteps ≤ MAX_STEPS.
  - numpitches ≥ 1.
  - pitch ∈ [0, numpitches−1] for each step.

---

## 4. Layout and regions

- **Grid only:** Piano-roll style. X = step index (0..numsteps−1), Y = scale degree. Row 0 (top) = highest degree (numpitches−1), bottom row = degree 0.
- **Cell states:** off (border only), on (fill), on+accent (fill + center circle).
- **Spacing:** CELL_GAP between cells for minimal aesthetic.

---

## 5. Hit-testing and edit behavior

- **Grid:** Click empty cell → add note (pitch, gate=1, accent=0). Click active cell → cycle: on → on+accent → off.
- Only steps with index < numsteps are editable.
- Full sequence is output on the single outlet (deferred) on click so the coll stays in sync. Use **highlight** *index* to show the active step.

---

## 6. Constants

- MAX_STEPS = 32.
- MARGIN, CELL_GAP: layout constants.
