# SIH Quantum Platform — Brand & Design Guidelines

Derived from the reference landing page (agentic marketing platform screenshot) and adapted for an AI-based interactive quantum algorithm learning platform. Tone: calm, precise, professional — a lab notebook, not a toy.

---

## 1. Color Palette

| Role | Color | Hex (approx.) | Usage |
|---|---|---|---|
| Base background | Warm off-white | `#F8F6F0` | Page background, default surface |
| Primary text | Near-black | `#161514` | Headings, body copy |
| Primary action | Ink black | `#111111` | Pill buttons, nav CTA, high-emphasis UI |
| Card surface | Soft gray | `#EFEDE7` | Feature cards, panels, inactive tabs |
| Accent (deep) | Forest green | `#1E3A2B` | Dark feature cards, highlight sections, "active" states |
| Accent (light) | Mint tint | `#E4EEE3` | Table highlight columns, success/selected states |
| Structural dark | Charcoal / black | `#0D0D0D` | Footer, header bar on dark mode, code editor background |
| Border/hairline | Warm gray | `#DEDAD0` | Card borders, dividers |

**Rule of use:** background stays light and quiet (`#F8F6F0`) across ~85% of the app. Forest green is the platform's signal color — reserve it for one meaningful thing per screen (an active simulation, a correct answer, a "run" state), the same way the reference site uses its single dark green card as the one moment of color on an otherwise neutral page. Never let green compete with itself — one saturated green element per viewport.

For quantum-specific states (superposition, entanglement, measurement collapse), extend the accent role only, don't introduce new hues:
- Amplitude / probability bars → mint tint fill, forest-green border
- Measurement collapse / correct answer → forest green solid
- Error / incorrect gate → keep black text, use a thin red hairline only on the offending element — don't add red as a background color

---

## 2. Typography

Two-role pairing, mirroring the reference site's serif-headline / sans-body split:

**Display (headings, hero text, module titles)**
A high-contrast, refined serif — e.g. **Fraunces**, **Newsreader**, or **GT Sectra** as substitutes if licensing is a concern. Used sparingly, large sizes only (28px+). This is what gives the platform its "serious research tool" feel rather than a generic dashboard look.

**Body / UI (nav, buttons, paragraph copy, form labels)**
A clean grotesque sans — **Inter** or **General Sans**. Used at 14–16px for body, 13px for captions/labels, medium weight for buttons.

**Monospace (equations, code editor, circuit notation)**
**JetBrains Mono** or **IBM Plex Mono** — needed since this platform (unlike the reference) has to display equations, Qiskit code, and gate notation. This is the one role the reference site doesn't need but yours does.

Type scale:
- H1 (hero/module title): 40–48px, serif, tight leading
- H2 (section headers): 28–32px, serif
- H3 (card titles): 18–20px, sans, medium
- Body: 15–16px, sans, regular
- Caption/label: 12–13px, sans, medium, slightly letter-spaced

---

## 3. Iconography

Requested style: **elegant, professional, restrained** — matching the serif/sans pairing above, not playful or filled.

- **Style:** thin-line icons, 1.5px stroke weight, rounded line caps/joins (not sharp). Avoid filled/solid icon sets — they read as heavier and more "app-store" than this platform's tone.
- **Recommended sets:** Lucide or Phosphor (Light weight) — both are open-source, consistent, and pair well with a serif/sans system.
- **Color:** icons default to `#161514` (same as body text) at rest; switch to forest green `#1E3A2B` only on active/selected/hover states — same restraint rule as the color palette.
- **Size grid:** 16px (inline with text/labels), 20px (nav/buttons), 32px (feature card headers) — pick from this scale only, don't introduce arbitrary sizes.
- **Quantum-specific iconography** (not in generic sets, will need custom SVGs): qubit (simple circle/orbit glyph), gate symbols (H, X, Z, CNOT as clean boxed letterforms — this is standard in circuit diagrams, keep them monospace-labeled), Bloch sphere thumbnail icon, entanglement (two linked circles).

---

## 4. Layout & Components

- **Corner radius:** 12–16px on cards and panels, full pill radius (999px) on buttons — same soft-but-not-round language as the reference.
- **Buttons:** solid black pill for primary actions ("Run Circuit," "Start Lesson"), outline/ghost pill for secondary actions. White text on black, black text on outline.
- **Cards:** soft gray (`#EFEDE7`) background, 1px hairline border (`#DEDAD0`), no drop shadows — flat, quiet surfaces, let the green accent and serif type carry hierarchy instead of elevation.
- **Dark sections used sparingly:** one deep-green or charcoal block per page max (e.g. the Circuit Builder canvas or a featured concept card) — everything else stays on the light background. This "mostly light, one dark anchor" rhythm is the single most identifiable trait to carry over from the reference.
- **Spacing:** generous whitespace between sections (80–120px vertical rhythm on desktop), consistent 24px gutter on card grids.
- **Footer:** full-bleed charcoal/black (`#0D0D0D`) with white/gray text — direct carryover from reference.

---

## 5. Voice notes for UI copy

- Plain, active verbs: "Run circuit," "Measure," "Reset" — not "Submit," "Execute Process."
- No exclamation marks, no forced enthusiasm — the tone is precise, closer to a lab tool than a marketing site.
- Errors state what happened and how to fix it ("Circuit has no measurement gate — add one before running"), never vague ("Something went wrong").
