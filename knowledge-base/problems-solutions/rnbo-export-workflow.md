# RNBO Export Workflow

**Tags**: #rnbo #export #vst #au #workflow #m4l #technical
**Related**: [[Max for Live to VST]], [[RNBO Licensing]], [[Cross-Platform Plugin Development]]
**Context**: Drift Phase 2 (VST/AU export), all future products

## Summary

RNBO (by Cycling '74) exports Max patches to C++ code, then compiles to VST3/AU/AAX plugins. Workflow: prototype in Max/M4L → RNBO-ize (replace incompatible objects with gen~ or RNBO equivalents) → export → cloud compile or local toolchain → test → distribute. Free below $200k/year revenue; you own the exported code.

## Why RNBO for Stria?

- **Prototype in Max**: Fast iteration for algorithmic logic and timing
- **Export to VST/AU**: Reach non-Ableton users (FL Studio, Logic, Bitwig, etc.)
- **No RNBO fee below $200k/year**: Free for side-hustle scale ($1,250–$3,500/month)
- **You own the code**: Exported C++ is yours; no ongoing runtime license
- **Cloud compilation**: No local Xcode/Visual Studio setup initially (optional later)

## RNBO Export Process (High-Level)

```
1. Prototype in Max/M4L
   ↓
2. RNBO-ize: Replace incompatible objects (see below)
   ↓
3. Export RNBO patch (.rnbo file)
   ↓
4. Cloud compile (or local toolchain)
   ↓
5. Download compiled plugin (VST3, AU, AAX)
   ↓
6. Test in DAWs (FL, Logic, Bitwig, etc.)
   ↓
7. Distribute (Gumroad, Plugin Boutique, etc.)
```

## Step 1: Prototype in Max/M4L

Build full device as M4L first:
- Transport sync (`transport`, `phasor~`)
- Step sequencer (pattern storage: `coll`, `table`, or `dict`)
- Playhead logic (phase math)
- Synth engine (gen~ for modal bar, or MSP objects)
- MIDI out (`noteout` or `midiout`)
- UI (M4L UI objects: knobs, sliders, buttons)

**Goal**: Validate concept, timing, and UX before exporting.

## Step 2: RNBO-ize (Replace Incompatible Objects)

RNBO supports a **subset** of Max objects. Replace incompatible ones:

### Compatible (Keep As-Is)

- **MSP audio**: `phasor~`, `cycle~`, `+~`, `*~`, `%~`, filters, etc.
- **gen~**: Fully supported; preferred for custom DSP
- **Control flow**: `route`, `select`, `trigger`, `gate`
- **Math**: `+`, `*`, `/`, `%`, `expr`
- **RNBO-specific**: `param`, `in`, `out`, `inport~`, `outport~`

### Incompatible (Replace)

| Max Object | Why Incompatible | RNBO Alternative |
|------------|------------------|------------------|
| `live.*` (M4L UI) | M4L-specific | Use `param` (host automation) + custom plugin UI (later) |
| `coll`, `table` | File I/O, dynamic data structures | Use `buffer~` (audio-rate lookup) or `codebox` (gen~) with arrays |
| `js`, `node.script` | JavaScript runtime | Rewrite in gen~ codebox or Max control logic |
| `poly~` | Polyphony wrapper | Use `rnbo~` polyphony (built-in) |
| `plugout~` | M4L audio out | Use `out~ 1 2` (RNBO audio out) |
| `noteout`, `midiout` | M4L MIDI | Use `out` (RNBO MIDI out) |

### Pattern Storage (Sequencer)

**Problem**: `coll` or `table` not directly supported for pattern storage.

**Solution**:
1. **buffer~**: Store pattern as audio buffer (sample = step data). Use `peek~` or `index~` to read.
2. **gen~ array**: Use `Data` object in gen~ codebox; access via index.
3. **Hardcode**: For MVP, hardcode pattern in gen~ or RNBO (not flexible, but works for proof-of-concept).
4. **JSON in C++**: Post-export, modify C++ to load pattern from JSON or preset file (advanced).

**Recommended for MVP**: Use `buffer~` with 1-sample-per-step; read step data (pitch, gate) from buffer index.

### UI (Knobs, Sliders)

**M4L**: `live.dial`, `live.slider`, `live.toggle`

**RNBO**: Use `param` object for each parameter. Host DAW provides UI (knobs, sliders). Custom plugin UI (native) is optional and requires C++ or JUCE wrapper (post-MVP).

**Example**:
```
[param drift @min 0 @max 0.01 @default 0.001]
```

Host DAW shows "Drift" knob with range 0–0.01, default 0.001.

## Step 3: Export RNBO Patch

In Max:
1. Save your RNBO patcher as `.rnbo` file
2. Use RNBO export dialog: File → Export → RNBO (or `rnbo~` object → Export)
3. Choose target: VST3, AU, AAX, or C++ source
4. Optional: Set plugin name, manufacturer, version

**Output**: `.rnbo` file or C++ source code.

## Step 4: Compile Plugin

### Option A: Cloud Compilation (Easiest)

- Cycling '74 provides cloud compile service (free or paid tier)
- Upload `.rnbo` file → get compiled VST3/AU/AAX back
- No local toolchain needed
- **Limitation**: Standard plugin wrapper; no custom UI (generic host UI only)

### Option B: Local Compilation (Advanced)

1. **Install toolchain**:
   - **macOS**: Xcode (for AU, VST3)
   - **Windows**: Visual Studio (for VST3)
2. **Export C++ source**: RNBO export → "C++ Source Code"
3. **Integrate with plugin wrapper**:
   - Use Steinberg VST3 SDK (free)
   - Or JUCE framework (easier; handles VST3, AU, AAX)
4. **Build**: Compile in Xcode/Visual Studio
5. **Code-sign** (macOS/Windows): Required for distribution

**Advantage**: Full control; custom UI; can modify C++ (e.g. add preset loading, custom graphics).

**Recommended path**:
- **MVP (Drift Phase 2)**: Cloud compile (fast, easy)
- **Post-MVP**: Local compile + JUCE for custom UI and polish

## Step 5: Test in DAWs

- **macOS**: Logic Pro (AU), Ableton (VST3), Bitwig (VST3)
- **Windows**: FL Studio (VST3), Cubase (VST3), Reaper (VST3)
- **Cross-platform**: Bitwig, Reaper (both VST3)

### Test Checklist

- [ ] Plugin loads in DAW
- [ ] Host automation works (param knobs respond)
- [ ] Transport sync works (play/stop, tempo changes)
- [ ] Audio output is clean (no clicks, dropouts, aliasing)
- [ ] MIDI out works (if applicable)
- [ ] Plugin survives save/reload of project
- [ ] No crashes on parameter changes or tempo changes

## Step 6: Distribute

### Formats

- **VST3**: Windows + macOS; most DAWs
- **AU**: macOS only; Logic, GarageBand, Ableton (macOS)
- **AAX**: Pro Tools (requires iLok, paid AAX SDK, not recommended for MVP)

**Recommended for MVP**: VST3 (Windows + macOS) + AU (macOS). Skip AAX initially.

### Packaging

- **Installer**: Use installer builder (PACE, Iced Audio, or manual .pkg/.exe)
- **Manual install**: Provide .vst3 and .component files + instructions (copy to plugin folder)
- **Code-signing**: Required for macOS (Apple Developer account, $99/year); optional but recommended for Windows

### Channels

- **Gumroad**: Direct sales; you host files
- **Plugin Boutique, ADSR, KVR**: Retailers; take 30–50% but handle delivery and reach
- **Own website**: If you have one; link to Gumroad checkout

## RNBO Licensing (Summary)

- **Free below $200k/year revenue**: No RNBO fee
- **Above $200k/year**: Contact Cycling '74 for commercial license
- **You own the exported code**: C++ is yours; no runtime license
- **Max license**: Need Max license to use RNBO editor; $399 one-time or $9.99/month

**For Stria**: Start free (side-hustle scale); pay when revenue > $200k (good problem to have).

## Common Issues and Solutions

### Issue 1: Timing Drift (Plugin Out of Sync)

**Symptom**: Sequence drifts out of sync with DAW over time.

**Solution**: Use RNBO `in transport` to get DAW position, tempo, and play state. Lock phase to transport position, not sample count.

### Issue 2: Pattern Storage (No `coll` in RNBO)

**Symptom**: Can't store user-defined pattern in RNBO.

**Solution**: Use `buffer~` (1 sample per step) or `gen~ Data` array. Post-MVP: Load pattern from preset file in C++.

### Issue 3: No Custom UI (Cloud Compile)

**Symptom**: Plugin has generic host UI (knobs only); no custom graphics.

**Solution**: Accept for MVP (Fors-style minimal). Post-MVP: Local compile + JUCE for custom UI.

### Issue 4: Polyphony (Multiple Notes at Once)

**Symptom**: Struck-bar synth is monophonic; chords don't work.

**Solution**: Use `rnbo~ polyphony` in Max before export. Or use `poly~` equivalent in RNBO (voice allocation).

### Issue 5: VST3 Validation Fails

**Symptom**: VST3 doesn't load in some DAWs.

**Solution**: Run Steinberg VST3 validator (free tool). Common issues: incorrect category, missing MIDI ports, bad parameter ranges. Fix in RNBO export settings or C++.

## MVP Strategy for Drift

### Phase 2 (RNBO Export)

1. **Validate MVP M4L first** (Phase 1: M4L only, prove concept)
2. **RNBO-ize**: Replace `coll` with `buffer~` for pattern; replace `live.*` with `param`
3. **Cloud compile**: VST3 (Windows + macOS) + AU (macOS)
4. **Test**: Logic, FL Studio, Bitwig
5. **Distribute**: Gumroad (VST3 + AU versions); price $59–79 (higher than M4L for broader reach)

### Post-MVP (Custom UI)

6. **Local compile + JUCE**: Custom plugin UI (step grid, knobs, phase viz)
7. **Code-sign**: macOS (required) + Windows (optional)
8. **Expand to retailers**: Plugin Boutique, ADSR (30–50% cut, but wider reach)

## References

- **Cycling '74 RNBO**: https://rnbo.cycling74.com/
- **RNBO Export Licensing FAQ**: https://support.cycling74.com/hc/en-us/articles/10730637742483
- **Steinberg VST3 SDK**: https://www.steinberg.net/vst3sdk
- **JUCE Framework**: https://juce.com/ (cross-platform plugin wrapper)
- **Drift research/rnbo.md**: Stria docs (RNBO licensing, export, VST3)

## Related Concepts

- [[Max for Live to VST]]
- [[RNBO Licensing]]
- [[Cross-Platform Plugin Development]]
- [[Plugin Distribution Channels]]
- [[Code Signing for macOS and Windows]]
