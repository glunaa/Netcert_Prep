# Coding Conventions

**Analysis Date:** 2026-03-02

## Naming Patterns

**Files:**
- React components: PascalCase matching the exported component name — `Nav.tsx`, `HomePage.tsx`, `VLSMPage.tsx`
- Hooks: camelCase with `use` prefix — `useTestEngine.ts`
- Utilities: camelCase describing purpose — `vlsm.ts`
- Data modules: camelCase describing content — `netplusQuestions.ts`, `awsQuestions.ts`, `referenceData.ts`
- Type definitions: `index.ts` in a `types/` directory

**Functions/Components:**
- React page components: PascalCase, exported as default — `export default function HomePage()`
- React shared/internal components: PascalCase, NOT exported (file-private) — `function DomainBreakdown()`, `function OptionIcon()`
- React public exported components: named exports — `export function NetPlusTestPage()`
- Hooks: camelCase with `use` prefix — `useTestEngine`, `useProgress`
- Pure utility functions: camelCase — `calculateVLSM`, `validateIp`, `pickRandom`
- Private helper functions: camelCase, unexported — `ipToNum`, `numToIp`, `prefixToMask`, `nextPowerOf2`
- Event handlers: verb-based camelCase — `addSubnet`, `removeSubnet`, `updateSubnet`, `calculate`, `reset`

**Variables:**
- State variables: descriptive camelCase nouns — `shuffled`, `answered`, `finished`, `results`
- Boolean state: plain adjectives (not `isX`) — `answered`, `finished`, `open`, `scored`
- Constants (module-level data): camelCase — `osiLayerColors`, `featureCards`, `links`
- Type aliases: PascalCase — `OS`, `Command`, `CommandGroup`

**Interfaces/Types:**
- All interfaces: PascalCase with no `I` prefix — `Question`, `SubnetInput`, `TestResult`, `OsiLayer`
- Union string types: PascalCase — `ExamType`
- Props interfaces: PascalCase with `Props` suffix — `TestPageProps`

## Code Style

**Formatting:**
- No Prettier config detected — formatting is manual/editor-driven
- Consistent 2-space indentation throughout all files
- Single quotes for strings in TypeScript/TSX
- Semicolons: omitted at end of statements (no-semicolon style) in most files (e.g., `src/types/index.ts`), but used in some files (e.g., `src/utils/vlsm.ts`)
- Trailing commas present in multi-line objects and arrays

**Linting:**
- ESLint v9 flat config at `eslint.config.js`
- Rules: `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`
- Applied only to `**/*.{ts,tsx}` files
- `dist/` directory is ignored

**TypeScript:**
- Strict mode enabled (`"strict": true` in `tsconfig.app.json`)
- `noUnusedLocals: true` and `noUnusedParameters: true` enforced
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- Target: ES2022, module: ESNext

## Import Organization

**Order (consistent pattern observed):**
1. React and React-ecosystem imports — `import { useState } from 'react'`
2. React Router imports — `import { NavLink } from 'react-router-dom'`
3. Local hooks — `import { useTestEngine, useProgress } from '../hooks/useTestEngine'`
4. Local data — `import { netplusQuestions } from '../data/netplusQuestions'`
5. Type-only imports last with `import type` — `import type { TestResult } from '../types'`

**Path Style:**
- Relative paths only, no path aliases configured
- `../` navigation used for cross-directory imports
- Within same dir: `./filename`

## Error Handling

**Strategy:** Defensive returns for utility functions, try/catch for browser APIs.

**Patterns:**
- Utility functions return error objects (discriminated union): `calculateVLSM` returns `SubnetResult[] | { error: string }` — caller checks `'error' in res`
- localStorage wrapped in try/catch with silent fallback to defaults (see `useProgress` in `src/hooks/useTestEngine.ts` lines 67-79)
- UI errors surfaced via React state (`const [error, setError] = useState<string | null>(null)`) and rendered as error cards
- No global error boundaries present
- Catch blocks use bare `catch` with no bound variable when error value is unused: `catch { ... }` (TypeScript 4+ feature)

