# Signal chain: amplifier, mixer, reverb

High-level spec for the output path after the bar (or full instrument): **contact-mic + tube preamp** character, **mixer with panning**, and **Lexicon 224–style reverb**.

---

## 1. Amplifier — contact mic through tube preamp

**Goal:** Shape the bar (or summed) signal so it feels like a **contact mic** (piezo) into a **tube preamp**: slightly lo-fi, warm, with soft saturation and a coloured frequency response.

**Character to mimic:**

- **Contact mic:** High impedance, strong low-end and “body,” often a bump in the low-mids; roll off sub rumble (high-pass); can feel slightly brittle or peaky in the presence range.
- **Tube preamp:** Soft clipping (even-order style), gentle compression as level increases, slight mid warmth; optional very low-level hum/hiss (toggle or level).

**Suggested approach (Max/gen~):**

- **Input gain / drive:** One control. More drive → more saturation.
- **Saturation:** Soft nonlinearity in gen~ or MSP: **tanh~** (or `x / (1 + abs(x))`), or a waveshaper. Keep it mild so it thickens rather than distorts.
- **Tone:**  
  - **High-pass** early (e.g. 40–80 Hz) to mimic piezo rumble rolloff.  
  - Optional **low-mid bump** (e.g. parametric or **eq~** / biquad) and/or **high shelf** down a little to take the edge off.
- **Optional:** Very quiet **noise~** (hiss) and/or 50/60 Hz **cycle~** (hum), mixed in at a low level and switchable, for “preamp in the room” vibe.
- **Output level:** Trim after saturation so the next stage (mixer) has headroom.

**Params (suggested):** Drive, tone (or bass/treble), optional noise/hum on/off and level.

---

## 2. Mixer — level and panning

**Goal:** Mix one or more sources (e.g. bar dry, bar post-amp, external sidechain) with **level** and **pan** per channel, then send to reverb and/or dry out.

**Suggested approach:**

- **Inputs:** One or more mono (or stereo) buses. Typical: one mono “bar” bus (after the amplifier section).
- **Per channel:**  
  - **Level** (0–1 or dB): **\*~** or **gain~** / **live.gain~**.  
  - **Pan:** Constant-power pan (L = cos(angle), R = sin(angle) with angle 0…π/2 for L–R). In Max: **panner~** or **pan~**, or manual: **\*~ cos(pan)** → left, **\*~ sin(pan)** → right (pan 0–1 mapped to 0…π/2).
- **Master:** Sum to a stereo bus. Optional master level before send/out.
- **Sends:** Optional **send** level to reverb (pre- or post-pan); dry path stays separate for wet/dry blend at the end.

**Params:** Level and pan per channel; optional master level; send level to reverb.

---

## 3. Reverb — Lexicon 224 style

**Goal:** A reverb that **evokes the Lexicon 224**: long, smooth, dense tail; modulated delay lines; not grainy; “hall” character with a slight halo from modulation.

**224 character (reference):**

- **Structure:** Allpass filters and short delay lines with high feedback; many recirculations for long decay (tens of seconds).
- **Modulation:** Delay time modulation (e.g. LFO) for chorusing and to smooth the tail; can add a subtle “halo” or soft noise in the tail.
- **Tone:** Smooth rolloff of highs over time (more damping on late reflections); no harsh metallic ring.
- **Density:** Dense early reflections merging into a smooth, continuous tail.

**Suggested approach (Max/gen~):**

- **Algorithm:**  
  - **Early reflections:** Short delays (e.g. 10–50 ms range) with sparse taps, mixed into the tail.  
  - **Tail:** Several **allpass~** (or allpass in gen~) in series/parallel, fed by **delay~** lines (e.g. 30–80 ms), with feedback for decay time.  
  - **Modulation:** Slight LFO on delay times (e.g. ±0.5–2 ms) for chorusing; keep rate low (0.1–0.5 Hz) for a 224-like feel.  
  - **Damping:** Lowpass in the feedback path (or per allpass) so high frequencies decay faster than lows.
- **Params:** Decay time (or feedback), pre-delay, damping (or HF decay), modulation rate/depth, wet/dry (or reverb level).
- **Max objects:** **j.rev~** or **reverb~** for a quick solution; for 224-like character, a **gen~** or custom **delay~** + **allpass~** + modulation chain gets closer.

**Params (suggested):** Decay, pre-delay, damping, modulation depth (and optionally rate), wet/dry.

---

## Signal flow (summary)

```
Bar (mono) → [Amplifier: drive, tone, optional noise] → [Mixer: level, pan] → dry L/R
                                                                              ↓
                                                                        [Send] → [Reverb 224-style] → wet L/R
                                                                              ↓
                                                                        Dry + Wet → main out (plugout~)
```

Reverb can receive the post-mixer stereo bus (or mono send); wet/dry blend can be at the end or via send amount + dry level in the mixer.

---

## References

- Lexicon 224: allpass-based, modulated delays, long decay; Valhalla and others have written on 224 character and algorithm structure.
- Contact mic / tube preamp: soft saturation (tanh, tape-style), high-pass, mild mid emphasis; optional hum/hiss for vibe.
