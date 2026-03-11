#!/usr/bin/env bash
# Build script for Rattle distribution package

set -e

VERSION="${1:-0.1.0}"
DIST_DIR="dist"
DEVICE="rattle.amxd"
ARCHIVE="rattle-${VERSION}.zip"

# Check for device
if [ ! -f "$DEVICE" ]; then
    echo "ERROR: $DEVICE not found. Save as Live Device first."
    exit 1
fi

# Create dist directory
mkdir -p "$DIST_DIR"

# Create zip with device and README
echo "Packaging $DEVICE and README.md..."
zip -q "$DIST_DIR/$ARCHIVE" "$DEVICE" README.md

echo "✓ Created $DIST_DIR/$ARCHIVE"
