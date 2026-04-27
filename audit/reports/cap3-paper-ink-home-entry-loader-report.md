# cAp3 Paper and Ink Home Entry Loader Report

## 1. Summary

Implemented the Paper and Ink Home entry surfaces:

- Converted `Loader` to the manuscript prologue treatment with `paper grain vignette`, a guide plate, and wax-seal progress control.
- Converted `HomeInfo` to a translucent manuscript stage card with Roman numeral stage labels, corner ornaments, display quote text, and `.btn-quill`.
- Converted Home overlay controls to stamped manuscript keycaps using `.btn-stamp`.
- Removed the legacy `button.css` runtime import and deleted the stylesheet after proving `.fill-button` was no longer used.

Intentionally left unchanged:

- The Home 3D canvas, model imports, model positions, animation logic, stage detection, camera, lighting, drag, zoom, and key simulation behavior.
- Redux, Supabase services, i18n runtime setup, EmailJS, Gemini chatbot logic, and environment variables.
- Non-Home route pages and unrelated components.

## 2. Files Changed

- `src/components/Loader.tsx`
  - Replaced the old gray/blue loader UI with the Paper and Ink prologue loader, guide plate, wax-seal SVG progress ring, asset count, and tokenized loading skeletons.
  - Preserved `useProgress()`, monotonic `displayProgress`, translation reload behavior, completion gating, `canStart`, and `onStarted?.()`.
- `src/components/HomeInfo.tsx`
  - Removed the arrow image import, theme selector, and `.fill-button` usage.
  - Added Roman numeral stage labels, translucent `.corners` card styling, safe empty-content handling, display quote text, and `.btn-quill`.
- `src/pages/Home.tsx`
  - Replaced the loader wrapper with `fixed inset-0 z-[999]`.
  - Added a local `ControlButton` helper and restyled desktop/mobile overlay controls with `.btn-stamp`.
  - Preserved `leftHandlers`, `rightHandlers`, and Q/W/E/R start/end handler calls.
- `src/main.tsx`
  - Removed `import "./styles/button.css";`.
- `src/styles/button.css`
  - Deleted after runtime reference search showed it was no longer needed.
- `audit/reports/cap3-paper-ink-home-entry-loader-report.md`
  - Added this implementation report.

## 3. Scope Compliance

- No `src/models/*` files were changed.
- `SceneContent` behavior was not changed; edits in `Home.tsx` were limited to the loader wrapper, overlay controls, and a small button helper.
- No non-Home route page files were changed by this phase.
- `ChatBot`, `Alert`, `About`, `Projects`, and `Contact` were not changed by this phase.

## 4. Visual Coverage

- Loader uses `paper grain vignette`.
- Loader includes the manuscript prologue eyebrow, translated heading, guide `.plate`, and wax-seal SVG progress treatment.
- HomeInfo uses `.corners`, translucent paper background, Roman numeral stage labels, display quote text, and `.btn-quill`.
- Home controls use `.btn-stamp` for desktop and mobile layouts.

## 5. Behavior Preservation

- Loader still uses `useProgress()` with `progress`, `total`, `loaded`, and `active`.
- Loader still keeps monotonic `displayProgress`, requires `!active`, `loaded === total`, and `displayProgress === 100`, and only calls `onStarted?.()` when `canStart` is true.
- Loader does not split translated title text by spaces; it renders `t("Welcome to My Journey")` as one string.
- HomeInfo still fetches `getHomeInfo()` and translates `stageInfo.text` and `stageInfo.linkText`.
- Left/right controls still spread `leftHandlers` and `rightHandlers`.
- Q/W/E/R controls still call `handleMoveStart(key)` and `handleMoveEnd(key)` for touch and mouse events.

## 6. `button.css` Cleanup Result

`src/styles/button.css` was removed.

Runtime search before removal:

```bash
rg -n "fill-button|fill-button-dark|button.css" src
```

Result summary:

- Only `src/styles/button.css` selectors remained.
- Only `src/main.tsx` imported `button.css`.
- No JSX/runtime component still used `.fill-button` or `.fill-button-dark`.

After removal, the same search returned no results.

## 7. Validation Results

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
  - Result: Vite started at `http://127.0.0.1:5174/`.
- `curl -I -s http://127.0.0.1:5174/`
  - Status: Initial sandboxed attempt failed with exit code 7 and no response output.
  - Result after localhost approval: Pass, HTTP 200.

Skipped smoke coverage:

- Browser activation of the loader button after asset completion was skipped because browser interaction automation was not available in this session.
- Canvas screenshot/nonblank verification was skipped for the same reason.
- Click/touch verification of Q/W/E/R and left/right buttons was skipped for the same reason. Handler preservation was verified in code and by typecheck/build.

## 8. Risks or Follow-Ups

- Browser-level visual smoke should be performed when browser automation is available, especially for the loader asset-complete start state and Home canvas overlay alignment.
- The Loader heading intentionally avoids accent-splitting translated text. If visual ownership later requires a partial accent in the title, explicit per-locale keys should be added instead of splitting by spaces.
- cAp4 can proceed to the next route surface without carrying `button.css`.

## 9. Agent Notes

- Assumption: cAp1 and cAp2 uncommitted work already present in the worktree is the accepted foundation for this phase.
- Assumption: ASCII `-- Prologue --`, `-- Stage I --`, `<`, `>`, and `->` are preferred here to avoid introducing new decorative Unicode.
- The desktop Q/W/E/R caps use the verified Ciri animation mapping: `PIRO`, `CELE`, `TRK`, and `WHIRL`.
- The next agent should treat `src/styles/button.css` as retired and avoid reintroducing `.fill-button`.
