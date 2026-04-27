# cAp6: Paper and Ink Contact Page and Alert Port

## Purpose

Implement the sixth cluster and phase of the Paper and Ink UI overhaul. This phase ports the Contact route and shared Alert banner to the manuscript form, preserved Three.js scene, and strip-style feedback treatment.

This phase includes a small behavior fix: the current `Contact.tsx` submit flow shows a success alert from `finally` even after EmailJS fails. Correct that while preserving the intended success/error user experience.

## Current Assumptions

cAp1 through cAp5 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- Shared chrome is Paper and Ink.
- Home entry surfaces are Paper and Ink.
- About page is Paper and Ink.
- Projects page is Paper and Ink.
- `src/styles/button.css` has been retired and must not be reintroduced.
- Reports exist for cAp1 through cAp5.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `docs/specs/cap4-paper-ink-about-page.md`
- `docs/specs/cap5-paper-ink-projects-page.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `audit/reports/cap4-paper-ink-about-page-report.md`
- `audit/reports/cap5-paper-ink-projects-page-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Primary target files:

- `src/pages/Contact.tsx`
- `src/components/Alert.tsx`
- `src/components/Alert.test.tsx`

Possible locale files only if needed:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## In Scope

- Port `Contact.tsx` to the Paper and Ink two-column contact layout.
- Preserve the Sif and bonfire Three.js scene.
- Preserve EmailJS configuration and request payload.
- Preserve form state, input handling, required fields, and Sif animation transitions.
- Correct the false success alert behavior after EmailJS errors.
- Port `Alert.tsx` to the strip-style Paper and Ink banner.
- Update `Alert.test.tsx` to assert the new alert behavior/styles.
- Restyle Contact loading skeletons, footer, and form controls using Paper and Ink tokens.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit `src/models/Sif.tsx`, `src/models/Bonfire.tsx`, model assets, or scene model components.
- Do not edit Redux slices, Supabase services, EmailJS environment names, Gemini chatbot logic, shared chrome, Home, About, Projects, Loader, HomeInfo, or ChatBot.
- Do not add dependencies.
- Do not reintroduce `src/styles/button.css` or `.fill-button`.
- Do not redesign the Alert hook API.
- Do not create a global component library in this phase.

## Existing Behavior to Preserve

Contact form:

- `form` state has `name`, `email`, and `message`.
- `isLoading` controls submit pending state.
- `currentAnimation` can be:
  - `idle`
  - `walking`
  - `running`
  - `attack`
- `handleFocus` sets animation to `walking`.
- `handleBlur` sets animation to `idle`.
- Submit sets loading true and animation to `running`.
- EmailJS sends:

```ts
{
  from_name: form.name,
  to_name: "Viet Hung Pham",
  from_email: form.email,
  to_email: "hung.v.pham002@gmail.com",
  message: form.message,
}
```

- Success clears form and eventually returns animation to `idle`.
- Error shows danger alert and returns animation to `idle`.

Scene:

- Keep `Scene` component behavior and light settings intact unless a type or layout issue forces a small non-behavioral edit.
- Keep `Canvas` camera and GL settings intact unless a visual wrapper requires only class/layout changes.
- Keep the `ResizeObserver` canvas-height logic initially. Do not remove it unless browser screenshots prove pure CSS is safe.

Alert:

- Keep prop shape:

```ts
const Alert = ({ type, text }: { type: string; text: string }) => { ... }
```

- Keep `role="alert"`.

## Required Behavior Fix

Current `handleSubmit` has this bug:

- `catch` shows a danger alert.
- `finally` then always shows success.

Required:

- Show success only when `emailjs.send(...)` succeeds.
- Show danger only when it fails.
- Do not show success after failure.
- Keep `isLoading` reset in all cases.
- Keep the existing alert auto-dismiss timing around 2500ms unless there is a clear reason to adjust.
- Keep form clearing on success.
- Do not clear the form immediately on failure.

Recommended shape:

```ts
try {
  await emailjs.send(...);
  showAlert({ text: successText, type: "success" });
  setCurrentAnimation("attack");
  setForm({ name: "", email: "", message: "" });
  setTimeout(() => {
    hideAlert();
    setCurrentAnimation("idle");
  }, 2500);
} catch (error) {
  setCurrentAnimation("idle");
  showAlert({ text: errorMessage, type: "danger" });
  setTimeout(() => {
    hideAlert();
  }, 2500);
} finally {
  setIsLoading(false);
}
```

Document this fix in the cAp6 report.

## Design Direction

Mirror the Contact and Alert artboards from `_source/surfaces.jsx` and the handoff README:

- Contact is two columns on desktop:
  - left: manuscript form.
  - right: preserved Three.js scene.
- On mobile, stack the form and scene.
- Form labels are mono eyebrow labels.
- Inputs use manuscript underline treatment via `.input-ms` or the tokenized `.input`/`.textarea`.
- Submit uses `.btn-ink` or `.btn-quill`.
- A small scene caption can overlay the scene using translucent paper.
- Alert is an inline strip banner, not a rounded blue/red card.

