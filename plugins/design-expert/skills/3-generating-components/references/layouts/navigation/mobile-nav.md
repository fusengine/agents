---
name: mobile-nav
description: Bottom tab bar navigation for mobile with safe area handling
when-to-use: Designing mobile navigation, bottom tabs, mobile-first apps
keywords: mobile, bottom-nav, tabs, safe-area, touch, fitts-law
priority: high
related: sidebar.md, navbar.md
---

# Mobile Navigation Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Tab bar | Fixed bottom, full width | Mobile only (< 640px) |
| Items | 3-5 tab icons with labels | Equal width distribution |
| Safe area | Bottom padding for notch | env(safe-area-inset-bottom) |

**Research:** Fitts's Law - bottom of screen is the most accessible area for thumb. Maximum 5 items to avoid overcrowding. Active state needs both filled icon AND label for clarity.

## Components (shadcn/ui)

- `Button` - Tab items (ghost variant)
- `Badge` - Notification indicators
- `Sheet` - Overflow menu ("More" tab)

## Tab Item Structure

```
    [Icon]      <- 24px, outline (inactive) / filled (active)
    [Label]     <- 10-12px, hidden when inactive (optional)
```

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --mobile-nav-height | 56px + safe-area | Tab bar height |
| --mobile-nav-bg | var(--background) | Background |
| --mobile-nav-border | var(--border) | Top border |
| --mobile-nav-z | 10 | Z-index |
| --tab-icon-size | 24px | Icon dimensions |

## States

| State | Icon | Label | Color |
|-------|------|-------|-------|
| Inactive | Outline | Muted or hidden | var(--muted-foreground) |
| Active | Filled | Visible, bold | var(--primary) |
| Badge | Outline + red dot | Muted | var(--error) indicator |

## Safe Area Handling

```css
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--background);
  border-top: 1px solid var(--border);
}
```

## "More" Tab Pattern

When more than 5 items exist:
1. Show top 4 items as tabs
2. 5th tab = "More" (ellipsis icon)
3. "More" opens bottom Sheet with remaining items
4. Sheet items use list format with icons

## Animation (Framer Motion)

- Active indicator: layoutId animation (smooth slide)
- Tab switch: content crossfade
- Badge: scale pop-in when count changes
- Sheet: slide from bottom with spring

## Gemini Design Prompt

```
Create a mobile bottom tab navigation with 5 items: Home, Search, Create (+),
Notifications (with badge), Profile. Fixed at bottom with safe area padding.
Active state shows filled icon + label in primary color.
Smooth active indicator animation. Use design-system.md tokens.
```

## Validation Checklist

- [ ] Maximum 5 visible tabs
- [ ] Active state is clearly distinct (filled icon + label)
- [ ] Safe area padding for notch devices
- [ ] Touch targets are minimum 44x44px
- [ ] "More" tab opens Sheet for overflow items
- [ ] Badge notifications visible but not obstructive
- [ ] Tab bar hides on scroll down, shows on scroll up (optional)
- [ ] Works with screen readers (role="tablist")
