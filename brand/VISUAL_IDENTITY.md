# Visual Identity: Stria

Design principles, UI/UX standards, and visual direction for all Stria products and marketing. Goal: minimal, confident, designed—signals craft and expertise.

---

## Design Philosophy

**Minimal. Two-tone. Plenty of space. No clutter.**

Stria's visual identity is inspired by **Fors** (fors.fm) and **Elektron**: clean, scalable UI with limited color palettes, clear typography, and functional design. We signal "pro tool" and "designed instrument," not toy or plugin warehouse.

---

## 1. Device UI (Max for Live, VST/AU)

### 1.1 Layout Principles

- **Plenty of space**: Don't cram controls. Generous padding between elements.
- **Clear hierarchy**: Most important controls (Drift, Rate, Scale) large and prominent; secondary controls (snapshot, MIDI) smaller or to the side.
- **Functional grouping**: Group related controls (clock/playheads, pattern, sound, output).
- **Consistent alignment**: Grid-based layout; controls align to invisible grid lines.

### 1.2 Color Palette

Use **two-tone or limited palette**. Avoid gradients, neon, or busy color schemes.

**Recommended palettes:**

| Style | Background | Text/Labels | Accent (active/phase) | Notes |
|-------|------------|-------------|-----------------------|-------|
| **Dark** | Deep gray or near-black (#1a1a1a, #2a2a2a) | Soft white/cream (#e8e8e8, #f4f4f4) | Single color (blue, green, warm orange) | Fors-like; works well for M4L/plugins |
| **Light** | Off-white or light gray (#f0f0f0, #fafafa) | Dark gray or black (#2a2a2a, #1a1a1a) | Single accent (muted blue, teal, rust) | Clean, minimal; good for product pages |
| **Two-tone** | One neutral (gray) + one accent (e.g. rust, teal) | Contrast color from palette | Same accent for active state | Elektron-inspired; strong identity |

**Accent color usage:**
- Active playhead or step
- Phase indicator (e.g. Lissajous line)
- "Record" or "Snapshot" button when armed
- Selected scale or mode

**What to avoid:**
- Neon gradients, rainbow colors, "tech" aesthetic
- More than 2–3 colors per device
- Bright red/green unless for clear signal (error/success; use sparingly)

### 1.3 Typography

- **One sans-serif family** for UI and labels (e.g. Inter, Roboto, San Francisco, or Ableton's default if M4L)
- **Readable at small sizes** (11–14px for labels, 16–24px for values)
- **Consistent weight**: Regular for labels, Medium or Bold for values or headings
- **No decorative fonts** on device UI (save for product page if needed)

### 1.4 Controls and Elements

| Element | Style | Example |
|---------|-------|---------|
| **Knobs/sliders** | Minimal, no skeuomorphism. Single line or arc for value. | Ableton-style simple slider or circular dial with thin arc. |
| **Buttons** | Flat or slight border; accent color when active. | Rectangle or rounded rect; no 3D or emboss. |
| **Step grid** | Clear cell boundaries; accent for active step; subtle for inactive. | Grid lines in light gray; active step in accent color. |
| **Waveform/scope** | Single line, accent color; black or dark background. | Lissajous or playhead phase as thin line on dark field. |
| **Labels** | Small, uppercase or sentence case; above or to left of control. | "DRIFT", "Rate", "Scale" — consistent case style. |

### 1.5 Motion and Animation (Optional)

- **Slow and legible**: If phase visualization (Lissajous, orbits), keep it smooth and slow—Reich-like, not flashy.
- **Functional, not decorative**: Animation should communicate state (e.g. playhead position), not entertain.
- **No bounce or elastic easing**: Linear or gentle ease; signals precision, not playfulness.

---

## 2. Product Pages and Marketing

### 2.1 Layout (Fors-Inspired)

Structure for Gumroad long description or standalone landing page:

1. **Headline**: Product name + type (e.g. "Drift — Phase sequencer for Ableton")
2. **Subhead**: One-line tagline (e.g. "One pattern. Two playheads. Endless drift.")
3. **Price + CTA**: Prominent, top-right or centered below headline
4. **Hero paragraph**: 1–2 sentences describing the experience (not feature list)
5. **Demo/media**: Video or audio embed; full-width or large
6. **"Meet the…"** (optional): If device has distinct parts (playheads, clock, synth), name and describe each in one line
7. **Feature list / "To sum it up"**: Bullets for people who want the checklist
8. **Requirements**: Platform, Live version, OS, etc. — at the end
9. **Optional: Artists / community**: "Made with [Product]" when available

### 2.2 Visual Style

- **Plenty of whitespace**: Sections have breathing room; no wall of text or crowded images.
- **Limited color**: Same palette as device UI; one accent color throughout.
- **Clean typography**: One sans for body (16–18px, line-height ~1.5), one for headings (larger, bold or medium weight).
- **Images**: Device screenshots, waveforms, or minimal graphics. Avoid stock photos (happy producer at laptop). Prefer device-only or studio shots if needed.
- **No busy backgrounds**: Solid color or subtle gradient; no patterns or textures.

### 2.3 Imagery

**Device screenshots:**
- Show the UI in context (in Ableton, or standalone if VST)
- Clean, not cluttered; no messy project in background
- Accent color visible (active step, playhead, etc.)

**Waveforms / visualizations:**
- If showing audio or phase: single accent color, dark background, clean
- Lissajous or phase plot: elegant, not busy; signals "structure"

**Photos (if used):**
- Avoid stock "producer at laptop" images
- Prefer: hands on controller, device in rack, minimal studio, or no photos at all

**What to avoid:**
- Clip art, icons from free packs, generic "tech" graphics
- Busy or colorful backgrounds
- Multiple devices or clutter in screenshots

---

## 3. Logo and Icon

### 3.1 Brand Logo (Stria)

- **Wordmark or simple mark** (e.g. stylized "S" or abstract symbol)
- **Works at small sizes** (favicon, device corner, social avatar)
- **One or two colors** from palette
- **Scalable** (vector; works from 16×16 to large)

**Reference:** Fors logo is a simple wordmark; Elektron uses a geometric mark. Both are minimal and recognizable.

### 3.2 Device Icon

Each product should have a **device icon** (e.g. for M4L device browser, plugin folder).

**Design:**
- **Simple geometric shape or symbol** that suggests the process (e.g. two circles for Drift's playheads; branching lines for L-system)
- **Accent color + neutral** (e.g. teal circles on dark gray square)
- **64×64 or 128×128 minimum**; works at small sizes

**Examples:**
- **Drift**: Two overlapping circles (playheads) or two lines at slight angle (phasing)
- **Fold** (L-system): Branching tree or fractal "Y" shape
- **Tile**: Grid or tessellation pattern

**What to avoid:**
- Realistic 3D renders
- Text-only (unless very large and clear)
- Complex illustrations (won't read at small size)

---

## 4. Typography System

### 4.1 Recommended Fonts

**For UI (device, app):**
- **System default** (San Francisco on macOS, Segoe UI on Windows) — reliable, readable
- **Inter** (free, open-source; excellent for UI)
- **Roboto** (Google Fonts; clean, neutral)
- **If M4L**: Use Ableton's default or match Live's UI font

**For web/marketing (product pages, docs):**
- **Headings**: Inter, Roboto, or a clean sans (Medium or Bold weight)
- **Body**: Same as headings (Regular weight) or a serif for warmth (e.g. Crimson Pro, Lora)
- **Code/technical**: Monospace (e.g. Fira Code, JetBrains Mono) for code samples, file names

### 4.2 Hierarchy

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **H1 (Page title)** | 32–48px | Bold or Medium | Product name, page headline |
| **H2 (Section)** | 24–32px | Medium | Section headers |
| **H3 (Subsection)** | 18–24px | Medium or Regular | Subsections |
| **Body** | 16–18px | Regular | Paragraphs, descriptions |
| **Small (captions, footnotes)** | 12–14px | Regular or Light | Image captions, metadata |
| **UI labels** | 11–14px | Regular or Medium | Knob/slider labels, buttons |
| **UI values** | 14–18px | Medium or Bold | Parameter values, readouts |

---

## 5. Consistency Across Touchpoints

All Stria materials should use the same visual language:

| Touchpoint | Visual Rules |
|------------|--------------|
| **Device UI** | Two-tone palette, minimal controls, clear labels, one accent color |
| **Product page** | Same palette, clean layout, whitespace, device screenshots, no stock photos |
| **Gumroad / store** | Match palette; short copy, prominent CTA, feature bullets at end |
| **Social media** | Device screenshots, waveforms, or minimal graphics; no flashy text overlays |
| **Docs / manual** | Clean markdown or PDF; same font family, simple diagrams if needed |
| **Video / demo** | Device in focus; clean project, no clutter; voiceover or text captions (no loud music) |

---

## 6. What to Avoid (Anti-Patterns)

### Visual

- **Neon gradients, rainbow colors, "tech" aesthetic** (feels generic, not craft)
- **Busy backgrounds, patterns, textures** (competes with content)
- **Crowded panels, tiny type** (signals "plugin warehouse," not boutique)
- **Skeuomorphism** (fake wood, leather, knobs with reflections)
- **3D renders or realistic textures** (unless very high quality; prefer flat/2D)
- **Stock photos of producers** (generic; avoid unless it's your own studio)

### Tone

- **Overly playful or toy-like** (we're instruments, not games)
- **Corporate or clinical** (we're warm and inviting, not cold)
- **Flashy or loud** (we're confident and minimal, not hype)

---

## 7. Design Checklist

Before finalizing any visual asset (device UI, product page, image, logo):

- [ ] Does it use a **limited color palette** (2–3 colors max)?
- [ ] Is there **plenty of whitespace** (not crowded)?
- [ ] Is the **typography clear and consistent** (one or two font families)?
- [ ] Does it **signal "designed" and "pro tool"** (not toy, not generic)?
- [ ] Is it **minimal and functional** (no decorative clutter)?
- [ ] Does it **align with Fors/Elektron reference** (clean, confident, craft)?
- [ ] Is it **scalable and readable at small sizes** (device icon, favicon)?

If yes to all: ship it.

---

## 8. Practical MVP Scope (Drift)

For the **Drift** MVP, prioritize these visual elements:

| Element | MVP Approach | Notes |
|---------|--------------|-------|
| **Device UI** | Dark or two-tone; step grid + 2–3 knobs (Drift, Rate, Scale); one accent color for active step | Keep it simple; can expand later |
| **Device icon** | Two overlapping circles (playheads) on dark square; accent color | 64×64 minimum; vector if possible |
| **Product page** | Headline, 1–2 paragraphs, demo link, bullets, requirements; match device palette | Use Gumroad long description or simple HTML |
| **Logo** | Wordmark "Stria" in clean sans; or defer to just text for MVP | Can refine post-launch |
| **Screenshots** | 2–3 clean shots of device in Ableton (or standalone) | No clutter in project; show step grid and knobs |

**Defer to v1.1+:**
- Phase visualization (Lissajous, orbits)
- Fancy logo or brand mark
- Full landing page (Gumroad is enough for MVP)
- Video demo (can be screen recording with voiceover; no fancy editing needed)

---

*Last updated: February 2026 | See [BRAND_IDENTITY.md](BRAND_IDENTITY.md) for overall brand; [REFERENCE_MODEL.md](REFERENCE_MODEL.md) for Fors analysis.*
