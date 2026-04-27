# cAp4: Paper and Ink About Page Port

## Purpose

Implement the fourth cluster and phase of the Paper and Ink UI overhaul. This phase ports only the About route to the manuscript author, skills, and chronicle layout.

The work is a visual and layout port for `src/pages/About.tsx` while preserving live data, translations, loading/error behavior, and existing service contracts.

## Current Assumptions

cAp1, cAp2, and cAp3 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- App shell and shared chrome are already Paper and Ink.
- Home loader, HomeInfo, and Home overlay controls are already Paper and Ink.
- `src/styles/button.css` has been retired and must not be reintroduced.
- Reports exist for cAp1, cAp2, and cAp3.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Primary target file:

- `src/pages/About.tsx`

Possible locale files only if needed:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## In Scope

- Replace the current blue/avatar/radial-menu About layout with the Paper and Ink About artboard direction.
- Preserve `getExperiences()` and `getSkills()` data fetching.
- Preserve `experience` and `skill` TypeScript contracts.
- Preserve `useTranslation()` and existing translation keys where possible.
- Add client-side skill grouping inside `About.tsx`.
- Render translated experience point summaries that are currently commented out.
- Restyle loading and error states using Paper and Ink tokens.
- Preserve social/profile links in a manuscript-compatible treatment.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit Supabase services or schema.
- Do not edit `src/types/supabase.ts` unless TypeScript requires a purely optional local UI helper type in `About.tsx`; schema changes are not allowed.
- Do not edit `Projects`, `Contact`, `Home`, `Loader`, `HomeInfo`, `Alert`, `ChatBot`, `Navbar`, toggles, models, hooks, Redux, EmailJS, Gemini, or i18n runtime setup.
- Do not add dependencies.
- Do not reintroduce `src/styles/button.css` or `.fill-button`.
- Do not create a global component library in this phase.

## Existing Data Shape

Skills:

```ts
export interface skill {
  id?: number;
  name: string;
  icon: string;
}
```

Experiences:

```ts
export interface experience {
  id?: number;
  year: string;
  company: string;
  role: string;
  country: string;
  logo: string;
  points: string[];
  linkText: string;
}
```

Important:

- Do not rely on skill categories from Supabase. They do not exist.
- Do not require new fields in `experiences`.
- Do not remove `logo` or `country` usage unless the final layout intentionally does not need them.

## Design Direction

Mirror the About artboard from `_source/surfaces.jsx` and the handoff README:

- Name hero using display italic typography.
- Manuscript portrait block with small seal-style social links.
- Lede paragraph under the name.
- Bio plate with drop cap.
- Skills as categorized manuscript plates or a structured gridded ledger.
- Experience as a vertical chronicle timeline with center rule, alternating entries, accent nodes, translated role/company/date/location metadata, and translated point summaries.

Use existing Paper and Ink primitives:

- `.plate`
- `.card-paper`
- `.rule-double`
- `.seal`
- `.t-eyebrow`
- `.t-display`
- `.t-display-italic`
- `.t-ui`
- `.t-mono`
- `.t-drop`
- `.hairline`

## Implementation Requirements

### 1. Clean Up Old About-Specific Structure

Remove or replace these old visual constructs from `About.tsx`:

- `RadialMenuItem`
- `AnimatePresence` if it is only used for the radial menu.
- Blue circular social buttons.
- Blue gradient name treatment.
- Icon-based skills grid.
- Old central timeline with thick gray/blue line.
- Commented-out legacy timeline point list.

Keep `motion` if useful for existing page reveal animations, but do not let animation requirements complicate the port. Static tokenized layout is acceptable if it is cleaner and safer.

### 2. Preserve Data Fetching and State

Keep these state concepts:

- `experiences`
- `skills`
- `loading`
- `error`

Keep the `useEffect` that fetches both datasets with `Promise.all`:

```ts
const [experiencesData, skillsData] = await Promise.all([
  getExperiences(),
  getSkills(),
]);
```

Keep error handling:

```ts
setError(err instanceof Error ? err.message : "Failed to fetch data");
```

Do not change `getExperiences()` or `getSkills()`.

### 3. Restyle Loading State

Replace the old blue spinner with a Paper and Ink loading state.

Required:

