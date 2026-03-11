import * as path from 'path';
import { loadAndRun } from '../src/index';

const MODAL_BAR_PATH = path.join(
  __dirname,
  '../../../instruments/drift/src/modal_bar/modal_bar.codebox'
);

describe('modal_bar.codebox integration', () => {
  const sr = 48000;
  const ratios = [1, 1.5, 2, 2.5, 3, 4, 5, 6]; // one ratio per mode; we use mc_channel to index

  it('loads and runs with gate=0 (silence)', () => {
    const result = loadAndRun(MODAL_BAR_PATH, {
      samples: 100,
      sr,
      inlets: [0, 440, 0], // gate 0, 440 Hz, unused in3
      params: { decay: 1, softness: 0.5, force: 0.5 },
      buffers: { ratios },
      mc_channel: 1,
    });
    expect(result.out1).toHaveLength(100);
    expect(result.out2).toHaveLength(100);
    expect(result.out3).toHaveLength(100);
    // out1 (resonator) and out2 (exciter) should be near zero with gate 0
    const rms = (arr: number[]) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
    expect(rms(result.out1)).toBeLessThan(0.01);
    expect(rms(result.out2)).toBeLessThan(0.01);
    expect(result.out3.every((x) => x === 0)).toBe(true);
  });

  it('candy-stripe: gate burst triggers exciter and resonator', () => {
    // 500 samples silence, 1000 samples gate=1, 2000 samples silence
    const total = 500 + 1000 + 2000;
    const gate: number[] = [];
    for (let i = 0; i < 500; i++) gate.push(0);
    for (let i = 0; i < 1000; i++) gate.push(1);
    for (let i = 0; i < 2000; i++) gate.push(0);
    const result = loadAndRun(MODAL_BAR_PATH, {
      samples: total,
      sr,
      inlets: [gate, 440, 0],
      params: { decay: 0.5, softness: 0.3, force: 0.5 },
      buffers: { ratios },
      mc_channel: 1,
    });
    expect(result.out1).toHaveLength(total);
    expect(result.out2).toHaveLength(total);
    expect(result.out3).toHaveLength(total);
    // out3 = trigger: should be 1 only at the rising edge (sample 500)
    expect(result.out3[499]).toBe(0);
    expect(result.out3[500]).toBe(1);
    expect(result.out3[501]).toBe(0);
    // out2 (exciter): non-zero during the gate burst, then zero
    const exciterDuringBurst = result.out2.slice(500, 1500);
    const exciterAfter = result.out2.slice(1500, 2000);
    expect(exciterDuringBurst.some((x) => Math.abs(x) > 0.01)).toBe(true);
    expect(Math.max(...exciterAfter.map(Math.abs))).toBeLessThan(0.01);
    // out1 (resonator): rings after the burst, then decays
    const resonatorAfterBurst = result.out1.slice(1500, 2000);
    expect(resonatorAfterBurst.some((x) => Math.abs(x) > 0.001)).toBe(true);
  });
});
