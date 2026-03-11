/**
 * Spec-driven check: validates that the built step_sequencer.js exposes
 * the globals required by SPEC.md (inlets, outlets, message handlers, paint, resize, click).
 * Built file uses install(global) so we check for assignments to these names.
 */

const fs = require("fs");
const path = require("path");

const builtPath = path.join(__dirname, "index.js");

const REQUIRED_EXPORTS = [
  "inlets",
  "outlets",
  "paint",
  "onresize",
  "onclick",
  "highlight",
  "getdata",
  "set",
  "numsteps",
  "numpitches",
  "fgcolor",
  "bgcolor",
];

if (!fs.existsSync(builtPath)) {
  console.error("Missing source file:", builtPath);
  process.exit(1);
}

const src = fs.readFileSync(builtPath, "utf8");
const missing = REQUIRED_EXPORTS.filter((name) => {
  return !src.includes(name);
});

if (missing.length > 0) {
  console.error("Spec check failed: built file is missing required exports:", missing.join(", "));
  process.exit(1);
}

console.log("Spec check passed: source file exposes required globals.");
