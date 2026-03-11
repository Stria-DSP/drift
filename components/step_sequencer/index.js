/*
 * step_sequencer.js — Drift step sequencer jsui
 * Source of truth for step data. Scale degrees (0..numpitches-1), no MIDI.
 *
 * Inlet: messages only
 *   highlight <index> — set highlighted step column; no outlet output
 *   getdata           — outputs full sequence to outlet (clear + store per step)
 *   set <i> <p> <g> <a> — update step i with pitch p, gate g, accent a
 *   numsteps <n>      — set number of steps (columns), default 8
 *   numpitches <n>    — set number of pitches (rows), scale degrees 0..n-1
 *   fgcolor <r> <g> <b> — foreground color (0–1), default white
 *   bgcolor <r> <g> <b> — background color (0–1), default black
 *
 * Outlet: data sync — clear then store index pitch gate accent for each step (on getdata / set / numsteps / numpitches / click)
 *
 * Grid cells: off (border only), on (fill), on+accent (fill + center circle).
 * Click cycles: off → on → on+accent → off.
 */

inlets = 1;
outlets = 1;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// ─── Constants ───────────────────────────────────────────────────────

var MAX_STEPS = 32;
var MARGIN = 12;
var CELL_GAP = 6;

// ─── State ───────────────────────────────────────────────────────────

var state = {
  numSteps: 8,
  numPitches: 7,
  steps: [],
  boxW: 320,
  boxH: 240,
  contentX: MARGIN,
  gridY0: 0,
  gridH: 0,
  cellW: 0,
  cellH: 0,
  gridSteps: 0,
  fgColor: [1, 1, 1],
  bgColor: [0, 0, 0],
  highlightCol: -1
};

function initSteps() {
  state.steps.length = 0;
  for (var i = 0; i < MAX_STEPS; i++) {
    state.steps.push({ pitch: 0, gate: 0, accent: 0 });
  }
}

// ─── Pure functions ──────────────────────────────────────────────────

