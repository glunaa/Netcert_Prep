# Architecture

**Analysis Date:** 2026-03-02

## Pattern Overview

**Overall:** Single-Page Application (SPA) with client-side routing

**Key Characteristics:**
- Pure client-side React app — no backend server, no API calls, no database
- All data is statically embedded as TypeScript constant arrays in `src/data/`
- State is ephemeral (React `useState`) except for quiz progress which persists to `localStorage`
- Deployed as a static site to GitHub Pages at `/Netcert_Prep/`
- GitHub Pages SPA routing handled via query-string redirect trick in `index.html`

## Layers

**Entry / Bootstrap:**
- Purpose: Mount React application into DOM
- Location: `src/main.tsx`
- Contains: `createRoot` call, `StrictMode` wrapper, CSS import
- Depends on: `src/App.tsx`, `src/index.css`
- Used by: `index.html` via `<script type="module" src="/src/main.tsx">`

**Router / Layout:**
- Purpose: Define all routes and render persistent navigation shell
- Location: `src/App.tsx`
- Contains: `BrowserRouter` with dynamic `basename`, `Nav` component, `Routes` tree
- Depends on: `src/components/Nav.tsx`, all page components in `src/pages/`
- Used by: `src/main.tsx`

**Navigation Component:**
- Purpose: Sticky top navigation bar with desktop links and mobile hamburger menu
- Location: `src/components/Nav.tsx`
- Contains: Responsive nav with `NavLink` active-state handling, mobile toggle state
- Depends on: React Router `NavLink`
- Used by: `src/App.tsx`

**Pages:**
- Purpose: Full-screen route views; each page is self-contained with its own local state
- Location: `src/pages/`
- Contains: Reference pages (`NetPlusPage`, `AWSPage`, `CLIPage`, `VPCPage`), tool pages (`VLSMPage`), test pages (`TestPages.tsx`), and the dashboard (`HomePage`)
- Depends on: `src/data/`, `src/hooks/useTestEngine.ts`, `src/utils/vlsm.ts`, `src/types/`
- Used by: `src/App.tsx` route definitions

**Hooks (Business Logic):**
- Purpose: Encapsulate stateful quiz engine logic and localStorage persistence
- Location: `src/hooks/useTestEngine.ts`
- Contains: `useTestEngine` (question shuffling, answer selection, skip, next, finish) and `useProgress` (localStorage read/write for best/last scores)
- Depends on: `src/types/index.ts`
- Used by: `src/pages/TestPages.tsx`, `src/pages/HomePage.tsx`

**Utilities (Pure Functions):**
- Purpose: Domain-specific computation with no side effects
- Location: `src/utils/vlsm.ts`
- Contains: `calculateVLSM`, `validateIp` and internal IP math helpers
- Depends on: `src/types/index.ts`
- Used by: `src/pages/VLSMPage.tsx`

**Data Layer:**
- Purpose: Static question banks and reference lookup tables, all typed TypeScript constants
- Location: `src/data/`
- Contains:
  - `netplusQuestions.ts` — 60 `Question[]` objects for Network+ exam
  - `awsQuestions.ts` — 60 `Question[]` objects for AWS SAA-C03 exam
  - `referenceData.ts` — `osiLayers`, `portEntries`, `subnetCheatSheet`, `awsServicesSummary`
- Depends on: `src/types/index.ts`
- Used by: pages and hooks

**Types:**
- Purpose: Shared TypeScript interfaces consumed across all layers
- Location: `src/types/index.ts`
- Contains: `Question`, `SubnetInput`, `SubnetResult`, `TestResult`, `OsiLayer`, `PortEntry`, `ExamType`
- Depends on: nothing
- Used by: all other layers

## Data Flow

**Quiz / Test Flow:**

1. User navigates to `/netplus/test` or `/aws/test`
2. `App.tsx` renders `NetPlusTestPage` or `AWSTestPage` from `src/pages/TestPages.tsx`
3. `TestScreen` component selects the correct question array from `src/data/`
4. `useTestEngine(questions)` initializes: randomly picks 30 questions, sets up answer/progress state
5. User selects an answer — `engine.selectAnswer(idx)` records result in `results[]` state
6. User clicks "Next" — `engine.next()` advances `current` index or sets `finished = true`
7. On finish, `useProgress().recordScore()` writes score to `localStorage` key `netcert_progress`
8. `ResultsScreen` renders with domain breakdown calculated from `results[]`

**VLSM Calculator Flow:**

