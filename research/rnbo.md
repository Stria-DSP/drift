# RNBO Export & Licensing

Summary of Cycling '74 RNBO export capabilities and commercial licensing. Source: [RNBO Export Licensing FAQ](https://support.cycling74.com/hc/en-us/articles/10730637742483-RNBO-Export-Licensing-FAQ) (consult the official page for current terms).

---

## 1. Export capabilities

- **Targets:** VST3 (Mac/Windows/Linux), Audio Units (Mac), Max externals, raw C++ code, Raspberry Pi, web.
- **Workflow:** Build and debug in Max/RNBO → export C++ or use cloud compiler for VST3/AU binaries. C++ export can be wrapped in custom GUIs (e.g. JUCE) for commercial plugins.
- **Engine:** 64-bit audio, sample-accurate timing, host transport sync, polyphony. Suited for algorithmic sequencers and phase-based engines.

---

## 2. Who owns what

- **Your algorithms and Max patcher:** Yours. Cycling '74 does **not** claim ownership of your ideas or patch design.
- **Exported code text:** Copyright remains with Cycling '74 so they can license it; that copyright is **not** a patent or other claim on your algorithms.

---

## 3. Licensing (Cycling '74 License for Max-Generated Code for Export)

Exported code is dual-licensed: **Cycling '74 License for Max-Generated Code for Export** or **GPLv3**. For closed-source commercial plugins, use the Cycling '74 license.

### 3.1 Commercial use (selling / distributing software that uses exported code)

| Revenue / funding | Action | Fee |
|-------------------|--------|-----|
| **Under $200k/year** | No need to contact Cycling '74. You can sell, sublicense, and distribute. | **No fee.** |
| **Over $200k/year** | Must contact [licensing@cycling74.com](mailto:licensing@cycling74.com) to register commercial distribution. | No fee stated; terms may change for RNBO versions &gt; 1.X. |

- No requirement to “prove” under $200k; attestation is assumed. Obvious violations may be followed up.
- **Non-commercial use** (no sale/sublicensing/distribution of software using the code): No contact needed regardless of entity size.

### 3.2 GPLv3 option

- Use GPLv3 if you want the result to be free/open or to integrate with other GPL code (e.g. JUCE under GPL).
- **Closed-source or proprietary integration:** Use the Cycling '74 license, not GPLv3.
- Selling GPLv3 software is allowed provided you comply with GPLv3 (e.g. source availability).

---

## 4. Sharing binaries

- **Non-VST3:** Under the Cycling '74 license (and, for commercial, within the revenue rules above), you may share exported source and binaries (web, Max external, rPi, AU, etc.).
- **VST3:** Extra rules apply (see below).
- **Apple:** Binaries generally need **code signing** and an **Apple Developer Program** membership to run on other Macs without security overrides.

---

## 5. VST3 distribution

Two paths:

1. **Closed-source VST3 (binary):** You must have a **VST3 license from Steinberg**. Process: complete their agreement and submit as per [Steinberg VST3 Licensing](https://steinbergmedia.github.io/vst3_dev_portal/pages/VST+3+Licensing/Index.html).
2. **Open-source VST3:** You may use **GPLv3** and comply with Steinberg’s requirements; no separate Steinberg agreement needed. The RNBO **cloud compiler** does not give you plugin source; for a custom build you export C++ from RNBO and build the plugin yourself (e.g. [JUCE RNBO Template](https://github.com/Cycling74/rnbo.example.juce)).

**JUCE:** If you use JUCE to build a commercial closed-source VST3, you need a **commercial JUCE license** in addition to the Steinberg VST3 license.

**Personal use only:** No need to release source or complete the Steinberg agreement.

---

## 6. Practical takeaways for Planedrifter (Drifter)

- **Under $200k revenue:** You can sell RNBO-derived plugins (M4L, AU, or VST3 once licensed) without paying Cycling '74 or proving revenue.
- **VST3:** Plan for Steinberg agreement (and JUCE commercial license if using JUCE for a paid product).
- **Mac distribution:** Plan for Apple Developer account and code signing for AU and any Mac VST3 builds.
- **Ownership:** Your phasing/algorithm design and Max patches remain yours; only the exported code text is under Cycling '74’s copyright and license.

For the latest details and version-specific terms, see the [RNBO Export Licensing FAQ](https://support.cycling74.com/hc/en-us/articles/10730637742483-RNBO-Export-Licensing-FAQ) and [RNBO Export Platform FAQ](https://support.cycling74.com/hc/en-us/articles/10954722178579-RNBO-Export-Platform-FAQ).
