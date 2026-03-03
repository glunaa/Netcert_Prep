# Codebase Structure

**Analysis Date:** 2026-03-02

## Directory Layout

```
Netcert_Prep/
├── src/
│   ├── main.tsx            # App entry point — mounts React root
│   ├── App.tsx             # BrowserRouter + Routes + Nav layout shell
│   ├── index.css           # Tailwind v4 import, @theme tokens, @layer components/utilities
│   ├── App.css             # Minimal resets (body margin: 0)
│   ├── pages/              # One file per route view
│   │   ├── HomePage.tsx    # Dashboard: progress cards, OSI preview, feature grid
│   │   ├── NetPlusPage.tsx # Tabbed Net+ reference (OSI, ports, subnets, quick facts)
│   │   ├── AWSPage.tsx     # AWS services overview, shared responsibility, well-architected
│   │   ├── VLSMPage.tsx    # Interactive VLSM subnet calculator UI
│   │   ├── CLIPage.tsx     # Tabbed CLI reference (Windows, Linux, Cisco)
│   │   ├── VPCPage.tsx     # AWS VPC deep-dive reference
│   │   └── TestPages.tsx   # Shared TestScreen + NetPlusTestPage + AWSTestPage exports
│   ├── components/
│   │   └── Nav.tsx         # Sticky navbar — desktop links, mobile hamburger, CTA buttons
│   ├── hooks/
│   │   └── useTestEngine.ts # useTestEngine (quiz state) + useProgress (localStorage)
│   ├── data/
│   │   ├── netplusQuestions.ts  # 60 Question objects for Network+ exam bank
│   │   ├── awsQuestions.ts      # 60 Question objects for AWS SAA-C03 exam bank
│   │   └── referenceData.ts     # osiLayers, portEntries, subnetCheatSheet, awsServicesSummary
│   ├── utils/
│   │   └── vlsm.ts         # Pure VLSM calculation functions: calculateVLSM, validateIp
│   ├── types/
│   │   └── index.ts        # All shared TypeScript interfaces and type aliases
│   └── assets/             # Static assets (SVGs, images) — currently empty
├── public/                 # Static files copied to dist root (favicon.svg lives here)
├── dist/                   # Build output — generated, not committed
├── .github/
│   └── workflows/          # GitHub Actions CI/CD (deploy to GitHub Pages)
├── .planning/
│   └── codebase/           # GSD analysis documents
├── index.html              # HTML shell — fonts, SPA redirect script, <div id="root">
├── vite.config.ts          # Vite config — React plugin, Tailwind v4 plugin, base path
├── tsconfig.json           # References tsconfig.app.json and tsconfig.node.json
├── tsconfig.app.json       # TypeScript config for src/ (ESNext, bundler module resolution)
├── tsconfig.node.json      # TypeScript config for vite.config.ts
├── package.json            # Dependencies and npm scripts
├── package-lock.json       # Lockfile
└── eslint.config.js        # ESLint flat config with TypeScript + React rules
```

## Directory Purposes

**`src/pages/`:**
- Purpose: All routable views; each file corresponds to one or more routes in `App.tsx`
- Contains: Default-exported page components; `TestPages.tsx` is the exception — it contains internal helper components and two named exports
- Key files: `TestPages.tsx` (most complex at ~395 lines), `VPCPage.tsx` (largest at ~570 lines)

**`src/components/`:**
- Purpose: Shared UI components used across multiple pages
- Contains: Currently only `Nav.tsx` — the persistent navigation bar
- Note: No sub-folders; single flat level

**`src/hooks/`:**
- Purpose: Custom React hooks that encapsulate stateful logic reusable across pages
- Contains: `useTestEngine.ts` — two hooks exported from one file
- Note: Currently only one file; quiz logic is separated from page rendering concern

**`src/data/`:**
- Purpose: Static data used as the application's "content layer" — question banks and reference tables
- Contains: TypeScript files exporting typed constant arrays; no runtime fetching
- Note: Adding questions = editing these files directly

**`src/utils/`:**
- Purpose: Pure TypeScript utility functions with no React dependency
- Contains: `vlsm.ts` — IP math and VLSM allocation algorithm
- Note: Functions here should be side-effect free and independently testable

**`src/types/`:**
- Purpose: Single source of truth for all shared TypeScript types
- Contains: `index.ts` with all interfaces — `Question`, `SubnetInput`, `SubnetResult`, `TestResult`, `OsiLayer`, `PortEntry`, `ExamType`
- Note: Import as `import type { ... } from '../types'` — the `index.ts` is the barrel

