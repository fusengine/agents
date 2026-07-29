---
name: tailwindcss-borders
description: "Use when styling element borders, rounded corners, focus outlines/rings, or divide-* separators between children."
user-invocable: false
---

<objective>
Complete reference for Tailwind CSS v4.1 border-related utilities: border width/color/style and per-side variants, `rounded-*` border-radius (including per-corner), `outline-*` with `outline-offset`, box-shadow-based `ring-*` with `ring-offset`, and `divide-*` separators between children.

Flags the v4.1 default `ring` width change (3px → 1px, use `ring-3` for v3 behavior) and per-corner border-radius improvements.
</objective>

# Tailwind CSS Borders Skill

Complete reference for border-related utilities in Tailwind CSS v4.1.

## Contents

- **Border Width** - `border`, `border-x`, `border-y`, `border-t`, `border-r`, `border-b`, `border-l`
- **Border Color** - `border-{color}`, per-side border colors
- **Border Style** - `border-solid`, `border-dashed`, `border-dotted`, `border-double`
- **Border Radius** - `rounded`, `rounded-t`, `rounded-r`, `rounded-b`, `rounded-l`, `rounded-tl`, `rounded-tr`, `rounded-bl`, `rounded-br`, `rounded-full`
- **Outline** - `outline`, `outline-{width}`, `outline-{color}`, `outline-offset`
- **Ring** - `ring`, `ring-{width}`, `ring-{color}`, `ring-offset`, `ring-offset-{color}`
- **Divide** - `divide-x`, `divide-y`, `divide-{color}`, `divide-{style}`

## Key Features

- Comprehensive border control with width, color, and style options
- Per-side border customization for fine-grained control
- Ring shadows as accessible focus indicators
- Divide utilities for separating child elements
- Full color palette support via design tokens
- Responsive and state variants support

## v4.1 Updates

- Default `ring` width changed from `3px` to `1px` (use `ring-3` for v3 behavior)
- Enhanced outline customization with `outline-offset`
- Improved border radius with corner-specific classes
- Better type safety with CSS variables in arbitrary values

## Detailed References

- [border.md](references/border.md) - Load when styling border width/color/style, border-radius, or per-side border patterns
- [outline.md](references/outline.md) - Load when configuring outline width/color/offset for focus and accessibility states
- [ring.md](references/ring.md) - Load when building box-shadow-based rings or divide-* separators between children
