# Drift Step Sequencer Constitution

## Core Principles

### Spec-first development
All behavior and message protocol are defined in the specification (SPEC.md and, when used, .specify/memory/specs/) before implementation. Code and docs MUST stay aligned with the spec. Changes to behavior require spec updates first.

### Max compatibility
The built artifact is a single JavaScript file executed by Max jsui. No ES modules, no Node APIs at runtime. Use only globals and APIs that Max provides (inlets, outlets, outlet(), mgraphics, this.inlet). The build (Node) is for authoring only.

### Single-file output
The project bundles multiple ES modules (entry: src/main.js) into one dist/step_sequencer.js via esbuild. The required globals are fixed; the spec check (npm run check) validates the built file exposes the required surface.

### Clear boundaries
In scope: jsui UI, message protocol, layout, hit-testing, scale/octave semantics. Out of scope: Max patch wiring, coll format, playback; those live in integration docs and the parent Drift project.

### Testable acceptance
The spec includes acceptance criteria. Implementation MUST satisfy them. Use npm run check to verify the built script; manual testing in Max for UI and message flow.

## Governance

- **Amendments:** Update this constitution only when adding or changing principles that apply to all step-sequencer work. Bump version and set Last Amended to today.
- **Versioning:** CONSTITUTION_VERSION follows semantic versioning (MAJOR = incompatible principle change, MINOR = new principle, PATCH = clarification).
- **Compliance:** Before implementing features or refactors, confirm alignment with SPEC.md and this constitution.

**Version**: 1.0.0 | **Ratified**: 2025-02-24 | **Last Amended**: 2025-02-24
