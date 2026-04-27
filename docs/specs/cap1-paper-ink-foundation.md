# cAp1: Paper and Ink Design System Foundation

## Purpose

Implement the first cluster and phase of the Paper and Ink UI overhaul. This phase prepares the app for later component-level redesign work by landing the design token system, Tailwind extensions, font loading, and compatibility CSS.

Do not restyle application components in this phase. The app should still behave like the current portfolio after this work, but the Paper and Ink design primitives must be available for subsequent phases.

## Source References

Read these before editing:

- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/styles/tokens.css`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/styles/index.css`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/tailwind.config.js`
- `/Users/viethungpham/Documents/GitHub/3D_Viet-Hung-Portfolio/docs/paper-ink-ui-overhaul-integration-plan.md`

## Target Files

Expected changed files:

- `src/styles/tokens.css`
- `src/styles/index.css`
- `tailwind.config.js`
- `index.html`

Possible changed file:

- `src/main.tsx`, only if removing `src/styles/button.css` after verifying no current JSX still depends on `.fill-button`.

No page or component files should be changed in cAp1.

## In Scope

- Add the Paper and Ink CSS token system.
- Add reusable CSS primitives for paper surfaces, typography, controls, and ornaments.
- Extend Tailwind with token-backed colors, fonts, and shadows.
- Add Google Fonts loading.
- Preserve compatibility with the current JSX and existing class names.
- Keep the app typechecking and building before any page/component ports happen.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not restyle `Navbar`, `HomeInfo`, `Loader`, `About`, `Projects`, `Contact`, `ChatBot`, `Alert`, or route pages.
- Do not edit Three.js models, scene positions, camera settings, animation behavior, or controls.
- Do not edit Redux state, i18n setup, Supabase services, EmailJS, Gemini chatbot logic, or environment variables.
- Do not remove old CSS primitives unless they are provably unused and their removal is necessary for this phase.
- Do not introduce new dependencies.

## Implementation Requirements

### 1. Add `src/styles/tokens.css`

Create `src/styles/tokens.css` using the handoff reference as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/styles/tokens.css`

The file must include the Paper and Ink token families:

- `--font-display`
- `--font-ui`
- `--font-mono`
- `--paper-0`
- `--paper-1`
- `--paper-2`
- `--paper-edge`
- `--ink-900`
- `--ink-700`
- `--ink-500`
- `--ink-300`
- `--ink-100`
- `--accent`
- `--accent-soft`
- `--accent-wash`
- `--rule`
- `--rule-strong`
- `--shadow-card`
- `--shadow-press`
- `--focus-ring`
- `--grain-opacity`
- `--vignette`

The file must include light-mode values under `:root` and dark-mode values under `.dark`.

The file must also include these CSS primitives:

- `.paper`
- `.grain`
- `.vignette`
- `.t-display`
- `.t-display-italic`
- `.t-ui`
- `.t-mono`
- `.t-eyebrow`
- `.t-drop`
- `.card-paper`
- `.plate`
- `.rule-double`
- `.seal`
- `.btn-ink`
- `.btn-quill`
- `.btn-stamp`
- `.input-ms`
- `.tag-ink`
- `.corners`
- `.scribble`
- `.hairline`
- `:focus-visible`

Font loading decision:

- Prefer loading Google Fonts through `index.html`.
- If `tokens.css` contains a Google Fonts `@import`, remove it to avoid duplicate font requests.

### 2. Update `src/styles/index.css`

Import the token file at the top:

```css
@import url("./tokens.css");
```

Keep Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Set body defaults:

```css
body {
  font-family: var(--font-ui);
  color: var(--ink-900);
  background: var(--paper-0);
}
```

Preserve or rewrite these existing utility names so the current app still compiles and renders during later phased work:

- `.max-container`
- `.head-text`
- `.subhead-text`
- `.blue-gradient_text`
- `.input`
- `.textarea`
- `.btn`
- `.custom-spinner`
- `.loading-bar`
- `.no-select`
- `body.dragging`

Compatibility expectations:

- `.blue-gradient_text` should become token/accent based, but the class name must remain.
- `.input` and `.textarea` should map to the manuscript input direction but remain usable by current `Contact.tsx`.
- `.btn` should map to the ink button direction but remain usable by current `Contact.tsx`.
- `.custom-spinner` should continue to render a visible spinner for current `Loader.tsx` and `Contact.tsx` fallback states.
- `.loading-bar` should remain visible for translation/data loading skeletons.

Do not delete these old selectors in this phase unless no references remain:

- `.glassmorphism`
- `.block-container`
- `.neo-brutalism-blue`
- `.neo-brutalism-white`
- `.fill-button`
- `.fill-button-dark`

