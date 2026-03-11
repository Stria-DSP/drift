/**
 * GenExpr runtime API for Jest and CLI.
 * Parse and run .genexpr / .codebox source with controlled inputs; return outlet arrays.
 */

import * as path from 'path';
import { tokenize } from './lexer';
import { parse, ParseError } from './parser';
import { runGenExpr, type RunOptions, type RunResult } from './interpreter';
import type { Program, FunDecl, Statement } from './ast';

export { ParseError, RunOptions, RunResult };

/**
 * Run GenExpr source for N samples. Returns outlet arrays (out1, out2, ...).
 */
export function run(source: string, options: RunOptions): RunResult {
  const program = parseSource(source);
  return runGenExpr(program, options);
}

/**
 * Parse source to AST (for tests or debugging).
 */
export function parseSource(source: string): Program {
  const tokens = tokenize(source);
  return parse(tokens);
}

/**
 * Resolve require statements: load required .genexpr files, merge their functions,
 * and return a program with only non-RequireStmt statements.
 */
function resolveRequires(
  program: Program,
  basePath: string,
  fsModule: { readFileSync: (path: string, encoding: string) => string },
  loaded: Set<string>
): Program {
  const functions: FunDecl[] = [...program.functions];
  const statements: Statement[] = [];

  for (const s of program.statements) {
    if (s.kind === 'RequireStmt') {
      const key = s.path;
      if (loaded.has(key)) continue;
      loaded.add(key);
      const resolved = path.join(path.dirname(basePath), `${s.path}.genexpr`);
      const source = fsModule.readFileSync(resolved, 'utf8');
      const required = parse(tokenize(source));
      const merged = resolveRequires(required, resolved, fsModule, loaded);
      functions.push(...merged.functions);
      continue;
    }
    statements.push(s);
  }

  return { kind: 'Program', functions, statements };
}

/**
 * Load a .genexpr or .codebox file and run it.
 * require "name" in source loads name.genexpr from the same directory and merges its functions.
 */
export function loadAndRun(
  filePath: string,
  options: RunOptions,
  fsModule: { readFileSync: (path: string, encoding: string) => string } = require('fs')
): RunResult {
  const source = fsModule.readFileSync(filePath, 'utf8');
  const program = parse(tokenize(source));
  const resolved = resolveRequires(program, filePath, fsModule, new Set());
  return runGenExpr(resolved, options);
}
