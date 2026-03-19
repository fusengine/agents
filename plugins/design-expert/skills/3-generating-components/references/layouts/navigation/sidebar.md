---
name: sidebar
description: Three-state sidebar navigation with expanded, collapsed, and hidden modes
when-to-use: Designing app sidebar navigation, admin panel navigation
keywords: sidebar, navigation, collapsed, expanded, hidden, menu, responsive
priority: high
related: navbar.md, mobile-nav.md, page-architecture.md
---

# Sidebar Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | Logo / app name | Icon-only when collapsed |
| Nav items | Section links with icons | Tooltips when collapsed |
| Bottom | User menu / settings | Avatar-only when collapsed |

## Three States

| State | Width | Trigger | Content |
|-------|-------|---------|---------|
| Expanded | 240px | Default on desktop | Icon + label + badge |
| Collapsed | 60px | Toggle button or tablet | Icon + tooltip |
| Hidden | 0px | Mobile default | Overlay with backdrop |

## Components (shadcn/ui)

- `Button` - Nav items (ghost variant)
- `Tooltip` - Labels in collapsed state
- `Avatar` - User avatar at bottom
- `Badge` - Notification counts
- `Separator` - Section dividers
- `Sheet` - Mobile overlay sidebar

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --sidebar-expanded | 240px | Full width |
| --sidebar-collapsed | 60px | Icon-only width |
| --sidebar-bg | var(--card) | Background color |
| --sidebar-border | var(--border) | Right border |
| --sidebar-item-height | 40px | Nav item height |
| --sidebar-padding | 12px | Inner padding |

## Nav Item Structure

```
[Icon] [Label]                    [Badge]
  16px   flex-1                    count
```

- Active state: bg-primary/10 + text-primary + font-medium
- Hover state: bg-muted
- Icon size: 20px (consistent across all items)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+B / Ctrl+B | Toggle sidebar state |
| Arrow keys | Navigate between items |
| Enter | Activate selected item |

## Animation (Framer Motion)

- Expand/collapse: width transition 200ms ease-out
- Labels: fade in/out during transition
- Mobile overlay: slide from left + backdrop fade
- Active indicator: layoutId animation for smooth movement

## Gemini Design Prompt

```
Create a sidebar navigation with 3 states: expanded (240px with icons + labels),
collapsed (60px with icons + tooltips), and hidden (mobile overlay).
Logo at top, nav sections in middle, user menu at bottom.
Smooth width transition animation. Use design-system.md tokens.
```

## Validation Checklist

- [ ] 3 states work correctly (expanded/collapsed/hidden)
- [ ] Collapsed state shows tooltips on hover
- [ ] Mobile uses Sheet overlay with backdrop
- [ ] Active item is visually distinct
- [ ] Keyboard navigation works
- [ ] Toggle shortcut (Cmd+B) works
- [ ] Transition animation is smooth (200ms)
- [ ] User menu is accessible in all states
