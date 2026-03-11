/**
 * Recursive-descent parser for GenExpr.
 * Order: functions first, then statements (History, Param, Buffer, then rest).
 */

import type { Token } from './lexer';
import {
  type Program,
  type FunDecl,
  type Statement,
  type Expr,
  type HistoryDecl,
  type ParamDecl,
  type BufferDecl,
  type Assignment,
  type OutletAssignment,
  type IfStmt,
  type ForStmt,
  type WhileStmt,
  type ReturnStmt,
  type RequireStmt,
  type NumberLiteral,
  type Identifier,
  type BinaryExpr,
  type UnaryExpr,
  type CallExpr,
  type TernaryExpr,
} from './ast';

export class ParseError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number
  ) {
    super(`${message} at ${line}:${column}`);
    this.name = 'ParseError';
  }
}

export function parse(tokens: Token[]): Program {
  const p = new Parser(tokens);
  return p.parseProgram();
}

class Parser {
  private i = 0;

  constructor(private tokens: Token[]) {}

  private get current(): Token {
    return this.tokens[this.i] ?? this.tokens[this.tokens.length - 1];
  }

  private get type(): Token['type'] {
    return this.current.type;
  }

  private at(ty: Token['type']): boolean {
    return this.current.type === ty;
  }

  private consume(ty: Token['type']): Token {
    const t = this.current;
    if (t.type !== ty) {
      throw new ParseError(`Expected ${ty}, got ${t.type}`, t.line, t.column);
    }
    this.i++;
    return t;
  }

  private optional(ty: Token['type']): boolean {
    if (this.at(ty)) {
      this.i++;
      return true;
    }
    return false;
  }

  parseProgram(): Program {
    const functions: FunDecl[] = [];
    while (this.isFunDecl()) {
      functions.push(this.parseFunDecl());
    }
    const statements: Statement[] = [];
    while (!this.at('EOF')) {
      statements.push(this.parseStatement());
    }
    return { kind: 'Program', functions, statements };
  }

  private isFunDecl(): boolean {
    if (this.at('IDENT') && this.tokens[this.i + 1]?.type === 'LPAREN') {
      const name = this.current.value as string;
      // Function name cannot be a keyword that starts statements
      if (['History', 'Param', 'Buffer', 'if', 'for', 'while', 'return', 'break', 'continue'].includes(name)) return false;
      return true;
    }
    return false;
  }

  private parseFunDecl(): FunDecl {
    const name = this.consume('IDENT').value as string;
    this.consume('LPAREN');
    const params: string[] = [];
    if (!this.at('RPAREN')) {
      params.push(this.consume('IDENT').value as string);
      while (this.optional('COMMA')) {
        params.push(this.consume('IDENT').value as string);
      }
    }
    this.consume('RPAREN');
    this.consume('LBRACE');
    const body: Statement[] = [];
    while (!this.at('RBRACE')) {
      body.push(this.parseStatement());
    }
    this.consume('RBRACE');
    return { kind: 'FunDecl', name, params, body };
  }

