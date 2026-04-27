# cAp7 Paper and Ink ChatBot Portal Report

## 1. Summary

Implemented the Paper and Ink ChatBot port:

- Replaced the old blue robot navbar trigger with a 36px manuscript chrome `Q` button.
- Restyled the portaled panel as a Paper and Ink manuscript surface with an ink header, corner ornaments, tokenized transcript, `.input-ms`, and `.btn-ink`.
- Added local portal theme safety by applying the active Redux theme class to the portaled panel root.

Intentionally left unchanged:

- Gemini endpoint, model, API key env var, `system_instruction`, request payload shape, and resume prompt content.
- Message state, input state, loading state, send guard, auto-scroll, Enter-to-send, 429 handling, no-answer fallback, error fallback, and outside-click close behavior.
- Routes, pages, shared chrome, Redux slices, resume data, Supabase services, EmailJS, models, and i18n setup.

## 2. Files Changed

- `src/components/ChatBot.tsx`
  - Added the Redux theme selector for portal theme safety.
  - Ported the trigger, panel shell, header, transcript, loading state, input, and send button to Paper and Ink styling.
  - Preserved the existing Gemini/resume assistant behavior.
- `audit/reports/cap7-paper-ink-chatbot-portal-report.md`
  - Added this implementation report.

## 3. Scope Compliance

- No routes or page files were changed.
- No shared chrome components were changed.
- Gemini endpoint/model/env var/request semantics were not changed.
- Resume content was not changed.
- `button.css` was not reintroduced.
- Runtime search `rg -n "fill-button|button.css" src` returned no results.

## 4. Visual Coverage

- Trigger uses a 36px Paper and Ink chrome button with `var(--paper-1)`, `var(--rule-strong)`, `var(--ink-900)`, `var(--shadow-press)`, and a display italic `Q`.
- Panel uses a parchment manuscript surface with `.card-paper`, `.corners`, `var(--paper-0)`, `var(--rule-strong)`, `var(--shadow-card)`, and low radius.
- Header uses `var(--ink-900)` with paper text, `The Quill`, and `ASK ABOUT HUNG` metadata.
- Messages, loading dots, input, and send button use token-backed Paper and Ink styling.
- The old blue robot trigger, blue header, blue bubbles, and rounded chat bubbles were removed.

## 5. Behavior Preservation

- Resume-based `SYSTEM_PROMPT` remains in place.
- Send guard remains: empty input and loading state block sends.
- User input still clears immediately after sending.
- User message is still appended before the request.
- 429 handling still appends `t("chatbot_rate_limit")`.
- No-answer fallback still uses `t("chatbot_no_answer")`.
- Catch handling still appends `t("chatbot_error")`.
- `finally` still resets `isLoading`.
- Enter-to-send remains.
- Send button disabled state remains.
- Outside-click and touch close still use `buttonRef` and `panelRef`.
- `messagesEndRef` auto-scroll remains.
- Portal rendering with `createPortal(panel, document.body)` remains.

## 6. Portal Theme Safety

`ChatBot.tsx` now reads `state.theme.mode` through `useSelector` and applies `dark` directly to the portaled panel root when the active mode is dark. Because the Paper and Ink CSS variables are defined on `.dark`, the portaled panel and its descendants resolve dark `var(--paper-*)`, `var(--ink-*)`, and `var(--accent*)` values even though the portal target is `document.body`.

Light/dark behavior was verified by code inspection. Browser dark-mode interaction was skipped because browser automation is not available in this repo.

## 7. Locale Changes

No locale keys were added.

Existing keys are still used for the greeting, placeholder, rate-limit, error, and no-answer text. `The Quill`, `ASK ABOUT HUNG`, `YOU`, and `QUILL` remain local manuscript metadata.

## 8. Test Changes

No tests were added or changed.

A narrow ChatBot test was not added because it would require portal, Redux, i18n, raw markdown, and fetch mocks while still mostly asserting markup classes. The existing suite was run to guard against regressions.

## 9. Validation Results

- `npm run typecheck`
  - Status: Pass.
  - Result: `tsc --noEmit` completed with no errors.
- `npm run build`
  - Status: Pass.
  - Result: `tsc -b && vite build` completed successfully.
- `npm test -- --runInBand`
  - Status: Pass.
  - Result: 1 test suite passed, 3 tests passed.
- `npm run dev -- --host 127.0.0.1`
  - Status: Pass.
  - Result: Vite started locally at `http://127.0.0.1:5175/` after port 5174 was already in use.
- `curl -I -s http://127.0.0.1:5175/`
  - Status: Initial sandboxed attempt failed with exit code 7 and no output.
  - Result after localhost approval: Pass, HTTP 200.
- `rg -n "fill-button|button.css" src`
  - Status: Pass.
  - Result: no runtime references found.

Skipped smoke coverage:

- Browser interaction checks for opening the panel, closing with the close button, outside-click close, typing input, Enter-to-send, and dark-mode visual verification were skipped because `node_modules/.bin` contains Jest/Vite tooling but no Playwright or Cypress browser automation.
- No real Gemini request was made.

## 10. Risks or Follow-Ups

- Browser-level visual review should still be performed for the ChatBot panel in light and dark modes, especially mobile height, long messages, and close/outside-click behavior.
- The loading indicator uses tokenized bouncing dots rather than the global `.loading-bar`, which better matches the compact transcript area.
- cAp8 can proceed without additional ChatBot API work unless it wants broader browser visual automation.

## 11. Agent Notes

- Assumption: cAp1 through cAp6 work in the current dirty worktree is accepted foundation work for this phase.
- Assumption: local manuscript metadata avoids locale churn and the Supabase translation-sync risk called out in the spec.
- The portaled root keeps `panelRef`, so outside-click detection still treats the entire visible panel as inside the ChatBot.
