/**
 * GenExpr built-in constants and functions.
 * Deterministic noise for reproducible tests.
 */

const PI = Math.PI;

// Simple deterministic PRNG (mulberry32) for noise() - seed set by interpreter
let noiseSeed = 0;
export function setNoiseSeed(seed: number): void {
  noiseSeed = seed >>> 0;
}

function nextRand(): number {
  let t = (noiseSeed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function noise(): number {
  return nextRand() * 2 - 1; // -1 to 1 like gen~
}

export const BUILTIN_CONSTANTS: Record<string, number> = {
  pi: PI,
  PI: PI,
  SAMPLERATE: 48000, // default; overridden per run
  mc_channel: 1,
};

export type BuiltinFn = (...args: number[]) => number | number[];

export const BUILTINS: Record<string, BuiltinFn> = {
  cos: (x) => Math.cos(x),
  sin: (x) => Math.sin(x),
  tan: (x) => Math.tan(x),
  exp: (x) => Math.exp(x),
  abs: (x) => Math.abs(x),
  log: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  min: (a, b) => Math.min(a, b),
  max: (a, b) => Math.max(a, b),
  tanh: (x) => Math.tanh(x),
  atan2: (y, x) => Math.atan2(y, x),
  pow: (a, b) => Math.pow(a, b),
  clamp: (x, lo, hi) => Math.min(hi, Math.max(lo, x)),
  noise: () => noise(),
  peek: (/* buffer ref, index - handled in interpreter */) => 0, // interpreter resolves buffer by name
};

export function setSamplerate(sr: number): void {
  BUILTIN_CONSTANTS.SAMPLERATE = sr;
}

export function setMcChannel(ch: number): void {
  BUILTIN_CONSTANTS.mc_channel = ch;
}
