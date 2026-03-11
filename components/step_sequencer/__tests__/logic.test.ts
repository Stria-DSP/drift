import {
  clamp,
  nearestInScalePure,
  effectivePitchPure,
  parseSetpatternTriples,
} from "../src/logic";

const MAX_STEPS = 32;

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(50, 0, 127)).toBe(50);
    expect(clamp(0, 0, 127)).toBe(0);
    expect(clamp(127, 0, 127)).toBe(127);
  });

  it("returns lo when value < lo", () => {
    expect(clamp(-1, 0, 127)).toBe(0);
    expect(clamp(35, 36, 72)).toBe(36);
  });

  it("returns hi when value > hi", () => {
    expect(clamp(128, 0, 127)).toBe(127);
    expect(clamp(73, 36, 72)).toBe(72);
  });
});

describe("nearestInScalePure", () => {
  it("returns clamp(pitch, pitch_low, pitch_high) when scale_mask is empty", () => {
    expect(nearestInScalePure(50, 36, 72, [])).toBe(50);
    expect(nearestInScalePure(30, 36, 72, [])).toBe(36);
    expect(nearestInScalePure(80, 36, 72, [])).toBe(72);
  });

  it("returns nearest pitch in scale_mask within range", () => {
    const cMajor = [60, 62, 64, 65, 67, 69, 71];
    expect(nearestInScalePure(60, 36, 72, cMajor)).toBe(60);
    expect(nearestInScalePure(62, 36, 72, cMajor)).toBe(62);
    expect(nearestInScalePure(64, 36, 72, cMajor)).toBe(64);
    expect(nearestInScalePure(68, 36, 72, cMajor)).toBe(67);
    expect(nearestInScalePure(66, 36, 72, cMajor)).toBe(65);
  });

  it("ignores scale_mask pitches outside pitch_low..pitch_high", () => {
    const scale = [48, 60, 72];
    expect(nearestInScalePure(58, 50, 70, scale)).toBe(60);
    expect(nearestInScalePure(71, 50, 70, scale)).toBe(60);
  });

  it("returns clamped pitch when no scale pitches in range", () => {
    const scale = [0, 20];
    expect(nearestInScalePure(60, 36, 72, scale)).toBe(60);
  });
});

describe("effectivePitchPure", () => {
  it("returns base pitch when octave is 0", () => {
    expect(effectivePitchPure(60, 0)).toBe(60);
    expect(effectivePitchPure(0, 0)).toBe(0);
    expect(effectivePitchPure(127, 0)).toBe(127);
  });

  it("adds 12 per positive octave", () => {
    expect(effectivePitchPure(60, 1)).toBe(72);
    expect(effectivePitchPure(60, 2)).toBe(84);
  });

  it("subtracts 12 per negative octave", () => {
    expect(effectivePitchPure(60, -1)).toBe(48);
    expect(effectivePitchPure(72, -1)).toBe(60);
  });

  it("clamps result to 0..127", () => {
    expect(effectivePitchPure(120, 1)).toBe(127);
    expect(effectivePitchPure(10, -1)).toBe(0);
  });
});

describe("parseSetpatternTriples", () => {
  it("returns empty array when length < 3", () => {
    expect(parseSetpatternTriples([], MAX_STEPS)).toEqual([]);
    expect(parseSetpatternTriples([60, 1], MAX_STEPS)).toEqual([]);
  });

  it("parses flat list of pitch, gate, accent triples (octave default 0)", () => {
    const out = parseSetpatternTriples([60, 1, 0, 62, 0, 1, 64, 1, 0], MAX_STEPS);
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ pitch: 60, gate: 1, accent: 0, octave: 0 });
    expect(out[1]).toEqual({ pitch: 62, gate: 0, accent: 1, octave: 0 });
    expect(out[2]).toEqual({ pitch: 64, gate: 1, accent: 0, octave: 0 });
  });

  it("parses 4-tuples (pitch, gate, accent, octave) when list length is multiple of 4", () => {
    const out = parseSetpatternTriples(
      [60, 1, 0, 0, 62, 0, 1, -1, 64, 1, 0, 1],
      MAX_STEPS
    );
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ pitch: 60, gate: 1, accent: 0, octave: 0 });
    expect(out[1]).toEqual({ pitch: 62, gate: 0, accent: 1, octave: -1 });
    expect(out[2]).toEqual({ pitch: 64, gate: 1, accent: 0, octave: 1 });
  });

  it("skips selector when first element is 'setpattern'", () => {
    const out = parseSetpatternTriples(
      ["setpattern", 60, 1, 0, 62, 0, 1],
      MAX_STEPS
    );
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ pitch: 60, gate: 1, accent: 0, octave: 0 });
    expect(out[1]).toEqual({ pitch: 62, gate: 0, accent: 1, octave: 0 });
  });

  it("respects maxSteps", () => {
    const list: number[] = [];
    for (let i = 0; i < 33; i++) list.push(60, 1, 0);
    const out = parseSetpatternTriples(list, MAX_STEPS);
    expect(out).toHaveLength(MAX_STEPS);
  });

  it("clamps pitch to 0..127", () => {
    const out = parseSetpatternTriples([-5, 1, 0, 200, 0, 0], MAX_STEPS);
    expect(out[0].pitch).toBe(0);
    expect(out[1].pitch).toBe(127);
  });

  it("treats non-zero gate/accent as 1", () => {
    const out = parseSetpatternTriples([60, 2, 0.5, 62, 0, 0], MAX_STEPS);
    expect(out[0].gate).toBe(1);
    expect(out[0].accent).toBe(1);
    expect(out[1].gate).toBe(0);
    expect(out[1].accent).toBe(0);
  });

  it("clamps 4-tuple octave to -1, 0, or 1", () => {
    const out = parseSetpatternTriples([60, 0, 0, 2, 62, 0, 0, -2], MAX_STEPS);
    expect(out[0].octave).toBe(1);
    expect(out[1].octave).toBe(-1);
  });
});
