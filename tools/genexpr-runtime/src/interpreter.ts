/**
 * Interpreter for GenExpr AST. Runs per-sample (tick) with History, Param, inlets, outlets.
 */

import type {
  Program,
  Statement,
  Expr,
  FunDecl,
  Assignment,
  OutletAssignment,
  CallExpr,
  BinaryExpr,
} from './ast';
import {
  BUILTINS,
  BUILTIN_CONSTANTS,
  setNoiseSeed,
  setSamplerate,
  setMcChannel,
} from './builtins';

export type RunOptions = {
  sr?: number;
  samples: number;
  inlets?: (number | number[])[];
  params?: Record<string, number>;
  buffers?: Record<string, number[]>;
  noiseSeed?: number;
  mc_channel?: number;
};

export type RunResult = {
  [key: string]: number[]; // out1, out2, ...
};

export function runGenExpr(program: Program, options: RunOptions): RunResult {
  const sr = options.sr ?? 48000;
  const samples = options.samples;
  setSamplerate(sr);
  if (options.mc_channel != null) setMcChannel(options.mc_channel);
  if (options.noiseSeed != null) setNoiseSeed(options.noiseSeed);

  const inlets = options.inlets ?? [];
  const params = options.params ?? {};
  const buffers = options.buffers ?? {};

  const state = new InterpreterState(program, {
    sr,
    inlets,
    params: { ...params, ...(options.mc_channel != null ? { mc_channel: options.mc_channel } : {}) },
    buffers,
    mc_channel: options.mc_channel,
  });
  state.initDeclarations();

  const maxOut = state.computeMaxOutlet();
  const result: RunResult = {};
  for (let o = 1; o <= maxOut; o++) result[`out${o}`] = [];

  for (let t = 0; t < samples; t++) {
    state.setTickInlets(t);
    state.runStatements();
    for (let o = 1; o <= maxOut; o++) {
      result[`out${o}`].push(state.getOutlet(o));
    }
    state.advanceHistory();
  }

  return result;
}

class InterpreterState {
  vars: Record<string, number> = {};
  historyPrev: Record<string, number> = {};
  historyNext: Record<string, number> = {};
  paramValues: Record<string, number> = {};
  outlets: Record<number, number> = {};
  buffers: Record<string, number[]> = {};
  inletValues: number[] = [];
  sr: number;
  inletsConfig: (number | number[])[];
  functions: Map<string, FunDecl> = new Map();
  historyNames: Set<string> = new Set();
  paramNames: Set<string> = new Set();
  bufferNames: Set<string> = new Set();
  statements: Statement[] = [];
  maxOutlet = 1;

  constructor(
    program: Program,
    private config: {
      sr: number;
      inlets: (number | number[])[];
      params: Record<string, number>;
      buffers: Record<string, number[]>;
      mc_channel?: number;
    }
  ) {
    this.sr = config.sr;
    this.inletsConfig = config.inlets;
    for (const f of program.functions) this.functions.set(f.name, f);
    for (const s of program.statements) {
      if (s.kind === 'HistoryDecl') this.historyNames.add(s.name);
      else if (s.kind === 'ParamDecl') this.paramNames.add(s.name);
      else if (s.kind === 'BufferDecl') this.bufferNames.add(s.name);
    }
    this.statements = program.statements;
    for (const [name, val] of Object.entries(config.params)) {
      this.paramValues[name] = val;
    }
    this.buffers = { ...config.buffers };
    if (config.mc_channel != null) this.paramValues['mc_channel'] = config.mc_channel;
  }

  private toNumber(v: number | number[]): number {
    return Array.isArray(v) ? (v[0] ?? 0) : v;
  }

  initDeclarations(): void {
    for (const s of this.statements) {
      if (s.kind === 'HistoryDecl') {
        const init = this.toNumber(this.evalExpr(s.init));
        this.historyPrev[s.name] = init;
        this.historyNext[s.name] = init;
      } else if (s.kind === 'ParamDecl') {
        const def = this.toNumber(this.evalExpr(s.default));
        this.paramValues[s.name] = this.config.params[s.name] ?? def;
      }
      // BufferDecl: buffers already set from config; no init value needed
    }
  }