**`public/`:**
- Purpose: Files served as-is at the root of the deployed site
- Contains: `favicon.svg` referenced in `index.html` as `/Netcert_Prep/favicon.svg`
- Generated: No
- Committed: Yes

**`dist/`:**
- Purpose: Vite production build output
- Generated: Yes (`npm run build`)
- Committed: No (listed in `.gitignore`)

**`.planning/codebase/`:**
- Purpose: GSD analysis documents consumed by `/gsd:plan-phase` and `/gsd:execute-phase`
- Generated: By GSD map-codebase command
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: HTML shell — SPA redirect script, font preconnects, root div
- `src/main.tsx`: JS entry — mounts `<App />` into `#root` with StrictMode
- `src/App.tsx`: Router root — defines all 8 routes, renders `<Nav>`

**Configuration:**
- `vite.config.ts`: Vite build config — `base: '/Netcert_Prep/'`, React + Tailwind plugins
- `src/index.css`: Design system — `@theme {}` tokens, `@layer components` utility classes
- `tsconfig.app.json`: TypeScript settings for source code
- `eslint.config.js`: ESLint rules

**Core Logic:**
- `src/hooks/useTestEngine.ts`: Quiz engine and progress persistence
- `src/utils/vlsm.ts`: Subnet calculation algorithm
- `src/types/index.ts`: All shared type definitions

**Data:**
- `src/data/netplusQuestions.ts`: Network+ question bank (60 questions)
- `src/data/awsQuestions.ts`: AWS SAA-C03 question bank (60 questions)
- `src/data/referenceData.ts`: OSI layers, port table, subnet cheat sheet, AWS services

**Testing:**
- No test files present — not applicable

## Naming Conventions

**Files:**
- Page components: PascalCase with `Page` suffix — `HomePage.tsx`, `VLSMPage.tsx`
- Exception: `TestPages.tsx` is plural because it exports multiple page components
- Component files: PascalCase — `Nav.tsx`
- Hook files: camelCase with `use` prefix — `useTestEngine.ts`
- Utility files: camelCase noun — `vlsm.ts`
- Data files: camelCase noun + `Questions` suffix for question banks — `netplusQuestions.ts`, `awsQuestions.ts`
- Type files: `index.ts` (barrel export)

**Directories:**
- All lowercase, semantic — `pages/`, `components/`, `hooks/`, `data/`, `utils/`, `types/`

**Exports:**
- Page components: default export
- Test pages: named exports (`NetPlusTestPage`, `AWSTestPage`) from one shared file
- Hooks: named exports (`useTestEngine`, `useProgress`)
- Data: named exports (`netplusQuestions`, `awsQuestions`, `osiLayers`, `portEntries`, etc.)
- Types: named exports from `src/types/index.ts`

## Where to Add New Code

**New Reference Page (e.g., a Cisco cheat sheet):**
- Implementation: `src/pages/CiscoPage.tsx` (default export)
- Route: Add `<Route path="/cisco" element={<CiscoPage />} />` in `src/App.tsx`
- Nav link: Add entry to the `links` array in `src/components/Nav.tsx`
- Data (if needed): `src/data/ciscoData.ts` with typed exports

**New Question Bank (e.g., CompTIA Security+):**
- Data file: `src/data/secplusQuestions.ts` — export `secplusQuestions: Question[]`
- Page: `src/pages/TestPages.tsx` — add a new exported wrapper like `SecPlusTestPage` using `TestScreen`
- Route: Add to `src/App.tsx`

**New Utility Function:**
- If pure/computation: add to existing `src/utils/vlsm.ts` if related to networking math, otherwise create `src/utils/[name].ts`
- No React imports — keep utils free of hooks and JSX

**New Shared Component:**
- Place in `src/components/ComponentName.tsx`
- Use default export

**New Type:**
- Add to `src/types/index.ts` — keep all shared types in one file

**New Custom Hook:**
- Add to `src/hooks/useHookName.ts` or co-export from `src/hooks/useTestEngine.ts` if closely related to quiz logic

## Special Directories

**`dist/`:**
- Purpose: Production build artifacts (JS bundles, CSS, assets)
- Generated: Yes, by `npm run build`
- Committed: No

**`.github/workflows/`:**
- Purpose: GitHub Actions pipeline for automated deployment to GitHub Pages
- Committed: Yes

**`node_modules/`:**
- Purpose: Installed npm dependencies
- Generated: Yes, by `npm install`
- Committed: No

**`.planning/`:**
- Purpose: GSD planning documents (codebase analysis, phase plans)
- Generated: By GSD commands
- Committed: Yes

---

*Structure analysis: 2026-03-02*
