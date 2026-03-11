import { parse } from '../src/parser';
import { tokenize } from '../src/lexer';
import { ParseError } from '../src/parser';

describe('parser', () => {
  function parseSource(s: string) {
    return parse(tokenize(s));
  }

  it('parses simple outlet assignment', () => {
    const prog = parseSource('out1 = in1 + in2;');
    expect(prog.functions).toHaveLength(0);
    expect(prog.statements).toHaveLength(1);
    expect(prog.statements[0].kind).toBe('OutletAssignment');
    if (prog.statements[0].kind === 'OutletAssignment') {
      expect(prog.statements[0].outlet).toBe(1);
      expect(prog.statements[0].value.kind).toBe('BinaryExpr');
    }
  });

  it('parses History and Param declarations', () => {
    const prog = parseSource(`
      History gate_prev(0.);
      Param decay(1.0);
      out1 = gate_prev;
    `);
    expect(prog.statements[0].kind).toBe('HistoryDecl');
    expect(prog.statements[1].kind).toBe('ParamDecl');
    expect(prog.statements[2].kind).toBe('OutletAssignment');
  });

  it('parses Buffer declaration', () => {
    const prog = parseSource('Buffer ratios("ratios");');
    expect(prog.statements[0].kind).toBe('BufferDecl');
    if (prog.statements[0].kind === 'BufferDecl') {
      expect(prog.statements[0].name).toBe('ratios');
      expect(prog.statements[0].bufferName).toBe('ratios');
    }
  });

  it('parses ternary and comparison', () => {
    const prog = parseSource('out1 = gate > 0.5 && gate_prev <= 0.5 ? 1. : 0.;');
    expect(prog.statements).toHaveLength(1);
    expect(prog.statements[0].kind).toBe('OutletAssignment');
    const val = (prog.statements[0] as { value: { kind: string } }).value;
    expect(val.kind).toBe('TernaryExpr');
  });

  it('parses function definition then statements', () => {
    const prog = parseSource(`
      add(a, b) {
        return a + b;
      }
      out1 = add(1., 2.);
    `);
    expect(prog.functions).toHaveLength(1);
    expect(prog.functions[0].name).toBe('add');
    expect(prog.functions[0].params).toEqual(['a', 'b']);
    expect(prog.statements).toHaveLength(1);
  });

  it('parses for loop', () => {
    const prog = parseSource(`
      out1 = 0.;
      for (i = 0; i < 10; i += 1) {
        out1 = out1 + 1.;
      }
    `);
    const forStmt = prog.statements.find((s) => s.kind === 'ForStmt');
    expect(forStmt).toBeDefined();
    if (forStmt?.kind === 'ForStmt') {
      expect(forStmt.init?.kind).toBe('Assignment');
      expect(forStmt.cond?.kind).toBe('BinaryExpr');
      expect(forStmt.step?.kind).toBe('Assignment');
    }
  });
});
