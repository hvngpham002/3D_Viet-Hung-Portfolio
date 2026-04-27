# cAp7: Paper and Ink ChatBot Port and Portal Theme Safety

## Purpose

Implement the seventh cluster and phase of the Paper and Ink UI overhaul. This phase ports only the `ChatBot` trigger and panel to the manuscript "Quill" treatment while preserving the existing Gemini/resume assistant behavior.

This phase must also fix the known portal theme-safety issue: the ChatBot panel is rendered with `createPortal(..., document.body)`, so it does not automatically inherit the `.dark` class from the app shell. The portaled panel must receive the active theme context locally.

## Current Assumptions

cAp1 through cAp6 are complete and validated:

- Token foundation exists in `src/styles/tokens.css`.
- Shared chrome is Paper and Ink.
- Home, About, Projects, Contact, and Alert surfaces are Paper and Ink.
- `src/styles/button.css` has been retired and must not be reintroduced.
- Reports exist for cAp1 through cAp6.
- Browser screenshot automation may still be unavailable in this repo.

## Source References

Read these before editing:

- `docs/paper-ink-ui-overhaul-integration-plan.md`
- `docs/specs/cap1-paper-ink-foundation.md`
- `docs/specs/cap2-paper-ink-shared-chrome.md`
- `docs/specs/cap3-paper-ink-home-entry-loader.md`
- `docs/specs/cap4-paper-ink-about-page.md`
- `docs/specs/cap5-paper-ink-projects-page.md`
- `docs/specs/cap6-paper-ink-contact-alert.md`
- `audit/reports/cap1-paper-ink-foundation-report.md`
- `audit/reports/cap2-paper-ink-shared-chrome-report.md`
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
- `audit/reports/cap4-paper-ink-about-page-report.md`
- `audit/reports/cap5-paper-ink-projects-page-report.md`
- `audit/reports/cap6-paper-ink-contact-alert-report.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/README.md`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/design_reference.html`
- `/Users/viethungpham/Downloads/design_handoff_paper_ink/_source/surfaces.jsx`

Primary target file:

- `src/components/ChatBot.tsx`

Possible test file only if practical:

- `src/components/ChatBot.test.tsx`

Possible locale files only if needed:

- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

## In Scope

- Restyle the ChatBot navbar trigger as a 36px Paper and Ink chrome button.
- Restyle the portaled panel as a Paper and Ink manuscript plate.
- Preserve all existing Gemini request behavior.
- Preserve all existing resume-context prompt behavior.
- Preserve message state, auto-scroll, input behavior, enter-to-send, loading state, rate-limit handling, error handling, and outside-click close.
- Fix the portal dark-mode token cascade.
- Create or update tests only if feasible and not brittle.
- Create a post-implementation report under `audit/reports`.

## Out of Scope

- Do not edit Navbar ordering or shared chrome except through the existing `ChatBot` trigger rendering.
- Do not edit resume data.
- Do not edit Gemini model selection, endpoint, request payload semantics, API key env var name, or system prompt constraints.
- Do not edit Redux slices.
- Do not edit routes/pages, Contact/Alert, models, hooks, Supabase services, EmailJS, or i18n runtime setup.
- Do not add dependencies.
- Do not reintroduce `src/styles/button.css` or `.fill-button`.
- Do not create a global component library in this phase.

## Existing Behavior to Preserve

System prompt:

- Keep using `resumeContent` from:

```ts
import resumeContent from "../data/resume.md?raw";
```

- Preserve the behavioral constraints in `SYSTEM_PROMPT`:
  - answer only about Hung based on the resume.
  - decline unrelated questions.
  - plain text only.
  - no markdown formatting.
  - respond in the same language as the user.
  - include resume content.

Gemini API:

- Keep env var:

```ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

- Keep endpoint model unless explicitly asked otherwise:

