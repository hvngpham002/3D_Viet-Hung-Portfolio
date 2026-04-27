# cAp9 Paper and Ink Visual Acceptance and Release Handoff Report

## 1. Summary

Completed the cAp9 browser visual acceptance and release handoff pass.

- Captured browser screenshot evidence for all required routes at desktop `1440x900` and mobile `390x844` in light and dark themes.
- Captured ChatBot open-state evidence in desktop/mobile and light/dark modes.
- Confirmed Home and Contact canvases are nonblank with WebGL-enabled Chrome screenshots and PNG variance checks.
- Ran navigation, theme, language, mobile menu, ChatBot, Projects slideshow, Contact focus/type/blur, Home start/control, and Alert role smoke checks.
- Fixed two concrete visual/accessibility defects found during browser review.
- Re-ran affected browser checks and final static validation after the fixes.

Release status: `Accepted`.

## 2. Files Changed

- `src/pages/Projects.tsx`
  - Increased Projects slideshow dot button hit areas to `32x32` while preserving the small visible ink-dot treatment.
- `src/components/VersionMark.tsx`
  - Made the fixed version mark pointer-inert and hidden below the `sm` breakpoint so it cannot overlay mobile page controls.
- `audit/reports/cap9-visual-evidence/`
  - Added screenshot evidence and `cap9-browser-summary.json`.
- `audit/reports/cap9-paper-ink-visual-acceptance-release-handoff-report.md`
  - Added this report.

No package dependency, route, data, Supabase, EmailJS, Gemini, Redux, i18n runtime, or R3F scene behavior changes were made.

## 3. Browser Tooling Available

Project-local browser automation binaries remain unavailable: `node_modules/.bin` has Jest/Vite tooling but no Playwright, Cypress, or Puppeteer.

Browser acceptance was completed with an already installed local Google Chrome controlled through the Chrome DevTools Protocol:

- Browser: Chrome `147.0.7727.116`.
- DevTools port: `9224`.
- Final capture mode: headless Chrome with WebGL enabled through the local GPU/Metal path.

An initial temporary launch with GPU disabled caused expected WebGL context failures in R3F routes. Those captures were discarded and overwritten after relaunching Chrome with WebGL enabled.

## 4. Screenshot and Evidence Index

Screenshots were captured and stored in:

`audit/reports/cap9-visual-evidence/`

Evidence files:

- `home-desktop-light.png`
- `home-desktop-dark.png`
- `home-mobile-light.png`
- `home-mobile-dark.png`
- `about-desktop-light.png`
- `about-desktop-dark.png`
- `about-mobile-light.png`
- `about-mobile-dark.png`
- `projects-desktop-light.png`
- `projects-desktop-dark.png`
- `projects-mobile-light.png`
- `projects-mobile-dark.png`
- `contact-desktop-light.png`
- `contact-desktop-dark.png`
- `contact-mobile-light.png`
- `contact-mobile-dark.png`
- `chatbot-desktop-light.png`
- `chatbot-desktop-dark.png`
- `chatbot-mobile-light.png`
- `chatbot-mobile-dark.png`
- `home-canvas-after-start.png`
- `contact-canvas.png`
- `cap9-browser-summary.json`

Total PNG screenshots: 22.

## 5. Viewport and Theme Matrix

Required matrix completed:

| Route or surface | Desktop light | Desktop dark | Mobile light | Mobile dark |
| --- | --- | --- | --- | --- |
| `/` | Captured | Captured | Captured | Captured |
| `/about` | Captured | Captured | Captured | Captured |
| `/projects` | Captured | Captured | Captured | Captured |
| `/contact` | Captured | Captured | Captured | Captured |
| ChatBot open | Captured | Captured | Captured | Captured |

The browser summary recorded no horizontal scroll, no visible runtime fault, and no visible legacy visual-system class remnants in the required mobile route matrix after fixes.

## 6. Route Visual Review

Reviewed routes:

- `/`: Home loader/start flow reached the post-start 3D scene. Home info and stamped controls remained reachable on desktop and mobile.
- `/about`: Portrait hero, bio plate, skill plates, and chronicle layout remained readable in light/dark and desktop/mobile states.
- `/projects`: Folio cards, taped screenshots, tags, links, and slideshow controls rendered correctly. The discovered dot-control hit-target defect was fixed and rechecked.
- `/contact`: Form plate, labels, focusable fields, submit button, and Sif/bonfire scene rendered in light/dark and desktop/mobile states. Mobile version mark overlap was fixed and rechecked.

No old blue/glass/neo-brutalist runtime UI remnants were visible after the pass. The blue sky in Home screenshots is part of the existing 3D scene asset, not a UI-system remnant.

## 7. Interaction Smoke Results

Browser interaction smoke results:

