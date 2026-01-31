---
name: ref-as-prop
description: React 19 ref as prop - no more forwardRef needed
when-to-use: creating components that accept refs, migrating from forwardRef
keywords: ref, forwardRef, props, migration
priority: medium
related: migration-18-19.md
---

# Ref as Prop (React 19)

## What Changed

In React 19, `ref` is a regular prop. No more `forwardRef` wrapper needed.

---

## Migration

### Before (React 18)
Wrap component with `forwardRef` and receive ref as second argument.

### After (React 19)
Add `ref` to props interface and use it directly.

---

## TypeScript Typing

Add `ref?: React.Ref<ElementType>` to your props interface.

---

## Key Points

- Callback refs still work
- `forwardRef` is deprecated but still functions
- Component display name is preserved (no wrapper)
- Simpler mental model - ref is just a prop

---

## Benefits

1. **Simpler code** - No wrapper needed
2. **Better types** - ref is explicit in interface
3. **Easier debugging** - Component name preserved
4. **Less boilerplate** - Just a prop

---

## forwardRef Deprecation

`forwardRef` still works but is deprecated. Will be removed in future version.

**Recommendation:** Remove `forwardRef` in new code, migrate existing code gradually.
