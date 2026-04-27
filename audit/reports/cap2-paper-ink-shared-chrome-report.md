# cAp2 Paper and Ink Shared Chrome Report

## 1. Summary

Implemented the Paper and Ink shared shell and persistent navigation chrome:

- Applied the global Paper and Ink app shell to `src/App.tsx`.
- Converted the navbar to the manuscript paper bar treatment.
- Replaced the PVH square with a wax-seal monogram and brand text.
- Converted desktop and mobile navigation to token-backed display typography.
- Converted `ThemeToggle`, `LanguageToggle`, and the mobile menu button to 36px manuscript chrome controls.
- Converted `VersionMark` to a tokenized mono mark.

Intentionally left unchanged:

- Page-level surfaces remain unported for later clusters.
- `ChatBot.tsx` was not edited, so its trigger and portal panel visual treatment remain for a later cluster.
- `HomeInfo`, `Loader`, `Alert`, route pages, Three.js logic, Redux, i18n runtime setup, Supabase, EmailJS, Gemini, and models were not changed.
- `src/styles/button.css` remains in place.

## 2. Files Changed

- `src/App.tsx`
  - Changed the root `<main>` to `paper grain vignette min-h-screen`.
  - Preserved routes, lazy imports, `Suspense`, `Loader`, `Navbar`, and `VersionMark`.
- `src/components/Navbar.tsx`
  - Added the fixed manuscript paper bar, wax-seal logo, brand text, display nav links, active `.scribble` state, parchment mobile menu, dotted dividers, and 36px manuscript mobile menu button.
  - Preserved `reloadTranslations()`, route targets, `NavLink` behavior, mobile open state, and right-cluster ordering.
- `src/components/ThemeToggle.tsx`
  - Preserved Redux `dispatch(toggleTheme())` and the `RootState` selector.
  - Replaced the old rounded emoji button with a 36px tokenized manuscript chrome button using non-emoji sun and crescent glyphs.
- `src/components/LanguageToggle.tsx`
  - Preserved `i18n.changeLanguage(lang)`, local dropdown state, and close-after-select behavior.
  - Removed the blank globe option and limited the set to `en`, `vi`, and `zh`.
  - Added a 36px mono trigger and parchment dropdown with flag/code rows.
- `src/components/VersionMark.tsx`
  - Preserved the prop API and fixed bottom-right placement.
  - Changed rendering to `v {version}` with tokenized mono styling.
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
  - Added this implementation report.

## 3. Scope Compliance

- No page files were changed.
- `src/components/ChatBot.tsx` was not changed.
- `src/styles/button.css` was not removed or edited.
- No Redux, i18n runtime setup, Supabase, EmailJS, Gemini, Three.js, model, or data files were changed in this phase.

## 4. Visual Coverage

- App shell uses `paper grain vignette min-h-screen`.
- Navbar uses the manuscript paper bar styling with `color-mix(...)`, blur, and token rule border.
- Wax-seal logo exists with `P` plus smaller `vh` text.
- Desktop active nav uses italic display typography and `.scribble`.
- Mobile menu uses a parchment panel and dotted dividers.
- ThemeToggle and LanguageToggle use 36px manuscript chrome styling.
- Mobile menu button uses the 36px manuscript chrome treatment.
- VersionMark uses tokenized mono styling and `text-ink-300`.

## 5. Behavior Preservation

- Route targets remain `/`, `/about`, `/projects`, and `/contact`.
- Route definitions, lazy imports, `Suspense`, and `Loader` fallback remain in place.
- Theme toggle still dispatches the Redux `toggleTheme()` action.
- Language selection still calls `i18n.changeLanguage(lang)` and closes the dropdown.
- Mobile menu open/close state remains local to `Navbar`.
- Right cluster ordering remains `ChatBot`, `ThemeToggle`, `LanguageToggle`, mobile menu button.

## 6. Validation Results

- `npm run typecheck`
  - Status: Pass
  - Result: `tsc --noEmit` completed with no errors.
- `npm run build`
  - Status: Pass
  - Result: `tsc -b && vite build` completed successfully.
- `npm test -- --runInBand`
  - Status: Pass
  - Result: 1 test suite passed, 2 tests passed.
- `npm run dev -- --host 127.0.0.1`
  - Status: Pass
  - Result: Vite started locally on `http://127.0.0.1:5174/`.
- `curl -I -s http://127.0.0.1:5174/`
  - Status: Pass after escalation
  - Result: HTTP 200. The first sandboxed curl attempt failed with `Operation not permitted`; rerunning with localhost network approval succeeded.
- `curl -I -s http://127.0.0.1:5174/about`
  - Status: Pass after escalation
  - Result: HTTP 200.
- `curl -I -s http://127.0.0.1:5174/projects`
  - Status: Pass after escalation
  - Result: HTTP 200.
- `curl -I -s http://127.0.0.1:5174/contact`
  - Status: Pass after escalation
  - Result: HTTP 200.

Skipped smoke coverage:

- Browser interaction smoke for toggling light/dark, opening and closing the mobile menu at a mobile viewport, and changing language from the dropdown was not performed because this session did not have browser automation available. The underlying component behavior was preserved in code and covered by typecheck/build validation.

## 7. Risks or Follow-Ups

- `ChatBot` visual treatment remains for a later cluster by scope.
- `ChatBot` still uses a portal-based surface, so dark-mode token cascading should be revisited when that component is ported.
- The mobile menu and dropdown are implemented with inline token styles matching the handoff. A shared chrome-button class could be introduced later if duplication grows across more components.

## 8. Agent Notes

- Assumption: cAp1 foundation was already present and should be treated as the active token layer.
- Assumption: `reloadTranslations()` remains the correct Navbar loading mechanism because no safer central replacement was present in the inspected files.
- The worktree already contained uncommitted cAp1 foundation files and docs before this phase; those were left untouched except for adding the cAp2 report.
- Next agent starting cAp3 should keep `button.css` until `HomeInfo` no longer uses `.fill-button` or `.fill-button-dark`.
