#!/usr/bin/env node
/**
 * CLI for GenExpr runtime: run a .genexpr or .codebox file and print outlet arrays.
 * Usage: genexpr run <file> [--samples N] [--sr N] [--in1 v] [--in2 v] ... [--param name v] [--buffer name=val1,val2,...] [--format csv|values]
 */

import * as fs from 'fs';
import * as path from 'path';
import { run, loadAndRun, ParseError } from './index';
import type { RunOptions } from './interpreter';

function parseArgs(argv: string[]): { file: string; options: RunOptions; format: string } {
  const args = argv.slice(2);
  let file = '';
  const options: RunOptions = { samples: 1024 };
  let format = 'values';

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === 'run' && !file && args[i + 1] && !args[i + 1].startsWith('--')) {
      file = args[++i];
      continue;
    }
    if (a === 'run' && file) continue;
    if (!a.startsWith('--') && !file) {
      file = a;
      continue;
    }
    if (a === '--samples' && args[i + 1] != null) {
      options.samples = parseInt(args[++i], 10);
      continue;
    }
    if (a === '--sr' && args[i + 1] != null) {
      options.sr = parseInt(args[++i], 10);
      continue;
    }
    if (a === '--format' && args[i + 1] != null) {
      format = args[++i];
      continue;
    }
    if (a === '--noiseSeed' && args[i + 1] != null) {
      options.noiseSeed = parseInt(args[++i], 10);
      continue;
    }
    if (a === '--mc_channel' && args[i + 1] != null) {
      options.mc_channel = parseInt(args[++i], 10);
      continue;
    }
    if (a.startsWith('--in')) {
      const num = a.slice(4) || '1';
      const n = parseInt(num, 10);
      if (!Number.isNaN(n) && args[i + 1] != null) {
        const val = args[++i];
        const v = parseFloat(val);
        if (!options.inlets) options.inlets = [];
        while (options.inlets.length < n) options.inlets.push(0);
        options.inlets[n - 1] = Number.isNaN(v) ? 0 : v;
      }
      continue;
    }
    if (a === '--param' && args[i + 1] != null && args[i + 2] != null) {
      const name = args[++i];
      const val = parseFloat(args[++i]);
      if (!options.params) options.params = {};
      options.params[name] = Number.isNaN(val) ? 0 : val;
      continue;
    }
    if (a.startsWith('--buffer') && a.includes('=')) {
      const eq = a.indexOf('=');
      const name = a.slice(8, eq).trim();
      const rest = a.slice(eq + 1);
      const vals = rest.split(',').map((s) => parseFloat(s.trim()));
      if (!options.buffers) options.buffers = {};
      options.buffers[name] = vals.filter((v) => !Number.isNaN(v));
      continue;
    }
    if (a === '--buffer' && args[i + 1] != null) {
      const spec = args[++i];
      const eq = spec.indexOf('=');
      if (eq >= 0) {
        const name = spec.slice(0, eq).trim();
        const rest = spec.slice(eq + 1);
        const vals = rest.split(',').map((s) => parseFloat(s.trim()));
        if (!options.buffers) options.buffers = {};
        options.buffers[name] = vals.filter((v) => !Number.isNaN(v));
      }
      continue;
    }
  }

  return { file, options, format };
}

function printResult(result: Record<string, number[]>, format: string): void {
  const keys = Object.keys(result).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10);
    const nb = parseInt(b.replace(/\D/g, ''), 10);
    return na - nb;
  });
  if (format === 'csv') {
    const len = result[keys[0]]?.length ?? 0;
    console.log(keys.join(','));
    for (let i = 0; i < len; i++) {
      console.log(keys.map((k) => result[k][i]).join(','));
    }
    return;
  }
  if (format === 'values') {
    for (const k of keys) {
      const arr = result[k];
      const tail = arr.length > 10 ? arr.slice(-10) : arr;
      console.log(`${k}: length=${arr.length} last=${tail.join(' ')}`);
    }
    return;
  }
  // raw: one line per outlet, space-separated
  for (const k of keys) {
    console.log(result[k].join(' '));
  }
}

function main(): void {
  const { file, options, format } = parseArgs(process.argv);
  if (!file) {
    console.error('Usage: genexpr run <file.codebox|file.genexpr> [--samples N] [--sr N] [--in1 v] [--param name v] [--buffer name=val1,val2,...] [--format csv|values|raw]');
    process.exit(1);
  }
  const resolved = path.resolve(process.cwd(), file);
  if (!fs.existsSync(resolved)) {
    console.error('File not found:', resolved);
    process.exit(1);
  }
  try {
    const result = loadAndRun(resolved, options);
    printResult(result, format);
  } catch (err) {
    if (err instanceof ParseError) {
      console.error('Parse error:', err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
