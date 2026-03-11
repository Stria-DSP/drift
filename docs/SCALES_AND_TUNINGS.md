# Sequencer: scales, tunings, and flexible range

High-level spec for constraining the sequencer to **scales**, **tunings**, and a **flexible pitch range**. Playhead output (and optionally the step grid) stays within the chosen scale and range; tuning maps scale degrees to **frequency** for the bar synth (no MIDI).

---

## 1. Scale

**Goal:** All output pitches belong to a user-chosen **scale** (set of intervals from a root).

**Parameters:**

- **Root:** Note name or pitch number (e.g. C = 60, or 0–11 for root pitch class). Determines the “key.”
- **Scale type:** Which set of intervals (in semitones from root) defines the scale. Examples:
  - **Diatonic:** Major (0 2 4 5 7 9 11), Natural minor (0 2 3 5 7 8 10), Harmonic minor, Melodic minor, Dorian, Phrygian, Lydian, Mixolydian, etc.
  - **Pentatonic:** Major pentatonic (0 2 4 7 9), Minor pentatonic (0 3 5 7 10), etc.
  - **Other:** Whole tone, diminished (octatonic), hexatonic, user-defined (list of semitone offsets).
- **Implementation:** A **scale** = root (pitch class) + ordered list of **degrees** (0 = root, 1 = second degree, …) each with a **semitone offset** from root (in 12-TET) or a **ratio** (in JI). For 12-TET, store e.g. `[0, 2, 4, 5, 7, 9, 11]`; lookups are “nearest degree” then root + offset.

**Quantize:** Given a raw pitch (from the pattern or playhead), **snap to nearest scale degree** (in the current scale + root). Then express as (degree, octave) or as a pitch in the current tuning (see below).

---

## 2. Tuning

**Goal:** Map scale degrees (and octave) to **frequency** for the bar synth. Supports 12-TET and non–12-TET tunings (no MIDI).

**Options:**

- **12-TET (equal temperament):** Pitch = root + degree_offset + octave×12. Frequency = 440 × 2^((pitch − 69)/12). **mtof** for the bar.
- **Just intonation (JI):** Each scale degree has a **ratio** to the root (e.g. major: 1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8). Frequency = root_freq × ratio × 2^octave. Ratio table per scale type (and optionally per root for key-based JI).- **Other temperaments:** Meantone, Werckmeister, etc. — table of cent offsets (or ratios) per degree; apply to a base frequency.

**Parameters:**

- **Tuning type:** 12-TET, JI (e.g. key-based), or a small set of presets (Meantone, etc.).
- **Reference:** Root frequency (e.g. A4 = 440 Hz) or “concert pitch” so root and octave resolve to Hz.

**Data flow:** Scale + root + range → allowed pitches (as degrees + octaves). When outputting a note: (degree, octave) + tuning → **frequency** (for bar).

---

## 3. Flexible range

**Goal:** The sequencer operates in a **bounded pitch range** so the step grid and playheads only use notes within that range.

**Parameters:**

- **Range mode (choose one or combine):**
  - **Root + span:** Root note (or pitch class) + “span” in octaves (e.g. 1, 2, 3) or in semitones (e.g. 12, 24). Allowed set = scale degrees in [root, root + span].
  - **Low / high note:** Explicit lowest and highest note (pitch number or note name). Allowed set = scale degrees that fall within [low, high].
- **Flexible:** User can set root to C and span to 2 octaves, or root to F and span to 24 semitones, or low = 48, high = 84, etc. Range is then the intersection of “scale” and “range.”

**Step grid behaviour:**

- **Option A:** Steps store **scale degree + octave** (or index into “allowed notes” list). Multislider / toggles edit within the allowed set only (e.g. 0–N−1 for N notes in range).
- **Option B:** Steps store **raw pitch** (e.g. 0–127 or semitone index); when reading, **quantize to nearest scale degree within range** before output. Grid can show note names or degrees; input is clamped/snapped to range.

**Playhead output:** Whatever is read from the pattern (degree or raw pitch) is **quantized to scale** and **clamped to range**, then passed through **tuning** to **frequency** (for the bar).

---

## 4. Implementation outline (Max)

- **Scale:** Store current scale as a list of semitone offsets (or a **coll** / **dict**). Root = 0–11 (pitch class). **Quantize:** Given pitch P, find nearest P' in { root + offset + 12*k } for k in octave range and offset in scale; output (degree, octave) or P'.
- **Range:** Two numbers or root + span. Build list of “allowed” pitches (scale degrees in range) once when scale/root/range change; use for grid and quantize.
- **Tuning:**  
  - **12-TET:** **mtof** for bar.  
  - **JI (or other):** Table of ratios (or cent offsets). frequency = ref × ratio × 2^octave.
- **UI:** Scale menu (e.g. Major, Minor, Pentatonic, …), Root menu or dial, Tuning menu (12-TET, JI, …), Range (low/high or root + span). Optional: transpose (adds offset to root or range).

---

## 5. Summary

| Concept    | Purpose |
|-----------|---------|
| **Scale** | Set of allowed intervals (e.g. major, minor, pentatonic); root sets the key. |
| **Quantize** | Snap any pitch to the nearest scale degree (within range). |
| **Range** | Lowest and highest allowed note (or root + span). Constrains grid and output. |
| **Tuning** | Map (degree, octave) → frequency (12-TET, JI, etc.) for the bar. |

Result: User picks scale, root, tuning, and range; the sequencer only outputs notes in that scale and range, with the chosen tuning applied as **frequency** for the bar synth.