- Full-height route-level layout, centered.
- Use `.plate` or `.card-paper`.
- Include `t-eyebrow` text such as `Chapter I`.
- Include a `loading-bar`.
- Use token colors only.

No blue spinner should remain in `About.tsx`.

### 4. Restyle Error State

Replace the old red error block with a Paper and Ink error state.

Required:

- Full-height route-level layout, centered.
- Use `.plate` or `.card-paper`.
- Use `text-accent` or `var(--accent)` for the error title.
- Show the actual `error` text.
- Keep the message readable in light and dark.

### 5. Hero Section

Required content:

- Portrait image from existing asset:

```tsx
src="/images/profile.webp"
```

- Display name using existing translations:
  - `t("about_greeting")`
  - `t("about_name")`

Recommended rendering:

```tsx
{t("about_greeting")} <em>{t("about_name")}.</em>
```

Do not hard-code English-only hero copy if existing translations can be reused.

Required visual:

- Container starts below fixed navbar.
- Max width around existing `max-container` or about `max-w-5xl`.
- Hero can be a two-column grid on desktop and single-column on mobile.
- Portrait block:
  - `var(--paper-2)` background.
  - `1px solid var(--rule-strong)`.
  - `box-shadow: var(--shadow-card)`.
  - squared or very low radius.
  - no circular crop unless explicitly chosen to preserve image composition.
- Social links:
  - Preserve LinkedIn: `https://linkedin.com/in/vhungpham`
  - Preserve GitHub: `https://github.com/hvngpham002`
  - Style as small `.seal` links or small tokenized manuscript buttons.
  - Use `target="_blank"` and `rel="noopener noreferrer"`.
  - Include accessible labels.

### 6. Lede and Bio

Required:

- Use existing `about_bio` translation.
- Render it in a `.plate`.
- Apply `.t-drop` to the paragraph so it gets a drop cap.
- Use `font-ui`, token colors, and comfortable line-height.

Optional:

- Add a short lede line above the bio if it can reuse existing translated content.
- If adding new visible text, add locale keys for all three languages or keep it as non-user-facing metadata.

Avoid:

- Hard-coded English body copy that bypasses i18n.
- Oversized hero text inside compact cards.

### 7. Skill Grouping

The handoff wants grouped skills without icons. Current skill data is flat, so group client-side by `skill.name`.

Add a local helper in `About.tsx`; do not change Supabase schema.

Recommended grouping:

```ts
const skillGroups = [
  {
    label: "Languages",
    names: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"],
  },
  {
    label: "Frontend",
    names: ["React", "Redux", "Tailwind", "SASS"],
  },
  {
    label: "Backend & Tools",
    names: ["Node.js", "Git"],
  },
];
```

Implementation guidance:

- Match against fetched `skills`.
- Preserve the display name from Supabase.
- Put any unmatched skills into an `Other` or `Additional` group.
- If labels are visible user-facing text, either:
  - add locale keys for all three languages, or
  - render labels as concise technical metadata and document the choice in the report.

Required visual:

- Section header uses `.rule-double`.
- Use a grid:
  - 1 column on mobile.
  - 2 columns on tablet.
  - 3 or 4 columns on desktop, depending on content fit.
- Each group is a `.plate` or `card-paper`.
- Group label uses `.t-eyebrow`.
- Skill names use Inter/UI or display italic text.
- Do not render skill icons in cAp4.

### 8. Experience Chronicle

Replace the current timeline with a Paper and Ink chronicle.

Required:

- Section header uses `.rule-double`.
- Use a vertical center rule on desktop.
- Entries alternate left/right on desktop.
- Entries stack cleanly on mobile.
- Each entry includes:
  - `exp.year`
  - translated role: `t(exp.role)`
  - translated company: `t(exp.company)`
  - translated point summaries from `exp.points.map((point) => t(point))`
- Include `exp.logo` and `exp.country` only if they fit the manuscript treatment:
  - small seal-like node, small metadata mark, or omitted from card body.
  - If omitted, document this in the report.

Required card treatment:

- `.card-paper` or `.plate`.
- No blue borders.
- No rounded-lg white/dark-gray cards.
- Role uses display italic.
- Company uses token accent or ink emphasis.
- Points use UI text, `text-ink-500` or token equivalent.
- Use real list semantics (`ul`/`li`) for points if points are shown as bullets.

