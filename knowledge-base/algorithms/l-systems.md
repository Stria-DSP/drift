# L-Systems (Lindenmayer Systems)

**Tags**: #l-systems #generative #algorithmic-composition #recursion #fractal
**Related**: [[Recursive Structures]], [[Nested Tuplets]], [[Generative Grammar]]
**Context**: Future product (Fold or similar), fractal/recursive sequencing

## Summary

L-systems are string-rewriting systems invented by Aristid Lindenmayer (1968) for modeling plant growth. In music: a seed pattern (axiom) + replacement rules → self-similar, branching structures. Deterministic, not random; one seed grows into complex patterns with fractal/recursive character. Used for melody, rhythm, or both.

## Core Concept

### Basic Components

1. **Alphabet**: Set of symbols (e.g. A, B, C, +, -)
2. **Axiom**: Starting string (e.g. "A")
3. **Production rules**: How to replace each symbol (e.g. A → AB, B → A)
4. **Iterations**: How many times to apply rules (depth)

### Example: Fibonacci

**Axiom**: `A`
**Rules**: `A → AB`, `B → A`

| Iteration | String | Length |
|-----------|--------|--------|
| 0 | A | 1 |
| 1 | AB | 2 |
| 2 | ABA | 3 |
| 3 | ABAAB | 5 |
| 4 | ABAABABA | 8 |
| 5 | ABAABABAABAAB | 13 |

Result: Fibonacci sequence in string length; self-similar structure.

### Mapping to Music

#### Melody (Pitch)

- Each symbol → note or pitch class
- Example: A=C, B=E, C=G
- String "ABAAB" → melody C-E-C-C-E

#### Rhythm (Duration)

- Each symbol → duration or tuplet
- Example: A=quarter, B=eighth
- String "ABAAB" → rhythm ♩♪♩♩♪

#### Nested Tuplets

- Each symbol → tuplet type (3:2, 5:4, 7:4)
- L-system determines **nesting structure**
- Example: A → 3:2 (triplet), B → 5:4 (quintuplet)
- String "ABA" → 3-tuplet, 5-tuplet, 3-tuplet at top level; recursion nests them

## Musical Applications

### Melody Generation

**Pattern**: Seed = 2–4 notes; rules expand into longer melody.

**Example**:
- Axiom: `A`
- Rules: `A → ABC`, `B → BA`, `C → C`
- Map: A=C4, B=E4, C=G4

| Iteration | String | Melody |
|-----------|--------|--------|
| 0 | A | C |
| 1 | ABC | C-E-G |
| 2 | ABCBAC | C-E-G-E-C-G |
| 3 | ABCBACBAABCC | C-E-G-E-C-G-E-C-C-E-G-G |

Result: Self-similar melody; recognizable motifs at multiple scales.

### Rhythm Generation

**Pattern**: Symbols → durations; L-system creates rhythmic cells.

**Example**:
- Axiom: `A`
- Rules: `A → ABB`, `B → A`
- Map: A=quarter, B=eighth

| Iteration | String | Rhythm |
|-----------|--------|--------|
| 0 | A | ♩ |
| 1 | ABB | ♩♪♪ |
| 2 | ABBAABBA | ♩♪♪♩♩♪♪♩ |

### Nested Tuplet Structure

**Pattern**: Symbols → tuplet types; recursion = nested time divisions.

**Example**:
- Axiom: `A`
- Rules: `A → AB`, `B → A`
- Map: A = 3:2, B = 5:4
- Recursion depth: 2

**Level 0**: One span (1 bar)
**Level 1 (apply rules)**: `AB` → divide bar into 3:2, then 5:4
**Level 2 (apply rules again)**: Each 3:2 slot becomes `AB` (3:2, 5:4); each 5:4 slot becomes `A` (3:2)

Result: Polyrhythmic, fractal time structure.

## Design Patterns for Music Tools

### Pattern 1: Pitch + Rhythm from Same L-System

- One L-system generates string
- Dual mapping: symbol → (pitch, duration)
- Example: A → (C4, quarter), B → (E4, eighth)
- Result: Melody and rhythm share same structure (unified)

### Pattern 2: Separate L-Systems for Pitch and Rhythm

- L-system 1 → pitch sequence
- L-system 2 → rhythm sequence
- Combine: zip pitch[i] with duration[i]
- Result: Independent control; more flexible

### Pattern 3: L-System + Scale Quantization

- L-system generates interval pattern (e.g. +2, -1, +3)
- Start at root note; apply intervals
- Quantize to scale (e.g. C major)
- Result: Melodic contour from L-system, harmony from scale

### Pattern 4: Nested Tuplets Only

