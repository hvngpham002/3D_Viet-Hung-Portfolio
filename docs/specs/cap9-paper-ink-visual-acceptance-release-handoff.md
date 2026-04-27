# cAp9: Paper and Ink Visual Acceptance and Release Handoff

## Purpose

Implement the ninth cluster and final acceptance phase of the Paper and Ink UI overhaul. cAp1 through cAp8 completed the implementation, cleanup, and runtime validation work. This phase must close the remaining visual QA gap: browser-level review, responsive screenshots, interaction smoke, 3D canvas nonblank checks, and a final release handoff report.

This phase is primarily verification. Only make code changes if browser review exposes a concrete visual or interaction defect. Keep any fixes narrow, document them, and rerun the relevant checks.

## Current Assumptions

cAp1 through cAp8 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- Shared chrome is Paper and Ink.
- Home, Loader, About, Projects, Contact, Alert, ChatBot, and ErrorBoundary are Paper and Ink.
- Legacy CSS and Tailwind compatibility shims were removed in cAp8.
- `src/styles/button.css` remains absent.
- Runtime remnant scans passed after cAp8.
- Full static validation passed after cAp8.
- Route smoke checks passed after cAp8.
- Browser screenshots and interaction checks were still skipped because this repo did not have Playwright or Cypress binaries in `node_modules/.bin`.

## Source References

Read these before starting:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `docs/specs/cap4-paper-ink-about-page.md`
- `docs/specs/cap5-paper-ink-projects-page.md`
- `docs/specs/cap6-paper-ink-contact-alert.md`
- `docs/specs/cap7-paper-ink-chatbot-portal.md`
- `docs/specs/cap8-paper-ink-final-qa-cleanup.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `audit/reports/cap4-paper-ink-about-page-report.md`
- `audit/reports/cap5-paper-ink-projects-page-report.md`
- `audit/reports/cap6-paper-ink-contact-alert-report.md`
- `audit/reports/cap7-paper-ink-chatbot-portal-report.md`
- `audit/reports/cap8-paper-ink-final-qa-cleanup-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Report file to create:

- `audit/reports/cap9-paper-ink-visual-acceptance-release-handoff-report.md`

Screenshot/evidence directory to create when screenshots are possible:

- `audit/reports/cap9-visual-evidence/`

## In Scope

- Start the app locally and perform browser-level visual acceptance.
- Capture route screenshots when browser tooling is available.
- Review desktop and mobile responsive states.
- Review light and dark themes.
- Review ChatBot trigger and portaled panel visuals in light and dark modes.
- Review Home loader/start flow and confirm the Home canvas is nonblank after start.
- Review Contact page and confirm the 3D canvas is nonblank.
- Review navigation, theme toggle, language toggle, mobile menu, Projects slideshow controls, and Contact form focus states.
- Check for text overlap, clipped controls, inaccessible tap targets, unintentional horizontal scroll, blank canvases, and old blue/glass visual remnants.
- Fix only concrete defects discovered during this visual pass.
- Run final static validation and route smoke checks.
- Create a final cAp9 handoff report under `audit/reports`.

## Out of Scope

- Do not redesign completed surfaces.
- Do not create new features.
- Do not change Supabase schemas, data files, EmailJS configuration, Gemini endpoint/model/prompt, Redux slices, route structure, lazy imports, or R3F scene behavior.
- Do not submit the Contact form.
- Do not send a real ChatBot message to Gemini.
- Do not add Playwright, Cypress, Puppeteer, or any other browser dependency to the project unless the user explicitly approves that dependency change.
- Do not check in temporary browser tooling scripts unless they are intentionally part of the audit evidence and documented in the report.
- Do not reintroduce old visual-system classes, `src/styles/button.css`, or `.fill-button`.

## Browser Tooling Policy

Preferred order:

1. Use any already available local browser automation or DevTools control in the environment.
2. Use a locally installed browser manually if automation is unavailable.
3. If neither automated nor manual browser inspection is available, document the blocker precisely and still complete static validation, route smoke checks, and code-level visual audit.

Do not add browser automation dependencies just to complete this phase without user approval.

If screenshots are possible, save them under:

```text
audit/reports/cap9-visual-evidence/
```

Use stable, descriptive file names:

