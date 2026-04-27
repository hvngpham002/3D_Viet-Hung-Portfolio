# cAp5: Paper and Ink Projects Page Port

## Purpose

Implement the fifth cluster and phase of the Paper and Ink UI overhaul. This phase ports only the Projects route to the manuscript folio layout while preserving the existing project slideshow behavior.

The work is a visual and layout port for `src/pages/Projects.tsx`. The project carousel, drag/swipe gestures, hover pause, auto-advance timing, data fetching, translations, and link behavior must remain intact.

## Current Assumptions

cAp1 through cAp4 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- Shared chrome is Paper and Ink.
- Home entry surfaces are Paper and Ink.
- About page is Paper and Ink.
- `src/styles/button.css` has been retired and must not be reintroduced.
- Reports exist for cAp1, cAp2, cAp3, and cAp4.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `docs/specs/cap4-paper-ink-about-page.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `audit/reports/cap4-paper-ink-about-page-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Primary target file:

- `src/pages/Projects.tsx`

Possible locale files only if needed:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## In Scope

- Replace the current rounded blue/white project cards with Paper and Ink folios.
- Preserve the existing project slideshow behavior.
- Preserve `getProjects()` data fetching.
- Preserve `project` TypeScript contract.
- Preserve existing translation keys where possible.
- Restyle loading and error states using Paper and Ink tokens.
- Restyle footer using tokens.
- Use folio numbering.
- Add tape strips over project screenshots.
- Replace blue pill tags with square manuscript tags for this page.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit Supabase services or schema.
- Do not edit `src/types/supabase.ts`.
- Do not edit `Home`, `About`, `Contact`, `Loader`, `HomeInfo`, `Alert`, `ChatBot`, shared chrome, models, hooks, Redux, EmailJS, Gemini, or i18n runtime setup.
- Do not add dependencies.
- Do not reintroduce `src/styles/button.css` or `.fill-button`.
- Do not create a global component library in this phase.
- Do not remove Framer Motion carousel behavior.

## Existing Data Shape

Projects:

```ts
export interface project {
  id?: number;
  images: string[];
  title: string;
  description: string;
  tags: string[];
  sourceCode: string;
  demo: string;
}
```

Runtime note:

- Some data sources may contain nullish `demo` or `sourceCode` values even though the current TypeScript interface says `string`.
- Continue guarding links with truthiness checks, as the current UI does.
- Do not change the schema or type file in this phase.

## Behavior That Must Be Preserved

Inside `ProjectCard`, preserve these concepts:

- `currentImageIndex`
- `direction`
- `isHovered`
- `isTransitioning`
- `paginate(newDirection)`
- `changeImage(index)`
- auto-advance interval when not hovered
- hover pause behavior
- 4500ms slideshow interval
- 300ms transition lock timeout
- `slideVariants`
- `swipeConfidenceThreshold`
- `swipePower`
- `drag="x"`
- `dragConstraints={{ left: 0, right: 0 }}`
- `dragElastic={1}`
- `onDragEnd` swipe threshold logic
- dot navigation
- `draggable="false"` on images

You may move markup around these behaviors, but do not simplify them away.

## Design Direction

Mirror the Projects artboard from `_source/surfaces.jsx` and the handoff README:

- Section reads like a cabinet of manuscript folios.
- Two-column project grid on desktop.
- One-column grid on mobile.
- Each card is a Paper and Ink folio with:
  - folio numbering.
  - display italic title.
  - taped screenshot area.
  - tokenized description.
  - square mono uppercase tags.
  - manuscript-styled demo/source links.
- Loading, error, and footer use tokenized Paper and Ink treatments.

Use existing Paper and Ink primitives where appropriate:

- `.card-paper`
- `.plate`
- `.rule-double`
- `.t-eyebrow`
- `.t-display`
- `.t-display-italic`
- `.t-ui`
- `.t-mono`
- `.btn-quill`
- `.tape`
- `.loading-bar`

## Implementation Requirements

### 1. Preserve Data Fetching and State

Keep these state concepts:

- `projects`
- `loading`
- `error`

Keep the existing fetch:

```ts
const data = await getProjects();
setProjects(data);
```

Keep error handling:

```ts
setError(err instanceof Error ? err.message : "Failed to fetch projects");
```

Do not change `getProjects()`.

### 2. Restyle Loading State

Replace the old blue spinner with a Paper and Ink loading state.

Required:

- Full-height route-level layout, centered.
- Use `.plate` or `.card-paper`.
- Include `t-eyebrow` text such as `Cabinet`.
- Include one or more `loading-bar` blocks.
- Use token colors only.