- L-system determines **time structure** (no pitch)
- Pitch from user input or another algorithm
- Result: Polyrhythm generator (rhythm-focused L-system)

## Parameters for UI

| Parameter | Effect | Range/Type |
|-----------|--------|------------|
| **Axiom** | Starting seed | String (e.g. "A", "AB", "ABC") |
| **Rules** | Replacement logic | 1–3 rules (e.g. A→AB, B→A) |
| **Depth** | Iterations / recursion | 1–10 (higher = longer/more complex) |
| **Symbol mapping** | Pitch or duration per symbol | User-defined or preset |
| **Scale** | Quantize output | Root + scale type |
| **Length cap** | Max notes or duration | e.g. 64 notes, 4 bars |

## Advantages

- **Deterministic**: Same axiom + rules + depth → same output; no randomness
- **Self-similar**: Recognizable motifs at multiple scales (fractal character)
- **Compact**: Small seed + simple rules → long, complex patterns
- **Transparent**: User sees and controls the grammar; not a black box
- **Musical**: Bach-like canons, Baroque sequences → self-similarity is musical tradition

## Challenges

1. **Exponential growth**: String length doubles or triples per iteration. Need length cap or pruning.
2. **Mapping ambiguity**: How to map symbols to pitch/rhythm? Multiple valid approaches.
3. **UI complexity**: Defining rules in a GUI (not code) is non-trivial. Preset library helps.
4. **Musical coherence**: Not all L-systems sound good. Need curated rules or constraints (e.g. scale quantization).

## Implementation

### Algorithm

```python
def l_system(axiom, rules, depth):
    current = axiom
    for i in range(depth):
        next_string = ""
        for symbol in current:
            if symbol in rules:
                next_string += rules[symbol]
            else:
                next_string += symbol  # identity rule
        current = next_string
    return current

# Example
axiom = "A"
rules = {"A": "AB", "B": "A"}
depth = 4

result = l_system(axiom, rules, depth)
# Result: "ABAABABA"
```

### Max/MSP Implementation

- Use `coll` or `dict` to store rules
- Use `uzi` or recursion (`js` or `node.script`) to iterate
- Map symbols to MIDI notes using `coll` or `table`
- Output as step sequence or real-time MIDI

### gen~ (Not Ideal)

L-systems are **discrete**, not audio-rate. Better in Max control rate or `js`/`node.script`.

## Examples from Literature

### Music

- **Tom Johnson** (*Rational Melodies*, *Self-Similar Melodies*): Strict self-similar processes, including L-systems
- **Charles Ames**: Algorithmic composition software using L-systems for melody and structure
- **Iannis Xenakis**: Used stochastic and deterministic grammars (not pure L-systems, but related)

### Biology / Visuals

- Original use: Model plant growth (branching, leaves)
- Computer graphics: Fractal trees, ferns, landscapes

## Related Techniques

### Recursive Subdivision (Not L-System)

- Top-down: Start with full span, subdivide recursively (binary tree, golden ratio)
- L-system is bottom-up: Start with seed, expand by rules
- Both create self-similar structures; different approaches

### Markov Chains

- Probabilistic: Transition from state A → B with probability p
- L-system is deterministic: A always → AB (if that's the rule)
- Can combine: Stochastic L-system (multiple rules per symbol, chosen by probability)

## Future Product: "Fold" (Working Title)

**One-liner**: Fractal composition from one seed using L-system grammar.

**Features**:
- User defines axiom (2–4 notes or symbols)
- 1–3 production rules (e.g. A→AB, B→AC, C→A)
- Recursion depth slider (1–8)
- Dual mapping: symbols → pitch + rhythm
- Scale quantization
- Output: MIDI sequencer or live generation

**UI**:
- Simple rule editor (symbol + replacement string)
- Preview: Show string growth per iteration (like Fibonacci example)
- Mapping: Symbol → note name or interval; symbol → duration
- Optional: Preset library (Bach-like, Fibonacci, branching, etc.)

**Differentiation**: Not random, not grid; explicit generative grammar. "Grow a piece from one idea."

## References

- **Lindenmayer, Aristid**: *The Algorithmic Beauty of Plants* (1990) — classic reference
- **Tom Johnson**: *Self-Similar Melodies* — music using strict self-similar processes
- **Wikipedia**: "L-system" — algorithm, examples, notation
- **Music software**: AlgoScore, ORCA, others have L-system modes
- **Academic papers**: "L-systems in music composition" (various authors; Google Scholar)

## Related Concepts

- [[Recursive Structures]]
- [[Nested Tuplets]]
- [[Generative Grammar]]
- [[Fractal Structures in Music]]
- [[Self-Similarity]]