function clamp(v, lo, hi) {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

// ─── Layout ──────────────────────────────────────────────────────────

function doLayout() {
  state.gridSteps = Math.max(1, Math.min(state.numSteps, MAX_STEPS));
  var usedSteps = state.gridSteps;
  var pitchSpan = Math.max(1, state.numPitches);

  state.gridY0 = MARGIN;
  var gridBottom = state.boxH - MARGIN;
  state.gridH = Math.max(4, gridBottom - state.gridY0);

  state.contentX = MARGIN;
  var contentW = state.boxW - state.contentX - MARGIN;
  var totalGapW = (usedSteps - 1) * CELL_GAP;
  state.cellW = (contentW - totalGapW) / usedSteps;
  var totalGapH = (pitchSpan - 1) * CELL_GAP;
  state.cellH = Math.max(2, (state.gridH - totalGapH) / pitchSpan);
}

// ─── Drawing ─────────────────────────────────────────────────────────

function cellX(col) {
  return state.contentX + col * (state.cellW + CELL_GAP);
}

function cellY(row) {
  return state.gridY0 + row * (state.cellH + CELL_GAP);
}

function paintImpl() {
  var boxW = state.boxW;
  var boxH = state.boxH;
  var contentX = state.contentX;
  var gridY0 = state.gridY0;
  var gridH = state.gridH;
  var cellW = state.cellW;
  var cellH = state.cellH;
  var gridSteps = state.gridSteps;
  var pitchSpan = Math.max(1, state.numPitches);
  var numSteps = state.numSteps;
  var steps = state.steps;
  var fg = state.fgColor;
  var bg = state.bgColor;
  var hlCol = state.highlightCol;

  var safeW = Math.max(0, boxW);
  var safeH = Math.max(0, boxH);
  mgraphics.set_source_rgba(bg[0], bg[1], bg[2], 1);
  mgraphics.rectangle(0, 0, safeW, safeH);
  mgraphics.fill();

  if (!(cellW > 0 && cellH > 0 && gridSteps > 0 && pitchSpan > 0)) return;

  var hlActive = hlCol >= 0 && hlCol < gridSteps && hlCol < numSteps;

  // Grid (piano roll): row 0 = scale degree (pitchSpan-1), row (pitchSpan-1) = degree 0
  // Off: fg border, no fill. On: fg fill. Accent: fg fill + bg circle in center.
  // Highlighted column: thicker borders on all cells.
  for (var row = 0; row < pitchSpan; row++) {
    var deg = pitchSpan - 1 - row;
    for (var col = 0; col < gridSteps; col++) {
      var x = cellX(col);
      var y = cellY(row);
      var s = steps[col];
      var isNote = s && s.pitch === deg && s.gate;
      var hasAccent = isNote && s.accent;
      var thickBorder = hlActive && col === hlCol;

      if (isNote) {
        mgraphics.set_source_rgba(fg[0], fg[1], fg[2], 1);
        mgraphics.rectangle(x, y, cellW, cellH);
        mgraphics.fill();
        if (hasAccent) {
          var cx = x + cellW / 2;
          var cy = y + cellH / 2;
          var r = Math.min(cellW, cellH) * 0.25;
          mgraphics.set_source_rgba(bg[0], bg[1], bg[2], 1);
          mgraphics.arc(cx, cy, r, 0, Math.PI * 2);
          mgraphics.fill();
        }
        if (thickBorder) {
          mgraphics.set_source_rgba(fg[0], fg[1], fg[2], 1);
          mgraphics.rectangle(x, y, cellW, cellH);
          mgraphics.set_line_width(2);
          mgraphics.stroke();
        }
      } else {
        mgraphics.set_source_rgba(fg[0], fg[1], fg[2], 1);
        mgraphics.rectangle(x, y, cellW, cellH);
        mgraphics.set_line_width(thickBorder ? 2 : 1);
        mgraphics.stroke();
      }
    }
  }
}

// ─── Hit testing ─────────────────────────────────────────────────────

function hitGrid(x, y) {
  var pitchSpan = Math.max(1, state.numPitches);
  var cellW = state.cellW;
  var cellH = state.cellH;
  var strideX = cellW + CELL_GAP;
  var strideY = cellH + CELL_GAP;
  if (!(cellW > 0 && cellH > 0)) return null;
  if (y < state.gridY0 || y >= state.gridY0 + state.gridH) return null;
  var relX = x - state.contentX;
  var relY = y - state.gridY0;
  var col = Math.floor(relX / strideX);
  var row = Math.floor(relY / strideY);
  if (col < 0 || col >= state.gridSteps) return null;
  if (row < 0 || row >= pitchSpan) return null;
  var inCellX = relX - col * strideX;
  var inCellY = relY - row * strideY;
  if (inCellX >= cellW || inCellY >= cellH) return null;
  var deg = pitchSpan - 1 - row;
  return { step: col, pitch: deg };
}

// ─── Outlet helper ──────────────────────────────────────────────────

function outputFullData() {
  outlet(0, "clear");
  var steps = state.steps;
  var n = state.numSteps;
  for (var i = 0; i < n; i++) {
    var s = steps[i];
    if (s) {
      outlet(0, "store", i, s.pitch, s.gate ? 1 : 0, s.accent ? 1 : 0);
    }
  }
}

// ─── Sync size from mgraphics ────────────────────────────────────────

function syncSize() {
  if (mgraphics.size && mgraphics.size.length >= 2) {
    state.boxW = mgraphics.size[0];
    state.boxH = mgraphics.size[1];
    doLayout();
  }
}

// ─── Max message handlers ────────────────────────────────────────────

function paint() {
  try {
    syncSize();
    paintImpl();
  } catch (e) {}
}

function onresize(w, h) {
  state.boxW = w;
  state.boxH = h;
  doLayout();
  mgraphics.redraw();
}

function onclick(x, y) {
  try {
    syncSize();
  } catch (e) {
    return;
  }
  var pitchSpan = Math.max(1, state.numPitches);

  var stepOk = function (i) {
    return i >= 0 && i < state.numSteps && !!state.steps[i];
  };

  try {
    var gridHit = hitGrid(x, y);
    if (gridHit !== null && stepOk(gridHit.step)) {
      var deg = clamp(gridHit.pitch, 0, pitchSpan - 1);
      var s = state.steps[gridHit.step];
      if (s) {
        if (s.gate && s.pitch === deg) {
          if (s.accent) {
            s.gate = 0;
            s.accent = 0;
          } else {
            s.accent = 1;
          }
        } else {
          s.pitch = deg;
          s.gate = 1;
          s.accent = 0;
        }
      }
      mgraphics.redraw();
      if (typeof setTimeout !== "undefined") {
        setTimeout(outputFullData, 0);
      }
      return;
    }
  } catch (e) {}
  mgraphics.redraw();
}

function highlight(idx) {
  var i = Math.floor(Number(idx));
  if (i < 0 || i >= state.steps.length) return;
  state.highlightCol = i;
  mgraphics.redraw();
}

function getdata() {
  outputFullData();
}

function set(idx, pitch, gate, accent) {
  var i = Math.floor(Number(idx));
  if (i < 0 || i >= state.steps.length) return;
  var pitchSpan = Math.max(1, state.numPitches);
  var s = state.steps[i];
  if (!s) return;
  s.pitch = clamp(Math.round(Number(pitch)), 0, pitchSpan - 1);
  s.gate = Number(gate) ? 1 : 0;
  s.accent = Number(accent) ? 1 : 0;
  mgraphics.redraw();
  outputFullData();
}

function numsteps(n) {
  state.numSteps = clamp(Math.round(Number(n)), 1, MAX_STEPS);
  doLayout();
  mgraphics.redraw();
  outputFullData();
}

function numpitches(n) {
  state.numPitches = Math.max(1, Math.round(Number(n)));
  doLayout();
  mgraphics.redraw();
  outputFullData();
}

function fgcolor(r, g, b) {
  state.fgColor = [
    clamp(Number(r), 0, 1),
    clamp(Number(g), 0, 1),
    clamp(Number(b), 0, 1)
  ];
  mgraphics.redraw();
}

function bgcolor(r, g, b) {
  state.bgColor = [
    clamp(Number(r), 0, 1),
    clamp(Number(g), 0, 1),
    clamp(Number(b), 0, 1)
  ];
  mgraphics.redraw();
}

function list() {
  var a = arrayfromargs(arguments);
  if (a.length >= 4 && (a[0] === "fgcolor" || a[0] === "bgcolor")) {
    var fn = a[0] === "fgcolor" ? fgcolor : bgcolor;
    fn(a[1], a[2], a[3]);
  }
}

function bang() {}

function loadbang() {
  mgraphics.redraw();
}

// ─── Init ────────────────────────────────────────────────────────────

initSteps();
doLayout();