  private parseStatement(): Statement {
    if (this.at('HISTORY')) {
      this.i++;
      const name = this.consume('IDENT').value as string;
      this.consume('LPAREN');
      const init = this.parseExpr();
      this.consume('RPAREN');
      this.optional('SEMI');
      return { kind: 'HistoryDecl', name, init };
    }
    if (this.at('PARAM')) {
      this.i++;
      const name = this.consume('IDENT').value as string;
      this.consume('LPAREN');
      const defaultExpr = this.parseExpr();
      this.consume('RPAREN');
      this.optional('SEMI');
      return { kind: 'ParamDecl', name, default: defaultExpr };
    }
    if (this.at('BUFFER')) {
      this.i++;
      const name = this.consume('IDENT').value as string;
      this.consume('LPAREN');
      const bufferName = this.at('STRING') ? (this.consume('STRING').value as string) : '';
      this.consume('RPAREN');
      this.optional('SEMI');
      return { kind: 'BufferDecl', name, bufferName };
    }
    if (this.at('REQUIRE')) {
      this.i++;
      let path: string;
      if (this.at('LPAREN')) {
        this.i++;
        path = this.consume('STRING').value as string;
        this.consume('RPAREN');
      } else {
        path = this.consume('STRING').value as string;
      }
      this.optional('SEMI');
      return { kind: 'RequireStmt', path };
    }
    if (this.at('IF')) {
      return this.parseIf();
    }
    if (this.at('FOR')) {
      return this.parseFor();
    }
    if (this.at('WHILE')) {
      return this.parseWhile();
    }
    if (this.at('BREAK')) {
      this.i++;
      this.optional('SEMI');
      return { kind: 'BreakStmt' };
    }
    if (this.at('CONTINUE')) {
      this.i++;
      this.optional('SEMI');
      return { kind: 'ContinueStmt' };
    }
    if (this.at('RETURN')) {
      this.i++;
      const values: Expr[] = [];
      if (!this.at('SEMI') && !this.at('RBRACE')) {
        values.push(this.parseExpr());
        while (this.optional('COMMA')) {
          values.push(this.parseExpr());
        }
      }
      this.optional('SEMI');
      return { kind: 'ReturnStmt', values };
    }

    // Assignment or outlet assignment: ident [ , ident ] = expr
    if (this.at('IDENT')) {
      const first = this.current.value as string;
      const isOutlet = /^out(\d*)$/.test(first) || first === 'out';
      if (isOutlet && this.tokens[this.i + 1]?.type === 'ASSIGN') {
        const outletNum = first === 'out' ? 1 : parseInt(first.slice(3) || '1', 10);
        this.i++;
        this.consume('ASSIGN');
        const value = this.parseExpr();
        this.optional('SEMI');
        return { kind: 'OutletAssignment', outlet: outletNum, value };
      }

      this.i++;
      if (this.at('COMMA')) {
        const left: string[] = [first];
        while (this.optional('COMMA')) {
          left.push(this.consume('IDENT').value as string);
        }
        this.consume('ASSIGN');
        const right = this.parseExpr();
        this.optional('SEMI');
        return { kind: 'Assignment', left, op: '=', right };
      }

      if (this.at('ASSIGN') || this.at('PLUS_ASSIGN') || this.at('MINUS_ASSIGN') || this.at('STAR_ASSIGN') || this.at('SLASH_ASSIGN')) {
        const op = this.current.type;
        this.i++;
        const opMap = { ASSIGN: '=', PLUS_ASSIGN: '+=', MINUS_ASSIGN: '-=', STAR_ASSIGN: '*=', SLASH_ASSIGN: '/=' } as const;
        const right = this.parseExpr();
        this.optional('SEMI');
        return { kind: 'Assignment', left: first, op: opMap[op as keyof typeof opMap], right };
      }

      throw new ParseError(`Expected assignment or statement after identifier ${first}`, this.current.line, this.current.column);
    }

    throw new ParseError(`Unexpected token ${this.type}`, this.current.line, this.current.column);
  }

  private parseIf(): IfStmt {
    this.consume('IF');
    this.consume('LPAREN');
    const cond = this.parseExpr();
    this.consume('RPAREN');
    this.consume('LBRACE');
    const thenBody: Statement[] = [];
    while (!this.at('RBRACE')) thenBody.push(this.parseStatement());
    this.consume('RBRACE');
    const elseIfs: { cond: Expr; body: Statement[] }[] = [];
    let elseBody: Statement[] | null = null;
    while (this.at('ELSE')) {
      this.i++;
      if (this.at('IF')) {
        this.i++;
        this.consume('LPAREN');
        const econd = this.parseExpr();
        this.consume('RPAREN');
        this.consume('LBRACE');
        const ebody: Statement[] = [];
        while (!this.at('RBRACE')) ebody.push(this.parseStatement());
        this.consume('RBRACE');
        elseIfs.push({ cond: econd, body: ebody });
      } else {
        this.consume('LBRACE');
        elseBody = [];
        while (!this.at('RBRACE')) elseBody.push(this.parseStatement());
        this.consume('RBRACE');
        break;
      }
    }
    return { kind: 'IfStmt', cond, thenBody, elseIfs, elseBody };
  }

  private parseFor(): ForStmt {
    this.consume('FOR');
    this.consume('LPAREN');
    let init: Assignment | null = null;
    if (!this.at('SEMI')) {
      const id = this.consume('IDENT').value as string;
      this.consume('ASSIGN');
      const right = this.parseExpr();
      init = { kind: 'Assignment', left: id, op: '=', right };
    }
    this.consume('SEMI');
    let cond: Expr | null = null;
    if (!this.at('SEMI')) cond = this.parseExpr();
    this.consume('SEMI');
    let step: Assignment | null = null;
    if (!this.at('RPAREN')) {
      const id = this.consume('IDENT').value as string;
      const op = this.current.type;
      if (op === 'PLUS_ASSIGN' || op === 'MINUS_ASSIGN' || op === 'STAR_ASSIGN' || op === 'SLASH_ASSIGN') {
        this.i++;
        const opMap = { PLUS_ASSIGN: '+=', MINUS_ASSIGN: '-=', STAR_ASSIGN: '*=', SLASH_ASSIGN: '/=' } as const;
        const right = this.parseExpr();
        step = { kind: 'Assignment', left: id, op: opMap[op as keyof typeof opMap], right };
      }
    }
    this.consume('RPAREN');
    this.consume('LBRACE');
    const body: Statement[] = [];
    while (!this.at('RBRACE')) body.push(this.parseStatement());
    this.consume('RBRACE');
    return { kind: 'ForStmt', init, cond, step, body };
  }

