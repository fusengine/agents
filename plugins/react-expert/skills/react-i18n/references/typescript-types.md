---
name: typescript-types
description: Type-safe translations with i18next Selector API - autocompletion and compile-time validation
when-to-use: TypeScript projects, type-safe translations, IDE autocompletion, refactoring safety
keywords: typescript, selector api, type-safe, autocompletion, generics
priority: high
related: templates/typed-translations.md, i18next-basics.md
---

# TypeScript Type-Safety

## Selector API (i18next ≥25.4)

**Type-safe translation keys with full IDE autocompletion.**

### Purpose
- Compile-time validation of translation keys
- IDE autocompletion for all keys
- Safe refactoring of translation structure

### When to Use
- TypeScript projects
- Large codebases with many translations
- Teams needing refactoring safety

### Key Points
- Uses `t($ => $.namespace.key)` syntax
- Requires type definitions in `i18next.d.ts`
- Zero runtime overhead
- Works with all i18next features

---

## Type Definition Setup

**Extend i18next types for your translation resources.**

### Purpose
- Define resource types from JSON files
- Enable Selector API
- Configure default namespace

### When to Use
- Initial TypeScript setup
- After adding new namespaces
- When changing translation structure

### Key Points
- Import JSON files in `resources.ts`
- Extend `CustomTypeOptions` interface
- Set `enableSelector: true`
- Define `defaultNS` for convenience

---

## Typed Custom Hooks

**Create namespace-specific hooks for better DX.**

### Purpose
- Limit autocompletion to relevant namespace
- Reduce cognitive load per component
- Enforce namespace boundaries

### When to Use
- Feature-specific components
- Large namespaces with many keys
- Team conventions for organization

### Key Points
- Wrap `useTranslation` with typed namespace
- Export feature-specific hooks
- Maintains full type safety
- Reduces key path length

---

## keyPrefix Pattern

**Avoid repeating common key prefixes.**

### Purpose
- DRY principle for deeply nested keys
- Cleaner component code
- Easier key refactoring

### When to Use
- Components using many keys from same prefix
- Form components with field-specific translations
- Deeply nested translation structures

### Key Points
- Pass `keyPrefix` option to `useTranslation`
- All `t()` calls relative to prefix
- Combines with namespace selection
- Full type inference maintained

---

## Comparison: String vs Selector

| Aspect | String Keys | Selector API |
|--------|-------------|--------------|
| Autocompletion | ❌ None | ✅ Full |
| Typo Detection | ❌ Runtime | ✅ Compile-time |
| Refactoring | ❌ Manual search | ✅ IDE support |
| Bundle Size | Same | Same |
| Performance | Same | Same |

---

→ See `templates/typed-translations.md` for complete code examples
