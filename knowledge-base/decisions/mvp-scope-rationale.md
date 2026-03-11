# MVP Scope Rationale (Drift)

**Tags**: #drift #mvp #product-decisions #scope #best-practice
**Related**: [[Phasing and Interference]], [[Struck-Bar Physical Modeling]]
**Context**: Drift MVP planning, all future product MVPs

## Summary

Drift's MVP scope focuses on **2 playheads + user-defined pattern + scale + snapshot + struck-bar synth** as the core experience. This is the minimum viable version that delivers the "phase-based generative sequencing" promise. Post-MVP features (3-4 playheads, coincidence mode, prime lengths, phase viz) are deferred to validate the core concept first.

## Decision Context

### Problem

Drift's full vision includes:
- 3–4 playheads (not just 2)
- Coincidence triggering (notes only when playheads overlap)
- Prime-length loops (7, 11, 13 steps)
- Phase visualization (Lissajous, orbits)
- 64-bar MIDI capture with drag-drop export
- Advanced struck-bar synth (vibrato, tremolo, material selector)

Implementing all of this before launch = months of work, risk of over-engineering, and no validation that users want phase-based sequencing at all.

### Goal

Ship a **complete but minimal experience** that:
1. Proves the core phasing concept
2. Works as a full instrument (seq + sound)
3. Can be used in real projects (not a tech demo)
4. Gets feedback fast (weeks, not months)

## MVP Scope (What's In)

| Feature | Why It's In | Critical? |
|---------|-------------|-----------|
| **2 playheads** | Simplest phasing; proves concept; easier to tune musically | ✅ Yes |
| **User-defined pattern** (step sequencer) | Core promise: "You choose the pattern." Without this, it's just a preset player. | ✅ Yes |
| **Drift parameter** | Core phasing control; Reich-style drift. | ✅ Yes |
| **Scale quantization** | Keeps output musical; avoids dissonance pile-up. | ✅ Yes |
| **Snapshot** (record/capture) | Captures "happy accidents"; key use case for generative tools. | ✅ Yes |
| **Struck-bar synth** | Makes Drift a complete instrument; no need for external synth. Fits process music aesthetic (marimba, vibes). | ✅ Yes |
| **MIDI out** | Lets users send pattern to external instruments; parallel to internal synth. | ✅ Yes |
| **DAW transport sync** | Essential for M4L; must stay in time with project. | ✅ Yes |

## Post-MVP (What's Out)

| Feature | Why It's Deferred | When? |
|---------|-------------------|-------|
| **3rd and 4th playheads** | 2 playheads prove the concept; 3-4 add complexity without changing the core experience. | v1.1 (if users want more) |
| **Coincidence triggering** | Optional mode; 2 playheads firing independently is enough for MVP. | v1.1 (advanced mode) |
| **Prime-length loops** | Interesting but not essential; fixed 16-step loop is enough to show phasing. | v1.1 or v1.2 |
| **Phase visualization** | Nice-to-have; phasing is audible even without visual. | v1.1 (polish) |
| **64-bar MIDI drag-drop** | Full capture is complex (UI + Live API); simple snapshot is enough for MVP. | v1.2 or v2.0 |
| **Advanced bar synth** (vibrato, tremolo, material) | 2 modes + decay + brightness is enough for MVP; more params = more tuning. | v1.1 (expand synth) |

## Rationale: Why This Scope?

### 1. Core Experience is Complete

With MVP scope, user can:
- Program a pattern (step sequencer)
- Hear it phase (2 playheads + drift)
- Stay in key (scale quantization)
- Capture output (snapshot)
- Use as full instrument (struck-bar synth + MIDI out)

This is a **usable product**, not a tech demo or proof of concept.

### 2. Validates Key Hypotheses

- **H1**: Do users want phase-based generative sequencing? (2 playheads test this)
- **H2**: Is the struck-bar synth character right for this? (MVP has basic bar; can expand if users like it)
- **H3**: Is scale quantization + snapshot enough for workflow? (Test before adding 64-bar capture)

