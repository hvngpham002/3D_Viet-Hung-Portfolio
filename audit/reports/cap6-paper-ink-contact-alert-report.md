# cAp6 Paper and Ink Contact Alert Report

## 1. Summary

Implemented the Paper and Ink Contact and Alert port:

- Converted `Contact` to the manuscript two-column form and preserved Sif plus bonfire scene.
- Converted `Alert` to the top-centered strip banner with `SENT` and `FAILED` states.
- Fixed the submit flow so success is shown only after `emailjs.send(...)` resolves.
- Updated Alert tests for the new public output and alert semantics.

Intentionally left unchanged:

- EmailJS environment variable names and request payload.
- Sif, Bonfire, scene lighting, Canvas camera, and Canvas GL settings.
- Redux, Supabase services/schema/types, Gemini chatbot logic, shared chrome, Home, About, Projects, Loader, and HomeInfo.
- Existing footer copyright year.

## 2. Files Changed

- `src/pages/Contact.tsx`
  - Ported the route to the Paper and Ink two-column layout, tokenized loading bars, manuscript labels, `.input-ms` controls, `.btn-ink` submit button, scene caption, and tokenized footer.
  - Moved success alert handling into the EmailJS success path and kept loading reset in `finally`.
- `src/components/Alert.tsx`
  - Replaced the blue/red rounded banner with a fixed top-center strip using token colors, mono state label, display italic body text, and preserved `role="alert"`.
- `src/components/Alert.test.tsx`
  - Replaced old `bg-blue-800`/`bg-red-800` assertions with `SENT`, `FAILED`, message text, and `role="alert"` assertions.
- `audit/reports/cap6-paper-ink-contact-alert-report.md`
  - Added this implementation report.

## 3. Scope Compliance

- No model files were changed.
- No Supabase service, schema, or type files were changed.
- No non-Contact route pages were changed.
- Shared chrome, Home, About, Projects, and ChatBot files were not changed.
- `src/styles/button.css` was not reintroduced.
- No dependencies were added.

## 4. Visual Coverage

- Contact now uses a Paper and Ink manuscript form layout in a desktop two-column grid and mobile stacked grid.
- Form controls use `.t-eyebrow` labels and `.input-ms` underline inputs/textarea.
- The Three.js scene remains present through the preserved `<Canvas>` and `<Scene currentAnimation={currentAnimation} />`.
- Alert uses the strip banner treatment with token backgrounds, no rounded card styling, and top-center positioning under the navbar.
- Loading skeletons use `.loading-bar`; the footer uses `.t-eyebrow` and `text-ink-300`.

## 5. Behavior Preservation

- EmailJS payload remains:

```ts
{
  from_name: form.name,
  to_name: "Viet Hung Pham",
  from_email: form.email,
  to_email: "hung.v.pham002@gmail.com",
  message: form.message,
}
```

- EmailJS env vars remain `VITE_APP_EMAILJS_SERVICE_ID`, `VITE_APP_EMAILJS_TEMPLATE_ID`, and `VITE_APP_EMAILJS_PUBLIC_KEY`.
- Form state and `handleChange` remain.
- Focus sets Sif animation to `walking`; blur sets it to `idle`.
- Submit pending state still uses `isLoading`.
- `ResizeObserver` and canvas sizing logic were preserved.

## 6. Submit Bug Fix

- Success is shown only after `emailjs.send(...)` succeeds.
- Failure no longer gets overwritten by a success alert from `finally`.
- Form clearing happens on success.
- Failure leaves the form contents intact.
- `isLoading` resets in `finally` for both paths.
- Alert auto-dismiss timing remains 2500ms.

## 7. Alert Test Updates

`Alert.test.tsx` now verifies:

- Message text renders.
- Success renders `SENT`.
- Danger renders `FAILED`.
- Both states preserve `role="alert"`.

## 8. Locale Changes

No locale keys were added.

`Contact.tsx` uses `contact_sending` when present and falls back to `${contact_send_message}...` when the key is missing.

## 9. Validation Results

- `npm run typecheck`
  - Status: Initial fail, then pass.
  - Failure detail: the first implementation used `t("contact_sending", { defaultValue: ... })`, but the project i18n typing rejected that overload with `defaultValue: never`.
  - Fix: switched to an explicit missing-key fallback.
- `npm run typecheck`
  - Status: Pass.
  - Result: `tsc --noEmit` completed with no errors.
- `npm test -- --runInBand`
  - Status: Pass.
  - Result: 1 test suite passed, 3 tests passed.
- `npm run build`
  - Status: Pass.
  - Result: `tsc -b && vite build` completed successfully.
- `npm run dev -- --host 127.0.0.1`
  - Status: Pass.
  - Result: Vite started at `http://127.0.0.1:5174/`.
- `curl -I -s http://127.0.0.1:5174/contact`
  - Status: Initial sandboxed attempt failed with exit code 7 and no output.
  - Result after localhost approval: Pass, HTTP 200.

Skipped smoke coverage:

- Browser field focus/blur interaction, alert simulation, canvas pixel checks, and mobile screenshots were not completed because Playwright/browser automation is not installed in this repo. `node_modules/.bin` contains Jest/Vite tooling but no Playwright binary.
- No real external email was submitted.

The Vite dev server started for smoke testing was stopped after validation.

## 10. Risks or Follow-Ups

- Browser-level visual review should still be performed for `/contact`, especially mobile scene height and long translated form labels.
- The scene caption is intentionally small and non-interactive so it does not interfere with the canvas.
- cAp7 can proceed to ChatBot without needing Contact or Alert API changes.

## 11. Agent Notes

- Assumption: cAp1 through cAp5 work in the current dirty worktree is the accepted Paper and Ink foundation.
- Assumption: local manuscript metadata strings such as `Chapter IV`, `Now playing`, and `ENC. EMAILJS - OWL POST` are acceptable without locale churn.
- `button.css` remains retired; future work should not reintroduce `.fill-button`.
