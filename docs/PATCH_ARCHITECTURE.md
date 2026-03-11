# Drifter — high-level patch architecture

Block diagram of the Max for Live device: clock, playheads, pattern store, bar synth, and signal chain. For object-level detail see [.cursor/rules/planedrifter-max.mdc](../.cursor/rules/planedrifter-max.mdc) and [PROJECT_BRIEF.md](../PROJECT_BRIEF.md).

---

## Mermaid diagram

```mermaid
flowchart TB
  subgraph clock["Clock & playheads"]
    transport["transport"]
    phasor1["phasor~ (master)"]
    phasor2["phasor~ (playhead 2)"]
    transport --> phasor1
    transport --> phasor2
    phasor1 --> mult1["*~ num_steps"]
    mult1 --> trunc1["trunc~"]
    trunc1 --> change1["change~"]
    change1 --> idx1["step index 1"]
    phasor2 --> opt["+~ offset, +~ LFO, wrap~ 0 1"]
    opt --> subdiv["subdiv~"]
    subdiv --> what["what~"]
    what --> idx2["step index 2"]
  end

  subgraph pattern["Pattern store"]
    coll["coll (pattern)"]
    coll --> row["rows: pitch, gate, force"]
  end

  idx1 --> get1["get (index)"]
  idx2 --> get2["get (index)"]
  coll --> get1
  coll --> get2
  get1 --> unpack1["unpack pitch, gate, force"]
  get2 --> unpack2["unpack pitch, gate, force"]

  subgraph synth["Bar synth"]
    alloc["voice allocator"]
    mtof["mtof / freq"]
    unpack1 --> alloc
    unpack2 --> alloc
    alloc --> gen["gen~ (modal bar)"]
    mtof --> gen
    gen --> barout["audio out"]
  end

  subgraph chain["Signal chain"]
    barout --> amp["amplifier (drive, tanh~, HP)"]
    amp --> mixer["mixer (level, pan)"]
    mixer --> reverb["reverb (224-style)"]
    reverb --> plugout["plugout~"]
  end
```

---

## Legend

| Block | Role |
|--------|------|
| **transport** | DAW sync; drives phasor~ @lock 1. |
| **phasor~ (master)** | Master clock (e.g. 1n). × num_steps → step index for playhead 1. |
| **phasor~ (playhead 2)** | Second playhead; optional phase offset + LFO → wrap~ → subdiv~. Variable rate, reset. |
| **subdiv~** | Subdivides phasor into steps; outputs subdivided phase + step index. |
| **what~** | Sample-accurate step index from subdiv~ index (trigger on step change). |
| **coll (pattern)** | One pattern: rows = steps; columns = pitch, gate, force. Length = num_steps (variable). |
| **get / unpack** | Playheads read step index → get row → unpack (pitch, gate, force). |
| **voice allocator** | Maps note-ons to 8 voices; pitch → freq, gate → trigger, force → velocity. |
| **gen~ (modal bar)** | Exciter + 8-filter bank; material, size, wear, mallet. See [MODAL_BAR_README.md](MODAL_BAR_README.md) and [MODAL_BAR_GEN_DESIGN.md](MODAL_BAR_GEN_DESIGN.md). |
| **amplifier** | Contact-mic / tube preamp character: drive, tanh~, high-pass, tone. |
| **mixer** | Level and constant-power pan per channel; optional send to reverb. |
| **reverb** | Lexicon 224–style (allpass, modulated delays, long tail). |
| **plugout~** | Device audio output. |

---

To view or edit the diagram, paste the Mermaid code block into [mermaid.live](https://mermaid.live).
