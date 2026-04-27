# cAp3: Paper and Ink Home Entry Experience and Loader

## Purpose

Implement the third cluster and phase of the Paper and Ink UI overhaul. This phase ports the Home entry experience surfaces:

- Full-screen loader.
- Floating Home stage information card.
- Home on-canvas control buttons.

This phase must preserve all React Three Fiber scene behavior. The 3D canvas, models, animation logic, stage detection, camera settings, lighting, drag, zoom, and key simulation behavior are out of scope except where existing control buttons need visual-only class changes.

## Current Assumptions

cAp1 and cAp2 are complete and validated:

- `src/styles/tokens.css` exists.
- `src/styles/index.css` imports `tokens.css`.
- `src/App.tsx` uses `paper grain vignette min-h-screen`.
- `Navbar`, `ThemeToggle`, `LanguageToggle`, and `VersionMark` are already tokenized.
- `src/styles/button.css` is still imported because `HomeInfo.tsx` still uses `.fill-button`.
- `audit/reports/cap1-paper-ink-foundation-report.md` exists.
- `audit/reports/cap2-paper-ink-shared-chrome-report.md` exists.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Loader.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/HomeInfo.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Current target files:

- `src/components/Loader.tsx`
- `src/components/HomeInfo.tsx`
- `src/pages/Home.tsx`

Possible cleanup files:

- `src/main.tsx`
- `src/styles/button.css`

Possible i18n files only if needed:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## In Scope

- Restyle `Loader.tsx` as the Paper and Ink prologue loader.
- Preserve loader progress and start gating behavior.
- Restyle `HomeInfo.tsx` as a translucent manuscript stage card.
- Preserve HomeInfo Supabase data fetch and i18n mapping.
- Restyle Home control buttons as stamped manuscript keycaps.
- Preserve all existing Home control handlers and simulated key behavior.
- Remove `src/styles/button.css` only if `HomeInfo` no longer uses `.fill-button` and a search proves no remaining runtime references.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit `src/models/*`.
- Do not edit `src/hooks/useArrowHandlers.ts`.
- Do not edit Home scene setup, model positions, lighting values, camera values, or animation logic.
- Do not edit `Navbar`, `ThemeToggle`, `LanguageToggle`, `VersionMark`, `ChatBot`, `Alert`, `About`, `Projects`, or `Contact`.
- Do not change Redux, Supabase services, i18n runtime setup, EmailJS, Gemini chatbot logic, or environment variables.
- Do not add dependencies.
- Do not create a broad CSS cleanup beyond the possible `button.css` retirement described below.

## Implementation Requirements

### 1. Update `src/components/Loader.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Loader.tsx`

Required behavior to preserve:

- Keep `useProgress()` from `@react-three/drei`.
- Keep `progress`, `total`, `loaded`, and `active`.
- Keep monotonic `displayProgress` behavior so progress never goes backwards.
- Keep `reloadTranslations()` and the translation loading skeleton behavior.
- Keep the completion gate:
  - complete only when `!active`
  - `loaded === total`
  - `displayProgress === 100`
- Keep `canStart`.
- Keep `onStarted?.()` only firing when `canStart` is true.
- Keep the existing `LoaderProps` API:

```ts
interface LoaderProps {
  onStarted?: () => void;
}
```

Required visual:

- Root wrapper:

```tsx
<div className="paper grain vignette fixed inset-0 z-50 flex flex-col items-center justify-center px-4">
```

- Keep `LanguageToggle` top-right.
- Keep `VersionMark` bottom-right.
- Add mono eyebrow:

```text
-- Prologue --
```

ASCII hyphens are acceptable in code. Do not introduce decorative Unicode unless already present in copied handoff code and accepted by the file style.

- Heading:
  - `font-display`
  - `text-4xl sm:text-5xl md:text-6xl`
  - `text-ink-900`
  - `leading-none`
  - accent treatment for part of the title is allowed, but do not split translated text by spaces.

Translation safety requirement:

- Do not use this pattern:

```ts
t("Welcome to My Journey").split(" ")
```

- Preferred implementation: render the existing translated title as a single safe string:

```tsx
{t("Welcome to My Journey")}
```

- If the title is split for accent styling, use explicit translation keys for the split parts in all languages and provide safe defaults. Do not infer split points from spaces.

Subtitle:

- Keep existing translation key:

```ts
t("Explore an interactive timeline of my professional development through an immersive 3D experience.")
```

- Style as display italic / `text-ink-700`.

Guide plate:

- Use `.plate`.
- Width around `max-w-md`.
- Header uses `t("Quick Guide")`.
- Render the four existing guide rows:
  - `Movement` -> `Left/Right Arrows or Left Mouse`
  - `Rotation` -> `Middle Mouse Button + Drag`
  - `Animations` -> `Press Q, W, E, or R`
  - `Zoom` -> `Mouse Wheel`
- Use display italic labels and mono values.
- Use dotted rules between rows with `var(--rule)`.

Progress control:

- Replace the old blue spinner visual with a wax-seal style progress control.
- Use an SVG ring:
  - circle radius `52`
  - base stroke `var(--rule)`
  - progress stroke `var(--accent)`
  - rotate progress start to top
