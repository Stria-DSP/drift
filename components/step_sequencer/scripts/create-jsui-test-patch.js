#!/usr/bin/env node
/**
 * Creates dist/jsui_test.maxpat with one jsui loading dist/step_sequencer.js
 * and a loadbang connected to inlet 0, then opens the patch in Max.
 * Run from components/step_sequencer: node scripts/create-jsui-test-patch.js
 */

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SCRIPT_PATH = path.join(DIST, "step_sequencer.js");
const PATCH_PATH = path.join(DIST, "jsui_test.maxpat");

if (!fs.existsSync(SCRIPT_PATH)) {
  console.error("Missing dist/step_sequencer.js. Run npm run build or create a minimal repro first.");
  process.exit(1);
}

const patch = {
  patcher: {
    fileversion: 1,
    appversion: { major: 8, minor: 6, revision: 0, architecture: "x64", modernui: 1 },
    classnamespace: "box",
    rect: [100, 100, 500, 400],
    bglocked: 0,
    openinpresentation: 0,
    default_fontsize: 12,
    default_fontface: 0,
    default_fontname: "Arial",
    gridonopen: 1,
    gridsize: [15, 15],
    boxanimatetime: 200,
    boxes: [
      {
        box: {
          id: "obj-1",
          maxclass: "newobj",
          numinlets: 1,
          numoutlets: 1,
          outlettype: ["bang"],
          patching_rect: [50, 50, 70, 22],
          text: "loadbang",
        },
      },
      {
        box: {
          id: "obj-2",
          maxclass: "jsui",
          numinlets: 6,
          numoutlets: 2,
          outlettype: ["", ""],
          patching_rect: [50, 90, 400, 280],
          filename: SCRIPT_PATH,
        },
      },
    ],
    lines: [
      { patchline: { source: ["obj-1", 0], destination: ["obj-2", 0] } },
    ],
  },
};

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(PATCH_PATH, JSON.stringify(patch, null, 2), "utf8");
console.log("Wrote", PATCH_PATH);
console.log("jsui filename (absolute):", SCRIPT_PATH);

const plat = process.platform;
if (plat === "darwin") {
  try {
    execSync("open " + JSON.stringify(PATCH_PATH), { stdio: "inherit" });
    console.log("Opened in default app (set Max as default for .maxpat to open in Max).");
  } catch (e) {
    console.log("Could not open patch. Open manually:", PATCH_PATH);
  }
} else {
  console.log("Open in Max manually:", PATCH_PATH);
}