| Check | Result |
| --- | --- |
| Navbar/mobile menu opens, route tap navigates, menu closes | Pass |
| Theme toggle changes visual theme without reload | Pass |
| Language toggle exposes valid choices and changes language | Pass |
| ChatBot trigger opens panel | Pass |
| ChatBot close button closes panel | Pass |
| ChatBot outside click closes panel | Pass |
| ChatBot input accepts local test text without sending | Pass |
| Projects slideshow dot controls change image without layout shift | Pass |
| Project external links remain present/reachable | Pass |
| Contact inputs focus, accept local test text, blur, and preserve values | Pass |
| Home loader start reaches canvas | Pass |
| Home Q/W/E/R and left/right controls are present after start | Pass |
| Alert `role="alert"` remains present by code/DOM contract | Pass |

Home model dragging and `body.dragging` were not deterministically exercised because headless CDP hit-testing a specific R3F model mesh is unreliable. Home canvas, start flow, and on-screen controls were verified.

## 8. Canvas Nonblank Results

Canvas evidence:

| File | Result | Sample evidence |
| --- | --- | --- |
| `home-canvas-after-start.png` | Nonblank | 10,000 sampled colors, luminance stddev `55.62` |
| `contact-canvas.png` | Nonblank | 3,836 sampled colors, luminance stddev `32.03` |

Both checks passed after relaunching headless Chrome with WebGL enabled.

## 9. Runtime Remnant Scan Results

Post-fix scans:

```bash
rg -n "fill-button|button\.css" src index.html tailwind.config.js
```

Result: pass, no results.

```bash
rg -n "blue-gradient_text|glassmorphism|neo-brutalism|block-container|card\[data-color|#00c6ff|#0072ff|cyan|indigo|blue-" src index.html tailwind.config.js
```

Result: pass, no results.

```bash
rg -n "bg-slate|text-white|bg-white|dark:bg-gray|text-gray|border-gray|shadow-lg|shadow-xl|worksans|poppins|gray-200|black-500|blue-500" src index.html tailwind.config.js
```

Result: pass, no results.

## 10. Static Validation Results

All required validation commands passed after source fixes:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |
| `npm test -- --runInBand` | Pass, 1 suite and 3 tests passed |

## 11. Route Smoke Results

Vite was started with:

```bash
npm run dev -- --host 127.0.0.1
```

Actual port:

- `5174` was occupied.
- Vite served this app at `http://127.0.0.1:5175/`.

HTTP route smoke:

| Route | Result |
| --- | --- |
| `/` | HTTP 200 |
| `/about` | HTTP 200 |
| `/projects` | HTTP 200 |
| `/contact` | HTTP 200 |

## 12. External Request Safety

- Contact form was not submitted.
- No EmailJS request was triggered.
- ChatBot panel was opened and local text was typed, but the send button and Enter-send path were not used.
- No Gemini request was triggered.
- Live Supabase-backed page loading was allowed per cAp9 scope; no database writes were made.

## 13. Defect Log

| Severity | Route/surface | Finding | Decision | Verification |
| --- | --- | --- | --- | --- |
| P2 | `/projects` | Slideshow dot buttons had `8x8` hit areas, failing the mobile tap-target requirement. | Fixed in `src/pages/Projects.tsx` by keeping the visible dot small inside a `32x32` button. | Re-ran Projects desktop/mobile light/dark screenshots. Browser summary shows dot buttons `32x32`, no horizontal scroll, and `layoutShiftPx: 0`. |
| P2 | Mobile shared chrome / `/contact` | Fixed bottom-right version mark could overlap lower mobile form controls. | Fixed in `src/components/VersionMark.tsx` by hiding the mark below `sm` and adding `pointer-events-none`. | Re-ran all mobile route screenshots. Browser summary shows `versionVisible: false` on mobile routes and no horizontal scroll. |
| Tooling note | Home/Contact 3D routes | A first headless Chrome attempt with GPU disabled produced WebGL context failures and invalid blank/fault screenshots. | Relaunched temporary Chrome with WebGL enabled; stale captures were overwritten. | Home and Contact canvas PNG variance checks passed. |

No P0, P1, or P2 defects remain open.

## 14. Release Decision

`Accepted`

All required static validation, route smoke, runtime remnant scans, browser visual acceptance, ChatBot visual review, interaction smoke, and canvas nonblank checks passed after the two narrow fixes.

## 15. Residual Risks or Follow-Ups

- Browser acceptance was performed in headless Chrome via CDP, not a manual attended browser session.
- Desktop nav text links are naturally less than 32px high by text bounding box, but the mobile tap-target matrix passes and the desktop nav is not touch-primary.
- Home drag-to-set-`body.dragging` was not deterministically hit-tested against the R3F model mesh in headless automation; on-screen Home controls were verified.
