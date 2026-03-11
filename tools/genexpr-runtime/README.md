# genexpr-runtime

GenExpr / codebox runtime for **Jest unit testing** (candy-striping). Parses and executes `.genexpr` and `.codebox` files outside of Max with controlled inlets, params, and buffers; returns outlet arrays for assertions.

## API

```ts
import { run, loadAndRun, parseSource } from 'genexpr-runtime';

// Run from source string
const result = run('out1 = in1 + in2;', {
  samples: 100,
  sr: 48000,
  inlets: [1, 2],
  params: { gain: 0.5 },
  buffers: { ratios: [1, 2, 3] },
  noiseSeed: 42,
  mc_channel: 1,
});
// result.out1, result.out2, ...

// Run from file
const result2 = loadAndRun('./modal_bar.codebox', { samples: 1000, ... });
```

## Jest

Use in tests to candy-stripe inputs and assert on outlet arrays:

```ts
const result = loadAndRun(path.join(__dirname, '../../instruments/drift/src/modal_bar/modal_bar.codebox'), {
  samples: 3500,
  sr: 48000,
  inlets: [gateArray, 440, 0], // gate burst then silence
  params: { decay: 0.5, softness: 0.3, force: 0.5 },
  buffers: { ratios: [1, 1.5, 2, 2.5, 3, 4, 5, 6] },
  mc_channel: 1,
});
expect(result.out3[500]).toBe(1); // trigger at sample 500
```

## CLI (optional)

After `npm run build`:

```bash
node dist/cli.js run path/to/file.codebox --samples 48000 --sr 48000 --in1 0.5 --param decay 1 --buffer ratios=1,2,3 [--format csv|values|raw]
```

## Supported GenExpr subset

- **Declarations:** `History name(init);`, `Param name(default);`, `Buffer name("id");`
- **I/O:** `in1`–`inN`, `out1`–`outN`; History reads as previous sample
- **Built-ins:** `cos`, `sin`, `exp`, `abs`, `min`, `max`, `tanh`, `clamp`, `noise`, `peek(buffer, index)`; constants `SAMPLERATE`, `pi`, `mc_channel`
- **Control flow:** `if`/`else`, `for`, `while`, `break`, `continue`; user functions with `return`
- **Determinism:** `noiseSeed` option for reproducible tests

## References

- [GENEXPR_REFERENCE.md](../../instruments/drift/docs/GENEXPR_REFERENCE.md) (project)
- [Cycling '74 GenExpr](https://docs.cycling74.com/userguide/gen/gen_genexpr)