```text
home-desktop-light.png
home-desktop-dark.png
home-mobile-light.png
home-mobile-dark.png
about-desktop-light.png
about-desktop-dark.png
about-mobile-light.png
about-mobile-dark.png
projects-desktop-light.png
projects-desktop-dark.png
projects-mobile-light.png
projects-mobile-dark.png
contact-desktop-light.png
contact-desktop-dark.png
contact-mobile-light.png
contact-mobile-dark.png
chatbot-desktop-light.png
chatbot-desktop-dark.png
chatbot-mobile-light.png
chatbot-mobile-dark.png
home-canvas-after-start.png
contact-canvas.png
```

If a screenshot is impossible or not applicable, do not create a placeholder image. Record the reason in the report.

## Required Viewport Matrix

Verify these viewports at minimum:

- Desktop: `1440x900`.
- Mobile: `390x844`.

Optional, if time and tooling permit:

- Tablet: `768x1024`.
- Short desktop: `1280x720`.

Routes:

- `/`
- `/about`
- `/projects`
- `/contact`

Themes:

- light
- dark

Required minimum screenshot matrix when screenshots are possible:

- Desktop light and dark for all routes.
- Mobile light and dark for all routes.
- ChatBot open in desktop light and dark.
- ChatBot open in mobile light and dark.
- Home canvas after loader/start.
- Contact canvas.

## Visual Acceptance Checklist

Apply this checklist to every captured or inspected route.

Layout:

- No horizontal scroll at desktop or mobile widths.
- No text overlaps controls, canvas, cards, navbar, or fixed elements.
- No clipped headings, clipped buttons, or clipped form fields.
- Section spacing is deliberate and consistent with the Paper and Ink system.
- Cards and plates do not nest inside other decorative cards.
- Mobile content stacks in a usable order.

Paper and Ink system:

- Major surfaces use parchment, ink, rule, accent, plate, card-paper, corners, rule-double, t-eyebrow, t-display, t-display-italic, t-ui, t-mono, btn-ink, btn-quill, btn-stamp, input-ms, and loading-bar as appropriate.
- No old blue gradient, robot button, glassmorphism, neo-brutalist block button, gray/slate crash panel, or blue utility styling is visible.
- Accent color is restrained and does not dominate the page.
- Dark mode uses walnut/ink variables and remains readable.
- Fonts render as the intended display, UI, and mono stack.

Interaction:

- Navbar links navigate and active states are readable.
- Mobile menu opens, closes, and link taps close the menu.
- Theme toggle changes visual theme without reload.
- Language toggle exposes valid languages and changes current language.
- ChatBot trigger opens the panel.
- ChatBot close button and outside click/touch close the panel.
- ChatBot panel uses dark tokens while portaled.
- Projects image controls work and do not shift layout.
- Project external links remain reachable.
- Contact inputs focus/blur cleanly and preserve form text.
- Contact submit button is not clicked unless EmailJS is mocked or disabled.
- Home loader start control remains reachable.
- Home keyboard/control buttons remain reachable after start.

3D/canvas:

- Home canvas is nonblank after the loader/start flow.
- Contact canvas is nonblank.
- Canvas does not cover navbar, form controls, ChatBot, or page text unexpectedly.
- Mobile canvas framing is acceptable.
- Dragging Home still applies and clears `body.dragging` behavior if it can be tested.

Accessibility and polish:

- Primary buttons have visible focus states.
- Icon-only controls have accessible labels or titles.
- Tap targets in navbar, mobile menu, Home controls, Projects controls, and ChatBot are usable at mobile width.
- Alert banner still has `role="alert"` by code inspection or test.
- Fixed elements do not hide important content on mobile.

## Required Code-Level Checks

Run these scans before and after any fixes. Include results in the report.

```bash
rg -n "fill-button|button\.css" src index.html tailwind.config.js
```

```bash
rg -n "blue-gradient_text|glassmorphism|neo-brutalism|block-container|card\[data-color|#00c6ff|#0072ff|cyan|indigo|blue-" src index.html tailwind.config.js
```

```bash
rg -n "bg-slate|text-white|bg-white|dark:bg-gray|text-gray|border-gray|shadow-lg|shadow-xl|worksans|poppins|gray-200|black-500|blue-500" src index.html tailwind.config.js
```

Expected result after cAp8:

- No results.

If any result appears:

- Determine whether it is a legitimate runtime regression.
- Fix it if it is a live old-style remnant.
- Document it if it is a false positive.

## Required Static Validation

Run:

```bash
npm run typecheck
```

```bash
npm run build
```

```bash
npm test -- --runInBand
```

If code fixes are made, run these after the final fix, not only before.

## Required Route Smoke