**Example — error object pattern:**
```typescript
// src/utils/vlsm.ts
export function calculateVLSM(...): SubnetResult[] | { error: string } {
  if (!validateIp(networkIp)) return { error: 'Invalid network IP address' }
  // ...
}

// src/pages/VLSMPage.tsx - caller
const res = calculateVLSM(networkIp, prefix, subnets)
if ('error' in res) {
  setError(res.error)
} else {
  setResults(res)
}
```

**Example — localStorage try/catch:**
```typescript
// src/hooks/useTestEngine.ts
const [progress, setProgress] = useState(() => {
  try {
    const saved = localStorage.getItem('netcert_progress')
    return saved ? JSON.parse(saved) : { ... defaults ... }
  } catch {
    return { ... defaults ... }
  }
})
```

## Component Design

**Composition Pattern:**
- Large page files contain both private sub-components and the exported page component in one file
- Sub-components are hoisted above their parent (file order: helpers → sub-components → exported page)
- Section separators used: `// ── Section Name ───────────────────────────────────────────`

**Props Pattern:**
- Inline interface definitions above the function for page-level props — `interface TestPageProps { ... }`
- File-local interfaces defined at top of file, not exported
- Props destructured in function signature: `function ResultsScreen({ results, score, total, ... }: { results: TestResult[]; ... })`

**Hooks Usage:**
- Custom hooks encapsulate all stateful logic — components call hooks, not raw useState for complex state
- `useCallback` used consistently in hooks for stable function references
- Lazy state initialization with functions for expensive initial values: `useState(() => JSON.parse(...))`

## Data Design

**Module-level Constants:**
- Static data arrays defined as `const` at module scope — `featureCards`, `links`, `osiLayerColors`
- Question data exported as named const arrays — `export const netplusQuestions: Question[]`
- Reference data all from `src/data/referenceData.ts`

**Inline SVGs:**
- All icons are inline SVG, no icon library used
- Consistent SVG attribute style: `viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}`
- Heroicons outline icon set used throughout

## CSS/Styling Conventions

**Tailwind v4 Usage:**
- All styling via Tailwind utility classes in className prop — no CSS Modules or styled components
- Custom semantic classes defined in `@layer components` in `src/index.css`: `.card`, `.card-glass`, `.tag`, `.tag-net`, `.tag-aws`, `.tag-success`, `.tag-danger`, `.nav-link`, `.terminal`, `.progress-track`, `.progress-fill`, `.glow-accent`, `.glow-aws`
- Custom theme tokens accessed as `text-accent`, `bg-void`, `border-border`, etc.
- Conditional classes: template literal `${condition ? 'class-a' : 'class-b'}` pattern
- Opacity modifiers used extensively: `bg-accent/10`, `border-accent/30`, `hover:bg-white/[0.04]`
- Arbitrary values used sparingly: `text-[10px]`, `bg-white/[0.04]`, `hover:bg-white/[0.015]`

**Responsive Design:**
- Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoint prefixes
- Common breakpoint pattern: `hidden md:flex` for desktop-only, `md:hidden` for mobile-only

## Comments

**When to Comment:**
- Section delimiters in large files to separate logical groups: `// ── Section Name ──────────`
- Group comments in data arrays: `// ── Networking Fundamentals ──────────────────────────`
- No JSDoc comments anywhere in the codebase

**Inline Comments:**
- Minimal — code is treated as self-documenting
- JSX structural comments: `{/* Brand */}`, `{/* Desktop links */}`, `{/* Mobile menu */}`

## Module Design

**Exports:**
- Pages: single default export per file
- Hooks: named exports — `export function useTestEngine(...)`, `export function useProgress()`
- Utilities: named exports — `export function calculateVLSM(...)`, `export function validateIp(...)`
- Data: named const exports — `export const netplusQuestions`
- Types: named exports from `src/types/index.ts`

**Barrel Files:**
- `src/types/index.ts` acts as barrel for all types
- No `index.ts` barrel files for components, pages, hooks, or data — imported directly by path

---

*Convention analysis: 2026-03-02*
