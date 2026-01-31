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
