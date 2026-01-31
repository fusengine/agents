---
name: react-19-hooks
description: Testing React 19 hooks - useActionState, useOptimistic, use()
when-to-use: Testing React 19 specific hooks
keywords: useActionState, useOptimistic, use, react19, forms
priority: high
related: hooks-testing.md, templates/form-testing.md
---

# Testing React 19 Hooks

## New Hooks Overview

| Hook | Purpose | What to Test |
|------|---------|--------------|
| `useActionState` | Form action state | Pending, success, error states |
| `useOptimistic` | Optimistic UI | Immediate update, final state |
| `use()` | Read promises | Suspense fallback, resolved data |
| `useFormStatus` | Form pending | Button disabled state |

---

## useActionState Testing

### What to Assert

1. Form submission triggers action
2. Button disabled during pending
3. Success/error message appears
4. Form resets after success

---

## useOptimistic Testing

### What to Assert

1. Optimistic value appears immediately
2. Pending indicator shows
3. Final value replaces optimistic
4. Rollback on error

---

## use() Hook Testing

### Key Requirement

Always wrap in Suspense boundary for testing.

### What to Assert

1. Fallback shown initially
2. Data appears after resolution
3. Fallback disappears

---

## useFormStatus Testing

Tests from **child component** perspective.
Parent form provides pending state to children.

---

## Differences from React 18

| Aspect | React 18 | React 19 |
|--------|----------|----------|
| Form state | Manual useState | useActionState |
| Optimistic UI | Custom logic | useOptimistic |
| Data fetching | useEffect | use() + Suspense |

---

## Where to Find Code?

→ `templates/form-testing.md` - useActionState tests
→ `templates/suspense-testing.md` - use() hook tests
