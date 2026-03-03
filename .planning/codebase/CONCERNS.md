# Codebase Concerns

**Analysis Date:** 2026-03-02

## Tech Debt

**Biased shuffle algorithm:**
- Issue: `pickRandom` in `src/hooks/useTestEngine.ts` line 5 uses `[...arr].sort(() => Math.random() - 0.5)` which is a statistically biased shuffle. The V8 engine's sort algorithm produces non-uniform distributions with this pattern, meaning some question orderings appear more frequently than others.
- Files: `src/hooks/useTestEngine.ts`
- Impact: Practice tests subtly favor certain question orderings over time, reducing effective randomization.
- Fix approach: Replace with Fisher-Yates shuffle: iterate from the end swapping each element with a random element at or before it.

**Module-level mutable counter for subnet IDs:**
- Issue: `VLSMPage.tsx` declares `let nextId = 1` and `function makeId()` at module scope (lines 5–6). This is a mutable module-level variable outside React state. React's strict mode or hot-module reloading can reset this to 1, causing duplicate IDs across re-renders.
- Files: `src/pages/VLSMPage.tsx`
- Impact: In development (Strict Mode), subnet IDs may collide, breaking React's key reconciliation. Resetting the page restarts the counter, but IDs from a previous session could overlap.
- Fix approach: Replace with `useRef` initialized to 1 inside the component, or use `crypto.randomUUID()` / `Date.now()`.

**Untyped `progress` state in `useProgress`:**
- Issue: The `progress` state returned from `useProgress` in `src/hooks/useTestEngine.ts` is inferred as `any`-like because `setProgress` receives `(prev: typeof progress)` — `typeof progress` resolves to the initial value type but the generic is not formally declared. In `src/pages/HomePage.tsx` (lines 60–63, 104, 109) the values are cast with `as number | null` and `as number` to work around this.
- Files: `src/hooks/useTestEngine.ts`, `src/pages/HomePage.tsx`
- Impact: Type safety is bypassed; changes to the progress shape won't produce compile-time errors in consuming components.
- Fix approach: Define a `Progress` interface in `src/types/index.ts` and type `useState<Progress>` explicitly in `useProgress`.

**Score display shows `0/0` on first question:**
- Issue: `TestPages.tsx` line 285 renders `{engine.score}/{engine.current}` as the running score. On the first question, `engine.current` is `0` (the index, not questions answered), so the display reads "0/0" before any answer is given. This is misleading — the denominator should reflect questions answered, not the current question index.
- Files: `src/pages/TestPages.tsx`, `src/hooks/useTestEngine.ts`
- Impact: Minor UX confusion during the test. The denominator climbs to the correct total only at the end.
- Fix approach: Return `answered: results.length` from `useTestEngine` and use that as the denominator in the score display.

**`recordScore` called inside render body (side effect in render):**
- Issue: `TestPages.tsx` lines 252–255 call `recordScore(examKey, engine.score, engine.total)` directly in the render body, guarded only by `if (!scored)`. This is a side effect inside render — not inside `useEffect`. In React Strict Mode, the component renders twice in development, and if the guard is evaluated before the state update is flushed, `recordScore` may fire twice.
- Files: `src/pages/TestPages.tsx`
- Impact: In development (Strict Mode), progress scores may be double-recorded. In production, the `scored` guard protects against it, but the pattern violates React's rendering model.
- Fix approach: Move the `recordScore` call into a `useEffect` with `[engine.finished]` as the dependency.

**Fonts declared in CSS do not match fonts loaded in HTML:**
- Issue: `src/index.css` declares `--font-family-body: Inter` and `--font-family-display: 'Space Grotesk'` in `@theme {}`. However, `index.html` loads `Syne`, `DM Sans`, and `JetBrains Mono` from Google Fonts — not Inter or Space Grotesk.
- Files: `src/index.css`, `index.html`
- Impact: Body and headings fall back to `system-ui` on all browsers since Inter and Space Grotesk are never loaded. The custom font aesthetic is non-functional. The three fonts being loaded (Syne, DM Sans, JetBrains Mono) are wasted network requests.
- Fix approach: Either update `index.html` to load Inter and Space Grotesk, or update `--font-family-body` and `--font-family-display` in `index.css` to reference the fonts actually loaded.

**Missing favicon.svg:**
- Issue: `index.html` line 5 references `/Netcert_Prep/favicon.svg` as the page favicon. The `public/` directory contains only `vite.svg` and `404.html` — no `favicon.svg` exists.
- Files: `index.html`, `public/`
- Impact: Browser tab shows no custom icon; browser makes a 404 request on every page load.
- Fix approach: Add a `favicon.svg` to `public/`, or change the `<link rel="icon">` to reference `vite.svg`.

