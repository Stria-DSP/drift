/**
 * Pure logic for step sequencer: clamp, scale/octave helpers, setpattern parsing.
 * Used by tests and can be called from the jsui runtime if needed.
 */

export function clamp(v: number, lo: number, hi: number): number {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

export function nearestInScalePure(
  pitch: number,
  pitchLow: number,
  pitchHigh: number,
  scaleMask: number[]
): number {
  const clamped = clamp(pitch, pitchLow, pitchHigh);
  if (scaleMask.length === 0) return clamped;
  const inRange = scaleMask.filter((p) => p >= pitchLow && p <= pitchHigh);
  if (inRange.length === 0) return clamped;
  let nearest = inRange[0];
  let best = Math.abs(pitch - nearest);
  for (let i = 1; i < inRange.length; i++) {
    const d = Math.abs(pitch - inRange[i]);
    if (d < best) {
      best = d;
      nearest = inRange[i];
    }
  }
  return nearest;
}

export function effectivePitchPure(basePitch: number, octave: number): number {
  return clamp(basePitch + 12 * octave, 0, 127);
}

export type StepTriple = {
  pitch: number;
  gate: number;
  accent: number;
  octave?: number;
};

export function parseSetpatternTriples(
  list: (number | string)[],
  maxSteps: number
): StepTriple[] {
  let arr: (number | string)[] = Array.isArray(list) ? [...list] : [];
  if (arr.length > 0 && arr[0] === "setpattern") arr = arr.slice(1);
  if (arr.length < 3) return [];
  const out: StepTriple[] = [];
  const is4Tuple = arr.length >= 4 && arr.length % 4 === 0;
  const tupleSize = is4Tuple ? 4 : 3;
  for (let i = 0; i < arr.length && out.length < maxSteps; i += tupleSize) {
    const pitch = clamp(Number(arr[i]), 0, 127);
    const gate = Number(arr[i + 1]) ? 1 : 0;
    const accent = Number(arr[i + 2]) ? 1 : 0;
    let octave = 0;
    if (tupleSize === 4) {
      const o = Math.round(Number(arr[i + 3]));
      octave = o < 0 ? -1 : o > 0 ? 1 : 0;
    }
    out.push({ pitch, gate, accent, octave });
  }
  return out;
}
