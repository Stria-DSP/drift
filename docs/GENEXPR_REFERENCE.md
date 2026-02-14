# GenExpr language reference

**Unofficial; for project use.** This document is derived from Cycling '74 documentation and from GenExpr usage in this repo. The authoritative source is [GenExpr (Cycling '74)](https://docs.cycling74.com/userguide/gen/gen_genexpr).

---

## 1. Lexical structure

### Identifiers

- Start with a letter (`a`–`z`, `A`–`Z`) or underscore (`_`).
- After the first character: any number of letters, digits (`0`–`9`), or underscores.
- Function and abstraction names used as GenExpr functions must be valid identifiers; characters such as `~` or `.` in patcher names are not valid in GenExpr identifiers.

### Numeric literals

- Floating-point only (e.g. `0.5`, `1.`, `3.14159`, `1e-6`). The language is typeless; the compiler infers types from context and domain (e.g. gen~ audio).

### Comments

- Single-line: `//` to end of line.
- Multi-line: `/* ... */`.

### Reserved / special names

- **Inlets:** `in`, `in1`, `in2`, … `inN` (`in` is an alias for `in1`).
- **Outlets:** `out`, `out1`, `out2`, … `outN` (`out` is an alias for `out1`).
- **State:** `History` (declaration; see §3).
- **Parameters:** `Param` (declaration; see §4).

---

## 2. Syntax (grammar-style)

### Top-level order

1. **Function definitions** — All function definitions must appear first. No statements (including simple assignments) may appear before the last function definition.
2. **Statements** — Assignments, `out1 = ...`, and any other executable code follow.

### Functions

- **No `function` keyword.** Define with name and parameter list only:

  ```text
  name(arg1, arg2, ...) {
    statements;
    return expr;
  }
  ```

- **Multiple return values:** `return a, b;` and assign with `x, y = name(...);`.
- Arguments are untyped (name only). Functions must be declared before all statements.

### Statements

- **Assignment:** `identifier = expr;`
- **Multi-assign (single call):** `a, b = func();` — the only allowed multi-assignment on one line; the right-hand side is a single function call returning multiple values.
- **Outlet assignment:** `out1 = expr;` (or `out2`, etc.).
- **Semicolons:** Required when there are multiple statements. A single statement (e.g. one expression or one assignment) may omit the trailing semicolon.

### Expressions

- Literals, identifiers, function calls `func(args)`, binary operators (`+`, `-`, `*`, `/`, etc.), ternary `cond ? exprTrue : exprFalse`, and comma-separated lists on the right-hand side for multi-value assignment.
- **One assignment per line:** Do not write `a = 1, b = 2;`. Use separate lines. Exception: `a, b = f();` (one call, multiple return values).

### Variables

- **No `var` (or `let`/`const).** Variables are created by assignment and are local to scope. Do not use a declaration keyword.

---

## 3. State and I/O

### Inlets and outlets

- The codebox (or expr) object infers the number of inlets and outlets from the highest `inN` and `outN` used in the code.
- `in` and `out` are equivalent to `in1` and `out1`.

### One-sample delay (state)

Two forms exist; which is available depends on context (e.g. codebox vs expr, or gen~ version).

- **History declaration (codebox):**  
  `History name(initial_value);`  
  Declare one or more state variables with an initial value. Reading `name` yields the value from the previous sample; assigning to `name` stores the value for the next sample. This form is used in this project (e.g. in `modal_bar.codebox`) and is the one to use when the codebox reports that `history` is undeclared.

- **history(x) function (some contexts):**  
  In some GenExpr contexts (e.g. expr or certain gen~ setups), a function `history(identifier)` returns the previous sample’s value for that named variable. If your codebox reports “use of undeclared identifier 'history'”, use the `History` declaration form instead.

---

## 4. Parameters

- **Param:** `Param name(default_value);` (capital `P`; default value in parentheses). Example: `Param decay(1.0);`
- Parameters behave like gen [param](https://docs.cycling74.com/reference/gen_common_param/) operators. From Max, use `setparam` to set them. They may only be declared in the main body where inlets/outlets exist.

---

## 5. Control flow

- **Branching:** `if (cond) { ... }`, `else if (cond) { ... }`, `else { ... }` (optional chaining).
- **Loops:**
  - `for (init; cond; step) { ... }` — e.g. `for (i = 0; i < 10; i += 1) { ... }`. There is no `++` operator; use `i += 1`.
  - `while (cond) { ... }`
- **Loop control:** `break` (exit loop), `continue` (next iteration).
- **Floating-point loop bounds:** Loop counters and bounds are floating-point. For conditions like `i <= 1` with a step such as `0.05`, rounding can prevent the last iteration; use a small tolerance if needed (e.g. `i <= 1.04`).

---

## 6. Modules and abstractions

### require

- Load definitions from a `.genexpr` file: `require "name"` or `require("name");` (with or without parentheses and semicolon). The loader looks for `name.genexpr` on the Max search path. Required files are loaded once even if required multiple times.

### Abstractions as functions

- An unresolved identifier that is not a built-in operator can be resolved as a Gen abstraction: the interpreter looks for `name.gendsp` (gen~) or `name.genjit` (Jitter gen) on the search path. The abstraction name must be a valid GenExpr identifier (no `~`, `.`, etc.).

---

## 7. Operators and built-ins

Almost every Gen object that can be created in a Gen patcher is available in GenExpr as a function. The number of arguments matches the object’s inlets; multiple return values match multiple outlets.

**Examples:** `cos`, `sin`, `exp`, `abs`, `tanh`, `clamp`, `noise`, `atan2`, etc. See the gen~ and gen reference for the full set.

**Attributes:** Some operators accept key/value attributes (e.g. `boundmode= "mirror"`). Attribute values must be constants when used with built-in operators.

- **Full list:** [gen~ operators](https://docs.cycling74.com/userguide/gen/gen~_operators), [expr](https://docs.cycling74.com/reference/gen_common_expr), [codebox](https://docs.cycling74.com/reference/gen_common_codebox).

---

## 8. Technical notes

- **Typeless:** Variables have no explicit type; the compiler infers types from the Gen domain and usage.
- **No arrays:** There is no array type and no `[index]` notation.
- **Multiple-return assignment:** If the left-hand side has more names than the right-hand side has values, the extra names are assigned zero. Only the last expression on the right-hand side may expand to multiple values; other expressions’ extra return values are discarded.

---

## 9. References

- [GenExpr (Cycling '74)](https://docs.cycling74.com/userguide/gen/gen_genexpr) — main language documentation
- [expr (Gen Reference)](https://docs.cycling74.com/reference/gen_common_expr)
- [codebox (Gen Reference)](https://docs.cycling74.com/reference/gen_common_codebox)
- [gen~ operators](https://docs.cycling74.com/userguide/gen/gen~_operators)
- In this project: [.cursor/rules/genexpr-syntax.mdc](../.cursor/rules/genexpr-syntax.mdc) for common errors and fixes when editing `.codebox` / `.genexpr` files
