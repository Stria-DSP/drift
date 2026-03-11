/**
 * AST node types for GenExpr.
 * Grammar follows GENEXPR_REFERENCE.md: functions first, then statements.
 */

export type Program = {
  kind: 'Program';
  functions: FunDecl[];
  statements: Statement[];
};

export type FunDecl = {
  kind: 'FunDecl';
  name: string;
  params: string[];
  body: Statement[];
};

// Statements
export type Statement =
  | HistoryDecl
  | ParamDecl
  | BufferDecl
  | RequireStmt
  | Assignment
  | OutletAssignment
  | IfStmt
  | ForStmt
  | WhileStmt
  | BreakStmt
  | ContinueStmt
  | ReturnStmt;

export type RequireStmt = {
  kind: 'RequireStmt';
  path: string; // module name (e.g. "exciter") -> resolved to same dir + ".genexpr"
};

export type HistoryDecl = {
  kind: 'HistoryDecl';
  name: string;
  init: Expr;
};

export type ParamDecl = {
  kind: 'ParamDecl';
  name: string;
  default: Expr;
};

export type BufferDecl = {
  kind: 'BufferDecl';
  name: string;
  bufferName: string; // string literal id for Max lookup
};

export type Assignment = {
  kind: 'Assignment';
  left: string | string[]; // single id or [id, id] for multi-assign
  op: '=' | '+=' | '-=' | '*=' | '/=';
  right: Expr;
};

export type OutletAssignment = {
  kind: 'OutletAssignment';
  outlet: number; // 1-based
  value: Expr;
};

export type IfStmt = {
  kind: 'IfStmt';
  cond: Expr;
  thenBody: Statement[];
  elseIfs: { cond: Expr; body: Statement[] }[];
  elseBody: Statement[] | null;
};

export type ForStmt = {
  kind: 'ForStmt';
  init: Assignment | null;
  cond: Expr | null;
  step: Assignment | null;
  body: Statement[];
};

export type WhileStmt = {
  kind: 'WhileStmt';
  cond: Expr;
  body: Statement[];
};

export type BreakStmt = { kind: 'BreakStmt' };
export type ContinueStmt = { kind: 'ContinueStmt' };

export type ReturnStmt = {
  kind: 'ReturnStmt';
  values: Expr[]; // one or more for multi-return
};

// Expressions
export type Expr =
  | NumberLiteral
  | Identifier
  | BinaryExpr
  | UnaryExpr
  | CallExpr
  | TernaryExpr;

export type NumberLiteral = {
  kind: 'NumberLiteral';
  value: number;
};

export type Identifier = {
  kind: 'Identifier';
  name: string;
};

export type BinaryExpr = {
  kind: 'BinaryExpr';
  op: BinaryOp;
  left: Expr;
  right: Expr;
};

export type BinaryOp =
  | '+'
  | '-'
  | '*'
  | '/'
  | '<'
  | '>'
  | '<='
  | '>='
  | '=='
  | '!='
  | '&&'
  | '||';

export type UnaryExpr = {
  kind: 'UnaryExpr';
  op: '-';
  operand: Expr;
};

export type CallExpr = {
  kind: 'CallExpr';
  callee: string;
  args: Expr[];
};

export type TernaryExpr = {
  kind: 'TernaryExpr';
  cond: Expr;
  thenExpr: Expr;
  elseExpr: Expr;
};
