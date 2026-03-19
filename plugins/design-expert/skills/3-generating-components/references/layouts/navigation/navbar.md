---
name: navbar
description: Sticky navbar with blur backdrop, notifications, and responsive behavior
when-to-use: Designing top navigation bar, app header, global navigation
keywords: navbar, header, sticky, blur, notifications, search, responsive
priority: high
related: sidebar.md, mobile-nav.md, command-palette.md
---

# Navbar Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Left | Logo + hamburger (mobile) | Logo always visible |
| Center | Nav links (desktop only) | Hidden on mobile |
| Right | Search + notifications + user menu | Compact on mobile |

## Components (shadcn/ui)

- `NavigationMenu` - Desktop nav links
- `Button` - Icon buttons (search, notifications, hamburger)
- `Avatar` - User menu trigger
- `DropdownMenu` - User account menu
- `Badge` - Notification count dot
- `Sheet` - Mobile menu (hamburger)
- `Input` - Search (or Cmd+K trigger)

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --navbar-height | 64px (h-16) | Fixed height |
| --navbar-bg | var(--background)/80 | Semi-transparent bg |
| --navbar-blur | blur(16px) | Backdrop blur |
| --navbar-border | var(--border) | Bottom border |
| --navbar-z | 10 | Z-index (above content) |

## Sticky Behavior

```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: oklch(var(--background) / 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
```

## Desktop Layout (> 1024px)

```
[Logo]     [Nav Link] [Nav Link] [Nav Link]     [Search] [Bell] [Avatar]
```

## Mobile Layout (< 1024px)

```
[Hamburger] [Logo]                              [Bell] [Avatar]
```

## Notifications

- Bell icon with red dot badge for unread count
- Click opens dropdown with recent notifications
- "Mark all as read" action at top
- "View all" link at bottom

## Animation (Framer Motion)

- Mobile menu: slide from right (Sheet)
- Notification dropdown: fade + scale from top-right
- Nav links: subtle underline animation on hover
- Scroll: navbar shadow appears on scroll (elevation change)

## Gemini Design Prompt

```
Create a sticky navbar with logo left, nav links center (desktop), and user menu
with notifications right. Backdrop blur effect. Height 64px.
Mobile: hamburger menu opens Sheet from right. Notification bell with badge.
Use design-system.md tokens.
```

## Validation Checklist

- [ ] Sticky positioning works on scroll
- [ ] Backdrop blur is applied
- [ ] Mobile hamburger opens full menu
- [ ] Notification badge shows unread count
- [ ] User menu dropdown works
- [ ] Nav links show active state
- [ ] Search triggers command palette (Cmd+K)
- [ ] Accessible: all interactive elements focusable
