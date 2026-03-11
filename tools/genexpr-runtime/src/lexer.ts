/**
 * Lexer for GenExpr. Produces tokens for parser.
 * Handles: identifiers, float literals, comments, keywords, operators, string literals.
 */

export type TokenType =
  | 'NUMBER'
  | 'IDENT'
  | 'STRING'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACE'
  | 'RBRACE'
  | 'SEMI'
  | 'COMMA'
  | 'ASSIGN'
  | 'PLUS_ASSIGN'
  | 'MINUS_ASSIGN'
  | 'STAR_ASSIGN'
  | 'SLASH_ASSIGN'
  | 'LT'
  | 'GT'
  | 'LE'
  | 'GE'
  | 'EQ'
  | 'NE'
  | 'AND'
  | 'OR'
  | 'QUESTION'
  | 'COLON'
  | 'HISTORY'
  | 'PARAM'
  | 'BUFFER'
  | 'IF'
  | 'ELSE'
  | 'FOR'
  | 'WHILE'
  | 'BREAK'
  | 'CONTINUE'
  | 'RETURN'
  | 'REQUIRE'
  | 'EOF';

export type Token = {
  type: TokenType;
  value?: number | string;
  line: number;
  column: number;
};

const KEYWORDS: Record<string, TokenType> = {
  History: 'HISTORY',
  Param: 'PARAM',
  Buffer: 'BUFFER',
  if: 'IF',
  else: 'ELSE',
  for: 'FOR',
  while: 'WHILE',
  break: 'BREAK',
  continue: 'CONTINUE',
  return: 'RETURN',
  require: 'REQUIRE',
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let column = 1;

  function advance(): string {
    if (i >= source.length) return '';
    const c = source[i++];
    if (c === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    return c;
  }

  function peek(): string {
    return i < source.length ? source[i] : '';
  }

  function peek2(): string {
    return i + 1 < source.length ? source[i + 1] : '';
  }

  function add(type: TokenType, value?: number | string): void {
    tokens.push({ type, value, line, column });
  }

  while (i < source.length) {
    const startLine = line;
    const startCol = column;

    // Whitespace
    if (/[\s]/.test(source[i])) {
      advance();
      continue;
    }

    // Single-line comment
    if (source[i] === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') advance();
      continue;
    }

    // Multi-line comment
    if (source[i] === '/' && source[i + 1] === '*') {
      advance();
      advance();
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        advance();
      }
      if (i < source.length) advance();
      if (i < source.length) advance();
      continue;
    }

    // String literal "name"
    if (source[i] === '"') {
      advance();
      let s = '';
      while (i < source.length && source[i] !== '"') {
        if (source[i] === '\\') {
          advance();
          s += advance();
        } else {
          s += advance();
        }
      }
      if (peek() === '"') advance();
      add('STRING', s);
      continue;
    }

    // Numbers: 0.5, 1., 3.14159, 1e-6, 1e+2
    if (/[0-9.]/.test(source[i]) || (source[i] === '-' && i > 0 && /[0-9eE]/.test(source[i - 1]))) {
      let num = '';
      if (/[0-9]/.test(source[i]) || (source[i] === '.' && /[0-9]/.test(source[i + 1]))) {
        while (i < source.length && /[0-9.]/.test(source[i])) num += advance();
        if (source[i] === 'e' || source[i] === 'E') {
          num += advance();
          if (source[i] === '+' || source[i] === '-') num += advance();
          while (i < source.length && /[0-9]/.test(source[i])) num += advance();
        }
        const n = parseFloat(num);
        if (!Number.isNaN(n)) {
          add('NUMBER', n);
          continue;
        }
      }
    }

    // Two-char operators
    const two = source.slice(i, i + 2);
    if (two === '+=') {
      advance();
      advance();
      add('PLUS_ASSIGN');
      continue;
    }
    if (two === '-=') {
      advance();
      advance();
      add('MINUS_ASSIGN');
      continue;
    }
    if (two === '*=') {
      advance();
      advance();
      add('STAR_ASSIGN');
      continue;
    }
    if (two === '/=') {
      advance();
      advance();
      add('SLASH_ASSIGN');
      continue;
    }
    if (two === '<=') {
      advance();
      advance();
      add('LE');
      continue;
    }
    if (two === '>=') {
      advance();
      advance();
      add('GE');
      continue;
    }
    if (two === '==') {
      advance();
      advance();
      add('EQ');
      continue;
    }
    if (two === '!=') {
      advance();
      advance();
      add('NE');
      continue;
    }
    if (two === '&&') {
      advance();
      advance();
      add('AND');
      continue;
    }
    if (two === '||') {
      advance();
      advance();
      add('OR');
      continue;
    }

    // Single-char
    const c = source[i];
    switch (c) {
      case '+':
        advance();
        add('PLUS');
        break;
      case '-':
        advance();
        add('MINUS');
        break;
      case '*':
        advance();
        add('STAR');
        break;
      case '/':
        advance();
        add('SLASH');
        break;
      case '(':
        advance();
        add('LPAREN');
        break;
      case ')':
        advance();
        add('RPAREN');
        break;
      case '{':
        advance();
        add('LBRACE');
        break;
      case '}':
        advance();
        add('RBRACE');
        break;
      case ';':
        advance();
        add('SEMI');
        break;
      case ',':
        advance();
        add('COMMA');
        break;
      case '=':
        advance();
        add('ASSIGN');
        break;
      case '<':
        advance();
        add('LT');
        break;
      case '>':
        advance();
        add('GT');
        break;
      case '?':
        advance();
        add('QUESTION');
        break;
      case ':':
        advance();
        add('COLON');
        break;
      default:
        // Identifier or number starting with digit
        if (/[a-zA-Z_]/.test(c)) {
          let id = '';
          while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) id += advance();
          const kw = KEYWORDS[id];
          if (kw) add(kw);
          else add('IDENT', id);
          continue;
        }
        if (/[0-9]/.test(c)) {
          let num = '';
          while (i < source.length && /[0-9.eE+-]/.test(source[i])) {
            const next = source[i];
            if (next === 'e' || next === 'E') {
              num += advance();
              if (source[i] === '+' || source[i] === '-') num += advance();
            } else {
              num += advance();
            }
          }
          const n = parseFloat(num);
          add('NUMBER', Number.isNaN(n) ? 0 : n);
          continue;
        }
        advance(); // skip unknown char (or we could throw)
    }
  }

  add('EOF');
  return tokens;
}
