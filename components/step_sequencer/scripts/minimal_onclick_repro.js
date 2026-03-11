/**
 * Minimal ES5 onclick repro for Max jsui.
 * Tests: (1) onclick runs without "error calling function onclick",
 *        (2) redraw after click — click count should update immediately, not only after clicking outside.
 * Copy to dist/step_sequencer.js to test full flow; use npm run open-jsui-test-minimal for this script.
 */
"use strict";

var clickCount = 0;

if (typeof mgraphics !== "undefined") {
  mgraphics.init();
  mgraphics.relative_coords = 0;
  mgraphics.autofill = 0;
}

function paint() {
  var mg = typeof mgraphics !== "undefined" ? mgraphics : null;
  if (!mg) return;
  mg.set_source_rgba(0.2, 0.2, 0.3, 1);
  mg.paint();
  mg.set_source_rgba(1, 1, 1, 0.9);
  mg.rectangle(50, 50, 100, 30);
  mg.fill();
  mg.move_to(60, 70);
  mg.set_font_size(12);
  mg.show_text("click me — " + clickCount);
}

function onclick(a1, a2, a3) {
  try {
    var px, py;
    if (a1 >= 0 && a1 <= 2 && a2 > 50) {
      px = Number(a2);
      py = Number(a3);
    } else {
      px = Number(a1);
      py = Number(a2);
    }
    if (isNaN(px) || isNaN(py)) return;
    clickCount += 1;
    if (typeof outlet !== "undefined") {
      try {
        outlet(0, "list", Math.floor(px), Math.floor(py));
      } catch (_) {}
    }
    if (typeof mgraphics !== "undefined" && mgraphics.redraw) mgraphics.redraw();
  } catch (e) {
    try {
      if (typeof mgraphics !== "undefined" && mgraphics.redraw) mgraphics.redraw();
    } catch (_e) {}
  }
}
