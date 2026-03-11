# Planedrifter build automation
# The .maxpat → .amxd step is manual: open in Max, then File → Save as Live Device.

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
PATCH := $(ROOT)src/drift.maxpat
PATTERN := $(ROOT)src/pattern_default.txt
AMXD := $(ROOT)drifter.amxd
VERSION := $(shell cat $(ROOT)VERSION 2>/dev/null || echo "0.1.0")
DIST_DIR := $(ROOT)dist
DIST_NAME := drifter-$(VERSION)
MAX_APP := /Applications/Max.app

.PHONY: check open build dist clean help

help:
	@echo "Planedrifter build targets:"
	@echo "  make check   - Verify src/drift.maxpat and src/pattern_default.txt exist"
	@echo "  make open    - Open src/drift.maxpat in Max"
	@echo "  make build   - Run check, open patch, remind to save as .amxd"
	@echo "  make dist    - Package drifter.amxd + assets into dist/ (run after saving .amxd)"
	@echo "  make clean   - Remove dist/"

check:
	@test -f "$(PATCH)" || (echo "Missing: drift.maxpat" && exit 1)
	@test -f "$(PATTERN)" || (echo "Missing: pattern_default.txt" && exit 1)
	@echo "OK: patch and pattern file present"

open: check
	@open -a "$(MAX_APP)" "$(PATCH)"

build: check
	@echo "Opening patch in Max..."
	@open -a "$(MAX_APP)" "$(PATCH)"
	@echo ""
	@echo "→ In Max: File → Save as Live Device → save as drifter.amxd in project root"
	@echo "→ Then run: make dist"

dist:
	@test -f "$(AMXD)" || (echo "Missing drifter.amxd. Open src/drift.maxpat in Max, File → Save as Live Device, save as drifter.amxd"; exit 1)
	@mkdir -p "$(DIST_DIR)"
	@$(ROOT)scripts/build.sh "$(ROOT)" "$(VERSION)" "$(DIST_DIR)" "$(DIST_NAME)"
	@echo "Created $(DIST_DIR)/$(DIST_NAME).zip"

clean:
	rm -rf "$(DIST_DIR)"
