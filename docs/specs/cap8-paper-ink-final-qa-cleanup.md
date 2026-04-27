# cAp8: Paper and Ink Final QA, Legacy Cleanup, and Release Audit

## Purpose

Implement the eighth cluster and phase of the Paper and Ink UI overhaul. This is the final consolidation pass after cAp1 through cAp7. It must verify that the full runtime UI has moved off the old blue/glassmorphism/neo-brutalist system, remove unused transition shims, fix any remaining token misses, and leave a clear implementation audit report.

This phase is intentionally a cleanup and QA phase. Do not redesign completed pages, do not change app behavior, and do not broaden scope into unrelated refactors.

## Current Assumptions

cAp1 through cAp7 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- Shared chrome is Paper and Ink.
- Home, Loader, About, Projects, Contact, Alert, and ChatBot are Paper and Ink.
- `src/styles/button.css` has been retired and must not be reintroduced.
- Reports exist for cAp1 through cAp7.
- Browser automation may still be unavailable in this repo, but route smoke checks through Vite and curl are expected when local execution permits.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `docs/specs/cap4-paper-ink-about-page.md`
- `docs/specs/cap5-paper-ink-projects-page.md`
- `docs/specs/cap6-paper-ink-contact-alert.md`
- `docs/specs/cap7-paper-ink-chatbot-portal.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `audit/reports/cap4-paper-ink-about-page-report.md`
- `audit/reports/cap5-paper-ink-projects-page-report.md`
- `audit/reports/cap6-paper-ink-contact-alert-report.md`
- `audit/reports/cap7-paper-ink-chatbot-portal-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Primary target files:

- `src/styles/index.css`
- `tailwind.config.js`
- `src/components/ErrorBoundary.tsx`

Report file to create:

- `audit/reports/cap8-paper-ink-final-qa-cleanup-report.md`

Only edit other runtime files if the audit discovers a real remaining Paper and Ink regression that cannot be resolved from the primary target files.

## In Scope

- Audit all runtime source files for old visual-system remnants.
- Remove unused legacy CSS selectors from `src/styles/index.css`.
- Remove unused Tailwind compatibility aliases from `tailwind.config.js` only when runtime scans prove they are no longer referenced.
- Tokenize the remaining `ErrorBoundary` fallback so the crash screen matches Paper and Ink in light and dark modes.
- Verify `button.css` and `.fill-button` remain absent from runtime code.
- Verify old blue robot/chat, blue gradient text, glassmorphism, block/neo-brutalist surfaces, gray/slate crash screens, and old hover body color hacks are gone or documented.
- Run full validation and local route smoke checks.
- Create the required cAp8 implementation report under `audit/reports`.

## Out of Scope

- Do not redesign Home, About, Projects, Contact, ChatBot, Navbar, Loader, or Alert.
- Do not change routes, lazy imports, Suspense boundaries, Redux slices, Supabase services, EmailJS configuration, Gemini chatbot behavior, model assets, R3F scenes, or i18n runtime setup.
- Do not add dependencies.
- Do not make real external EmailJS or Gemini requests.
- Do not reintroduce `src/styles/button.css` or `.fill-button`.
- Do not convert this project to a component library.
- Do not change data schemas or local JSON data unless a broken runtime reference requires a tiny correction.

## Required Audit Commands

Run these or equivalent commands before editing. Include the useful results in the cAp8 report.

```bash
rg -n "fill-button|button\.css" src index.html tailwind.config.js
```

```bash
rg -n "blue-gradient_text|glassmorphism|neo-brutalism|block-container|card\[data-color|#00c6ff|#0072ff|cyan|indigo|blue-" src index.html tailwind.config.js
```

```bash
rg -n "bg-slate|text-white|bg-white|dark:bg-gray|text-gray|border-gray|shadow-lg|shadow-xl" src index.html tailwind.config.js
```

```bash
rg -n "worksans|poppins|gray-200|black-500|blue-500|text-blue|bg-blue|border-blue|from-blue|to-blue" src index.html tailwind.config.js
```

Important:

