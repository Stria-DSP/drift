# Drift step sequencer jsui (source)

TypeScript/Node project that builds to a single Max-compatible JavaScript file for the **jsui** object. Uses **Spec Kit**–style spec-driven development: behavior and protocol are defined in **SPEC.md** and **.specify/memory/** (constitution + feature spec).

## Setup

Use **nvm** to match the Node version:

```bash
nvm use
```

If the version is not installed: `nvm install`.

## Build

```bash
npm run build
```

1. **Esbuild** — Bundles **src/main.ts** (TypeScript + ES modules) into a single **IIFE** (ES2018).
2. **Babel** — Transpiles to **ES5** (IE11 target) so Max’s jsui engine can run it (no arrow functions, etc.).
3. **Post-fixes** — Converts any remaining arrow syntax in esbuild helpers and `.sort()` calls.
4. **Max jsui global** — The built file starts with `var __maxGlobal = this;` and passes that into `install()` so the sequencer runs against the jsui context (where Max provides `mgraphics` and `outlet`). Without this, the UI does not draw.

Point the Max **jsui** object’s **filename** at **dist/step_sequencer.js** (absolute path recommended; see integration doc).

## Test

```bash
npm test
```

Runs Jest unit tests in `__tests__/` (TypeScript via **ts-jest**). Tests target the pure logic in **src/logic.ts**. After code changes, run `npm run typecheck && npm run build && npm run check && npm test`.

## Watch

```bash
npm run watch
```

Watches **src/** and **__tests__/** for `.ts` changes; on each change runs typecheck, tests, and build (via **nodemon** and **nodemon.json**). Use during development to keep `dist/step_sequencer.js` up to date.

## Layout

- **build.js** — Pipeline: esbuild (bundle) → Babel (ES5) → post-fixes (arrows) + __maxGlobal / install() injection. See comments in build.js.
- **tsconfig.json** — TypeScript config; `npm run typecheck` runs `tsc --noEmit`.
- **src/types.ts** — Shared types: Step, Octave, Outlet, Mgraphics, SequencerStateLike.
- **src/constants.ts** — MAX_STEPS, MARGIN, row heights.
- **src/logic.ts** — Pure functions: clamp, nearestInScalePure, effectivePitchPure, parseSetpatternTriples.
- **src/SequencerState.ts** — **Class** holding state and layout; methods: initSteps, layout, nearestInScale, outputStep, loadPatternFromArray, handleMsgInt, handleScaleMaskList.
- **src/draw.ts** — paint(state, mgraphics); draws octave row, gate row, grid, accent row.
- **src/hitTest.ts** — hitOctave, hitGate, hitGrid, hitAccent(state, x, y).
- **src/main.ts** — Entry: `install(global)` receives the jsui global (in Max, from __maxGlobal). Creates SequencerState, assigns inlets, outlets, paint, onresize, onclick, list, setpattern, msg_int, bang, loadbang; uses `ctx.call(this)` in handlers so mgraphics/outlet come from the invocation context.

- **SPEC.md** — Specification (source of truth for protocol, behavior, layout).
- **.specify/** — Spec Kit layout: `memory/constitution.md`, `memory/specs/001-step-sequencer-jsui/spec.md`. See `.specify/README.md` for optional full CLI/slash commands.
- **check-spec.js** — `npm run check` validates the built script exposes required globals (inlets, outlets, paint, onresize, onclick, msg_int, list, setpattern).

Integration: see **docs/STEP_SEQUENCER_JSUI.md**.
