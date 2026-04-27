# Paper and Ink UI Overhaul Integration Plan

## Source Review

The handoff entry checked into the repo root, `design_handoff_paper_ink`, is not the actual bundle. It is a browser directory listing that points to:

`/Users/viethungpham/Downloads/design_handoff_paper_ink/`

Reviewed source artifacts:

- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/tokens.css`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/App.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Alert.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/HomeInfo.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/LanguageToggle.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Loader.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/Navbar.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/components/ThemeToggle.tsx`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/styles/index.css`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/src/styles/tokens.css`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/reference_implementation/tailwind.config.js`

Current app surfaces reviewed:

- `src/App.tsx`
- `src/main.tsx`
- `src/styles/index.css`
- `src/styles/button.css`
- `tailwind.config.js`
- `index.html`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/VersionMark.tsx`
- `src/components/HomeInfo.tsx`
- `src/components/Loader.tsx`
- `src/components/Alert.tsx`
- `src/components/ChatBot.tsx`
- `src/pages/Home.tsx`
- `src/pages/About.tsx`
- `src/pages/Projects.tsx`
- `src/pages/Contact.tsx`
- `src/services/supabaseService.ts`
- `src/types/supabase.ts`
- `src/data/homeInfo.json`
- `src/data/skills.json`
- `src/data/experiences.json`
- `src/data/projects.json`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## Integration Goal

Replace the current generic blue/glassmorphism portfolio chrome with the Paper and Ink visual system:

- Warm parchment and walnut dark mode surfaces.
- Iron-gall ink typography.
- Oxblood accent used sparingly.
- Cormorant Garamond display text, Inter UI text, JetBrains Mono metadata text.
- Sharp manuscript surfaces, stamped controls, wax seal logo/progress, paper grain, vignette, corner marks, scribble underlines, tape strips.

The overhaul is a presentation-layer integration. Preserve:

- React Router route structure.
- Redux theme slice and current theme toggle behavior.
- react-i18next and Supabase-backed translations.
- Supabase data fetches for home info, skills, experiences, and projects.
- EmailJS contact form behavior.
- Gemini chatbot behavior.
- React Three Fiber scenes, models, animation hooks, controls, camera, and loading semantics.
- Existing lazy imports and Suspense boundaries unless a visual shell requires a small wrapper change.

## Handoff Observations and Decisions

1. The handoff has a real production starting point for `App`, core shared components, tokens, and Tailwind config. Use those as implementation references, not blind replacements.
2. The content pages (`About`, `Projects`, `Contact`) are represented in `_source/surfaces.jsx`, not standalone production files. They need to be ported manually while preserving live data and form logic.
3. The current `ChatBot` uses `createPortal(document.body)`. CSS variables under `.dark` will not cascade to that portal if `.dark` remains only inside `App`. Either add theme-aware classes to the portal panel or move the `.dark` class to `document.documentElement`/`body`.
4. The handoff asks for no pill-like chips in the Projects surface, but `tokens.css` defines `.tag-ink` with `border-radius: 999px`. Resolve this before implementation. Recommended default: follow `design_reference.html` and `tokens.css` unless the visual owner confirms square chips.
5. Fonts are requested through `index.html`, while the bundled `tokens.css` also imports Google Fonts. Avoid duplicate font loading. Recommended default: use the `index.html` preconnect/link method and remove the `@import` from the copied tokens file, unless exact file parity is required.
6. The current skills data is flat (`name`, `icon`), but the handoff wants categorized skill plates with no icons. Implement a local category mapping in `About.tsx` instead of changing the Supabase schema.
7. The current Projects cards include a slideshow with drag and auto-advance. Preserve that behavior and reframe the current image with paper/tape treatment.
8. The current Contact page has manual canvas height measurement to keep the 3D scene aligned with the form. The redesign should first preserve the measurement behavior, then simplify only after screenshots confirm no mobile regressions.
9. The current `button.css` exists only for the `HomeInfo` fill button. After `HomeInfo` moves to `.btn-quill`, remove the import if no references remain.

## Cluster Map

### Cluster A: Design System Foundation

Ownership:

- `src/styles/tokens.css`
- `src/styles/index.css`
- `src/styles/button.css`
- `tailwind.config.js`
- `index.html`
- `src/main.tsx`

Responsibilities:

