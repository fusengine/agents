---
name: react-19-integration
description: React 19 features - Suspense, useTransition, Concurrent Rendering integration
when-to-use: React 19 apps, non-blocking updates, concurrent features
keywords: react 19, suspense, useTransition, concurrent, streaming
priority: high
related: templates/basic-setup.md, templates/language-switcher.md
---

# React 19 Integration

## Suspense Integration

**Native loading states for translation fetching.**

### Purpose
- Declarative loading states
- No manual loading flags
- Consistent loading UI

### When to Use
- All React 19 apps
- Lazy-loaded namespaces
- Clean loading patterns

### Key Points
- Enable `useSuspense: true` (default)
- Wrap app with `<Suspense>`
- Fallback shown during load
- Works with namespace loading

---

## useTransition for Language Switch

**Non-blocking language changes.**

### Purpose
- Keep UI responsive during switch
- Show pending state
- Prioritize user interactions

### When to Use
- Language switcher components
- Large translation sets
- Smooth UX requirements

### Key Points
- Wrap `changeLanguage` in `startTransition`
- `isPending` for loading indicator
- UI stays interactive
- Background loading

---

## Concurrent Rendering

**Leverage React 19 concurrent features.**

### Purpose
- Prioritized updates
- Smoother user experience
- Better perceived performance

### When to Use
- Complex UIs with translations
- Search with translated content
- Real-time updates

### Key Points
- Works automatically with Suspense
- `useDeferredValue` for search
- Non-blocking translation updates
- Automatic batching

---

## Error Boundaries

**Handle translation loading failures.**

### Purpose
- Graceful error handling
- Fallback UI on failure
- Recovery options

### When to Use
- Network-dependent translations
- Production apps
- Offline capability

### Key Points
- Wrap with Error Boundary
- Provide fallback content
- Retry/reload options
- Logging for debugging

---

## React 19 Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| `useSuspense` | `true` | Enable Suspense integration |
| `bindI18n` | `'languageChanged loaded'` | Events triggering re-render |
| `bindI18nStore` | `'added removed'` | Store events to bind |

---

→ See `templates/basic-setup.md` for React 19 app setup
