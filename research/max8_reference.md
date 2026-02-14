# Max 8 reference (Planedrifter-relevant)

Condensed from [Cycling '74 Max 8 Documentation](https://docs.cycling74.com/max8). Use for object behavior, messages, and gotchas when patching.

---

## coll

- **Role:** Store and retrieve messages by index (or symbol). Used for pattern: index = step, data = pitch + gate.
- **Arguments:** Optional `name` (symbol). Named colls share contents; on load Max searches for a file matching the name and loads it if found. Second arg `no-search` (nonzero) disables file search.
- **Key messages:**
  - **read** \[filename\] — Load from file (no arg = Open dialog). File is searched on Max search path.
  - **readagain** — Reload last read file.
  - **list** (index, data…) — Store at int address: first element = address, rest = data. So `list 0 60 1` stores (60, 1) at index 0.
  - **int** / **float** (index) — Output stored message at that address (same as “get” in many patches).
  - **dump** — Send all addresses out 2nd outlet, all messages out 1st outlet; bang out 4th when done.
  - **clear** — Clear all data.
- **Output:** 1st = stored message, 2nd = address (when triggered by bang/next/prev/sub), 3rd = bang when read done, 4th = bang when dump done.
- **Note:** For **read**, if the patcher isn’t saved (e.g. in M4L), path-dependent loading can fail. Prefer filling from message/list or adding the project folder to the Max search path.

---

## phasor~

- **Role:** Sawtooth 0→1 at a set rate. Used for transport-synced clock and step phase.
- **Arguments:** Optional initial frequency (Hz) or **time-value** (e.g. `1n`, `16n`).
- **Attributes:**
  - **frequency** — Rate (Hz or time-value).
  - **lock** (int) — 1 = sync to transport; when transport off, output is 0. For lock, use **note-values** (e.g. `1n`), not raw Hz.
  - **transport** — Name of transport object (default internal).
  - **phaseoffset** — Phase when starting or on **reset**.
- **Messages:** **reset** = set phase to phaseoffset. Left inlet: frequency (if no signal). Right inlet: set phase (0–1).
- **Output:** Signal 0→1 at the set rate.
- **See:** [Max time format](https://docs.cycling74.com/max8/vignettes/maxtime) for note values (`1n`, `16n`, etc.).

---

## thispatcher

- **Role:** Send messages to the patcher that contains it (window, path, etc.).
- **path** — Sends the **full pathname of the folder** containing the patcher file out the **right** outlet. **If the patcher has not been saved, there is no output.** In M4L/devices the top-level patcher path is reported, not an abstraction’s path.
- Use path to build a full path for **coll read** (e.g. path → prepend `/pattern_default.txt` → prepend `read ` → coll). Fails if patcher is unsaved or embedded in a way that doesn’t have a path.

---

## snapshot~

- **Role:** Sample a signal and output a float when triggered (or at an interval).
- **Arguments:** Optional reporting-interval (ms or time-value). If 0, outputs only on **bang**.
- **Messages:** **bang** (left inlet) — Output current sample value. Sample-accurate when “Scheduler in Audio Interrupt” is on.
- **Inlets:** Left = signal to sample; right = bang (or interval control).
- **Output:** Float (one sample of the signal).
- Use for step index: **trunc~** → snapshot~ (signal), **change~** → snapshot~ (bang) so you get one integer per step boundary.

---

## iter

- **Role:** Break a list into single elements; each **bang** sends the next element.
- **Behavior:** Send a list, then send bangs; each bang outputs the next number (or element) in sequence. No argument for group size — one element per bang.
- To fill a coll from one long list (e.g. 0 60 1 1 62 1 …), you need multiple bangs and to regroup into (index, pitch, gate), e.g. with **pack** and **trigger** or multiple **iter**/counter chains.

---

## multislider

- **Role:** Array of sliders or scrolling display. **size** (attr/message) = number of sliders (default 1, max 4096).
- **Attributes:** **setminmax** (low, high), **settype** (0 int, 1 float), **setstyle** (0 thin line, 1 bar, etc.), **orientation** (0 horizontal, 1 vertical).
- **Messages:** **list** — Set all slider values (and resize to list length). **bang** — Output current values as a list. **set** slider value — Set one slider without output. **fetch** slider — Output that slider’s value from the **right** outlet.
- **Output:** **Left** — When sliders change (mouse) or when list/int/float received: **full list** of current values. **Right** — Value from **fetch** (single slider).
- **Gotcha:** Mouse drag outputs the **entire list**, not (index, value). To get (index, value) on change you must either **fetch** by index or compare full lists.

---

## change~

- **Role:** Output a bang when the value received is different from the previous one. Used to detect step boundaries (e.g. **trunc~** → **change~** bangs when step index changes).
- **Inlets:** Left = value (any). **change~** is the MSP version (signal input).
- **Output:** Left = bang when value changed; right = the new value (for **change~**, outlet 1 = bang, outlet 2 = the sampled value if needed; for **change** (message) left = bang, middle = new value).

## trigger (t)

- **Role:** **t b** = bang in, bang out. **t i** = trigger int: right inlet = value (held), left inlet = bang (sends the value). **t f**, **t s**, **t l** etc. for float, symbol, list. Multiple types: **t b i** = bang in → bang out then int out (in that order). Use **t i** to capture a value (e.g. pitch) when a bang (e.g. gate) fires.
- **Common:** **t i** with gate bang → left, pitch → right: when gate bangs, output the current pitch.

## pack

- **Role:** Build a list from inlets. **pack 0 0** = two inlets, default 0; output = list of (inlet1, inlet2). **pack 0 0 0** = three inlets. Use with **prepend set** to build **set index pitch gate** for coll.
- **Order:** When any inlet receives a value, **pack** outputs the current list (left to right inlets).

## unpack

- **Role:** Break a list into separate outlets. **unpack 0 0** = two outlets; list in → left outlet gets first element, right gets second. Defaults (0 0) used if list is short. Use after **coll** to get (pitch, gate) from a row.

## prepend

- **Role:** Prepend a word (or list) to the message. **prepend get** + index → **get 5** (for coll). **prepend set** + (index pitch gate) → **set 5 60 1** (for coll). **prepend read ** + path → **read /path/to/file.txt**.

## makenote / midiout

- **makenote** velocity duration channel — Inlets: pitch (or note), velocity, duration (ms), channel. Trigger (e.g. from **t i**) sends note; **makenote** adds note-off after duration. Outlets: note (pitch), velocity (for **noteout**/ **midiout**).
- **midiout** port — Receives note messages (from **makenote** or **noteout**). In M4L typically **midiout 0** to send to the track.

## Search paths

- **read** (coll, etc.) looks in Max **search path**. Add folders in File → Preferences → File (or Search Path). For Projects, use Project search path so relative paths resolve.
- **thispatcher path** gives the patcher’s **folder**; only works if the patcher is saved to disk.

---

## Time format (phasor~, delay, etc.)

- Note values: `1n` (one bar), `4n`, `8n`, `16n`, etc. Used with **lock** and **transport** for tempo-relative timing.
- See: [Specifying Time Values](https://docs.cycling74.com/max8/vignettes/maxtime).

---

## Quick links (Max 8)

- [Max 8 docs index](https://docs.cycling74.com/max8)
- [coll](https://docs.cycling74.com/max8/refpages/coll) · [phasor~](https://docs.cycling74.com/max8/refpages/phasor~) · [thispatcher](https://docs.cycling74.com/max8/refpages/thispatcher) · [snapshot~](https://docs.cycling74.com/max8/refpages/snapshot~) · [iter](https://docs.cycling74.com/max8/refpages/iter) · [multislider](https://docs.cycling74.com/max8/refpages/multislider)
- [Search Paths](https://docs.cycling74.com/legacy/max8/vignettes/search_paths_topic) · [Max time format](https://docs.cycling74.com/max8/vignettes/maxtime)