- Add Paper and Ink CSS variables, type utilities, surface utilities, control utilities, ornaments, focus rings, loading bars, and legacy aliases.
- Extend Tailwind with token-backed colors, fonts, and shadows.
- Replace the current Poppins/Work Sans blue utility direction with Inter/Cormorant/JetBrains-backed utilities.
- Keep enough legacy aliases (`blue-gradient_text`, `.btn`, `.input`, `.textarea`, `.custom-spinner`) so partially ported surfaces continue to compile during phased work.
- Remove or retire old style primitives once all consumers have moved off them.

Key implementation notes:

- Import `tokens.css` at the top of `src/styles/index.css`.
- Keep `reset.css` import before `index.css`.
- Decide whether `button.css` remains imported during transition. It can stay through Phase 3, but should be removed by cleanup if `fill-button` is gone.
- Add a shared CSS class for nav chrome buttons if repeated inline styles become noisy. Suggested name: `.chrome-button`.
- Make sure `.grain::before` and `.vignette::after` keep `pointer-events: none` and do not visually overpower the 3D canvas.

Acceptance criteria:

- `npm run typecheck` passes.
- Tailwind utilities such as `text-ink-900`, `bg-paper-1`, `text-accent`, `font-display`, `font-ui`, and `font-mono` compile.
- Light and dark modes both change CSS variables without requiring page reload.
- No old blue gradient is visible on shared controls after later clusters finish.

### Cluster B: App Shell and Persistent Chrome

