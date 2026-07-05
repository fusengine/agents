---
name: 04-validation
description: Verify Next.js code quality with sniper agent
prev_step: references/nextjs/03.5-elicit.md
next_step: references/nextjs/05-review.md
---

# 04 - Validation (Next.js)

**Verify Next.js code quality with sniper agent (APEX Phase X).**

## When to Use

- After execution phase complete
- Before any code review
- After ANY code modification

---

## Next.js Validation Commands

### TypeScript Check

```bash
# Check all TypeScript errors
pnpm tsc --noEmit

# OR with npm
npm run type-check
```

### ESLint (Next.js 16)

```bash
# Run ESLint
pnpm eslint .

# Auto-fix issues
pnpm eslint . --fix
```

### Build Verification

```bash
# Production build (catches most issues)
pnpm build

# Expected output:
# Route (app)         Size     First Load JS
# + First Load JS shared by all
```

---

## sniper 6-Phase Validation

### Phase 1: Explore Structure

```text
Verify:
[ ] All files <100 lines
[ ] Interfaces in modules/[feature]/src/interfaces/
[ ] No interfaces in component files
[ ] Correct directory structure
```

### Phase 2: Research Verification

```text
Verify:
[ ] APIs match Next.js 16 docs
[ ] Server Actions use correct patterns
[ ] No deprecated APIs used
```

### Phase 3: Grep Usages

```text
Check:
[ ] All imports resolve
[ ] No broken references
[ ] Exports used correctly
```

### Phase 4: Run Linters

```bash
# Full validation suite
pnpm tsc --noEmit && pnpm eslint . && pnpm build
```

### Phase 5: Apply Fixes

```text
Fix order:
1. TypeScript errors (most critical)
2. ESLint errors
3. ESLint warnings
4. Build errors
```

### Phase 6: Zero Errors

```text
Required:
[ ] 0 TypeScript errors
[ ] 0 ESLint errors
[ ] 0 ESLint warnings (or documented)
[ ] Build successful
```

---

## Common Next.js Errors

### Hydration Mismatch

```typescript
// Error: Hydration failed because...

// Cause: Server/Client content differs
// Fix: Use useEffect for client-only content

'use client'
import { useState, useEffect } from 'react'

export function ClientDate() {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    setDate(new Date().toLocaleDateString())
  }, [])

  return <span>{date}</span>
}
```

### Async Client Component

```typescript
// Error: async/await is not allowed in Client Components

// Wrong
'use client'
export default async function Page() {} // ERROR

// Correct - use Server Component
export default async function Page() {} // No 'use client'

// OR use useEffect in Client Component
'use client'
export function DataComponent() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
}
```

### Missing 'use server'

```typescript
// Error: Server actions must be async functions

// Wrong
export function action() {} // Missing directive

// Correct
'use server'
export async function action() {}
```

---

## File Size Validation

### Check File Lines

```bash
# Count lines in a file
wc -l src/modules/feature/components/Component.tsx

# Check all TypeScript files
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -n
```

### Split Strategy

```text
If file > 90 lines:
main.tsx           # Core logic
utils.ts           # Helper functions
types.ts           # Interfaces (move to src/interfaces/)
constants.ts       # Config values
```

---

## Build Output Analysis

### Expected Output

```text
Route (app)                    Size     First Load JS
+ / (static)                   142 B          87.2 kB
+ /dashboard (dynamic)         1.2 kB         88.4 kB
+ First Load JS shared by all  87.0 kB
  ├ chunks/main.js             75.3 kB
  └ chunks/webpack.js          11.7 kB
```

### Warning Signs

```text
Red flags:
[ ] First Load JS > 150 kB (optimize imports)
[ ] Dynamic routes marked as static
[ ] Build time > 2 minutes
[ ] Memory warnings during build
```

---

## Validation Report Template

```markdown
## Next.js Validation Results

### TypeScript
- Status: PASS (0 errors)
- Command: `pnpm tsc --noEmit`

### ESLint
- Status: PASS (0 errors, 0 warnings)
- Command: `pnpm eslint .`

### Build
- Status: PASS
- Total First Load JS: 87.2 kB
- Build time: 12s

### File Checks
- All files <100 lines: PASS
- Interfaces location: PASS
- JSDoc coverage: PASS

### Issues Fixed
- [List any issues fixed during validation]
```

---

## Validation Checklist

```text
[ ] sniper agent launched
[ ] All 6 phases completed
[ ] tsc --noEmit passes
[ ] eslint passes
[ ] build succeeds
[ ] All files <100 lines verified
[ ] No hydration warnings
[ ] Bundle size acceptable
```

---

## Next Phase

Proceed to `05-review.md`