Mobile requirements:

- Avoid a center rule that leaves no room for cards.
- Use a left-side rule or stacked cards if needed.
- Text must not overlap the timeline node.

### 9. Footer

The current About footer can remain, but restyle it with tokens:

- `font-mono` or `.t-eyebrow`.
- `text-ink-300`.
- No gray utility dependency if practical.

Do not change the copyright year unless the user explicitly asks.

## Locale Guidance

Prefer existing keys:

- `about_greeting`
- `about_name`
- `about_bio`
- `about_skills`
- `about_exp`
- `about_exp_title_*`
- `about_exp_company_*`
- `about_exp_company_*_desc_*`

Add new locale keys only if visible text cannot be reasonably reused. If adding keys:

- Update all three files:
  - `src/locales/en.json`
  - `src/locales/vi.json`
  - `src/locales/zh.json`
- Document the added keys in the report.

Do not edit `src/i18n.ts`.

Note:

- The app can load translations from Supabase at runtime. New local JSON keys may not be available in production if Supabase does not have matching records. Prefer existing keys or graceful fallback strings for non-critical labels.

## Constraints

- Use `apply_patch` for manual file edits.
- Keep edits scoped to `About.tsx` and optional locale files.
- Do not edit service/schema/model files.
- Do not add dependencies.
- Do not reintroduce blue/glassmorphism UI.
- Do not reintroduce `button.css` or `.fill-button`.
- Keep TypeScript strict enough to pass existing validation.
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
- Visit `/about`.
- Confirm the route returns HTTP 200.
- Toggle light/dark if browser interaction is available.
- Confirm skills and experiences render from fetched data or the existing data source.
- Confirm mobile width does not overlap timeline content if browser/screenshot tooling is available.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap4-paper-ink-about-page-report.md`

Create `audit/reports` if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe each change.

3. Scope Compliance
   - Confirm no Supabase service/schema files were changed.
   - Confirm no non-About route pages were changed.
   - Confirm no shared chrome, Home, Projects, Contact, Alert, or ChatBot files were changed.
   - Confirm `button.css` was not reintroduced.

4. Visual Coverage
   - Confirm hero uses Paper and Ink portrait/name/social treatment.
   - Confirm bio uses `.plate` and drop cap.
   - Confirm skills are grouped and iconless.
   - Confirm chronicle/timeline uses Paper and Ink treatment.
   - Confirm loading and error states are tokenized.

5. Data and Behavior Preservation
   - Confirm `getExperiences()` and `getSkills()` are still used.
   - Confirm no Supabase schema changes were required.
   - Confirm existing translation keys are reused.
   - Confirm experience points are rendered and translated.

6. Skill Grouping Details
   - List the grouping rules used.
   - Note how unmatched skills are handled.

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
   - Note next-phase implications for cAp5.

10. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp5.

## Acceptance Criteria

cAp4 is complete when:

- `src/pages/About.tsx` is ported to the Paper and Ink About design direction.
- Loading and error states use Paper and Ink tokens.
- The old radial menu and blue icon skill grid are gone.
- Skills render grouped without icons.
- Experience entries render translated role, company, year, and point summaries.
- `getExperiences()` and `getSkills()` are still used.
- No Supabase schema or service files are changed.
- No non-About route pages are changed.
- `button.css` is not reintroduced.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes, or any failure is documented with cause.
- The implementation report exists at `audit/reports/cap4-paper-ink-about-page-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/pages/About.tsx`
- `audit/reports/cap4-paper-ink-about-page-report.md`

Possible changed files:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Unexpected for this phase:

- Changes to `src/services/*`
- Changes to `src/types/supabase.ts`
- Changes to `src/pages/Home.tsx`
- Changes to `src/pages/Projects.tsx`
- Changes to `src/pages/Contact.tsx`
- Changes to `src/components/ChatBot.tsx`
- Changes to `src/components/Alert.tsx`
- Changes to `src/components/Loader.tsx`
- Changes to `src/components/HomeInfo.tsx`
- Changes to shared chrome components
- Changes to `src/models/*`
- Reintroduction of `src/styles/button.css`