Ownership:

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/VersionMark.tsx`

Responsibilities:

- Apply the global `paper grain vignette min-h-screen` shell.
- Replace the PVH square logo with a wax-seal monogram.
- Replace nav typography and active state with display italic text plus `.scribble`.
- Convert the right-side controls into 36px stamped chrome buttons.
- Convert the mobile menu to a parchment plate with dotted dividers.
- Convert version text to mono eyebrow styling.

Key implementation notes:

- Preserve current `NavLink` route targets and `isActive` logic.
- Keep `reloadTranslations()` behavior in `Navbar` unless later translation loading is centralized.
- The right cluster order should remain: `ChatBot`, `ThemeToggle`, `LanguageToggle`, mobile menu.
- `LanguageToggle` should no longer expose the blank globe option. Use explicit `EN`, `VI`, and `ZH`.
- `VersionMark` should remain fixed bottom-right and use token color `--ink-300`.

Acceptance criteria:

- Desktop nav shows About, Projects, Contact with active scribble.
- Mobile menu opens and closes, and menu links close it after navigation.
- Theme and language toggles retain behavior.
- Header remains 64px high and does not behave like a floating card.

### Cluster C: Home, Loader, and 3D Overlay Controls

Ownership:

- `src/pages/Home.tsx`
- `src/components/HomeInfo.tsx`
- `src/components/Loader.tsx`

Responsibilities:

- Preserve the Home 3D canvas and all scene interaction logic.
- Restyle `HomeInfo` as a translucent parchment overlay with `.corners`, stage Roman numerals, display quote, and `.btn-quill`.
- Restyle Home's Q/W/E/R and left/right controls as stamped key buttons.
- Replace the blue loader with the manuscript prologue, quick guide plate, wax-seal progress indicator, asset count, and top-right language toggle.

Key implementation notes:

- Do not modify R3F models, positions, animation state, or input behavior unless a visual hitbox needs adjustment.
- Replace duplicated inline SVG arrow controls with the same visual dimensions as `.btn-stamp`; the arrows can remain text glyphs or existing SVGs.
- Keep `useProgress()` and the `canStart` gating exactly intact.
- The loader's translated headline currently splits the localized string by spaces. This is fragile for Chinese. Prefer either a locale-specific emphasized segment key or a safe fallback that does not depend on word splitting.
- The Home top overlay must keep `pointer-events-none` on the outer overlay and `pointer-events-auto` on the actual card/buttons.

Acceptance criteria:

- Loader progresses from `useProgress()` and only starts when assets are complete.
- Click to Start still calls `onStarted`.
- Home scene remains draggable/zoomable.
- Stage cards update as Ciri reaches stages 1-4.
- Mobile controls fit without overlap.

### Cluster D: About Page Port

Ownership:

- `src/pages/About.tsx`
- `src/data/skills.json` only if local fallback data needs grouping support.
- `src/locales/*.json` only if new labels are not hard-coded.

Responsibilities:

- Port the About artboard into live JSX while preserving `getExperiences()` and `getSkills()`.
- Replace the current centered avatar/radial social menu with a manuscript title hero.
- Convert the bio into a plate with a drop cap.
- Convert skills from icon cards to categorized text plates.
- Convert the experience section into a chronicle timeline with alternating entries, accent dots, role/company/date, and translated point summaries.

Key implementation notes:

- Keep social links, but restyle them as small seals or manuscript links near the hero.
- Create a small grouping helper for skills:
  - Languages: TypeScript, JavaScript, Python, Java, C, C++.
  - Frontend: React, Redux, Tailwind, SASS.
  - Backend and tools: Node.js, Git, and any future unknown skills.
- Current experience points are commented out. Re-enable them as short description text in the new cards.
- Keep loading and error states, but restyle them to `plate`, `t-eyebrow`, and token colors.
- Avoid changing Supabase table shape.

Acceptance criteria:

- About still renders with live Supabase data.
- Loading and error states remain visible and readable.
- Skills are readable without relying on icons.
- Timeline works on desktop and mobile without text overlap.

### Cluster E: Projects Page Port

Ownership:

- `src/pages/Projects.tsx`

Responsibilities:

- Port the Projects artboard into the existing slideshow cards.
- Replace rounded white cards with manuscript folios.
- Add folio numbering, display titles, tape strips over the screenshot frame, tokenized copy, square or approved chip styling, and manuscript links.
- Preserve current auto-advance, hover pause, dots, drag/swipe, demo link, and source link behavior.

Key implementation notes:

- Keep `ProjectCard` state and pagination logic.
- Style only the current image viewport and navigation controls.
- The current `project.sourceCode` type is `string`, but data can be null in local JSON before migration. In UI code, continue treating source and demo as optional.
- If following the README rather than token CSS on chip shape, override `.tag-ink` locally for Projects to use `border-radius: 0`.
- Preserve `target="_blank"` and `rel="noopener noreferrer"` for external links.

Acceptance criteria:

- Images still slide automatically and manually.
- Drag/swipe still changes images.
- Demo/source unavailable states remain translated.
- Project cards do not resize unpredictably as images change.

### Cluster F: Contact, Alert, and Form Feedback

Ownership:

- `src/pages/Contact.tsx`
- `src/components/Alert.tsx`

Responsibilities:

- Port the Contact artboard while preserving EmailJS submission.
- Restyle the form as manuscript fields with mono labels and bottom-rule inputs.
- Preserve the Sif and bonfire scene.
- Replace Alert with a strip banner under the navbar.

Key implementation notes:

- Keep form state, focus/blur animation changes, and submit logic.
- Fix a current behavior while porting if desired: `finally` always shows success even after an EmailJS error. If this is addressed, treat it as a small behavioral bug fix and test both success and failure paths.
- Keep `Alert` anchored top-center under the navbar and above the form/canvas.
- Maintain responsive two-column layout on desktop and stacked layout on mobile.
- Do not remove the canvas height observer until visual QA proves pure CSS is enough.

Acceptance criteria:

- Required fields still block invalid submit.
- Focus still switches Sif to walking, submit to running/attack, blur back to idle.
- Success and danger alerts use the new strip style.
- Contact scene remains visible and correctly framed on mobile and desktop.

### Cluster G: ChatBot Port and Portal Theme Safety

Ownership:

- `src/components/ChatBot.tsx`
- Potentially `src/App.tsx` or a small theme sync hook if portal styling needs global dark scope.

Responsibilities:

- Restyle trigger as a 36px stamped chrome button.
- Restyle panel as a parchment plate with corner marks.
- Restyle bot/user transcript and input using manuscript typography.
- Preserve Gemini API behavior, resume prompt, rate limit handling, loading state, outside-click close, and portal behavior.

Key implementation notes:

- Because the panel is portaled to `document.body`, either:
  - add `className={themeMode === "dark" ? "dark" : ""}` to a portal wrapper and ensure `paper` variables are available, or
  - synchronize the `dark` class onto `document.documentElement`, or
  - portal into an element inside the themed app shell.
- The first option is the least invasive.
- Keep the existing `messagesEndRef` auto-scroll.
- Replace the robot SVG with a display `Q` or a small quill-like SVG. If using SVG, keep it inline and color from `currentColor`.

Acceptance criteria:

- Chat panel opens in both light and dark with correct tokens.
- User can send with Enter and button.
- Loading indicator remains clear.
- Outside click closes the panel.
- No dark-mode mismatch in the portaled panel.

### Cluster H: Internationalization, Accessibility, and Content Fit

Ownership:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`
- All touched components and pages.

Responsibilities:

- Reuse existing translation keys where possible.
- Add new keys only for text that is truly new and user-visible.
- Prevent typography choices from breaking Chinese or Vietnamese layouts.
- Preserve meaningful accessible labels.

Key implementation notes:

- Avoid word-splitting translated text to style a specific suffix. This is especially risky for Chinese strings.
- Add keys such as `loader_prologue`, `loader_loaded_assets`, `chatbot_quill_title`, `about_chapter_author`, etc. only if the final JSX needs visible text not already translated.
- Keep icon-only buttons with `aria-label`.
- Ensure focus-visible rings use `--focus-ring`.
- Keep line lengths constrained for display text.

Acceptance criteria:

- All three locales render without missing keys.
- No heading, button, chip, or alert text overflows at mobile widths.
- Interactive controls are keyboard focusable and visibly focused.

### Cluster I: Verification and Cleanup

Ownership:

- Whole app.
- `package.json` scripts as existing validation entry points.

Responsibilities:

- Run static checks.
- Run unit tests.
- Build production bundle.
- Smoke-test all routes in light and dark.
- Capture visual screenshots after the app runs locally.
- Remove dead CSS and stale imports.

Key implementation notes:

- Use existing scripts first:
  - `npm run typecheck`
  - `npm test -- --runInBand` or `npm test`
  - `npm run build`
- Start the dev server with `npm run dev`.
- Verify at least:
  - `/`
  - `/about`
  - `/projects`
  - `/contact`
- Test desktop and mobile widths.
- Check Home and Contact canvas nonblank rendering.

Acceptance criteria:

- Typecheck passes.
- Test suite passes or failures are documented with cause.
- Build passes.
- No obvious layout overlap at common breakpoints.
- No visual remnants of old blue/glassmorphism chrome except where intentionally preserved in 3D lighting.

## Phase Plan

### Phase 0: Intake and Guardrails

Purpose:

- Make the handoff usable and prevent accidental refactors.

Tasks:

- Confirm the handoff bundle path and decide whether to copy it into repo documentation or keep it external.
- Save this plan in `docs/paper-ink-ui-overhaul-integration-plan.md`.
- Capture a baseline of the current UI if visual regression comparison is desired.
- Record out-of-scope code paths:
  - `src/models/*`
  - `src/hooks/useArrowHandlers.ts`
  - `src/redux/themeSlice.ts`
  - `src/services/supabaseService.ts`
  - `src/lib/supabaseClient.ts`
  - EmailJS env wiring
  - Gemini request payload behavior

Exit criteria:

- Plan is reviewed.
- Handoff file location is clear.
- Implementation branch is ready.

### Phase 1: Foundation First

Purpose:

- Land tokens and utility classes before touching components.

Tasks:

- Add `src/styles/tokens.css` from the handoff.
- Replace or merge `src/styles/index.css` with the reference implementation.
- Update `tailwind.config.js` with token-backed `paper`, `ink`, `accent`, `rule`, `font-*`, and shadow extensions.
- Add Google Fonts loading in `index.html` or keep the `tokens.css` import, but do not keep both long term.
- Keep legacy aliases in place so current JSX still renders while component work is incomplete.
- Decide whether `src/styles/button.css` remains during transition.

Exit criteria:

- `npm run typecheck` passes.
- App still boots with old JSX on new tokens.
- No Tailwind class compilation errors.

### Phase 2: Shared Shell and Chrome

Purpose:

- Convert the visual frame used by every route.

Tasks:

- Update `src/App.tsx` to use `paper grain vignette min-h-screen`.
- Port `Navbar.tsx` from reference and reconcile imports.
- Port `ThemeToggle.tsx`.
- Port `LanguageToggle.tsx`.
- Port `VersionMark.tsx`.
- Verify route navigation and mobile menu.

Exit criteria:

- All routes show the new header and version mark.
- Theme toggle changes token colors across the shell.
- Language menu works in all three locales.

### Phase 3: Entry Experience and Home Overlay

Purpose:

- Convert the most visible 3D-adjacent surfaces without touching scene behavior.

Tasks:

- Port `Loader.tsx` from reference.
- Replace fragile translated headline splitting.
- Port `HomeInfo.tsx` from reference.
- Restyle the Home control buttons in `src/pages/Home.tsx` as stamped controls.
- Verify full-screen loader behavior on first Home load.

Exit criteria:

- Loader, HomeInfo, and Home controls match the manuscript direction.
- Home canvas remains interactive.
- Start button and asset progress behavior are unchanged.

### Phase 4: Content Page Ports

Purpose:

- Convert the three main content routes while preserving data and interactivity.

Tasks:

- Port `About.tsx` layout from `_source/surfaces.jsx`.
- Add skill grouping helper in `About.tsx`.
- Re-enable translated experience point summaries in the new timeline.
- Port `Projects.tsx` visual shell while preserving carousel logic.
- Add tape strips and folio numbering to project screenshots.
- Port `Contact.tsx` visual shell while preserving form and Three.js scene logic.
- Port `Alert.tsx` from reference.

Exit criteria:

- About, Projects, and Contact all render real data.
- No user-facing logic is lost.
- Contact submit path still calls EmailJS.

### Phase 5: ChatBot and Portal Hardening

Purpose:

- Bring the floating assistant into the same visual system and fix theme cascade edge cases.

Tasks:

- Restyle `ChatBot.tsx` trigger and panel.
- Make the portaled panel receive the correct token values in dark mode.
- Restyle transcript, empty state, loading state, input, send button, and close button.
- Verify API error, rate limit, empty input, and outside-click close flows.

Exit criteria:

- ChatBot matches nav chrome and panel direction.
- Dark mode works inside the portal.
- Existing Gemini behavior remains intact.

### Phase 6: Visual QA, Accessibility, and Responsive Pass

Purpose:

- Catch design regressions after all surfaces are converted.

Tasks:

- Start the dev server with `npm run dev`.
- Inspect desktop widths around 1440, 1024, and 768.
- Inspect mobile widths around 430, 390, and 320.
- Toggle light/dark on every route.
- Change languages on every route.
- Verify keyboard focus on nav, toggles, chatbot, project controls, and form controls.
- Verify Home and Contact canvases render nonblank.
- Check that grain/vignette overlays do not visually obscure text or controls.
- Check line wrapping for long Vietnamese and Chinese strings.

Exit criteria:

- No incoherent overlap.
- No unreadable contrast.
- No hidden interactive controls.
- No blank 3D canvas.

### Phase 7: Cleanup and Final Validation

Purpose:

- Remove transition baggage and lock in a maintainable implementation.

Tasks:

- Remove unused old CSS primitives:
  - `glassmorphism`
  - `neo-brutalism-*`
  - `block-container`
  - `fill-button`
  - old blue gradient utilities if no longer referenced
- Remove `src/styles/button.css` import from `src/main.tsx` if unused.
- Remove dead imports, commented-out old JSX, and redundant inline styles.
- Run final checks:
  - `npm run typecheck`
  - `npm test -- --runInBand`
  - `npm run build`
- Document any intentional deviations from `design_reference.html`.

Exit criteria:

- Working tree contains only intentional UI overhaul changes.
- Static checks and build pass.
- Remaining risks are documented.

## Recommended PR Stack

If this overhaul is split across multiple pull requests, use this order:

1. `paper-ink-foundation`
   - Tokens, Tailwind, font loading, shell class, legacy aliases.
2. `paper-ink-shared-chrome`
   - Navbar, toggles, language menu, version mark.
3. `paper-ink-home-loader`
   - Loader, HomeInfo, Home controls.
4. `paper-ink-content-pages`
   - About, Projects, Contact, Alert.
5. `paper-ink-chatbot-qa`
   - ChatBot, portal theme fix, responsive polish, cleanup.

This order keeps each PR reviewable and ensures the token layer lands before components depend on it.

## File-by-File Implementation Matrix

| File | Cluster | Integration Type | Notes |
| --- | --- | --- | --- |
| `src/styles/tokens.css` | A | Add new file | Use handoff tokens with font-loading decision. |
| `src/styles/index.css` | A | Replace/merge | Keep legacy aliases during transition. |
| `src/styles/button.css` | A/I | Retire | Remove after `fill-button` is gone. |
| `tailwind.config.js` | A | Replace/merge | Add token-backed colors/fonts/shadows. |
| `index.html` | A | Edit | Add font preconnect/link if not relying on CSS import. |
| `src/main.tsx` | A/I | Edit | Remove `button.css` import during cleanup if unused. |
| `src/App.tsx` | B | Drop-in with verify | Reference implementation is close to current file. |
| `src/components/Navbar.tsx` | B | Drop-in with verify | Keep ChatBot import and translation loading. |
| `src/components/ThemeToggle.tsx` | B | Drop-in with verify | Existing Redux action unchanged. |
| `src/components/LanguageToggle.tsx` | B | Drop-in with verify | Remove blank globe option. |
| `src/components/VersionMark.tsx` | B | Manual restyle | Reference spec only; simple tokenized class. |
| `src/components/HomeInfo.tsx` | C | Drop-in with verify | Keep Supabase fetch and i18n mapping. |
| `src/components/Loader.tsx` | C/H | Drop-in plus i18n fix | Avoid word-splitting translated headline. |
| `src/pages/Home.tsx` | C | Manual restyle | Do not alter R3F scene logic. |
| `src/pages/About.tsx` | D/H | Manual port | Add skill grouping and translated timeline copy. |
| `src/pages/Projects.tsx` | E | Manual port | Preserve slideshow state and drag behavior. |
| `src/pages/Contact.tsx` | F | Manual port | Preserve EmailJS and scene sizing. |
| `src/components/Alert.tsx` | F | Drop-in with verify | Match existing `type`, `text` props. |
| `src/components/ChatBot.tsx` | G | Manual port | Handle portal dark-mode token cascade. |
| `src/locales/*.json` | H | Minimal additions | Add only text that cannot reuse existing keys. |

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| ChatBot portal does not inherit `.dark` tokens | Dark-mode panel appears light or tokenless | Add theme class to portal wrapper or sync `.dark` onto `document.documentElement`. |
| Loader translated headline split breaks non-space languages | Chinese headline emphasis renders incorrectly | Add explicit emphasis keys or render un-split localized title. |
| Skill grouping is not represented in Supabase | About skills cannot match design spec directly | Group client-side by skill name; keep fallback category. |
| Project chip shape conflict between README and tokens | Visual mismatch against intended design | Decide source of truth before implementation; default to design reference/tokens. |
| Contact canvas height logic regresses on mobile | Sif/bonfire scene overlaps or disappears | Preserve ResizeObserver until screenshots confirm a simpler CSS layout. |
| Duplicate font loading | Extra network cost and possible FOIT | Choose either `index.html` links or CSS `@import`, not both. |
| `grain` and `vignette` overlays stack above content | Text may appear muted or controls visually obscured | Keep high-z controls, inspect every route, tune opacity only if necessary. |
| New token utilities break old JSX mid-port | Partial implementation fails to compile | Keep legacy aliases through Phase 6. |
| Alert currently shows success in `finally` after errors | False success banner after EmailJS failure | Fix during Contact port or explicitly defer as a behavioral bug. |

## Verification Checklist

- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run build`
- Local smoke test:
  - `/`
  - `/about`
  - `/projects`
  - `/contact`
- Light/dark smoke test on every route.
- EN/VI/ZH smoke test on every route.
- Desktop screenshot pass.
- Mobile screenshot pass.
- Home canvas interaction pass:
  - drag/rotate
  - wheel zoom
  - Q/W/E/R buttons
  - left/right controls
- Projects interaction pass:
  - auto-advance
  - hover pause
  - dot navigation
  - drag/swipe
  - demo/source link states
- Contact interaction pass:
  - field focus animation
  - submit disabled/loading state
  - success alert
  - error alert if testable
- ChatBot interaction pass:
  - open/close
  - outside-click close
  - send message
  - loading state
  - rate limit/error fallback if testable

## Done Definition

The overhaul is complete when:

- Every listed surface uses the Paper and Ink tokens and visual language.
- No route visibly depends on the old blue/glassmorphism style.
- Existing data, routes, theme state, i18n, EmailJS, Gemini chatbot, and 3D scene behavior still work.
- Dark mode is correct for normal in-tree components and portaled ChatBot UI.
- Mobile and desktop layouts are free of major overlap.
- Typecheck, tests, and production build pass.
- Any intentional design deviations are documented in the implementation PR.
