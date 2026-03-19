---
name: page-transitions
description: Route change animations, drill-down patterns, and modal transitions
when-to-use: Animating route changes, page navigations, view transitions
keywords: page-transition, route, crossfade, drill-down, modal, sheet, navigation
priority: high
related: motion-principles.md, entrance-patterns.md
---

# Page Transitions

## Route Change (Crossfade)

The simplest and most common page transition. Works for all route changes.

```tsx
// layout.tsx - wrap children with AnimatePresence
<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

| Property | Value |
|----------|-------|
| Type | Crossfade (opacity) |
| Duration | 200ms |
| Mode | "wait" (exit before enter) |
| Easing | ease-out |

## Drill-Down (Slide)

For hierarchical navigation (list -> detail, category -> item).

```tsx
const drillDown = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-30%", opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};

const drillUp = {
  initial: { x: "-30%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
};
```

| Direction | Animation | Usage |
|-----------|-----------|-------|
| Forward (deeper) | Slide left, new from right | List -> detail |
| Back (shallower) | Slide right, new from left | Detail -> list |

## Modal Open/Close

```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
  className="fixed inset-0 bg-black/50"
/>

// Dialog
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

## Sheet (Bottom/Side)

```tsx
// Bottom sheet
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
/>

// Side sheet (right)
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
/>
```

## Tab Content Switch

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

## Multi-Stack Implementation

| Stack | Approach |
|-------|----------|
| Next.js App Router | Template.tsx with AnimatePresence + key={pathname} |
| React Router | Outlet wrapper with AnimatePresence |
| Laravel Inertia | Custom transition middleware |

## Rules

- Use `mode="wait"` to prevent layout jumps
- Keep page transitions under 300ms
- Drill-down should match navigation direction
- Always provide exit animation
- Test with prefers-reduced-motion (crossfade-only)