```text
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

- Keep `system_instruction`.
- Keep `contents` mapping:
  - `user` role for user messages.
  - `model` role for bot messages.
  - `parts: [{ text: m.content }]`.
- Keep 429 handling with `t("chatbot_rate_limit")`.
- Keep fallback answer with `t("chatbot_no_answer")`.
- Keep catch handling with `t("chatbot_error")`.
- Keep `finally` resetting `isLoading`.

UI behavior:

- Keep `isOpen`.
- Keep `messages`.
- Keep `input`.
- Keep `isLoading`.
- Keep `messagesEndRef` auto-scroll.
- Keep outside click/touch close using `buttonRef` and `panelRef`.
- Keep send guard:

```ts
if (!input.trim() || isLoading) return;
```

- Keep clearing input immediately after sending.
- Keep adding the user message before the request.
- Keep appending the bot message after response.
- Keep Enter key sending behavior.
- Keep send button disabled when loading or input is empty.

## Portal Theme Safety Requirement

Problem:

- `ChatBot` uses `createPortal(panel, document.body)`.
- The app applies `.dark` inside `App.tsx`, not on `document.body`.
- A portaled panel will not inherit `.dark`, so CSS variables can remain light in dark mode unless handled.

Required fix:

- Import Redux theme state into `ChatBot.tsx`:

```ts
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
```

- Read the current mode:

```ts
const themeMode = useSelector((state: RootState) => state.theme.mode);
```

- Apply the theme class to the portaled panel wrapper:

```tsx
className={themeMode === "dark" ? "dark" : ""}
```

or an equivalent wrapper that ensures `var(--paper-*)`, `var(--ink-*)`, and `var(--accent*)` resolve correctly inside the portal.

Acceptance note:

- It is not enough for the trigger to look correct in dark mode. The portaled panel itself must use dark token values.
- Do not move the portal target unless the implementation remains simple and fully preserves outside-click behavior.

## Design Direction

Mirror the ChatBot artboard from `_source/surfaces.jsx` and the handoff README:

- Trigger:
  - 36px by 36px.
  - Paper and Ink chrome button matching Navbar controls.
  - Use a display italic `Q`, small quill-like inline SVG, or other simple manuscript mark.
  - No blue robot SVG.
- Panel:
  - parchment surface.
  - low/no radius.
  - token border and `var(--shadow-card)`.
  - optional `.corners` ornament.
  - header with ink background.
  - title such as `The Quill`.
  - mono metadata such as `ASK ABOUT HUNG`.
  - transcript uses manuscript styling.
  - input uses `.input-ms`.
  - send button uses `.btn-ink` or `.btn-quill`.

Use Paper and Ink primitives:

- `.plate`
- `.card-paper`
- `.corners`
- `.t-eyebrow`
- `.t-display-italic`
- `.t-ui`
- `.t-mono`
- `.input-ms`
- `.btn-ink`
- `.btn-quill`
- `.loading-bar`

## Implementation Requirements

### 1. Update Trigger Button

Replace the old rounded robot button.

Required:

- Still wrapped by `buttonRef` so outside-click logic works.
- Button remains inside Navbar right cluster through existing `Navbar.tsx`.
- `onClick={() => setIsOpen((prev) => !prev)}` remains.
- `aria-label="Toggle chatbot"` remains or improves.

Visual:

- 36px by 36px.
- `border-radius: 2px`.
- `background: var(--paper-1)`.
- `border: 1px solid var(--rule-strong)`.
- `color: var(--ink-900)`.
- `box-shadow: var(--shadow-press)`.
- Display grid center.
- Glyph:
  - prefer ASCII `Q` in display italic, or a small inline SVG using `currentColor`.
  - do not use the old blue gradient robot SVG.

### 2. Update Portaled Panel Shell

Current panel:

- fixed full-ish mobile bottom panel.
- fixed top-right desktop panel.
- white/dark gray rounded card.

Required:

- Keep portal rendering.
- Keep `panelRef` on the element used by outside-click detection or on an enclosing wrapper that contains the whole panel.
- Ensure the panel wrapper receives dark mode class when needed.
- Keep high z-index, around `z-[9999]`.

Layout:

- Mobile:
  - `fixed inset-x-3 bottom-4`
  - height around `65vh`
  - avoid covering the whole viewport.
- Desktop:
  - `sm:inset-auto`
  - `sm:top-16`
  - `sm:right-4`
  - width around `20rem` to `22rem`.
  - height around `28rem`.

Visual:

- background `var(--paper-0)` or `var(--paper-1)`.
- border `1px solid var(--rule-strong)`.
- box shadow `var(--shadow-card)`.
- color `var(--ink-900)`.
- no large radius.
- no blue header.

### 3. Header

Required:

- Header background `var(--ink-900)`.
- Header text color `var(--paper-0)`.
- Left side:
  - small quill/Q marker.
  - title:
    - `The Quill`, or existing `t("chatbot_title")` if the implementation prefers fully translated visible text.
    - display italic.
  - mono metadata:
    - `ASK ABOUT HUNG` or similar.
- Right side:
  - close button.
  - preserve `onClick={() => setIsOpen(false)}`.
  - preserve `aria-label="Close chatbot"`.
  - use token colors, not blue/gray classes.

Locale guidance:

- Existing translated title key `chatbot_title` may be used.
- `The Quill` and `ASK ABOUT HUNG` may remain local manuscript metadata. If new translated text is added, update all three locale files and document it.

### 4. Empty State and Messages

Empty state:

- Preserve `t("chatbot_greeting")`.
- Style with `text-ink-500`, display italic or UI text.
- Avoid old gray utility classes.

Messages:

- Preserve `whitespace-pre-wrap`.
- Preserve user/bot alignment:
  - user right.
  - bot left.
- Bot messages:
  - optional mono label `QUILL`.
  - display italic or UI text.
  - `var(--paper-1)` background.
  - token border.
  - `var(--ink-900)` text.
- User messages:
  - optional mono label `YOU`.
  - `var(--ink-900)` background.
  - `var(--paper-0)` text.
- Use small radius at most `2px`.
- No blue bubbles.
- No rounded-2xl bubbles.

Loading state:

- Keep a visible bot-side loading indicator.
- Use tokenized dots, `loading-bar`, or simple manuscript ellipsis.
- Do not use old gray rounded chat bubble styling.

### 5. Input and Send Button

Input:

- Preserve:
  - `value={input}`
  - `onChange`
  - `onKeyDown={(e) => e.key === "Enter" && sendMessage()}`
  - placeholder `t("chatbot_placeholder")`
- Use `.input-ms`.
- Keep text readable on mobile.

Send button:

- Preserve:
  - `onClick={sendMessage}`
  - `disabled={isLoading || !input.trim()}`
  - `aria-label="Send message"`
- Use `.btn-ink` or `.btn-quill`.
- Use ASCII `->`, `Send`, or inline SVG with `currentColor`.
- No blue background.

### 6. Translations

Prefer existing keys:

- `chatbot_title`
- `chatbot_greeting`
- `chatbot_placeholder`
- `chatbot_rate_limit`
- `chatbot_error`
- `chatbot_no_answer`

Add new locale keys only if visible text cannot be reasonably treated as local manuscript metadata. If adding keys:

- Update:
  - `src/locales/en.json`
  - `src/locales/vi.json`
  - `src/locales/zh.json`
- Document the added keys in the report.

Do not edit `src/i18n.ts`.

Note:

- The app can load translations from Supabase at runtime. New local JSON keys may not be available in production if Supabase does not have matching records. Prefer existing keys or non-critical local metadata.

### 7. Tests

There is no existing `ChatBot.test.tsx` in the inspected tree.

Required:

- Do not add brittle network tests.
- Existing test suite must continue to pass.

Optional:

- Add a narrow render/open/close test only if it can be done without fragile mocks.
- If adding a test, mock:
  - `resume.md?raw`
  - `react-i18next`
  - `fetch`
  - Redux provider/theme state if needed.

If no test is added, document that choice in the cAp7 report.

## Constraints

- Use `apply_patch` for manual file edits.
- Keep edits scoped to `ChatBot.tsx` and optional locale/test files.
- Do not edit service/schema/type files.
- Do not add dependencies.
- Do not reintroduce blue/glassmorphism UI.
- Do not reintroduce `button.css` or `.fill-button`.
- Preserve Gemini endpoint, model, env var, request payload semantics, and resume prompt.
- Preserve outside-click close behavior.
- Preserve portal rendering.
- Fix dark-mode token cascade for the portal.
- Keep TypeScript validation passing.
- Keep mobile panel usable without text overlap.

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
- If browser interaction is available:
  - open the ChatBot panel.
  - close it with the close button.
  - close it by clicking outside.
  - type text and verify the send button enables.
  - press Enter and verify a user message appears.
  - toggle dark mode and verify the portaled panel uses dark Paper and Ink tokens.

Do not make a real Gemini request during smoke testing unless the user explicitly approves it.

If any validation or smoke test is skipped or fails, document the exact command and reason in the report.

## Post-Implementation Report

After implementation, create:

`audit/reports/cap7-paper-ink-chatbot-portal-report.md`

Create `audit/reports` if it does not exist.

The report must include:

1. Summary
   - What was implemented.
   - What was intentionally left unchanged.

2. Files Changed
   - List every changed file.
   - Briefly describe each change.

3. Scope Compliance
   - Confirm no routes/pages were changed.
   - Confirm no shared chrome components were changed.
   - Confirm no Gemini endpoint/model/env var/request semantics were changed.
   - Confirm no resume content was changed.
   - Confirm `button.css` was not reintroduced.

4. Visual Coverage
   - Confirm trigger uses 36px Paper and Ink chrome.
   - Confirm panel uses Paper and Ink manuscript styling.
   - Confirm messages and input are tokenized.
   - Confirm no old blue robot/bubbles/header remain.

5. Behavior Preservation
   - Confirm resume-based system prompt remains.
   - Confirm send guard remains.
   - Confirm 429 handling remains.
   - Confirm error/no-answer handling remains.
   - Confirm Enter-to-send remains.
   - Confirm outside-click close remains.
   - Confirm auto-scroll remains.

6. Portal Theme Safety
   - Explain how the portaled panel receives dark-mode token values.
   - Confirm trigger and panel both work in light/dark by code inspection or browser smoke.

7. Locale Changes
   - List any locale keys added.
   - If no locale keys were added, state that explicitly.

8. Test Changes
   - List any tests added or changed.
   - If no ChatBot test was added, explain why.

9. Validation Results
   - Include each command run.
   - Include pass/fail status.
   - Include relevant failure details if any command failed.

10. Risks or Follow-Ups
   - Note any browser/mobile visual smoke coverage that could not be completed.
   - Note any design compromise against the handoff.
   - Note next-phase implications for cAp8.

11. Agent Notes
   - Include assumptions made.
   - Include anything the next coding agent should know before starting cAp8.

## Acceptance Criteria

cAp7 is complete when:

- `src/components/ChatBot.tsx` trigger is ported to a 36px Paper and Ink chrome button.
- ChatBot panel is ported to Paper and Ink manuscript styling.
- The old blue robot trigger is removed.
- The old blue header and blue chat bubbles are removed.
- Gemini endpoint/model/env var and request semantics are preserved.
- Resume-based system prompt behavior is preserved.
- Input, Enter-to-send, disabled send state, loading state, 429 handling, error handling, no-answer handling, outside-click close, and auto-scroll are preserved.
- The portaled panel receives correct dark-mode token values.
- No route/page files are changed.
- No shared chrome files are changed.
- No dependencies are added.
- `button.css` is not reintroduced.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm test -- --runInBand` passes.
- The implementation report exists at `audit/reports/cap7-paper-ink-chatbot-portal-report.md`.
- Any skipped or failed validation is documented in the report.

## Expected Diff Shape

Expected changed files:

- `src/components/ChatBot.tsx`
- `audit/reports/cap7-paper-ink-chatbot-portal-report.md`

Possible changed files:

- `src/components/ChatBot.test.tsx`
- `src/locales/en.json`
- `src/locales/vi.json`
- `src/locales/zh.json`

Unexpected for this phase:

- Changes to `src/pages/*`
- Changes to `src/components/Navbar.tsx`
- Changes to `src/components/Alert.tsx`
- Changes to `src/components/Loader.tsx`
- Changes to `src/components/HomeInfo.tsx`
- Changes to shared chrome components
- Changes to `src/models/*`
- Changes to `src/services/*`
- Changes to Redux, Supabase, EmailJS, Gemini endpoint/model/env var semantics, or i18n runtime setup
- Changes to `src/data/resume.md`
- Reintroduction of `src/styles/button.css`