1. User navigates to `/vlsm` — `VLSMPage` renders
2. User enters a network IP, prefix length, and one or more subnet rows (local state only)
3. `calculate()` calls `calculateVLSM(networkIp, prefix, subnets)` from `src/utils/vlsm.ts`
4. Pure function returns `SubnetResult[]` or `{ error: string }`
5. Component renders results table or error message

**Reference Page Flow:**

1. User navigates to `/netplus`, `/aws`, `/cli`, or `/vpc`
2. Page imports static arrays directly from `src/data/referenceData.ts`
3. Data is rendered immediately — no loading state, no async operations
4. Tab state (e.g., `type Tab = 'osi' | 'ports' | 'subnets' | 'quickfacts'`) is local `useState`

**State Management:**
- No global state store (no Redux, no Zustand, no Context API)
- Each page manages its own local `useState`
- The only cross-session persistence is `localStorage` via `useProgress` hook
- Progress shape: `{ netplus: { lastScore, attempts, bestScore }, aws: { lastScore, attempts, bestScore } }`

## Key Abstractions

**`useTestEngine`:**
- Purpose: Generic quiz engine parameterised by a `Question[]` array
- Examples: `src/hooks/useTestEngine.ts`
- Pattern: Custom React hook returning state + action callbacks; used identically for both Net+ and AWS tests

**`TestScreen` + Exported Page Wrappers:**
- Purpose: Single reusable test UI component driven by a `TestPageProps` config object; two thin wrappers export exam-specific instances
- Examples: `src/pages/TestPages.tsx` — `TestScreen`, `NetPlusTestPage`, `AWSTestPage`
- Pattern: Render props/configuration object pattern; avoids duplicating 300+ lines of quiz UI

**Static Data Modules:**
- Purpose: Question banks and reference tables treated as typed constants
- Examples: `src/data/netplusQuestions.ts`, `src/data/awsQuestions.ts`, `src/data/referenceData.ts`
- Pattern: Named exports of typed arrays; no dynamic fetching

**`calculateVLSM`:**
- Purpose: Pure function for VLSM subnet allocation
- Examples: `src/utils/vlsm.ts`
- Pattern: Input validation → sort subnets by host count descending → iterate and allocate contiguous address blocks → return typed result array or error object

## Entry Points

**HTML Shell:**
- Location: `index.html`
- Triggers: Browser load
- Responsibilities: Sets page metadata, loads Google Fonts, contains SPA redirect script for GitHub Pages 404 handling, mounts `<div id="root">`

**JavaScript Entry:**
- Location: `src/main.tsx`
- Triggers: Module loaded by `index.html`
- Responsibilities: Imports global CSS, calls `createRoot(...).render(<App />)`

**Route Entry Points (one per page):**
- `/` → `src/pages/HomePage.tsx` — dashboard with progress cards, OSI preview, feature links
- `/netplus` → `src/pages/NetPlusPage.tsx` — tabbed reference (OSI, ports, subnets, quick facts)
- `/netplus/test` → `src/pages/TestPages.tsx` (`NetPlusTestPage`)
- `/aws` → `src/pages/AWSPage.tsx` — AWS services overview, shared responsibility, well-architected
- `/aws/test` → `src/pages/TestPages.tsx` (`AWSTestPage`)
- `/vlsm` → `src/pages/VLSMPage.tsx` — interactive VLSM subnet calculator
- `/cli` → `src/pages/CLIPage.tsx` — tabbed CLI command reference (Windows, Linux, Cisco)
- `/vpc` → `src/pages/VPCPage.tsx` — AWS VPC reference with diagrams

## Error Handling

**Strategy:** Localised, per-feature; no global error boundary

**Patterns:**
- `calculateVLSM` returns a discriminated union: `SubnetResult[] | { error: string }` — caller checks with `'error' in res`
- `useProgress` wraps `localStorage.getItem` / `JSON.parse` in `try/catch` and falls back to a default object
- No React error boundaries are defined
- No unhandled promise rejections (app is fully synchronous — no fetch calls)

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 utility classes applied inline on JSX; shared component classes defined in `src/index.css` `@layer components` block (`.card`, `.tag`, `.nav-link`, `.progress-track`, etc.)
**Fonts:** Google Fonts loaded via `<link>` in `index.html` — Syne (display), DM Sans (body), JetBrains Mono (code)
**Routing:** React Router v7 `BrowserRouter`; `basename` switches between `/Netcert_Prep/` (production) and `/` (dev) based on `import.meta.env.PROD`
**Validation:** Only in `src/utils/vlsm.ts` — IP format and prefix range checks before subnet calculation
**Authentication:** None
**Logging:** None

---

*Architecture analysis: 2026-03-02*
