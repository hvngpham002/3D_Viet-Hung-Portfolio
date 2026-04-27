# cAp2: Paper and Ink Shared Shell and Persistent Chrome

## Purpose

Implement the second cluster and phase of the Paper and Ink UI overhaul. This phase converts the global app shell and persistent navigation chrome to the Paper and Ink design language after cAp1 has landed the token foundation.

This is still not a page-level redesign phase. Do not port `HomeInfo`, `Loader`, `About`, `Projects`, `Contact`, `Alert`, or `ChatBot` yet.

## Current Assumptions

cAp1 is complete and validated:

- `src/styles/tokens.css` exists.
- `src/styles/index.css` imports `tokens.css`.
- Tailwind has token-backed `paper`, `ink`, `accent`, `rule`, font, and shadow utilities.
- `src/main.tsx` still imports `src/styles/button.css` because `HomeInfo.tsx` still uses `.fill-button`.
- `audit/reports/cap1-paper-ink-foundation-report.md` exists.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/App.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Navbar.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/ThemeToggle.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/LanguageToggle.tsx`

Current target files:

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/VersionMark.tsx`

## In Scope

- Apply the Paper and Ink shell classes to the root app surface.
- Convert the fixed header into the manuscript paper bar from the handoff.
- Convert the logo area into a wax-seal monogram plus display/eyebrow text.
- Convert desktop nav links to display typography with active `.scribble` underline.
- Convert the mobile menu into a parchment panel with dotted dividers.
- Convert `ThemeToggle` to a 36px manuscript chrome button.
- Convert `LanguageToggle` to a 36px manuscript chrome button and parchment dropdown.
- Convert `VersionMark` to a tokenized mono mark.
- Preserve current routing, theme state, i18n behavior, and right-cluster ordering.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit `src/components/ChatBot.tsx` in this phase.
- Do not restyle the ChatBot trigger or panel in this phase.
- Do not edit `src/components/HomeInfo.tsx`, `src/components/Loader.tsx`, `src/components/Alert.tsx`, or route pages.
- Do not edit Three.js scene logic, models, Redux slices, Supabase services, EmailJS, Gemini request logic, or i18n runtime setup.
- Do not remove `src/styles/button.css`; it is still needed until `HomeInfo` is ported.
- Do not introduce new dependencies.

## Implementation Requirements

### 1. Update `src/App.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/App.tsx`

Required behavior:

- Keep the Redux theme selector:

```ts
const themeMode = useSelector((state: RootState) => state.theme.mode);
```

- Keep the outer wrapper toggling `.dark`:

```tsx
<div className={themeMode === "dark" ? "dark" : ""}>
```

- Change `<main>` to use the Paper and Ink shell:

```tsx
<main className="paper grain vignette min-h-screen">
```

- Preserve:
  - `Router`
  - `Navbar`
  - `Suspense`
  - `Loader` fallback
  - all existing routes
  - `VersionMark`
  - lazy imports

Do not move route definitions or change route paths.

Note:

- The `ChatBot` portal dark-mode cascade is still a known later-cluster risk. Do not solve it in cAp2 unless it can be solved without editing `ChatBot.tsx`; otherwise document it in the report.

### 2. Update `src/components/Navbar.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Navbar.tsx`

Required layout:

- Fixed at the top.
- Full width.
- Height: `64px` / `h-16`.
- Horizontal padding: `px-4 md:px-6`.
- `z-50`.
- Background:

```css
color-mix(in srgb, var(--paper-0) 85%, transparent)
```

- Backdrop blur:

```css
backdrop-filter: blur(8px)
```

- Bottom border:

```css
1px solid var(--rule-strong)
```

Logo/brand requirements:

- Replace the current `PVH` square with a `.seal` wax mark.
- Seal size: `38px` by `38px`.
- Seal text: `P` with smaller superscript-like `vh`.
- Add brand text beside the seal on `sm` and larger:
  - Display text: `Pham Viet Hung`
  - Eyebrow text: `Engineer · Wanderer`
- The logo still links to `/`.

Desktop nav requirements:

- Keep route links:
  - `/about`
  - `/projects`
  - `/contact`
- Use `NavLink` active state.
- Use `font-display`.
- Font size: `text-lg md:text-xl`.
- Active link:
  - italic
  - `.scribble`
  - token ink color
