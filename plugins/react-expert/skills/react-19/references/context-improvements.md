---
name: context-improvements
description: React 19 Context API - Context as direct provider, no more Context.Provider
when-to-use: context providers, global state, theme providers, migration from Context.Provider
keywords: Context, Provider, createContext, use, conditional context
priority: high
related: new-hooks.md, migration-18-19.md, templates/use-context.md
---

# Context API Improvements (React 19)

## What Changed

In React 19, Context can be rendered directly as a provider.

---

## New Syntax

### Before (React 18)

Wrap with `<Context.Provider value={}>`.

### After (React 19)

Use `<Context value={}>` directly - Context IS the provider.

---

## Key Differences

| Feature | React 18 | React 19 |
|---------|----------|----------|
| Provider syntax | `<Context.Provider>` | `<Context>` |
| Reading context | `useContext(Context)` | `use(Context)` or `useContext` |
| Conditional read | Not possible | `use()` can be conditional |

---

## Reading Context with use()

The `use()` hook can read context conditionally - NOT possible with `useContext`.

This is unique to `use()`:
- Can be called inside conditions
- Can be called in loops
- Returns latest context value

---

## When to Use use() vs useContext

| Scenario | Use |
|----------|-----|
| Standard context reading | Either works |
| Conditional context | `use()` only |
| In loops | `use()` only |
| Legacy codebase | Keep `useContext` |

---

## Migration Steps

1. Update provider syntax: `<Context.Provider>` → `<Context>`
2. Update consumer (optional): `useContext(Context)` → `use(Context)`
3. Remove `.Provider` from type hints if any

---

## TypeScript Considerations

- Create context with explicit type parameter
- Always create custom hook with null check
- Export the hook, not the raw context

---

## Backwards Compatibility

- `Context.Provider` still works (deprecated)
- `useContext` still works
- Migration is optional but recommended

---

## Best Practices

1. **Use `<Context value={}>` directly** for new code
2. **Use `use(Context)`** for conditional reading
3. **Always create custom hook** with null check
4. **Keep `useContext`** for standard cases

---

## Where to Find Code Templates?

→ `templates/use-context.md` - Context patterns with use()
→ `templates/use-promise.md` - use() with promises