Use Paper and Ink primitives:

- `.plate`
- `.card-paper`
- `.rule-double`
- `.t-eyebrow`
- `.t-display`
- `.t-display-italic`
- `.t-ui`
- `.t-mono`
- `.input-ms`
- `.btn-ink`
- `.btn-quill`
- `.loading-bar`

## Implementation Requirements

### 1. Update `src/components/Alert.tsx`

Replace the current blue/red rounded alert with the strip-style banner.

Required visual:

- Outer positioning:
  - anchored under the navbar.
  - centered horizontally.
  - above Contact content.
  - `pointer-events-none` on the wrapper.
  - `pointer-events-auto` on the alert strip.
- Strip:
  - `inline-flex`.
  - no rounded corners.
  - `box-shadow: var(--shadow-card)`.
  - border uses token colors.
  - success background uses `var(--ink-900)`.
  - danger background uses `var(--accent)`.
- Left segment:
  - mono uppercase label.
  - success label: `SENT`.
  - danger label: `FAILED`.
  - text color: `var(--paper-0)`.
- Right segment:
  - display italic message.
  - text color: `var(--paper-0)`.
  - renders the passed `text`.

Required behavior:

- Preserve `role="alert"`.
- Preserve existing props.
- Do not introduce alert state into this component.

### 2. Update `src/components/Alert.test.tsx`

The current test asserts `bg-blue-800` and `bg-red-800`. Those classes should no longer exist in `Alert.tsx`.

Required:

- Keep the test that verifies the alert text renders.
- Update styling/behavior tests to match new public output.
- Recommended assertions:
  - success render includes `SENT`.
  - danger render includes `FAILED`.
  - both states preserve `role="alert"`.
  - message text renders for both states.

Do not overfit tests to long inline style strings unless necessary.

### 3. Update `src/pages/Contact.tsx` Layout

Keep imports for EmailJS, R3F, drei, Redux, alerts, and models as needed.

Required layout:

- Main section:
  - below fixed navbar.
  - desktop two-column layout.
  - mobile stacked layout.
  - max-width similar to other ported pages.
  - tokenized border/rule between form and scene on desktop if visually useful.
- Left form side:
  - `Chapter IV` eyebrow or similar technical manuscript label.
  - display heading using existing `t("contact_title")`.
  - optional short display italic note; avoid adding locale keys unless necessary.
  - form with generous gaps.
- Right scene side:
  - preserve `<Canvas>` and `<Scene currentAnimation={currentAnimation} />`.
  - add a small paper caption overlay if it does not interfere with canvas.

Do not replace the Three.js scene with a placeholder.

### 4. Form Controls

Required:

- Each field label uses `.t-eyebrow`.
- Inputs use `.input-ms` or existing tokenized `.input`.
- Textarea uses `.input-ms` or tokenized `.textarea`.
- Textarea should have a useful height, roughly `min-height: 160px` on desktop.
- Use existing translation keys:
  - `contact_name`
  - `contact_email`
  - `contact_message`
  - `contact_message_placeholder`
  - `contact_send_message`
- Keep current placeholders if desired:
  - name: `Sir Astorias, The Abysswalker`
  - email: `sif@gmail.com`
- Required attributes remain on all fields.
- `name` attributes remain:
  - `name`
  - `email`
  - `message`
- `value`, `onChange`, `onFocus`, and `onBlur` are preserved.

Submit button:

- Use `.btn-ink` or `.btn-quill`.
- Keep `type="submit"`.
- Keep disabled state when `isLoading`.
- Use existing `contact_send_message` for idle label.
- For loading label, use the best available key:
  - `t("contact_sending", { defaultValue: t("contact_send_message") + "..." })`
  - or add `contact_sending` to all locale files if necessary.

### 5. Translation Loading State

Preserve:

- `isTranslationsLoading`.
- `reloadTranslations()`.

Restyle skeletons:

- Use `.loading-bar`.
- Use tokenized sizing and no blue/gray dark classes.
- Keep enough skeleton height for the existing `ResizeObserver` measurement.

### 6. Canvas and Scene Preservation

Keep these unless a purely visual wrapper requires otherwise:

- `Scene` component.
- `lightSettings`.
- `currentLightConfig`.
- `Environment`, lights, shadows.
- `Bonfire` props.
- `Sif` props.
- `Canvas` camera.
- `Canvas` GL options.
- `Suspense` fallback with `Html center`.

Allowed visual fallback tweak:

- The fallback spinner can use the tokenized `.custom-spinner`, already provided by cAp1.
- Do not create a new loader component.

Canvas height:

- Preserve `formRef`, `canvasContainerRef`, and `ResizeObserver` logic.
- If changing layout classes breaks the sizing logic, adjust the measurements carefully and document it.
- Do not remove this logic unless browser visual verification proves the scene stays framed across desktop and mobile.

