---
name: activity-component
description: Activity API (stable since React 19.2) - Hide components while preserving state
when-to-use: tabs, modals, background tasks, state preservation
keywords: Activity, visible, hidden, state preservation, tabs, stable
priority: high
related: templates/activity-tabs.md, new-hooks.md
---

# Activity Component (React 19.2+)

> **Stable** since React 19.2.0 (October 2025) — exported as `Activity` from `react`.
> No `experimental_` / `unstable_` prefix in stable React.

## Purpose

Keep components mounted but hidden, **preserving state** while:
- Unmounting effects
- Deferring updates
- Hiding from DOM

---

## Import

```typescript
import { Activity } from 'react'
```

---

## Modes

| Mode | Behavior |
|------|----------|
| `visible` | Normal rendering, effects active |
| `hidden` | In DOM but hidden, effects paused, state preserved |

---

## Problem It Solves

| Approach | State | Effects | DOM |
|----------|-------|---------|-----|
| Conditional render | Lost | Unmounted | Removed |
| CSS `display: none` | Kept | Running | Hidden |
| `<Activity hidden>` | Kept | Paused | Hidden |

---

## When to Use

- Tab systems with form state
- Modals with preserved content
- Multi-step wizards
- Background tasks

---

## Key Behaviors

### State Preservation
- `useState` values preserved
- `useRef` values preserved
- Form inputs keep their values

### Effect Handling
- `useEffect` cleanup runs when hidden
- Effects resume when visible again

### 19.3 Fixes
- `useSyncExternalStore` no longer misses store mutations made while hidden
- Portal contents are hidden with the Activity
- `<title>`/metadata are not hoisted from hidden trees
- Errors in a hidden Activity no longer escape to the visible UI
- Inside a `<ViewTransition>`, becoming visible/hidden in a Transition triggers its `enter`/`exit` animation

---

## Where to Find Code Templates?

→ `templates/activity-tabs.md` - Tab implementation with Activity
