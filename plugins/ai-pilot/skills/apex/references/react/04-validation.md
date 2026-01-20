# 04 - Validation (React/Vite)

**Verify React code quality with sniper agent (APEX Phase X).**

## When to Use

- After execution phase complete
- Before any code review
- After ANY code modification

---

## Launch sniper Agent

### 6-Phase Validation

```text
Phase 1: explore-codebase
-> Verify module structure
-> Check component organization

Phase 2: research-expert
-> Verify React 19 patterns
-> Check hook implementations

Phase 3: grep usages
-> Find all component references
-> Check for unused exports

Phase 4: run linters
-> ESLint/Biome
-> TypeScript strict mode
-> Prettier formatting

Phase 5: apply fixes
-> Auto-fix linter issues
-> Manual fixes for complex issues

Phase 6: ZERO errors
-> Must pass completely
-> No warnings ignored
```

---

## Validation Commands

### TypeScript Check

```bash
bun run tsc --noEmit
```

### ESLint/Biome

```bash
# ESLint
bun run lint
bun run lint --fix

# Biome
bun run biome check
bun run biome check --write
```

### Build Verification

```bash
bun run build
```

---

## React-Specific Checks

### Component Validation

```text
[ ] No inline types (use interfaces/)
[ ] Props destructured
[ ] JSDoc present
[ ] <50 lines for presentation
[ ] No business logic in JSX
```

### Hook Validation

```text
[ ] Starts with "use"
[ ] <30 lines
[ ] Single responsibility
[ ] Dependencies array correct
[ ] No stale closures
```

### File Structure

```text
[ ] All files <100 lines
[ ] Interfaces in src/interfaces/
[ ] Hooks in src/hooks/
[ ] Components in components/
```

---

## Common React Errors

### Missing Dependencies

```typescript
// ESLint: react-hooks/exhaustive-deps
useEffect(() => {
  fetchUser(userId) // userId missing from deps
}, []) // Add userId

// Fix:
useEffect(() => {
  fetchUser(userId)
}, [userId])
```

### Type Errors

```typescript
// TS2322: Type 'undefined' is not assignable
const user = users.find(u => u.id === id)
user.name // Error: user might be undefined

// Fix: Optional chaining or guard
user?.name
// OR
if (!user) return null
```

### Import Errors

```typescript
// Cannot find module '@/modules/...'
// Check tsconfig.json paths:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Validation Report

```markdown
## Validation Results

### Linting
- ESLint: PASS (0 errors, 0 warnings)
- TypeScript: PASS (0 errors)
- Biome: PASS (formatted)

### File Checks
- All files <100 lines: PASS
- Interfaces location: PASS
- Hooks separation: PASS

### Build
- vite build: SUCCESS
- Bundle size: [X] KB

### React Specific
- No inline types: PASS
- JSDoc coverage: PASS
- Hook rules: PASS
```

---

## Validation Checklist

```text
[ ] sniper agent launched
[ ] All 6 phases completed
[ ] ZERO linter errors
[ ] ZERO type errors
[ ] All files <100 lines verified
[ ] Build successful
[ ] No React antipatterns
```

---

## Next Phase

-> Proceed to `05-review.md` (self-review)
-> OR `07-add-test.md` (if tests needed first)
