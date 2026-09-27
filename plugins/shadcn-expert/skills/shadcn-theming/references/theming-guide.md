---
name: theming-guide
description: CSS variables, OKLCH colors, chart/sidebar tokens, and Tailwind integration
when-to-use: When configuring theme tokens or color system
keywords: theme, oklch, css-variables, dark-mode, tailwind, tokens, colors
priority: high
related: ../SKILL.md
---

# Theming Guide

## Overview

shadcn/ui uses CSS custom properties with OKLCH color space for wide-gamut P3 support and perceptual uniformity. Tokens follow a 3-level hierarchy: primitive -> semantic -> component.

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **OKLCH** | `oklch(L% C H)` - perceptually uniform, P3 gamut |
| **Semantic tokens** | `--primary`, `--secondary`, `--accent` |
| **Dark mode** | `.dark` class or `prefers-color-scheme` |
| **@theme inline** | Tailwind v4 custom property bridge (`--color-*: var(--*)`, derived `--radius-*`) |

## Layout Variables

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--popover` / `--popover-foreground` | Popover surfaces |

## Interactive Variables

| Variable | Purpose |
|----------|---------|
| `--primary` / `--primary-foreground` | Primary buttons, links |
| `--secondary` | Secondary elements |
| `--accent` | Hover backgrounds |
| `--muted` / `--muted-foreground` | Muted backgrounds |
| `--destructive` | Danger/delete actions |

## Utility Variables

| Variable | Purpose |
|----------|---------|
| `--border` | Default border color |
| `--input` | Input border color |
| `--ring` | Focus ring color |
| `--radius` | Default border radius (0.625rem) |

## Radius Scale

`--radius` is the single source; the docs scaffold derives (in `@theme inline`): `--radius-sm: calc(var(--radius) * 0.6)`, `--radius-md: * 0.8`, `--radius-lg: var(--radius)`, `--radius-xl: * 1.4`, `--radius-2xl: * 1.8`, `--radius-3xl: * 2.2`, `--radius-4xl: * 2.6`.

## Base Colors

`tailwind.baseColor` (set at init or by a preset) generates the default token values: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe`. To switch later: `{runner} shadcn@latest migrate base-color --to <color>` (rewrites the CSS file from `tailwind.css` and `baseColor`; tokens you changed are left and reported). To take only a preset's theme/fonts: `{runner} shadcn@latest apply --preset <code> --only theme,font`.

## Adding New Tokens

Define the pair under `:root` and `.dark`, then expose it to Tailwind:

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

`bg-warning` / `text-warning-foreground` are then available. Registry items ship tokens through `cssVars.theme` / `cssVars.light` / `cssVars.dark` (the item-level `tailwind` key is deprecated for v4).

## Typeset (rendered markdown)

shadcn/typeset (July 2026) is one `typeset.css` file you own, generated at ui.shadcn.com/typeset. Import it after Tailwind (`@import "./typeset.css";`), wrap content in `className="typeset typeset-docs"`. Three controls: `--typeset-size`, `--typeset-leading`, `--typeset-flow` (+ `--typeset-font-body|heading|mono`). Uses theme tokens (dark mode follows), `:where()` selectors so utilities win, `not-typeset` / `data-not-typeset` to opt out, `typeset-scroll` for wide tables, append-stable for streaming chat.

## OKLCH Color Space

```
oklch(Lightness% Chroma Hue)
  L: 0-100%  (0 = black, 100 = white)
  C: 0-0.4   (0 = gray, 0.4 = vivid)
  H: 0-360   (hue angle)
```

Benefits: perceptual uniformity, P3 gamut, predictable contrast.

## Theme Switching

Use `.dark` class on `<html>` or CSS media query:

```tsx
<html className={theme === "dark" ? "dark" : ""}>{children}</html>
```

For full setup with next-themes, see [theme-setup.md](templates/theme-setup.md). Framework guides: /docs/dark-mode/{next,vite,astro,remix,tanstack-start}. `init -t next` and `-t vite` templates include dark mode.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Mixing hex and OKLCH | Use OKLCH consistently |
| Forgetting dark overrides | Every :root token needs .dark equivalent |
| Defining colors in Tailwind config | Use CSS variables with `@theme inline` bridge |
| `dark:` utilities ignore `.dark` class (v4) | Add `@custom-variant dark (&:is(.dark *));` |

---

## Related Templates

- [theme-setup.md](templates/theme-setup.md) - Complete theme configuration