  private parseWhile(): WhileStmt {
    this.consume('WHILE');
    this.consume('LPAREN');
    const cond = this.parseExpr();
    this.consume('RPAREN');
    this.consume('LBRACE');
    const body: Statement[] = [];
    while (!this.at('RBRACE')) body.push(this.parseStatement());
    this.consume('RBRACE');
    return { kind: 'WhileStmt', cond, body };
  }

  private parseExpr(): Expr {
    return this.parseTernary();
  }

  private parseTernary(): Expr {
    const cond = this.parseLogicalOr();
    if (this.optional('QUESTION')) {
      const thenExpr = this.parseTernary();
      this.consume('COLON');
      const elseExpr = this.parseTernary();
      return { kind: 'TernaryExpr', cond, thenExpr, elseExpr };
    }
    return cond;
  }

  private parseLogicalOr(): Expr {
    let left = this.parseLogicalAnd();
    while (this.optional('OR')) {
      left = { kind: 'BinaryExpr', op: '||', left, right: this.parseLogicalAnd() };
    }
    return left;
  }

  private parseLogicalAnd(): Expr {
    let left = this.parseEquality();
    while (this.optional('AND')) {
      left = { kind: 'BinaryExpr', op: '&&', left, right: this.parseEquality() };
    }
    return left;
  }

  private parseEquality(): Expr {
    let left = this.parseComparison();
    while (true) {
      if (this.optional('EQ')) {
        left = { kind: 'BinaryExpr', op: '==', left, right: this.parseComparison() };
      } else if (this.optional('NE')) {
        left = { kind: 'BinaryExpr', op: '!=', left, right: this.parseComparison() };
      } else break;
    }
    return left;
  }

  private parseComparison(): Expr {
    let left = this.parseAdditive();
    while (true) {
      if (this.optional('LT')) {
        left = { kind: 'BinaryExpr', op: '<', left, right: this.parseAdditive() };
      } else if (this.optional('GT')) {
        left = { kind: 'BinaryExpr', op: '>', left, right: this.parseAdditive() };
      } else if (this.optional('LE')) {
        left = { kind: 'BinaryExpr', op: '<=', left, right: this.parseAdditive() };
      } else if (this.optional('GE')) {
        left = { kind: 'BinaryExpr', op: '>=', left, right: this.parseAdditive() };
      } else break;
    }
    return left;
  }

  private parseAdditive(): Expr {
    let left = this.parseMultiplicative();
    while (true) {
      if (this.optional('PLUS')) {
        left = { kind: 'BinaryExpr', op: '+', left, right: this.parseMultiplicative() };
      } else if (this.optional('MINUS')) {
        left = { kind: 'BinaryExpr', op: '-', left, right: this.parseMultiplicative() };
      } else break;
    }
    return left;
  }

  private parseMultiplicative(): Expr {
    let left = this.parseUnary();
    while (true) {
      if (this.optional('STAR')) {
        left = { kind: 'BinaryExpr', op: '*', left, right: this.parseUnary() };
      } else if (this.optional('SLASH')) {
        left = { kind: 'BinaryExpr', op: '/', left, right: this.parseUnary() };
      } else break;
    }
    return left;
  }

  private parseUnary(): Expr {
    if (this.optional('MINUS')) {
      return { kind: 'UnaryExpr', op: '-', operand: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expr {
    if (this.at('NUMBER')) {
      const value = this.current.value as number;
      this.i++;
      return { kind: 'NumberLiteral', value };
    }
    if (this.at('IDENT')) {
      const name = this.current.value as string;
      this.i++;
      if (this.at('LPAREN')) {
        this.i++;
        const args: Expr[] = [];
        if (!this.at('RPAREN')) {
          args.push(this.parseExpr());
          while (this.optional('COMMA')) {
            args.push(this.parseExpr());
          }
        }
        this.consume('RPAREN');
        return { kind: 'CallExpr', callee: name, args };
      }
      return { kind: 'Identifier', name };
    }
    if (this.optional('LPAREN')) {
      const e = this.parseExpr();
      this.consume('RPAREN');
      return e;
    }
    throw new ParseError(`Expected expression, got ${this.type}`, this.current.line, this.current.column);
  }
}