- Inactive link:
  - not italic
  - token ink color
- Keep current translation keys:
  - `About`
  - `Projects`
  - `Contact`

Translation loading requirements:

- Preserve current `reloadTranslations()` call unless a safer existing central mechanism is already present.
- Loading skeleton should use `loading-bar` and token-compatible shape; avoid old gray-blue classes when possible.

Mobile menu requirements:

- Keep the existing `isOpen` state behavior.
- Mobile menu should open below the header near the right side.
- Use parchment panel styling:
  - `background: var(--paper-1)`
  - `border: 1px solid var(--rule-strong)`
  - `box-shadow: var(--shadow-card)`
  - no large rounded card style
- Link typography:
  - `font-display`
  - italic
  - `text-lg`
- Active mobile link uses `text-accent`.
- Non-active mobile link uses `text-ink-900`.
- Dotted divider between items:

```css
border-bottom: 1px dotted var(--rule)
```

Right cluster requirements:

- Preserve order:
  1. `ChatBot`
  2. `ThemeToggle`
  3. `LanguageToggle`
  4. mobile menu button
- Do not edit `ChatBot.tsx`.
- The mobile menu button should match the manuscript chrome button dimensions:
  - `36px` by `36px`
  - `border-radius: 2px`
  - `background: var(--paper-1)`
  - `border: 1px solid var(--rule-strong)`
  - `color: var(--ink-900)`
  - `box-shadow: var(--shadow-press)`

Accessibility requirements:

- Keep `aria-label="Toggle menu"` or equivalent.
- Ensure nav links remain keyboard reachable.
- Ensure the mobile menu button has a visible focus state via the global `:focus-visible` style.

### 3. Update `src/components/ThemeToggle.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/ThemeToggle.tsx`

Required behavior:

- Preserve Redux dispatch:

```ts
dispatch(toggleTheme())
```

- Preserve theme selector from `RootState`.
- Do not change `themeSlice`.

Required visual:

- 36px by 36px.
- `border-radius: 2px`.
- `background: var(--paper-1)`.
- `border: 1px solid var(--rule-strong)`.
- `color: var(--ink-900)`.
- `font-family: var(--font-display)`.
- `font-style: italic`.
- `font-size: 18px`.
- `box-shadow: var(--shadow-press)`.
- Grid-center the glyph.

Glyph requirements:

- Light mode shows `☀`.
- Dark mode shows `☾`.
- Do not use emoji variants.

Accessibility requirements:

- Include an `aria-label` that reflects the action, such as:

```tsx
aria-label={`Switch to ${themeMode === "light" ? "night" : "day"} mode`}
```

### 4. Update `src/components/LanguageToggle.tsx`