  setTickInlets(tick: number): void {
    this.inletValues = this.inletsConfig.map((v) =>
      typeof v === 'number' ? v : v[tick % v.length] ?? 0
    );
    // in / in1 alias
    this.vars['in'] = this.inletValues[0] ?? 0;
    this.vars['in1'] = this.inletValues[0] ?? 0;
    for (let i = 0; i < this.inletValues.length; i++) {
      this.vars[`in${i + 1}`] = this.inletValues[i] ?? 0;
    }
    // Params
    for (const [k, v] of Object.entries(this.paramValues)) {
      this.vars[k] = v;
    }
    // Constants
    this.vars['SAMPLERATE'] = this.sr;
    this.vars['pi'] = Math.PI;
    this.vars['PI'] = Math.PI;
    this.vars['mc_channel'] = this.config.params['mc_channel'] ?? BUILTIN_CONSTANTS.mc_channel;
    // History: read previous
    for (const name of this.historyNames) {
      this.vars[name] = this.historyPrev[name] ?? 0;
    }
  }

  runStatements(): void {
    for (const s of this.statements) {
      if (s.kind === 'HistoryDecl' || s.kind === 'ParamDecl' || s.kind === 'BufferDecl' || s.kind === 'RequireStmt') continue;
      this.runStatement(s);
    }
  }

  private runStatement(s: Statement): void {
    switch (s.kind) {
      case 'RequireStmt':
        break; // resolved at load time; no-op if present
      case 'Assignment': {
        let val: number | number[] = this.evalExpr(s.right);
        if (Array.isArray(s.left)) {
          const arr = Array.isArray(val) ? (val as number[]) : [val];
          s.left.forEach((id, i) => {
            const v = arr[i] ?? 0;
            this.vars[id] = v;
            if (this.historyNames.has(id)) this.historyNext[id] = v;
          });
        } else {
          const rightNum = Array.isArray(val) ? (val as number[])[0] ?? 0 : (val as number);
          const cur = this.vars[s.left] ?? 0;
          let final = rightNum;
          if (s.op === '+=') final = cur + rightNum;
          else if (s.op === '-=') final = cur - rightNum;
          else if (s.op === '*=') final = cur * rightNum;
          else if (s.op === '/=') final = rightNum === 0 ? 0 : cur / rightNum;
          this.vars[s.left] = final;
          if (this.historyNames.has(s.left)) this.historyNext[s.left] = final;
        }
        break;
      }
      case 'OutletAssignment': {
        const v = this.evalExpr(s.value);
        const n = Array.isArray(v) ? (v as number[])[0] ?? 0 : (v as number);
        this.outlets[s.outlet] = n;
        if (s.outlet > this.maxOutlet) this.maxOutlet = s.outlet;
        break;
      }
      case 'IfStmt': {
        if (this.evalExpr(s.cond)) {
          s.thenBody.forEach((st) => this.runStatement(st));
        } else {
          let done = false;
          for (const { cond, body } of s.elseIfs) {
            if (this.evalExpr(cond)) {
              body.forEach((st) => this.runStatement(st));
              done = true;
              break;
            }
          }
          if (!done && s.elseBody) s.elseBody.forEach((st) => this.runStatement(st));
        }
        break;
      }
      case 'ForStmt': {
        if (s.init) this.runStatement(s.init);
        for (;;) {
          if (s.cond && !this.evalExpr(s.cond)) break;
          let broke = false;
          for (const st of s.body) {
            this.runStatement(st);
            if ((st as { kind: string }).kind === 'BreakStmt') {
              broke = true;
              break;
            }
            if ((st as { kind: string }).kind === 'ContinueStmt') break;
          }
          if (broke) break;
          if (s.step) this.runStatement(s.step);
        }
        break;
      }
      case 'WhileStmt': {
        while (this.evalExpr(s.cond)) {
          for (const st of s.body) {
            this.runStatement(st);
            if ((st as { kind: string }).kind === 'BreakStmt') return;
          }
        }
        break;
      }
      case 'BreakStmt':
      case 'ContinueStmt':
        // Handled in ForStmt/WhileStmt
        break;
      case 'ReturnStmt':
        // Only inside user functions; not in top-level
        break;
      default:
        break;
    }
  }