- Treat `docs/**` and `audit/**` as historical documentation. Do not count old names inside completed specs or reports as runtime usage.
- Do not delete a class or Tailwind alias just because its name looks old. Delete it only if runtime usage is absent or the consuming runtime code is updated in the same phase.
- Some generic words such as `input`, `textarea`, `header`, `footer`, and `button` appear in real HTML and CSS resets. Class-specific scans must be interpreted carefully.

## Known Cleanup Candidates

The post-cAp7 scan found these candidates in runtime files. Recheck them in the current worktree before editing.

### `src/styles/index.css`

Likely removable if no runtime references remain:

- `body:has(.card[data-color="blue"]:hover)`
- `body:has(.card[data-color="green"]:hover)`
- `.blue-gradient_text`
- `.glassmorphism`
- `.logo`
- `.block-container`
- `.block-container .btn-back`
- `.block-container .btn-front`
- `.block-container` color variants:
  - `.btn-back-red`
  - `.btn-back-orange`
  - `.btn-back-pink`
  - `.btn-back-green`
  - `.btn-back-yellow`
  - `.btn-back-blue`
  - `.btn-back-black`
- `.neo-brutalism-blue`
- `.neo-brutalism-white`
- `.info-box`
- `.neo-btn`
- `.cta`
- `.cta-text`

Review before removing:

- `.max-container`
- `.head-text`
- `.subhead-text`
- `.header`
- `.footer`
- `.footer-container`

Keep unless replacing all runtime consumers:

- `.input`
- `.textarea`
- `.btn`
- `.custom-spinner`
- `.loading-bar`
- `.no-select`
- `body.dragging`

Reason:

- `.custom-spinner`, `.loading-bar`, `.no-select`, and `body.dragging` still support live Loader, Contact, HomeInfo, and model interaction behavior.
- `.input`, `.textarea`, and `.btn` may still be compatibility aliases for form-like surfaces or future fallback markup. Remove them only if a runtime scan proves they are unused and the project no longer needs them.

### `tailwind.config.js`

Review these compatibility aliases:

- `colors.gray.200`
- `colors.black.DEFAULT`
- `colors.black.500`
- `colors.blue.500`
- `fontFamily.worksans`
- `fontFamily.poppins`

If no runtime source uses these aliases, remove them to finish the migration away from the old system. If keeping any alias, document the exact runtime dependency in the report.

### `src/components/ErrorBoundary.tsx`

Replace the current slate crash fallback:

```tsx
bg-slate-800 text-white
```

with a Paper and Ink fallback using token-backed utilities or classes. The fallback should:

- Fill the viewport.
- Use `bg-paper-0` and `text-ink-900` or direct CSS variables through existing utilities.
- Include a manuscript-style plate or compact centered text treatment.
- Work in dark mode if the active `.dark` class is present above it.
- Preserve the optional `fallback` prop behavior.
- Preserve `componentDidCatch` logging.

Do not add new state, hooks, dependencies, or routing behavior to `ErrorBoundary`.

## Implementation Requirements

### 1. Build a Runtime Remnant Inventory

Create a short inventory before editing:

- Old selectors/classes found.
- Runtime file and line number.
- Decision: remove, replace, keep, or document.
- Reason for the decision.

The report must include this inventory or a concise table equivalent.

### 2. Remove Dead Legacy CSS

In `src/styles/index.css`:

- Delete old body hover rules for `.card[data-color]` if no current runtime card uses them.
- Delete dead blue/glassmorphism/block/neo-brutalist utilities after confirming no runtime usage.
- Keep the file organized:
  - imports first.
  - base `body` rule.
  - `@layer utilities` for Tailwind-applied utility aliases.
  - standalone global helpers after the layer.
- Do not remove `tokens.css` import.
- Do not duplicate utilities already defined in `src/styles/tokens.css`.

Acceptance:

- A post-edit scan returns no runtime references to removed selectors.
- The app still builds after Tailwind processes `index.css`.

### 3. Tighten Tailwind Compatibility Aliases

In `tailwind.config.js`:

- Remove old compatibility colors and fonts only when no runtime references remain.
- Keep token-backed extensions:
  - `paper`
  - `ink`
  - `accent`
  - `rule`
  - `rule-strong`
  - `fontFamily.display`
  - `fontFamily.ui`
  - `fontFamily.mono`
  - `boxShadow.card`
  - `boxShadow.press`