- Use a 120px by 120px container.
- Use a radial seal disk inside the ring.
- Show `Math.round(displayProgress)}%` inside the seal.
- Keep the `button` disabled until `canStart`.
- Keep the existing accessible label logic:
  - ready: `t("Click to start experience")`
  - loading: `t("Loading models")`

Start/loading label:

- Ready state shows `t("Click to Start")` in display italic accent.
- Loading state shows `t("Loading assets...")` or a loading bar if translations are loading.

Asset count:

- When `active`, show bottom-left mono text:

```tsx
{t("Loaded")} {loaded} {t("of")} {total} {t("assets")}
```

### 2. Update `src/components/HomeInfo.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/HomeInfo.tsx`

Required behavior to preserve:

- Keep `currentStage: number | null` prop.
- Keep `getHomeInfo()` data fetch.
- Keep `homeInfo` type.
- Keep translation of:
  - `stageInfo.text`
  - `stageInfo.linkText`
- Keep the 150ms opacity transition timing unless there is a clear reason to adjust.
- Keep the link destination from Supabase data.

Required cleanup:

- Remove the `arrow` image import.
- Remove `useSelector`, `RootState`, and theme lookup if they are no longer used.
- Remove `.fill-button` and `.fill-button-dark` usage.

Stage label:

- Add a helper that maps stages to Roman numerals:

```ts
const stageLabel = (stage: number) => {
  const roman = ["", "I", "II", "III", "IV"][stage] || String(stage);
  return `Stage ${roman}`;
};
```

Required visual:

- Outer wrapper:
  - `mx-5`
  - `max-w-2xl`
  - opacity transition
- Card:
  - `.corners`
  - `relative`
  - responsive horizontal padding
  - centered text
  - background:

```css
color-mix(in srgb, var(--paper-0) 78%, transparent)
```

  - `backdrop-filter: blur(10px)`
  - `border: 1px solid var(--rule-strong)`
  - `box-shadow: var(--shadow-card)`
- Add corner ornament spans:

```tsx
<span className="corner-tl" />
<span className="corner-br" />
```

- Eyebrow:

```tsx
<div className="t-eyebrow">-- {stageLabel(stage)} --</div>
```

- Quote text:
  - `font-display`
  - italic
  - `text-ink-900`
  - `fontWeight: 500`
  - responsive clamp around 18-22px
  - avoid rendering an empty quoted line if content has not loaded yet.
- CTA:
  - `Link`
  - `className="btn-quill no-underline"`
  - use existing translated `linkText`
  - use ASCII `->` unless project style already accepts the decorative arrow.

### 3. Update `src/pages/Home.tsx`

This file contains both the Home route shell and the `SceneContent` implementation. Keep edits tightly scoped to the overlay controls and loader wrapper.

Allowed edits:

- The loader overlay wrapper around `<Loader />`.
- The control button JSX in the overlay layer.
- Small helper component/function inside `Home.tsx` to reduce duplicated button markup.

Do not edit:

- `lightingConfig`
- `<Canvas>` props
- light definitions
- model imports
- `SceneContent`
- model scale/position/rotation helpers
- pointer/keyboard/touch handlers inside `SceneContent`
- Ciri stage detection
- `useFrame` logic

Loader wrapper:

- The current wrapper uses gray backgrounds:

```tsx
<div className="fixed top-0 left-0 right-0 bottom-0 z-[999] bg-gray-100 dark:bg-gray-800">
```

- Replace it with a neutral wrapper that does not fight the loader root. Acceptable:

```tsx
<div className="fixed inset-0 z-[999]">
```

Home control buttons:

- Replace old glass/rounded control classes with `.btn-stamp`.
- Preserve all existing event handlers exactly:
  - left/right buttons must continue to spread `leftHandlers` and `rightHandlers`.
  - Q/W/E/R buttons must continue to call `handleMoveStart(key)` and `handleMoveEnd(key)` for touch and mouse events.
  - `aria-label`s must remain meaningful.
- Preserve desktop and mobile layout separation:
  - desktop controls visible at `md` and up.
  - mobile controls visible below `md`.
- Preserve bottom-center placement and `pointer-events-auto`.

Recommended helper shape:

```tsx
type ControlButtonProps = {
  label: string;
  cap?: string;
  ariaLabel: string;
  size?: "desktop" | "mobile";
  handlers?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};
```

This is optional. If used, keep it inside `Home.tsx`.

Button visual requirements:

- Desktop buttons:
  - use `.btn-stamp`
  - stable 56-64px square sizing
  - primary glyph on top
  - small mono cap label under it
- Mobile buttons:
  - use `.btn-stamp`
  - stable 48px square sizing
  - text must not overflow
- Add a simple vertical divider between arrow controls and Q/W/E/R on desktop if it does not complicate the markup.

Button label guidance:

- Left/right caps: `LEFT`, `RIGHT`.
- Arrow glyphs may use ASCII `<` and `>` to avoid introducing new decorative Unicode.
- Q/W/E/R caps should not be misleading. Do not use `IDLE`, `WALK`, `RUN`, or `DRAW` unless you verify those are the actual Home model actions.
- Acceptable short caps based on current `Ciri.tsx` mapping:
  - Q: `PIRO`
  - W: `CELE`
  - E: `TRK`
  - R: `WHIRL`