**`progress-track` missing `position: relative` for absolute-positioned child:**
- Issue: `TestPages.tsx` line 213 places a `<div className="absolute top-0 h-full w-px ...">` (the pass-mark line) as a direct child of an element using the `.progress-track` class. The `.progress-track` utility in `src/index.css` line 128 does not set `position: relative`, and the class uses `overflow-hidden` which clips the absolute child. The pass-mark line may render outside the track or be clipped entirely depending on the nearest positioned ancestor.
- Files: `src/pages/TestPages.tsx` (line 211–215), `src/index.css` (line 128)
- Impact: The visual pass-mark threshold line on the results screen may not appear correctly.
- Fix approach: Add `relative` to the `.progress-track` `@apply` chain in `src/index.css`, or add `relative` as an inline utility class where the pass-mark line is used.

---

## Known Bugs

**Page meta description is incorrect:**
- Symptoms: `index.html` line 7 has `<meta name="description" content="Interactive study companion for CompTIA Network+ and AWS Cloud Practitioner">`. The app targets **AWS Solutions Architect** (SAA-C03), not AWS Cloud Practitioner (CLF-C02).
- Files: `index.html`
- Trigger: Always present; affects SEO and social sharing previews.
- Workaround: None; incorrect silently.

**Page title references wrong AWS cert:**
- Symptoms: `index.html` line 8 has `<title>NetCertPrep — Network+ & AWS CCP Study Hub</title>`. "CCP" refers to Cloud Practitioner, but the app targets Solutions Architect (SAA-C03).
- Files: `index.html`
- Trigger: Always present; visible in browser tab and search results.
- Workaround: None.

---

## Security Considerations

**localStorage progress data has no schema validation on read:**
- Risk: The `useProgress` hook reads `netcert_progress` from localStorage and parses it with `JSON.parse` with only a `try/catch` for parse errors. If the stored JSON has an unexpected shape (e.g., from a browser extension, cross-origin storage manipulation, or a future app version), the `progress` object will have incorrect structure that TypeScript cannot detect at runtime. Downstream `.attempts`, `.lastScore`, and `.bestScore` accesses could return `undefined`, causing `NaN` renders.
- Files: `src/hooks/useTestEngine.ts` (lines 68–79)
- Current mitigation: `try/catch` handles `JSON.parse` failures only.
- Recommendations: Add a schema validation step after parsing (check that `netplus` and `aws` keys exist with expected sub-fields), falling back to defaults if invalid.

**External font loading from Google Fonts:**
- Risk: Google Fonts requests in `index.html` send the user's IP and referrer to Google on every page load. No Content Security Policy header is set (GitHub Pages does not allow custom headers by default).
- Files: `index.html`
- Current mitigation: None.
- Recommendations: Self-host fonts in `public/` and reference them via `@font-face` in `src/index.css` to eliminate the third-party dependency. This also fixes the font mismatch concern.

---

## Performance Bottlenecks

**All question data loaded eagerly on app start:**
- Problem: `netplusQuestions` (433 lines, 60 questions) and `awsQuestions` (496 lines, 60 questions) are statically imported into `TestPages.tsx`, which is imported by `App.tsx`. All question data is bundled into the single JS chunk and parsed on first load, even if the user never navigates to a test page.
- Files: `src/data/netplusQuestions.ts`, `src/data/awsQuestions.ts`, `src/pages/TestPages.tsx`, `src/App.tsx`
- Cause: No code-splitting or lazy loading is in place.
- Improvement path: Use `React.lazy` + `import()` to lazily load test pages. Both question data files would then only load when the user navigates to `/netplus/test` or `/aws/test`.

**No route-level code splitting:**
- Problem: All 8 pages are statically imported in `src/App.tsx`. The entire app is delivered in a single JS bundle.
- Files: `src/App.tsx`
- Cause: Direct imports with no `React.lazy`.
- Improvement path: Wrap page imports with `React.lazy(() => import('./pages/...'))` and wrap `<Routes>` with `<Suspense>`.

---

## Fragile Areas