If a compatibility alias remains, the cAp8 report must say why.

### 4. Tokenize Error Boundary

Update `src/components/ErrorBoundary.tsx` so the default fallback is visually aligned with Paper and Ink.

Suggested shape:

```tsx
<div className="flex h-screen w-screen items-center justify-center bg-paper-0 px-6 text-ink-900">
  <div className="plate corners max-w-md px-6 py-5 text-center shadow-card">
    <p className="t-eyebrow mb-3 text-accent">Runtime Fault</p>
    <p className="font-display text-2xl italic">
      Something went wrong. Please reload the page.
    </p>
  </div>
</div>
```

Adjust text and spacing to match the codebase, but keep:

- viewport coverage.
- token-backed color.
- readable fallback copy.
- no old slate/white treatment.

### 5. Verify Cross-Route Visual Consistency by Code and Smoke

Review these files by code inspection after cleanup:

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/VersionMark.tsx`
- `src/components/Loader.tsx`
- `src/components/HomeInfo.tsx`
- `src/components/Alert.tsx`
- `src/components/ChatBot.tsx`
- `src/pages/Home.tsx`
- `src/pages/About.tsx`
- `src/pages/Projects.tsx`
- `src/pages/Contact.tsx`

Confirm:

- all major surfaces use Paper and Ink tokens/classes.
- no old blue gradient, glassmorphism, or neo-brutalist components remain visible in runtime JSX.
- route-level loading and error states use tokenized surfaces.
- portaled ChatBot still handles dark mode locally.
- Contact success/error logic from cAp6 is still intact.
- Home control and Loader start behavior are unchanged.

## Validation Requirements

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

Then run a local Vite route smoke check:

```bash
npm run dev -- --host 127.0.0.1
```

Check these routes return HTTP 200:

- `/`
- `/about`
- `/projects`
- `/contact`

Stop the Vite server after smoke checks.

If browser automation is available, also verify:

- desktop light mode screenshot for `/`, `/about`, `/projects`, `/contact`.
- desktop dark mode screenshot for the same routes.
- mobile viewport screenshot for the same routes.
- ChatBot opens and closes without old blue styling.
- Contact page canvas is nonblank.
- Home canvas is nonblank after loader/start flow.

If browser automation is unavailable, document that limitation clearly in the report.

Do not submit the Contact form to EmailJS. Do not make a real Gemini ChatBot request unless the user explicitly approves it.

## Acceptance Criteria

- `src/styles/button.css` is still deleted or absent.
- Runtime scan for `.fill-button` and `button.css` returns no results.
- Dead old visual selectors are removed from `src/styles/index.css` or explicitly justified.
- Remaining CSS helpers are all still used or intentionally retained compatibility aliases.
- `ErrorBoundary` fallback no longer uses `bg-slate-800 text-white`.
- Tailwind config no longer exposes unused old blue/black/gray/font compatibility aliases, unless the report documents a concrete runtime reason.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes.
- `/`, `/about`, `/projects`, and `/contact` smoke checks return HTTP 200.
- No real external email or Gemini request is made.
- `audit/reports/cap8-paper-ink-final-qa-cleanup-report.md` exists and is complete.

## Required Report Contents

Create `audit/reports/cap8-paper-ink-final-qa-cleanup-report.md` with these sections:

1. Summary
2. Files Changed
3. Runtime Remnant Inventory
4. CSS Cleanup Decisions
5. Tailwind Cleanup Decisions
6. Error Boundary Update
7. Scope Compliance
8. Validation Results
9. Route Smoke Results
10. Browser or Visual Verification
11. External Request Safety
12. Residual Risks or Follow-Ups

The report must explicitly mention:

- whether `fill-button` and `button.css` scans passed.
- which legacy selectors were removed.
- which compatibility aliases were kept and why.
- whether browser screenshots were run or skipped.
- whether any route, page, model, service, EmailJS, Gemini, Redux, Supabase, or i18n behavior changed.

## Final Response Requirements for the Implementing Agent

After implementation, respond with:

- files changed.
- validation commands and pass/fail status.
- route smoke results.
- report path.
- any skipped browser visual checks and why.

Keep the final response concise, but do not omit failed or skipped validation.