No blue spinner should remain in `Projects.tsx`.

### 3. Restyle Error State

Replace the old red error block with a Paper and Ink error state.

Required:

- Full-height route-level layout, centered.
- Use `.plate` or `.card-paper`.
- Use `text-accent` or `var(--accent)` for the error title.
- Show the actual `error` text.
- Keep the message readable in light and dark.

### 4. Projects Page Header

Replace the current simple `h2` and gray divider with a Paper and Ink section header.

Required:

- Use `.rule-double`.
- Include:
  - left metadata: `Cabinet`
  - center display title using existing `t("Projects")`
  - right metadata: project count, for example `04 of 04`
- Use ASCII text only:
  - `04 of 04`
  - not decorative number symbols.
- Keep layout responsive. On narrow screens, the rule header may stack.

### 5. Project Grid

Required:

- One column on mobile.
- Two columns on `md` or `lg` and up.
- Gap around `gap-8` to `gap-10`.
- Cards should not be nested inside decorative outer cards.
- Use `article` semantics for project cards.

### 6. Project Folio Card

Replace the current `bg-white dark:bg-gray-700 rounded-xl shadow-lg` card with Paper and Ink folio styling.

Required visual:

- Outer card uses `.card-paper`.
- No large rounded corners.
- No blue background classes.
- Stable screenshot region using either:
  - `aspect-[16/10]`
  - or fixed responsive height similar to current `h-72`
- Screenshot area background uses `var(--paper-2)` or token utilities.
- Overflow hidden only where needed for the slideshow image.

Folio metadata:

- Add a folio label:

```tsx
FOLIO {String(index + 1).padStart(2, "0")}
```

- Use `.t-eyebrow`.

Title:

- Use translated title: `t(project.title)`.
- Use display italic typography.
- Size around 28-32px on desktop.
- Use `text-ink-900`.

Description:

- Use translated description: `t(project.description)`.
- Use UI/body text.
- Use `text-ink-700` or token equivalent.
- Limit to a readable block. If using a max-line treatment, do it without adding dependencies.

### 7. Screenshot Slideshow Treatment

Preserve all existing slideshow behavior, but restyle its frame.

Required:

- Keep `AnimatePresence` and motion image wrapper.
- Keep `slideVariants`.
- Keep swipe behavior.
- Keep auto-advance and hover pause.
- Keep `motion.img`.
- Add two tape strips at the top of the screenshot area:
  - use `.tape` if available.
  - left tape slightly rotated negative.
  - right tape slightly rotated positive.
- Tape strips must be pointer-events none.
- Ensure tape does not block drag/swipe gestures.

Dot navigation:

- Keep dots as buttons.
- Restyle dot container with tokenized paper background and rule border.
- Active dot uses `var(--accent)`.
- Inactive dot uses `var(--ink-300)` or `var(--rule-strong)`.
- Keep `aria-label={`View image ${idx + 1}`}`.
- Keep disabled behavior during transition.

### 8. Tags

The handoff has a small conflict:

- The global `.tag-ink` primitive from cAp1 is pill-shaped.
- The Projects surface spec says tag chips should have no radius.

For cAp5, follow the Projects surface spec.

Required:

- Tags are iconless.
- Use mono font.
- Uppercase text.
- Around 10-11px.
- `background: var(--paper-2)`.
- `border: 1px solid var(--rule-strong)` or `var(--rule)`.
- `color: var(--ink-700)`.
- `border-radius: 0` or at most `2px`.

Implementation options:

- Use a local class string in `Projects.tsx`.
- Or use `.tag-ink` plus an inline/local override for `borderRadius: 0`.

Do not change global `.tag-ink` in this phase unless absolutely necessary.

### 9. Links and Unavailable States

Preserve current link behavior:

- Demo link only renders as a link when `project.demo` is truthy.
- Source link only renders as a link when `project.sourceCode` is truthy.
- External links keep:

```tsx
target="_blank"
rel="noopener noreferrer"
```

Demo link:

- Use existing key `projects_live_demo`.
- Style as manuscript display italic or `.btn-quill`.
- Add an ASCII arrow suffix if desired: `->`.

Source link:

- Use existing key `projects_source_code`.
- Style as manuscript display italic secondary link or `.btn-quill`.

Unavailable states:

- Use existing keys:
  - `projects_not_deployed`
  - `projects_private`
- Style with `t-mono` or tokenized muted text.
- Do not render unavailable states as disabled blue buttons.

### 10. Footer

