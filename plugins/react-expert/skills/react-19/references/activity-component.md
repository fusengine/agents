---
name: activity-component
description: Activity API (React 19.2 Experimental) - Hide components while preserving state
when-to-use: tabs, modals, background tasks, state preservation
keywords: Activity, visible, hidden, state preservation, tabs, experimental
priority: high
related: templates/activity-tabs.md, new-hooks.md
---

# Activity Component (React 19.2)

> **Experimental**: Available since React 19.2 (October 2025).
> Import as `experimental_Activity` or `unstable_Activity`.

## Purpose

Keep components mounted but hidden, **preserving state** while:
- Unmounting effects
- Deferring updates
- Hiding from DOM

---

## Import

```typescript
import { experimental_Activity as Activity } from 'react'
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

---

## Where to Find Code Templates?

→ `templates/activity-tabs.md` - Tab implementation with Activity
