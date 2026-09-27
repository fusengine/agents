---
name: migration-18-19
description: React 18 to 19 migration guide - breaking changes and updates
when-to-use: upgrading React version, understanding breaking changes
keywords: migration, upgrade, breaking changes, React 18, React 19
priority: medium
related: ref-as-prop.md, new-hooks.md
---

# React 18 to 19 Migration Guide

## Breaking Changes

### 1. ref as Prop
Remove `forwardRef` wrapper, add `ref` to props.

→ See `ref-as-prop.md` for details

### 2. Context as Provider
Use `<Context value={}>` directly, not `<Context.Provider>`.

### 3. Cleanup Functions in Refs
Ref callbacks can now return cleanup functions.

### 4. useFormStatus Location
Import from `react-dom`, not `react`.

### 5. Strict Mode Changes
Also double-invokes ref callbacks in development.

---

## Deprecated APIs

### Removed

| API | Replacement |
|-----|-------------|
| `ReactDOM.render` | `createRoot` |
| `ReactDOM.hydrate` | `hydrateRoot` |
| `ReactDOM.unmountComponentAtNode` | `root.unmount()` |
| `ReactDOM.findDOMNode` | Refs |
| Legacy Context | `createContext` |
| String refs | Callback or `useRef` |
| `defaultProps` on functions | Default parameters |

### Deprecated (Still Work)

| API | Replacement |
|-----|-------------|
| `forwardRef` | `ref` as prop |
| `<Context.Provider>` | `<Context value={}>` |

---

## New Patterns to Adopt

### Data Fetching
Replace `useEffect` with `use()` + Suspense.

### Form Handling
Replace manual state with `useActionState`.

### Optimistic Updates
Replace manual optimistic state with `useOptimistic`.

---

## Migration Checklist

- [ ] Update React and React DOM to 19
- [ ] Replace `forwardRef` with `ref` prop
- [ ] Update `<Context.Provider>` to `<Context>`
- [ ] Move `useFormStatus` import to `react-dom`
- [ ] Remove deprecated APIs
- [ ] Update ESLint plugin: `eslint-plugin-react-hooks@latest`
- [ ] Update TypeScript types: `@types/react@latest`
- [ ] Test ref cleanup functions
- [ ] Consider adopting new patterns

---

## Package Updates

```bash
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19
npm install -D eslint-plugin-react-hooks@latest
```

---

## Gradual Migration

1. **Phase 1:** Update packages, fix breaking changes
2. **Phase 2:** Adopt new Context syntax
3. **Phase 3:** Migrate forms to Actions
4. **Phase 4:** Replace useEffect data fetching with use()
5. **Phase 5:** Add React Compiler

---

## Upgrading 19.2 → 19.3

No breaking change, deprecation or codemod announced (react/react-dom 19.3.0, 2026-09-09). Watch for:

- `react-dom@19.3.0` peers `react@^19.3.0`; `@types/react@19.3` / `@types/react-dom@19.3` need **TypeScript ≥ 5.6**
- **StrictMode** now double-invokes effects during hydration (like client-rendered roots) and after Fast Refresh — may surface effect bugs
- **Transitions** are no longer entangled — timing assumptions between unrelated Transitions can change
- DEV warning when a component appears unblocked by a conditional `use()`
- Canary imports: `ViewTransition` / `addTransitionType` are now exported unprefixed from `react`
- Trusted Types: `TrustedHTML` / `TrustedScript` / `TrustedScriptURL` now reach sinks like `innerHTML` without coercion
- RSC: `<Context>` from a `'use client'` module can be rendered directly by a Server Component; `react-server-dom-webpack/*.unbundled` moved to `react-server-dom-unbundled` (since 19.2.2)

### RSC Security Floor

`react-server-dom-webpack` / `-parcel` / `-turbopack` must be **≥ 19.2.4** (CVE-2025-55182 RCE, CVE-2025-55183/55184, CVE-2025-67779, CVE-2026-23864). Prefer **≥ 19.2.7** (fixes the 19.2.6 `FormData` regression) or **19.3.0**.
