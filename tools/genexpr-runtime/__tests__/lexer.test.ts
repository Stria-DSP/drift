import { tokenize } from '../src/lexer';

describe('lexer', () => {
  it('tokenizes numbers', () => {
    const t = tokenize('0.5 1. 3.14159 1e-6');
    expect(t.filter((x) => x.type === 'NUMBER').map((x) => x.value)).toEqual([0.5, 1, 3.14159, 1e-6]);
  });

  it('tokenizes identifiers and keywords', () => {
    const t = tokenize('History Param decay gate_prev');
    expect(t.map((x) => (x.type === 'IDENT' || x.type === 'HISTORY' || x.type === 'PARAM' ? (x.value ?? x.type) : x.type))).toEqual([
      'HISTORY',
      'PARAM',
      'decay',
      'gate_prev',
      'EOF',
    ]);
  });

  it('tokenizes operators', () => {
    const t = tokenize('+= -= * = < <= == && ? :');
    expect(t.map((x) => x.type)).toEqual([
      'PLUS_ASSIGN',
      'MINUS_ASSIGN',
      'STAR',
      'ASSIGN',
      'LT',
      'LE',
      'EQ',
      'AND',
      'QUESTION',
      'COLON',
      'EOF',
    ]);
  });

  it('skips single-line comments', () => {
    const t = tokenize('in1 // comment\nout1 = 1.');
    expect(t.map((x) => x.type)).toContain('IDENT');
    expect(t.find((x) => x.type === 'NUMBER')?.value).toBe(1);
  });

  it('skips multi-line comments', () => {
    const t = tokenize('/* skip \n all */ out1 = 2.');
    expect(t.filter((x) => x.type === 'NUMBER')[0]?.value).toBe(2);
  });

  it('tokenizes string literals for Buffer', () => {
    const t = tokenize('Buffer ratios("ratios");');
    expect(t.find((x) => x.type === 'STRING')?.value).toBe('ratios');
  });
});