### 7. Footer

Restyle footer with tokens:

- `.t-eyebrow` or `font-mono`.
- `text-ink-300`.
- No gray utility dependency if practical.

Do not change the copyright year unless explicitly asked.

## Locale Guidance

Prefer existing keys:

- `contact_title`
- `contact_email`
- `contact_name`
- `contact_message`
- `contact_message_placeholder`
- `contact_send_message`

Potential key:

- `contact_sending`

Current state:

- `vi.json` already has `contact_sending`.
- `en.json` and `zh.json` may not.

Preferred approach:

- Use `t("contact_sending", { defaultValue: `${t("contact_send_message")}...` })` to avoid locale churn and Supabase translation-sync risk.

If adding locale keys:

- Update all three files.
- Document the added keys in the report.

Do not edit `src/i18n.ts`.

## Constraints

- Use `apply_patch` for manual file edits.
- Keep edits scoped to `Contact.tsx`, `Alert.tsx`, `Alert.test.tsx`, and optional locale files.
- Do not edit model files.
- Do not edit service/schema/type files.
- Do not add dependencies.
- Do not reintroduce blue/glassmorphism UI.
- Do not reintroduce `button.css` or `.fill-button`.
- Preserve EmailJS payload and env var names.
- Preserve Sif animation state names.
- Keep TypeScript validation passing.
- Keep layout responsive without text overlap.

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
- Visit `/contact`.
- Confirm the route returns HTTP 200.
- If browser interaction is available:
  - focus each field and confirm no errors.
  - verify Sif animation state changes on focus/blur if inspectable.
  - verify required fields still block submit.
  - verify alert strip appears for a simulated success/error if feasible.
  - verify canvas is nonblank.
  - verify mobile width does not overlap form and scene.

Do not submit a real external email during smoke testing unless the user explicitly approves it.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap6-paper-ink-contact-alert-report.md`

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
   - Confirm no Supabase service/schema/type files were changed.
   - Confirm no non-Contact route pages were changed.
   - Confirm no shared chrome, Home, About, Projects, or ChatBot files were changed.
   - Confirm `button.css` was not reintroduced.

4. Visual Coverage
   - Confirm Contact uses Paper and Ink form layout.
   - Confirm form controls use manuscript labels and inputs.
   - Confirm Three.js scene remains present.
   - Confirm Alert uses strip banner treatment.
   - Confirm loading skeletons and footer are tokenized.

5. Behavior Preservation
   - Confirm EmailJS payload and env vars are unchanged.
   - Confirm form state and handlers are preserved.
   - Confirm focus/blur animation behavior remains.
   - Confirm submit pending state remains.
   - Confirm `ResizeObserver`/canvas sizing logic is preserved or explain any adjustment.

6. Submit Bug Fix
   - Confirm success is only shown after EmailJS success.
   - Confirm failure no longer shows success afterward.
   - Confirm form clearing behavior on success/failure.

7. Alert Test Updates
   - Summarize how `Alert.test.tsx` was updated.

8. Locale Changes
   - List any locale keys added.
   - If no locale keys were added, state that explicitly.

9. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

10. Risks or Follow-Ups
   - Note any browser/mobile visual smoke coverage that could not be completed.
   - Note any design compromise against the handoff.
   - Note next-phase implications for cAp7.

11. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp7.

## Acceptance Criteria

cAp6 is complete when:

- `src/pages/Contact.tsx` is ported to the Paper and Ink contact design direction.
- `src/components/Alert.tsx` is ported to the strip banner design.
- `src/components/Alert.test.tsx` passes with the new alert expectations.
- EmailJS env var names and payload are unchanged.
- Success alert appears only on successful send.
- Failure alert does not get overwritten by success.
- Form focus/blur animation state behavior remains.
- The Sif and bonfire Three.js scene remains in the route.
- Canvas sizing logic is preserved or carefully documented if adjusted.
- Loading skeletons and footer use Paper and Ink tokens.
- No model files are changed.
- No non-Contact route pages are changed.
- `button.css` is not reintroduced.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes.
- The implementation report exists at `audit/reports/cap6-paper-ink-contact-alert-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/pages/Contact.tsx`
- `src/components/Alert.tsx`
- `src/components/Alert.test.tsx`
- `audit/reports/cap6-paper-ink-contact-alert-report.md`

Possible changed files:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Unexpected for this phase:

- Changes to `src/models/*`
- Changes to `src/services/*`
- Changes to `src/types/supabase.ts`
- Changes to `src/pages/Home.tsx`
- Changes to `src/pages/About.tsx`
- Changes to `src/pages/Projects.tsx`
- Changes to `src/components/ChatBot.tsx`
- Changes to shared chrome components
- Changes to Redux, Supabase services, EmailJS env names, Gemini, or i18n runtime setup
- Reintroduction of `src/styles/button.css`
