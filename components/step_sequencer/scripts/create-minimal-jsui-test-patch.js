#!/usr/bin/env node
/**
 * Copies the minimal onclick repro to dist/, creates dist/jsui_test_minimal.maxpat
 * (one jsui loading that script + loadbang), and opens the patch in Max.
 * Run from components/step_sequencer: npm run open-jsui-test-minimal
 */

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const MINIMAL_SOURCE = path.join(ROOT, "scripts", "minimal_onclick_repro.js");
const MINIMAL_SCRIPT_PATH = path.join(DIST, "step_sequencer_minimal.js");
const PATCH_PATH = path.join(DIST, "jsui_test_minimal.maxpat");

if (!fs.existsSync(MINIMAL_SOURCE)) {
  console.error("Missing scripts/minimal_onclick_repro.js");
  process.exit(1);
}

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
fs.copyFileSync(MINIMAL_SOURCE, MINIMAL_SCRIPT_PATH);
console.log("Copied minimal repro to", MINIMAL_SCRIPT_PATH);

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
          filename: MINIMAL_SCRIPT_PATH,
        },
      },
    ],
    lines: [
      { patchline: { source: ["obj-1", 0], destination: ["obj-2", 0] } },
    ],
  },
};

fs.writeFileSync(PATCH_PATH, JSON.stringify(patch, null, 2), "utf8");
console.log("Wrote", PATCH_PATH);
console.log("jsui filename (absolute):", MINIMAL_SCRIPT_PATH);

const MAX_APP = "/Applications/Max.app";
const plat = process.platform;
if (plat === "darwin") {
  try {
    execSync("open -a " + JSON.stringify(MAX_APP) + " " + JSON.stringify(PATCH_PATH), { stdio: "inherit" });
    console.log("Opened in Max.");
  } catch (e) {
    console.log("Could not open patch. Open manually:", PATCH_PATH);
  }
} else {
  console.log("Open in Max manually:", PATCH_PATH);
}
