---
name: namespaces
description: Organize translations into multiple files - code splitting, lazy loading, team organization
when-to-use: large apps, feature-based organization, lazy loading, team workflows
keywords: namespaces, code splitting, organization, lazy loading, modules
priority: high
related: lazy-loading.md, templates/lazy-loading-routes.md
---

# Namespaces Organization

## What are Namespaces

**Split translations into separate files per feature/domain.**

### Purpose
- Organize translations by feature
- Enable code splitting
- Improve team workflows
- Reduce initial bundle size

### When to Use
- Apps with multiple features
- Large translation files
- Team-based development
- Performance optimization

### Key Points
- One JSON file per namespace
- Load on-demand with lazy loading
- Set `defaultNS` for convenience
- Use `fallbackNS` for shared keys

---

## Namespace Loading

**Control when namespaces are loaded.**

### Purpose
- Optimize initial load time
- Load translations with route
- Pre-fetch anticipated namespaces

### When to Use
- Route-based apps
- Performance-critical apps
- Large translation sets

### Key Points
- `ns` option in init for pre-loaded
- `useTranslation(ns)` triggers load
- `i18n.loadNamespaces()` for programmatic
- Suspense handles loading states

---

## Namespace Access

**Reference keys from specific namespaces.**

### Purpose
- Access keys from non-default namespace
- Combine keys from multiple namespaces
- Override default namespace

### When to Use
- Cross-feature components
- Shared + feature-specific translations
- Explicit namespace control

### Key Points
- `t('namespace:key')` explicit syntax
- First namespace in array is default
- Fallback to `fallbackNS` if key missing
- Works with Selector API

---

## Fallback Namespace

**Share common translations across namespaces.**

### Purpose
- Avoid duplicating common keys
- Centralize shared UI strings
- Reduce translation maintenance

### When to Use
- Common actions (save, cancel, delete)
- Shared UI elements
- App-wide terminology

### Key Points
- Set `fallbackNS: 'common'` in config
- Missing keys fallback to common
- Reduces translation file duplication
- Works with all namespaces

---

## Recommended Structure

| Namespace | Content |
|-----------|---------|
| `common` | Buttons, labels, navigation, status |
| `auth` | Login, register, password reset |
| `dashboard` | Metrics, charts, reports |
| `settings` | User preferences, configuration |
| `errors` | Error messages, validation |

---

→ See `templates/lazy-loading-routes.md` for route-based namespace loading