Use the reference implementation as the starting point:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/LanguageToggle.tsx`

Required behavior:

- Preserve `i18n.changeLanguage(lang)`.
- Preserve local dropdown `isOpen` state.
- Close dropdown after selecting a language.
- Keep existing flag asset paths:
  - `/icons/usa-flag.webp`
  - `/icons/vietnam-flag.webp`
  - `/icons/china-flag.webp`

Language set:

- Use explicit languages only:
  - `en`, label `EN`
  - `vi`, label `VI`
  - `zh`, label `ZH`
- Remove the blank globe language option from this component.
- If `i18n.language` is not one of the explicit codes, default the visual label to `EN`.

Required visual:

- Trigger:
  - 36px by 36px
  - `border-radius: 2px`
  - `background: var(--paper-1)`
  - `border: 1px solid var(--rule-strong)`
  - `color: var(--ink-900)`
  - `font-family: var(--font-mono)`
  - `font-weight: 700`
  - `font-size: 11px`
  - `letter-spacing: 0.08em`
  - `box-shadow: var(--shadow-press)`
- Dropdown:
  - anchored to the right edge of trigger
  - `top-full mt-1`
  - `z-[60]`
  - `background: var(--paper-1)`
  - `border: 1px solid var(--rule-strong)`
  - `box-shadow: var(--shadow-card)`
  - minimum width around `80px`
- Dropdown rows:
  - flag icon plus mono code
  - dotted divider using `var(--rule)`

Accessibility requirements:

- Trigger has `aria-label="Toggle language menu"` or equivalent.
- Each option has `aria-label` like `Select en`.
- Flag images should use empty alt text if the code label is visible in the same button.

### 5. Update `src/components/VersionMark.tsx`

There is no standalone reference file for this component, but the handoff specifies the treatment.

Required behavior:

- Keep the same prop API:

```ts
interface VersionMarkProps {
  version: string;
}
```

- Keep fixed bottom-right placement.

Required visual:

- Use tokenized mono eyebrow styling:
  - `font-mono`
  - uppercase/tracked or `t-eyebrow`
  - `color: var(--ink-300)`
  - small size
- Render as:

```tsx
v {version}
```

with a space between `v` and the version.

Required placement:

- bottom-right fixed.
- `z-50`.
- Keep mobile-safe offsets similar to current:
  - `bottom-2 sm:bottom-3`
  - `right-2 sm:right-3`

## Constraints

- Use `apply_patch` for manual file edits.
- Do not use destructive git commands.
- Do not edit page files.
- Do not edit `ChatBot.tsx`.
- Do not remove `button.css`.
- Do not change route paths.
- Do not change Redux, i18n, Supabase, EmailJS, Gemini, or Three.js behavior.
- Keep current app behavior intact.
- Avoid adding component abstractions unless they reduce clear duplication inside the touched files.

## Required Validation

Run:

```bash
npm run typecheck
npm run build
```

Run tests if feasible:

```bash
npm test -- --runInBand
```

Perform a lightweight local smoke test if feasible:

- Start the app with `npm run dev`.
- Visit `/`, `/about`, `/projects`, and `/contact`.
- Toggle light/dark.
- Open and close the mobile menu at a mobile viewport.
- Change language from the dropdown.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap2-paper-ink-shared-chrome-report.md`

Create `audit/reports` if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe each change.

3. Scope Compliance
   - Confirm no page files were changed.
   - Confirm `ChatBot.tsx` was not changed.
   - Confirm `button.css` was not removed.

4. Visual Coverage
   - Confirm app shell uses `paper grain vignette min-h-screen`.
   - Confirm navbar uses manuscript paper bar styling.
   - Confirm wax-seal logo exists.
   - Confirm desktop active nav uses `.scribble`.
   - Confirm mobile menu uses parchment panel and dotted dividers.
   - Confirm ThemeToggle and LanguageToggle use 36px manuscript chrome.
   - Confirm VersionMark is tokenized.

5. Behavior Preservation
   - Confirm route navigation still works.
   - Confirm theme toggle still dispatches Redux action.
   - Confirm language change still calls `i18n.changeLanguage`.
   - Confirm mobile menu open/close still works.

6. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

7. Risks or Follow-Ups
   - Note that `ChatBot` visual treatment remains for a later cluster.
   - Note any dark-mode portal concerns that remain.
   - Note any design mismatch or implementation compromise.

8. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp3.

## Acceptance Criteria

cAp2 is complete when:

- `src/App.tsx` uses the Paper and Ink shell classes.
- Routes, lazy imports, Suspense, and `VersionMark` remain intact.
- `src/components/Navbar.tsx` uses the Paper and Ink header, seal logo, display nav, active scribble, parchment mobile menu, and manuscript mobile menu button.
- `src/components/ThemeToggle.tsx` preserves Redux behavior and uses the 36px tokenized chrome treatment.
- `src/components/LanguageToggle.tsx` preserves i18n behavior, removes the blank globe option, and uses the 36px tokenized chrome treatment.
- `src/components/VersionMark.tsx` uses tokenized mono styling and keeps fixed bottom-right placement.
- No page files are changed.
- `ChatBot.tsx` is unchanged.
- `button.css` remains in place.
- `npm run typecheck` passes.
- `npm run build` passes.
- The implementation report exists at `audit/reports/cap2-paper-ink-shared-chrome-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/VersionMark.tsx`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`

Unexpected for this phase:

- Changes to `src/pages/*`
- Changes to `src/components/ChatBot.tsx`
- Changes to `src/components/HomeInfo.tsx`
- Changes to `src/components/Loader.tsx`
- Changes to `src/components/Alert.tsx`
- Changes to `src/models/*`
- Changes to Redux, Supabase, EmailJS, Gemini, or i18n runtime setup
- Removal of `src/styles/button.css`
