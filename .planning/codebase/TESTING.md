# Testing Patterns

**Analysis Date:** 2026-03-02

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Test Config:** Not present. No `jest.config.*`, `vitest.config.*`, or any other test runner configuration found.

**Assertion Library:** None.

**Run Commands:**
```bash
# No test commands exist in package.json scripts
# Current scripts:
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # vite preview
```

**Test Dependencies:** None. `package.json` contains no testing packages in `dependencies` or `devDependencies`.

## Test File Organization

**Test Files:** None exist in the codebase. No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files found anywhere.

**Coverage:** Not configured, not measured.

## Current Quality Assurance

The codebase relies on TypeScript compilation and ESLint as its only automated correctness mechanisms.

**TypeScript (build-time):**
- Strict mode: `"strict": true` in `tsconfig.app.json`
- `noUnusedLocals` and `noUnusedParameters` enforced
- `verbatimModuleSyntax` enforces explicit `import type` for type-only imports
- Build command `tsc -b && vite build` — TypeScript errors fail the build
- Config: `tsconfig.app.json`, `tsconfig.json`, `tsconfig.node.json`

**ESLint (lint-time):**
- Config: `eslint.config.js`
- Plugins: `eslint-plugin-react-hooks` (hooks rules), `eslint-plugin-react-refresh` (HMR safety)
- Run via: `npm run lint`

## Testable Units (If Tests Were Added)

The following units are the best candidates for test coverage based on codebase structure:

**Pure Utility Functions (`src/utils/vlsm.ts`):**
- `validateIp(ip)` — validates IPv4 format, returns boolean
- `calculateVLSM(networkIp, prefix, subnets)` — returns `SubnetResult[]` or `{ error: string }`
- These have no React dependencies and would test with plain inputs/outputs

**Custom Hooks (`src/hooks/useTestEngine.ts`):**
- `useTestEngine(questions)` — quiz state machine (select, next, skip, restart, finish)
- `useProgress()` — localStorage read/write with fallback
- Would require React testing utilities (e.g., `@testing-library/react` + `renderHook`)

**Data Integrity (`src/data/`):**
- `netplusQuestions.ts` — 60 questions, each with valid `answer` index (0-3), non-empty `explanation`
- `awsQuestions.ts` — 60 questions, same shape
- Could be validated with simple data shape assertions

## Recommended Setup (If Adding Tests)

Based on the existing stack (Vite + TypeScript + React), the natural choice is:

**Framework:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Vitest config addition to `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  // ... existing base config
})
```

**Test file placement pattern:**
```
src/
├── utils/
│   ├── vlsm.ts
│   └── vlsm.test.ts       # co-located with source
├── hooks/
│   ├── useTestEngine.ts
│   └── useTestEngine.test.ts
```

**Example utility test pattern:**
```typescript
// src/utils/vlsm.test.ts
import { describe, it, expect } from 'vitest'
import { validateIp, calculateVLSM } from './vlsm'

describe('validateIp', () => {
  it('accepts valid IPv4', () => {
    expect(validateIp('192.168.1.0')).toBe(true)
  })
  it('rejects invalid octets', () => {
    expect(validateIp('999.0.0.0')).toBe(false)
  })
})

describe('calculateVLSM', () => {
  it('returns error for invalid IP', () => {
    const result = calculateVLSM('bad', 24, [{ id: '1', hosts: 10, label: 'A' }])
    expect(result).toHaveProperty('error')
  })
  it('allocates subnets sorted by host count descending', () => {
    const subnets = [
      { id: '1', hosts: 10, label: 'Small' },
      { id: '2', hosts: 50, label: 'Large' },
    ]
    const result = calculateVLSM('192.168.1.0', 24, subnets)
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      expect(result[0].label).toBe('Large') // largest allocated first
    }
  })
})
```

**Example hook test pattern:**
```typescript
// src/hooks/useTestEngine.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTestEngine } from './useTestEngine'
import { netplusQuestions } from '../data/netplusQuestions'

describe('useTestEngine', () => {
  it('starts with first question and not finished', () => {
    const { result } = renderHook(() => useTestEngine(netplusQuestions))
    expect(result.current.finished).toBe(false)
    expect(result.current.current).toBe(0)
  })

  it('records correct answer', () => {
    const { result } = renderHook(() => useTestEngine(netplusQuestions))
    const correctIdx = result.current.currentQuestion.answer
    act(() => {
      result.current.selectAnswer(correctIdx)
    })
    expect(result.current.answered).toBe(true)
    expect(result.current.score).toBe(1)
  })
})
```

## Test Types Priority Order

**Unit Tests (highest priority — add first):**
- Scope: `src/utils/vlsm.ts` pure functions — no mocking needed
- Value: Catches calculation bugs that are hard to spot visually

**Data Shape Tests (medium priority):**
- Scope: `src/data/netplusQuestions.ts`, `src/data/awsQuestions.ts`
- Value: Ensures all 120 questions have valid `answer` (0-3), non-empty `explanation`, known `domain`

**Hook Tests (medium priority):**
- Scope: `src/hooks/useTestEngine.ts`
- Requires: `jsdom` + `@testing-library/react`
- Value: Validates quiz state machine transitions (skip, next, finish, restart)

**E2E Tests (lower priority):**
- Framework: Not used, not recommended at current scale
- The app is navigation-heavy reference content; unit coverage of logic is sufficient

---

*Testing analysis: 2026-03-02*
