# Technology Stack

**Analysis Date:** 2026-03-02

## Languages

**Primary:**
- TypeScript ~5.9.3 - All source files in `src/` (`*.ts`, `*.tsx`)

**Secondary:**
- CSS (via Tailwind v4 directives) - `src/index.css`
- HTML - `index.html` (entry point, includes inline JS for SPA routing)

## Runtime

**Environment:**
- Node.js 20.18.0 (active; Vite 7 recommends 20.19+ — build succeeds with warning)

**Package Manager:**
- npm 11.4.1
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - UI rendering (`src/main.tsx`, all `src/pages/`, `src/components/`)
- React DOM 19.2.0 - DOM rendering (`src/main.tsx`)
- React Router DOM 7.13.1 - Client-side routing (`src/App.tsx`)

**Styling:**
- Tailwind CSS 4.2.1 - Utility-first CSS (`src/index.css`, applied via `@import "tailwindcss"`)
- `@tailwindcss/vite` 4.2.1 - Vite plugin integration (`vite.config.ts`)

**Build/Dev:**
- Vite 7.3.1 - Dev server and bundler (`vite.config.ts`)
- `@vitejs/plugin-react` 5.1.1 - React fast refresh and JSX transform

## Key Dependencies

**Critical:**
- `react-router-dom` 7.13.1 - All navigation and route-based page rendering; used in `src/App.tsx` with `BrowserRouter`, `Routes`, `Route`
- `tailwindcss` 4.2.1 - Styling foundation; custom design tokens in `@theme {}` block in `src/index.css`; `@layer components` and `@layer utilities` define reusable classes

**Infrastructure:**
- `typescript` ~5.9.3 - Static type checking; strict mode enabled in `tsconfig.app.json`

## TypeScript Configuration

**App config:** `tsconfig.app.json`
- Target: ES2022
- Strict mode: enabled
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` all enabled
- Module resolution: `bundler`
- JSX: `react-jsx`

**Node config:** `tsconfig.node.json`
- Target: ES2023
- Covers `vite.config.ts` only

**Root config:** `tsconfig.json`
- Project references only; delegates to `tsconfig.app.json` and `tsconfig.node.json`

## Linting

**Tool:** ESLint 9.39.1 (flat config) — `eslint.config.js`
- `@eslint/js` recommended rules
- `typescript-eslint` 8.48.0 recommended rules
- `eslint-plugin-react-hooks` 7.0.1 — hooks rules
- `eslint-plugin-react-refresh` 0.4.24 — HMR safety rules
- Targets: `**/*.{ts,tsx}`, ignores `dist/`

## Custom Theme Tokens

Defined in `src/index.css` inside `@theme {}`:
- Colors: `void` (#060810), `surface` (#0d1117), `card` (#111827), `border` (#1e2533), `muted` (#374151), `subtle` (#6b7280), `accent` (#00d4ff), `aws` (#ff9900), `success` (#22c55e), `danger` (#ef4444)
- Fonts: `--font-family-body` (Inter), `--font-family-display` (Space Grotesk)

## Custom CSS Components

Defined in `src/index.css` `@layer components`:
- `.card`, `.card-glass`, `.glow-accent`, `.glow-aws`, `.border-glow`
- `.tag`, `.tag-net`, `.tag-aws`, `.tag-success`, `.tag-danger`
- `.nav-link`, `.terminal`, `.progress-track`, `.progress-fill`

Custom utilities in `@layer utilities`:
- `.animation-delay-{100-500}`, `.text-balance`, `.perspective`, `.preserve-3d`, `.backface-hidden`, `.rotate-y-180`

## Configuration

**Environment:**
- No `.env` files present
- `import.meta.env.PROD` used in `src/App.tsx` to set BrowserRouter basename: `/Netcert_Prep` in production, `/` in dev
- No environment variables required at runtime

**Build:**
- `vite.config.ts` — sets `base: '/Netcert_Prep/'` for GitHub Pages asset paths
- Build output: `dist/` (excluded from ESLint)
- Build command: `tsc -b && vite build`
- Dev command: `vite`
- Preview command: `vite preview`

## Platform Requirements

**Development:**
- Node.js 20+ (20.18.0 confirmed working)
- npm 11+

**Production:**
- GitHub Pages static hosting
- SPA routing handled via `public/404.html` redirect + `index.html` inline decode script (spa-github-pages pattern)
- Deployed via GitHub Actions on push to `main`

---

*Stack analysis: 2026-03-02*
