---
name: code-organization-checks
description: Shell commands to assess interface separation, business logic location, and state management
---

# Code Organization Assessment

## Check Interface Separation

```bash
# TypeScript/JavaScript
ls -la src/interfaces/ src/types/ types/ 2>/dev/null

# Check for interfaces in components (violation)
grep -r "interface.*Props\|type.*Props" --include="*.tsx" src/components/ 2>/dev/null | head -10
```

## Check Business Logic Location

```bash
# Hooks for business logic
ls -la src/hooks/ hooks/ 2>/dev/null

# Check for logic in components (violation)
grep -rn "useState\|useEffect\|async" --include="*.tsx" src/components/ 2>/dev/null | wc -l
```

## Check State Management

```bash
# Store files
ls -la src/stores/ stores/ src/store/ 2>/dev/null

# Store usage
grep -r "useStore\|useSelector\|create(" --include="*.{ts,tsx}" src/ 2>/dev/null | head -10
```