- If caps are omitted for Q/W/E/R, keep the button accessible via `aria-label`.

### 4. Optional Cleanup: Retire `button.css`

After `HomeInfo.tsx` no longer uses `.fill-button` or `.fill-button-dark`, run:

```bash
rg -n "fill-button|fill-button-dark|button.css" src
```

If the only remaining runtime reference is the `button.css` import in `src/main.tsx`:

- Remove `import "./styles/button.css";` from `src/main.tsx`.
- Delete `src/styles/button.css`.
- Document the cleanup in the report.

If any runtime references remain:

- Keep `src/styles/button.css`.
- Keep the import in `src/main.tsx`.
- Document why cleanup was deferred.

Do not remove historical mentions in `docs/` or `audit/reports/`; only runtime references matter for this cleanup.

### 5. Optional i18n Key Additions

Only add locale keys if needed to avoid unsafe title splitting. If added, update all three locale files:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Do not edit `src/i18n.ts`.

Remember that the app currently loads translations from Supabase at runtime. New local JSON keys may not be sufficient in production unless they are also present in Supabase. Prefer using existing keys when possible.

## Constraints

- Use `apply_patch` for manual file edits.
- Keep edits scoped to the files listed in this spec.
- Do not use destructive git commands.
- Do not change 3D scene behavior.
- Do not alter route paths.
- Do not add dependencies.
- Do not introduce page-level redesign outside Home entry surfaces.
- Preserve existing translated strings where possible.
- Do not use word-based splitting of translated strings.

## Required Validation

Run:

```bash
npm run typecheck
npm run build
```

Run tests:

```bash
npm test -- --runInBand
```

Perform a lightweight local smoke test if feasible:

- Start the app with `npm run dev`.
- Visit `/`.
- Confirm the route returns HTTP 200.
- Start the Home experience by activating the loader button after assets finish loading, if browser interaction is available.
- Confirm the Home canvas is nonblank, if browser interaction or screenshots are available.
- Confirm Q/W/E/R and left/right controls are still clickable/touchable, if browser interaction is available.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap3-paper-ink-home-entry-loader-report.md`

Create `audit/reports` if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe each change.

3. Scope Compliance
   - Confirm no model files were changed.
   - Confirm no `SceneContent` behavior was changed.
   - Confirm no non-Home route page files were changed.
   - Confirm `ChatBot`, `Alert`, `About`, `Projects`, and `Contact` were not changed.

4. Visual Coverage
   - Confirm Loader uses `paper grain vignette`.
   - Confirm Loader uses the manuscript prologue, guide plate, and wax-seal progress treatment.
   - Confirm HomeInfo uses `.corners`, translucent paper background, stage Roman numerals, display quote, and `.btn-quill`.
   - Confirm Home controls use `.btn-stamp`.

5. Behavior Preservation
   - Confirm loader `useProgress()` behavior and `onStarted` gating are preserved.
   - Confirm HomeInfo still fetches `getHomeInfo()` and translates content.
   - Confirm left/right controls still use `leftHandlers` and `rightHandlers`.
   - Confirm Q/W/E/R controls still call the same start/end handlers.

6. `button.css` Cleanup Result
   - State whether `src/styles/button.css` was removed or retained.
   - Include the search result summary that justified the decision.

7. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

8. Risks or Follow-Ups
   - Note any browser or 3D visual smoke coverage that could not be completed.
   - Note any remaining loader/Home visual mismatch against the handoff.
   - Note next-phase implications for cAp4.

9. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp4.

## Acceptance Criteria

cAp3 is complete when:

- `src/components/Loader.tsx` uses the Paper and Ink prologue loader treatment.
- Loader progress, completion gating, and `onStarted` behavior are preserved.
- Loader does not split translated title text by spaces.
- `src/components/HomeInfo.tsx` uses the Paper and Ink stage card treatment.
- HomeInfo no longer uses `.fill-button` or `.fill-button-dark`.
- `src/pages/Home.tsx` Home overlay controls use stamped manuscript buttons.
- Home scene setup and `SceneContent` behavior are not changed.
- `button.css` is either safely removed after proving no runtime references remain, or retained with a documented reason.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes, or any failure is documented with cause.
- The implementation report exists at `audit/reports/cap3-paper-ink-home-entry-loader-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/components/Loader.tsx`
- `src/components/HomeInfo.tsx`
- `src/pages/Home.tsx`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`

Possible changed files:

- `src/main.tsx`
- `src/styles/button.css`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Unexpected for this phase:

- Changes to `src/models/*`
- Changes to `src/hooks/useArrowHandlers.ts`
- Changes to `src/components/ChatBot.tsx`
- Changes to `src/components/Alert.tsx`
- Changes to `src/pages/About.tsx`
- Changes to `src/pages/Projects.tsx`
- Changes to `src/pages/Contact.tsx`
- Changes to Redux, Supabase services, EmailJS, Gemini, or i18n runtime setup
