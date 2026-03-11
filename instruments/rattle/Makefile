# Rattle — Makefile for building and packaging
# Max for Live device (rattle.amxd) must be saved manually in Max

VERSION := $(shell cat VERSION)
DIST_DIR := dist
DEVICE := rattle.amxd
PATCHER := src/rattle.maxpat

.PHONY: check open build dist clean

check:
	@echo "Checking for required files..."
	@test -f $(PATCHER) || (echo "ERROR: $(PATCHER) not found" && exit 1)
	@echo "✓ $(PATCHER) exists"

open: check
	@echo "Opening $(PATCHER) in Max..."
	@open $(PATCHER)

build: open
	@echo ""
	@echo "================================================"
	@echo "MANUAL STEP REQUIRED:"
	@echo "1. In Max: File → Save as Live Device"
	@echo "2. Save as: $(DEVICE) in project root"
	@echo "3. Run 'make dist' to package for release"
	@echo "================================================"

dist:
	@echo "Building distribution package..."
	@test -f $(DEVICE) || (echo "ERROR: $(DEVICE) not found. Run 'make build' first." && exit 1)
	@mkdir -p $(DIST_DIR)
	@./scripts/build.sh $(VERSION)
	@echo "✓ Distribution package created: $(DIST_DIR)/rattle-$(VERSION).zip"

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(DIST_DIR)
	@echo "✓ Clean complete"