If old selectors are retained, they may be visually softened or tokenized, but they must not break existing consumers.

### 3. Update `tailwind.config.js`

Keep:

```js
darkMode: "class"
```

Add token-backed colors:

```js
colors: {
  paper: {
    0: "var(--paper-0)",
    1: "var(--paper-1)",
    2: "var(--paper-2)",
    edge: "var(--paper-edge)",
  },
  ink: {
    100: "var(--ink-100)",
    300: "var(--ink-300)",
    500: "var(--ink-500)",
    700: "var(--ink-700)",
    900: "var(--ink-900)",
  },
  accent: {
    DEFAULT: "var(--accent)",
    soft: "var(--accent-soft)",
    wash: "var(--accent-wash)",
  },
  rule: "var(--rule)",
  "rule-strong": "var(--rule-strong)",
}
```

Add token-backed font families:

```js
fontFamily: {
  display: ["Cormorant Garamond", "Iowan Old Style", "Palatino", "serif"],
  ui: ["Inter", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"],
  worksans: ["Inter", "sans-serif"],
  poppins: ["Cormorant Garamond", "serif"],
}
```

Add token-backed shadows:

```js
boxShadow: {
  card: "var(--shadow-card)",
  press: "var(--shadow-press)",
}
```

Preserve the existing `content` paths:

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### 4. Update `index.html`

Add these font loading tags inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Do not remove existing metadata or app script tags.

### 5. Keep `src/main.tsx` Stable

The current import order should remain valid:

```ts
import "./styles/reset.css";
import "./styles/index.css";
import "./styles/button.css";
```

Only remove `button.css` if:

1. You run a search and confirm `.fill-button` and `.fill-button-dark` are no longer used anywhere.
2. Removing it does not break the current app.
3. You document that decision in the implementation report.

For cAp1, retaining `button.css` is acceptable and safer.

## Constraints

- Use `apply_patch` for manual file edits.
- Do not use destructive git commands.
- Do not modify behavior.
- Do not change page/component JSX.
- Do not add runtime dependencies.
- Preserve current class names needed by current components.
- Keep the implementation compatible with the current phased migration plan.

## Required Validation

Run these commands:

```bash
npm run typecheck
npm run build
```

Run tests if feasible:

```bash
npm test -- --runInBand
```

If any validation is skipped or fails, document the exact command and reason in the implementation report.

## Post-Implementation Report

After implementation, create a report under:

`audit/reports/`

Required report filename:

`audit/reports/cap1-paper-ink-foundation-report.md`

Create the `audit/reports` directory if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe the change in each file.

3. Design Token Coverage
   - Confirm that Paper and Ink light/dark CSS variables were added.
   - Confirm that core primitives like `.paper`, `.grain`, `.vignette`, `.plate`, `.seal`, `.btn-quill`, `.btn-stamp`, `.input-ms`, `.tag-ink`, `.corners`, and `.scribble` exist.

4. Compatibility Notes
   - Confirm that legacy aliases remain available.
   - Call out any old CSS that was retained intentionally.
   - Call out any old CSS that was removed, with reason.

5. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

6. Risks or Follow-Ups
   - Note any design handoff mismatch or implementation compromise.
   - Note any issue that should be handled by later clusters.

7. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp2.

## Acceptance Criteria

cAp1 is complete when:

- `src/styles/tokens.css` exists and contains the Paper and Ink token system.
- `src/styles/index.css` imports `tokens.css`.
- Tailwind supports:
  - `text-ink-900`
  - `text-ink-700`
  - `text-ink-500`
  - `bg-paper-0`
  - `bg-paper-1`
  - `bg-paper-2`
  - `text-accent`
  - `bg-accent`
  - `font-display`
  - `font-ui`
  - `font-mono`
  - `shadow-card`
  - `shadow-press`
- Current components still compile without missing CSS dependencies.
- No component or page behavior is changed.
- `npm run typecheck` passes.
- `npm run build` passes.
- The implementation report exists at `audit/reports/cap1-paper-ink-foundation-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected:

- Add `src/styles/tokens.css`.
- Modify `src/styles/index.css`.
- Modify `tailwind.config.js`.
- Modify `index.html`.
- Add `audit/reports/cap1-paper-ink-foundation-report.md`.

Possible:

- Modify `src/main.tsx` only if stylesheet cleanup is proven safe.

Unexpected for this phase:

- Changes to `src/components/*`.
- Changes to `src/pages/*`.
- Changes to `src/models/*`.
- Changes to data fetching, i18n runtime behavior, Redux, EmailJS, or Gemini chatbot logic.
