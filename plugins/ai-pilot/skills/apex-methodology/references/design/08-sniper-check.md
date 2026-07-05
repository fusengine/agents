---
name: 08-sniper-check
description: Run sniper agent for code validation
prev_step: references/design/07-review-design.md
next_step: references/design/09-create-pr.md
---

# 08 - Sniper Check (APEX Phase X)

**Launch sniper agent for code validation. NEVER SKIP.**

## When to Use

- After design review (07-review-design)
- Before creating PR
- After ANY code modification

---

## Launch Sniper Agent

### Task Command

```text
Task: sniper
Prompt: "Validate design component changes. Check:
1. TypeScript errors
2. ESLint issues
3. File sizes < 100 lines
4. Import/export correctness
5. JSDoc presence on exports"
```

---

## Sniper 6 Phases

### Phase 1: Explore Codebase

```text
-> Understand changed files context
-> Map dependencies
```

### Phase 2: Research

```text
-> Verify patterns against docs
-> Check for deprecated APIs
```

### Phase 3: Grep Usages

```text
-> Find all imports of changed components
-> Ensure no broken references
```

### Phase 4: Run Linters

```bash
# TypeScript
npx tsc --noEmit

# ESLint
npx eslint src/components/[new-component]

# Prettier (if configured)
npx prettier --check src/components/[new-component]
```

### Phase 5: Apply Fixes

```text
-> Auto-fix ESLint issues
-> Correct TypeScript errors
-> Format with Prettier
```

### Phase 6: Zero Errors

```text
-> Verify ALL issues resolved
-> No warnings left
-> Clean build
```

---

## Common Issues

### TypeScript Errors

```tsx
// Missing type
// ❌ Error: Parameter 'props' implicitly has 'any' type
function Card(props) { }

// ✅ Fix: Add interface
interface CardProps { title: string }
function Card({ title }: CardProps) { }
```

### ESLint Issues

```tsx
// Missing React import (React 17+)
// Usually auto-fixed

// Unused imports
// ❌ import { useState, useEffect } from 'react'
// (useEffect not used)

// ✅ import { useState } from 'react'
```

### File Size

```text
// If file > 100 lines
1. Extract sub-components
2. Extract animation variants
3. Extract types to separate file
```

---

## Validation Checklist

```text
[ ] sniper agent launched
[ ] TypeScript: zero errors
[ ] ESLint: zero errors
[ ] Prettier: formatted
[ ] Files: all < 100 lines
[ ] Imports: all valid
[ ] Exports: all documented
```

---

## Next Phase

-> Proceed to `09-create-pr.md`
