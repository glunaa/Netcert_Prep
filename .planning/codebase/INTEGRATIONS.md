# External Integrations

**Analysis Date:** 2026-03-02

## APIs & External Services

**None.** This is a fully static, client-side application. No external API calls are made at runtime. All question data and reference content is bundled as TypeScript data files.

## Data Storage

**Databases:**
- None. No database connection of any kind.

**File Storage:**
- None. All content is static and bundled at build time.

**Caching:**
- Browser `localStorage` used for quiz progress persistence
  - Key: `netcert_progress`
  - Shape: `{ netplus: { lastScore, attempts, bestScore }, aws: { lastScore, attempts, bestScore } }`
  - Read/write in: `src/hooks/useTestEngine.ts` (`useProgress` function)

## Static Data Sources

All application content is local TypeScript files, not external:
- `src/data/netplusQuestions.ts` — 60 CompTIA Network+ questions
- `src/data/awsQuestions.ts` — 60 AWS Solutions Architect questions
- `src/data/referenceData.ts` — OSI layers, port entries, and other reference content

## Authentication & Identity

**Auth Provider:** None. No authentication or user accounts.

## Fonts

**Google Fonts** — loaded via `<link>` in `index.html`
- Loaded: Syne (400–800), DM Sans (300–600), JetBrains Mono (400–600)
- URL: `https://fonts.googleapis.com` / `https://fonts.gstatic.com`
- This is a CDN dependency; offline use will fall back to system fonts
- Note: `src/index.css` references `Inter` and `Space Grotesk` as CSS variables but these are not explicitly loaded from Google Fonts in the current `index.html` — the page loads Syne/DM Sans/JetBrains Mono instead

## Monitoring & Observability

**Error Tracking:** None.

**Logging:** Browser `console` only (no structured logging library).

## CI/CD & Deployment

**Hosting:**
- GitHub Pages at `https://{user}.github.io/Netcert_Prep/`

**CI Pipeline:**
- GitHub Actions — `.github/workflows/deploy.yml`
- Trigger: push to `main` branch, or manual `workflow_dispatch`
- Build runner: `ubuntu-latest` with Node.js 20
- Steps: checkout → setup-node (with npm cache) → `npm ci` → `npm run build` → upload artifact → deploy to GitHub Pages
- Uses official actions: `actions/checkout@v4`, `actions/setup-node@v4`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`
- Concurrency group: `pages` with `cancel-in-progress: true`

## Webhooks & Callbacks

**Incoming:** None.

**Outgoing:** None.

## Environment Configuration

**Required env vars:** None. The application has no external service dependencies requiring secrets.

**Secrets location:** None needed. The only environment-aware config is `import.meta.env.PROD` (Vite built-in) used in `src/App.tsx` for routing basename.

## SPA Routing on GitHub Pages

The GitHub Pages deployment uses the `spa-github-pages` pattern to support client-side routing:
- `public/404.html` — redirects all 404s by encoding the path as a query parameter (keeps 1 segment: `/Netcert_Prep/`)
- `index.html` inline script — decodes the query parameter back into `history.replaceState` before React boots

---

*Integration audit: 2026-03-02*
