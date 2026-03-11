import { run, parseSource } from '../src/index';

describe('interpreter', () => {
  it('out1 = in1 + in2 with constant inlets', () => {
    const result = run('out1 = in1 + in2;', {
      samples: 5,
      inlets: [10, 20],
    });
    expect(result.out1).toHaveLength(5);
    expect(result.out1.every((v) => v === 30)).toBe(true);
  });

  it('History: one-sample delay', () => {
    const result = run(
      `
      History x(0.);
      x = in1;
      out1 = x;
    `,
      { samples: 4, inlets: [[1, 2, 3, 4]] }
    );
    // First sample: x (prev) = 0, then we set x = 1; out1 = 0 (prev)
    // Second: x prev = 1, set x = 2, out1 = 1
    // Third: out1 = 2; Fourth: out1 = 3
    expect(result.out1[0]).toBe(0);
    expect(result.out1[1]).toBe(1);
    expect(result.out1[2]).toBe(2);
    expect(result.out1[3]).toBe(3);
  });

  it('Param with default and override', () => {
    const result = run(
      `
      Param gain(0.5);
      out1 = in1 * gain;
    `,
      { samples: 2, inlets: [10], params: { gain: 2 } }
    );
    expect(result.out1[0]).toBe(20);
    expect(result.out1[1]).toBe(20);
  });

  it('built-in math: cos, min', () => {
    const result = run('out1 = cos(0.); out2 = min(1., 2.);', { samples: 1 });
    expect(result.out1[0]).toBeCloseTo(1);
    expect(result.out2[0]).toBe(1);
  });

  it('ternary and comparison', () => {
    const result = run(
      'out1 = in1 > 0.5 ? 1. : 0.;',
      { samples: 3, inlets: [[0, 1, 0.6]] }
    );
    expect(result.out1[0]).toBe(0);
    expect(result.out1[1]).toBe(1);
    expect(result.out1[2]).toBe(1);
  });

  it('user function with return', () => {
    const result = run(
      `
      double(x) { return x * 2.; }
      out1 = double(in1);
    `,
      { samples: 2, inlets: [3] }
    );
    expect(result.out1[0]).toBe(6);
    expect(result.out1[1]).toBe(6);
  });

  it('multi-return assignment', () => {
    const result = run(
      `
      pair() { return 10., 20.; }
      a, b = pair();
      out1 = a;
      out2 = b;
    `,
      { samples: 1 }
    );
    expect(result.out1[0]).toBe(10);
    expect(result.out2[0]).toBe(20);
  });

  it('SAMPLERATE and pi constants', () => {
    const result = run('out1 = 1. / SAMPLERATE; out2 = pi;', {
      samples: 1,
      sr: 48000,
    });
    expect(result.out1[0]).toBeCloseTo(1 / 48000);
    expect(result.out2[0]).toBeCloseTo(Math.PI);
  });

  it('peek(buffer, index) with buffers option', () => {
    const result = run(
      `
      Buffer ratios("ratios");
      out1 = peek(ratios, 0);
      out2 = peek(ratios, mc_channel - 1);
    `,
      { samples: 1, buffers: { ratios: [10, 20, 30] }, mc_channel: 2 }
    );
    expect(result.out1[0]).toBe(10);
    expect(result.out2[0]).toBe(20); // mc_channel 2 -> index 1
  });

  it('noise() is deterministic with noiseSeed', () => {
    const r1 = run('out1 = noise();', { samples: 3, noiseSeed: 42 });
    const r2 = run('out1 = noise();', { samples: 3, noiseSeed: 42 });
    expect(r1.out1).toEqual(r2.out1);
    const r3 = run('out1 = noise();', { samples: 3, noiseSeed: 99 });
    expect(r1.out1).not.toEqual(r3.out1);
  });
});