If H1–H3 are false, adding 3-4 playheads or phase viz won't save the product. If true, expanding is straightforward.

### 3. Faster Feedback Loop

- **MVP timeline**: 5–7 weeks at ~5–10 hrs/week (see MVP_PLAN.md)
- **Full version**: 12–16 weeks (double the time)

MVP lets you get product in users' hands **2-3x faster** → learn what they actually want → iterate based on real usage, not guesses.

### 4. Easier to Test and Debug

2 playheads + simple UI = fewer edge cases, easier to tune, faster to debug. Once core phasing is rock-solid, adding 3-4 playheads is straightforward (same logic, more instances).

### 5. Matches "Boutique" Positioning

Fors releases minimal, focused tools (e.g. Gem = "no-nonsense FM synth"). MVP Drift = "no-nonsense phase sequencer." Users who want depth will pay for it; users who want simplicity won't be overwhelmed.

## Trade-Offs and Risks

### Trade-Off 1: Limited Complexity (2 Playheads)

**Concern**: Some users might want 3-4 playheads immediately; 2 might feel limited.

**Mitigation**:
- Position as "focused" and "minimal" (Fors-style)
- Announce v1.1 roadmap (3-4 playheads) post-launch
- Price reflects MVP scope ($49–59, not $79)

### Trade-Off 2: No Phase Visualization

**Concern**: Visual learners might struggle to understand phasing without seeing it.

**Mitigation**:
- Demo video shows phasing audibly (waveform or step grid)
- Product page explains process clearly
- Add phase viz in v1.1 if user feedback requests it

### Trade-Off 3: Fixed Pattern Length (16 Steps)

**Concern**: Some users might want 7, 11, or 13-step prime loops immediately.

**Mitigation**:
- 16 steps is enough to show phasing over 4 bars
- Can manually program shorter patterns (e.g. use first 7 steps, leave rest empty)
- Add prime-length selector in v1.1

## Success Criteria (How We Know MVP is Right)

- [ ] At least 10 external users download and use Drift
- [ ] Users report phasing is audible and musical (not confusing or muddy)
- [ ] Users can program patterns and hear them in projects (not just a toy)
- [ ] Struck-bar synth character fits; users don't immediately ask for external synth
- [ ] Snapshot/capture works; users successfully save phrases they like
- [ ] Feature requests are for **expansion** (3-4 playheads, viz), not **fixes** (core doesn't work)

If success criteria are met → expand to v1.1 (3-4 playheads, phase viz, etc.).

If not → diagnose (is phasing too subtle? Is bar synth wrong? Is UI confusing?) and fix before adding more.

## Lessons for Future Products

### Pattern: Core Experience + 1-2 Key Features

- **Core**: The one process that defines the product (phasing, L-system, tiling, etc.)
- **Key feature 1**: Input method (user-defined pattern, axiom+rules, motif+symmetry)
- **Key feature 2**: Musical constraint (scale quantization, tempo sync, etc.)
- **Polish**: Snapshot, MIDI out, basic UI

**Defer**: Advanced modes, visualization, complex parameters, multi-tier features.

### Ship Fast, Iterate Based on Use

- MVP in 5–7 weeks → launch → collect feedback → v1.1 in 3–4 weeks
- Better than: 16 weeks → launch full version → discover users wanted something different → wasted 8+ weeks

### Price Reflects Scope

- MVP = $49–59 (boutique single device)
- v1.1+ (3-4 playheads, viz, advanced bar) = $69–79
- Composite instrument (seq + synth + effects + mod) = $99–149

Users understand "this is focused and will expand." Don't over-promise, under-deliver.

## Related Decisions

- [[MVP vs Full Product Trade-Offs]]
- [[Pricing Strategy]]
- [[User Feedback Integration]]
- [[Feature Prioritization Framework]]

## References

- MVP_PLAN.md (Drift repo)
- PROJECT_BRIEF.md §6 (Next steps)
- Eric Ries, *The Lean Startup* — MVP concept
- Fors product line (boutique, focused, expandable)

---

*Decision made: February 2026 | Review post-MVP launch based on user feedback*