Start Vite:

```bash
npm run dev -- --host 127.0.0.1
```

Check HTTP 200 for:

- `/`
- `/about`
- `/projects`
- `/contact`

Stop the Vite server afterward.

Document the actual port used. If the preferred port is occupied and Vite selects another port, use that port in smoke checks and record it.

## Safe Interaction Rules

Contact:

- You may focus fields, type local test text, blur fields, and inspect layout.
- Do not submit the real form.
- Do not trigger EmailJS.
- If submit behavior must be visually inspected, mock or block the network request in the browser tooling and document the mock. Do not make a real external request.

ChatBot:

- You may open and close the panel.
- You may type in the input to inspect layout.
- Do not send a message to Gemini.
- If send behavior must be inspected, mock `fetch` or block the request and document the mock. Do not make a real external request.

Supabase:

- Loading live page data through the app is acceptable.
- Do not change database data.

## Defect Handling

If browser review finds a defect:

1. Record it in a defect log with route, viewport, theme, reproduction steps, screenshot path if available, severity, and decision.
2. Fix only the narrowest related code.
3. Re-run the affected browser check.
4. Re-run static validation if any source file changed.
5. Update the report with before/after notes.

Severity guide:

- P0: app cannot render a route, fatal runtime error, or route returns non-200.
- P1: blank primary canvas, unusable navigation, unusable form, unreadable dark mode, or severe overlap.
- P2: visible layout defect, clipped content, inaccessible control, old visual-system remnant.
- P3: minor spacing/polish issue that does not block release.

Do not silently defer P0, P1, or P2 defects. Fix them or explicitly mark the release as blocked.

## Expected Files Changed

Required:

- `audit/reports/cap9-paper-ink-visual-acceptance-release-handoff-report.md`

Expected when screenshots are possible:

- files under `audit/reports/cap9-visual-evidence/`

Optional only if defects are found:

- narrow source changes in the affected component or stylesheet.

Unexpected:

- package dependency changes.
- broad page rewrites.
- route, data, model, service, Redux, Supabase, EmailJS, Gemini, or i18n behavior changes.
- reintroduced legacy styles.

## Acceptance Criteria

- cAp9 report exists and is complete.
- Browser visual acceptance is completed with screenshots, or the report clearly documents why screenshots were impossible and what substitute checks were performed.
- Desktop and mobile route review is covered.
- Light and dark theme review is covered.
- ChatBot portal visual review is covered.
- Home and Contact canvas nonblank checks are covered or explicitly blocked by tooling limits.
- Contact form was not submitted to EmailJS.
- ChatBot did not send a real Gemini request.
- Runtime old-style scans pass.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes.
- `/`, `/about`, `/projects`, and `/contact` return HTTP 200 from local Vite.
- Any P0, P1, or P2 visual defects discovered are fixed or the report marks the release as blocked.

## Required Report Contents

Create `audit/reports/cap9-paper-ink-visual-acceptance-release-handoff-report.md` with these sections:

1. Summary
2. Files Changed
3. Browser Tooling Available
4. Screenshot and Evidence Index
5. Viewport and Theme Matrix
6. Route Visual Review
7. Interaction Smoke Results
8. Canvas Nonblank Results
9. Runtime Remnant Scan Results
10. Static Validation Results
11. Route Smoke Results
12. External Request Safety
13. Defect Log
14. Release Decision
15. Residual Risks or Follow-Ups

The report must explicitly state:

- whether screenshots were captured.
- where screenshot artifacts are stored.
- which routes, viewports, and themes were checked.
- whether ChatBot was opened in light and dark mode.
- whether Home and Contact canvases were confirmed nonblank.
- whether Contact submit and ChatBot send were avoided or mocked.
- whether any source fixes were made.
- whether release is accepted, accepted with residual risks, or blocked.

## Release Decision Language

Use one of these statuses in the report:

- `Accepted`: all required checks passed and no open P0/P1/P2 defects remain.
- `Accepted with risks`: static validation and route smoke passed, but browser evidence is partial or minor P3 issues remain.
- `Blocked`: a P0/P1/P2 issue remains, validation failed, route smoke failed, or visual checks could not reach a minimally credible release decision.

## Final Response Requirements for the Implementing Agent

After implementation, respond with:

- files changed.
- whether screenshots/evidence were captured and where.
- validation command statuses.
- route smoke results.
- interaction and canvas check summary.
- release decision.
- report path.

Keep the final response concise, but include any blocked or skipped checks.