The current Projects footer can remain, but restyle it with tokens:

- `font-mono` or `.t-eyebrow`.
- `text-ink-300`.
- No gray utility dependency if practical.

Do not change the copyright year unless the user explicitly asks.

## Locale Guidance

Prefer existing keys:

- `Projects`
- `projects_live_demo`
- `projects_source_code`
- `projects_not_deployed`
- `projects_private`
- `project_*_title`
- `project_*_desc`

Add new locale keys only if visible text cannot be reasonably reused. If adding keys:

- Update all three files:
  - `src/locales/en.json`
  - `src/locales/vi.json`
  - `src/locales/zh.json`
- Document the added keys in the report.

Do not edit `src/i18n.ts`.

Note:

- The app can load translations from Supabase at runtime. New local JSON keys may not be available in production if Supabase does not have matching records. Prefer existing keys or technical metadata text for non-critical labels.

## Constraints

- Use `apply_patch` for manual file edits.
- Keep edits scoped to `Projects.tsx` and optional locale files.
- Do not edit service/schema/type files.
- Do not add dependencies.
- Do not reintroduce blue/glassmorphism UI.
- Do not reintroduce `button.css` or `.fill-button`.
- Preserve carousel logic exactly unless a visual wrapper requires moving JSX.
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
- Visit `/projects`.
- Confirm the route returns HTTP 200.
- If browser interaction is available:
  - verify project images render.
  - verify dot navigation changes images.
  - verify hover pauses auto-advance.
  - verify drag/swipe still changes images.
  - verify demo/source/unavailable states render.
  - verify mobile width does not overlap content.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap5-paper-ink-projects-page-report.md`

Create `audit/reports` if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe each change.

3. Scope Compliance
   - Confirm no Supabase service/schema/type files were changed.
   - Confirm no non-Projects route pages were changed.
   - Confirm no shared chrome, Home, About, Contact, Alert, or ChatBot files were changed.
   - Confirm `button.css` was not reintroduced.

4. Visual Coverage
   - Confirm header uses `.rule-double`.
   - Confirm project cards use Paper and Ink folio treatment.
   - Confirm screenshot area uses tape strips.
   - Confirm tags are square mono manuscript chips.
   - Confirm loading/error/footer states are tokenized.

5. Behavior Preservation
   - Confirm `getProjects()` is still used.
   - Confirm slideshow auto-advance interval remains.
   - Confirm hover pause remains.
   - Confirm drag/swipe remains.
   - Confirm dot navigation remains.
   - Confirm demo/source conditional rendering remains.

6. Tag Styling Decision
   - Note that cAp5 intentionally follows the Projects surface spec and uses square tags, even though global `.tag-ink` may remain pill-shaped.

7. Locale Changes
   - List any locale keys added.
   - If no locale keys were added, state that explicitly.

8. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

9. Risks or Follow-Ups
   - Note any browser/mobile visual smoke coverage that could not be completed.
   - Note any design compromise against the handoff.
   - Note next-phase implications for cAp6.

10. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp6.

## Acceptance Criteria

cAp5 is complete when:

- `src/pages/Projects.tsx` is ported to the Paper and Ink Projects folio design direction.
- Loading and error states use Paper and Ink tokens.
- The old rounded blue/white project cards are gone.
- Project cards include folio numbering.
- Screenshot areas include tape strips.
- Tags are square mono manuscript chips.
- Existing carousel behavior is preserved:
  - auto-advance.
  - hover pause.
  - drag/swipe.
  - dot navigation.
  - transition lock.
- Demo/source links and unavailable states still render conditionally.
- `getProjects()` is still used.
- No Supabase schema, service, or type files are changed.
- No non-Projects route pages are changed.
- `button.css` is not reintroduced.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes, or any failure is documented with cause.
- The implementation report exists at `audit/reports/cap5-paper-ink-projects-page-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/pages/Projects.tsx`
- `audit/reports/cap5-paper-ink-projects-page-report.md`

Possible changed files:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Unexpected for this phase:

- Changes to `src/services/*`
- Changes to `src/types/supabase.ts`
- Changes to `src/pages/Home.tsx`
- Changes to `src/pages/About.tsx`
- Changes to `src/pages/Contact.tsx`
- Changes to `src/components/ChatBot.tsx`
- Changes to `src/components/Alert.tsx`
- Changes to `src/components/Loader.tsx`
- Changes to `src/components/HomeInfo.tsx`
- Changes to shared chrome components
- Changes to `src/models/*`
- Reintroduction of `src/styles/button.css`