  evalExpr(e: Expr): number | number[] {
    switch (e.kind) {
      case 'NumberLiteral':
        return e.value;
      case 'Identifier': {
        // History variables: read always yields previous sample
        if (this.historyNames.has(e.name)) {
          return this.historyPrev[e.name] ?? 0;
        }
        const v = this.vars[e.name];
        if (v !== undefined) return v;
        if (BUILTIN_CONSTANTS[e.name] !== undefined) return BUILTIN_CONSTANTS[e.name];
        return 0;
      }
      case 'BinaryExpr':
        return this.evalBinary(e);
      case 'UnaryExpr':
        return -this.evalNumber(e.operand);
      case 'TernaryExpr': {
        const c = this.evalExpr(e.cond);
        return (typeof c === 'number' ? c !== 0 : (c as number[])[0]) ? this.evalExpr(e.thenExpr) : this.evalExpr(e.elseExpr);
      }
      case 'CallExpr':
        return this.evalCall(e);
      default:
        return 0;
    }
  }

  private evalNumber(e: Expr): number {
    const v = this.evalExpr(e);
    return Array.isArray(v) ? (v[0] ?? 0) : (v as number);
  }

  private evalBinary(e: BinaryExpr): number {
    const l = this.evalNumber(e.left);
    const r = this.evalNumber(e.right);
    switch (e.op) {
      case '+': return l + r;
      case '-': return l - r;
      case '*': return l * r;
      case '/': return r === 0 ? 0 : l / r;
      case '<': return l < r ? 1 : 0;
      case '>': return l > r ? 1 : 0;
      case '<=': return l <= r ? 1 : 0;
      case '>=': return l >= r ? 1 : 0;
      case '==': return l === r ? 1 : 0;
      case '!=': return l !== r ? 1 : 0;
      case '&&': return (l !== 0 && r !== 0) ? 1 : 0;
      case '||': return (l !== 0 || r !== 0) ? 1 : 0;
      default:
        return 0;
    }
  }

  private evalCall(e: CallExpr): number | number[] {
    if (e.callee === 'peek' && e.args.length >= 2) {
      const bufName = this.resolveBufferName(e.args[0]);
      const idx = Math.floor(this.evalNumber(e.args[1]));
      const buf = this.buffers[bufName];
      if (buf && buf.length > 0) {
        const i = Math.max(0, Math.min(idx, buf.length - 1));
        return buf[i];
      }
      return 0;
    }
    const fn = BUILTINS[e.callee];
    if (fn) {
      const args = e.args.map((a) => this.evalNumber(a));
      const out = fn(...args);
      return Array.isArray(out) ? out : [out];
    }
    const userFn = this.functions.get(e.callee);
    if (userFn) {
      const args = e.args.map((a) => this.evalNumber(a));
      const saved: Record<string, number> = {};
      userFn.params.forEach((p, i) => {
        saved[p] = this.vars[p];
        this.vars[p] = args[i] ?? 0;
      });
      let ret: number[] = [0];
      for (const st of userFn.body) {
        if (st.kind === 'ReturnStmt') {
          ret = st.values.map((ex) => this.evalNumber(ex));
          break;
        }
        this.runStatement(st);
      }
      userFn.params.forEach((p) => {
        if (saved[p] !== undefined) this.vars[p] = saved[p];
      });
      return ret.length > 1 ? ret : ret[0];
    }
    return 0;
  }

  private resolveBufferName(e: Expr): string {
    if (e.kind === 'Identifier') return e.name;
    return '';
  }

  getOutlet(n: number): number {
    return this.outlets[n] ?? 0;
  }

  computeMaxOutlet(): number {
    let max = 1;
    for (const s of this.statements) {
      if (s.kind === 'OutletAssignment' && s.outlet > max) max = s.outlet;
    }
    return max;
  }

  advanceHistory(): void {
    for (const name of this.historyNames) {
      this.historyPrev[name] = this.historyNext[name] ?? this.historyPrev[name];
    }
  }
}
