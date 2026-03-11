#!/usr/bin/env bash
# Package drifter.amxd and assets into a distribution zip.
# Usage: scripts/build.sh <project_root> <version> <dist_dir> <dist_name>
# Called by: make dist

set -e

ROOT="${1:?project root}"
VERSION="${2:?version}"
DIST_DIR="${3:?dist dir}"
DIST_NAME="${4:?dist name}"

cd "$ROOT"
ZIP_PATH="${DIST_DIR}/${DIST_NAME}.zip"

# Files to include in the release zip (drifter.amxd is required)
test -f "${ROOT}/drifter.amxd" || { echo "Missing drifter.amxd. Save src/drift.maxpat as Live device first." >&2; exit 1; }

TO_ZIP=("${ROOT}/drifter.amxd")
[[ -f "${ROOT}/README.md" ]] && TO_ZIP+=("${ROOT}/README.md")
[[ -f "${ROOT}/src/pattern_default.txt" ]] && TO_ZIP+=("${ROOT}/src/pattern_default.txt")

# Build zip with flat paths (-j strips directory)
zip -j "$ZIP_PATH" "${TO_ZIP[@]}"
echo "Created $ZIP_PATH"