**`TestScreen` re-uses `useTestEngine` initialized with `questions` prop:**
- Files: `src/hooks/useTestEngine.ts`, `src/pages/TestPages.tsx`
- Why fragile: `useTestEngine` initializes `shuffled` state via `useState(() => pickRandom(questions, 30))`. The initial questions are captured at mount time. If the `questions` prop reference changed (currently it doesn't, since the arrays are module-level constants), the hook would not re-initialize. The `start` callback does accept a fresh `pickRandom` call but the dependency on the outer `questions` array is implicit.
- Safe modification: Always pass questions as a stable module-level constant (currently done). Do not pass dynamically constructed arrays.
- Test coverage: No tests.

**`skip()` calls `next()` via closure dependency:**
- Files: `src/hooks/useTestEngine.ts` (lines 46–54)
- Why fragile: `skip` depends on `[shuffled, current, next]`. Since `next` is itself a `useCallback` that depends on `[current, shuffled.length]`, this creates a two-level dependency chain. If `next` re-creates (because `current` changed) before `skip` re-creates, there is a render window where `skip` holds a stale `next`. In practice this is safe because both update in the same render cycle, but the pattern is harder to reason about than calling `setCurrent` directly.
- Safe modification: Extract the shared "advance or finish" logic into a standalone function called by both `next` and `skip`, rather than having `skip` call `next`.
- Test coverage: No tests.

**`VLSMPage` subnet label generation overflows at 26 subnets:**
- Files: `src/pages/VLSMPage.tsx` (line 23)
- Why fragile: `addSubnet` generates labels using `String.fromCharCode(65 + prev.length)`. Once `prev.length` reaches 26 (after Subnet A through Z), the character code exceeds `Z` (90) and produces non-letter characters (`[`, `\`, `]`, etc.).
- Safe modification: Cap subnet count at 26, or use a numeric suffix after Z.
- Test coverage: No tests.

---

## Test Coverage Gaps

**No tests exist for any module:**
- What's not tested: The entire codebase — `useTestEngine`, `useProgress`, `calculateVLSM`, `validateIp`, all page components, and all data files.
- Files: `src/hooks/useTestEngine.ts`, `src/utils/vlsm.ts`, `src/pages/`, `src/data/`
- Risk: Any refactor or bug fix cannot be validated without manual testing. The VLSM calculator in particular has edge-case arithmetic (alignment, overflow) that is especially suited to unit tests.
- Priority: High for `src/utils/vlsm.ts` (pure functions, easy to test), Medium for `src/hooks/useTestEngine.ts`.

**No testing framework is installed:**
- What's not tested: Everything.
- Files: `package.json`
- Risk: No CI gate exists to catch regressions. The GitHub Actions workflow only runs `npm run build` — a passing build does not indicate correctness.
- Priority: High. Adding Vitest (compatible with the Vite build) would require only one devDependency and no config changes.

---

## Dependencies at Risk

**Node.js version below Vite 7 recommendation:**
- Risk: `package.json` uses Vite `^7.3.1`. Vite 7 recommends Node.js 20.19+. The project runs on Node 20.18.0. While builds currently succeed with only a warning, future Vite patch versions in the `^7.x` range may tighten this requirement.
- Impact: CI uses `node-version: '20'` (resolves to latest 20.x) so GitHub Actions is unaffected; the risk is local development only.
- Migration plan: Update local Node.js to 20.19+ or pin Node in `.nvmrc`.

**`react-router-dom` v7 (React Router v7 is a major overhaul):**
- Risk: React Router v7 (`^7.13.1`) introduced breaking changes from v6. The app currently uses only `BrowserRouter`, `Routes`, `Route`, `Link`, and `NavLink` — all of which remain compatible. However, RRv7's new "framework mode" with loaders and actions is a substantially different API; future contributors may confuse documentation.
- Impact: Minimal currently. Risk rises if the app expands with data loading patterns.
- Migration plan: No action needed now; pin major version to avoid accidental v8 upgrades.

---

## Missing Critical Features

**No 404 / unmatched route handler:**
- Problem: `src/App.tsx` has no catch-all `<Route path="*">` element. Navigating to any unrecognized path (e.g., `/settings`, `/typo`) renders a blank page with only the navbar.
- Blocks: Clean user experience for direct URL entry of invalid paths.

**No keyboard navigation for test questions:**
- Problem: The answer options in `TestPages.tsx` are `<button>` elements but there is no keyboard shortcut to select answers (e.g., pressing 1–4 or A–D), advance with Enter/Space, or skip with Escape. The only interaction is mouse click.
- Blocks: Accessibility and efficient keyboard-driven study flow.

**localStorage is the only persistence mechanism:**
- Problem: Progress data stored in `localStorage` via `useProgress` is device-local and browser-local. Clearing browser storage, switching devices, or using private browsing loses all progress history.
- Blocks: Multi-device study continuity.

---

*Concerns audit: 2026-03-02*
