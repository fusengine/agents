---
name: design-system-devtool
description: Ready-to-use dev tools design system — dark-first monochrome OKLCH, mono+sans pair, minimal motion, dense spacing
keywords: devtools, developer, technical, dark-mode, OKLCH, design-system, example
sector: dev-tools
---

# Design System — Dev Tool (Technical/Dark-First)

## Identity

| Property | Value |
|----------|-------|
| Sector | Dev Tools / SaaS |
| Personality | Precise, technical, minimal |
| Audience | Developers, power users |
| Density | dense (4px grid) |
| Motion | corporate (minimal, purposeful) |

## Colors (OKLCH)

### Brand

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --primary | oklch(50% 0.15 268) | oklch(65% 0.15 268) | Actions, links |
| --primary-foreground | oklch(98% 0.003 268) | oklch(98% 0.003 268) | Text on primary |
| --secondary | oklch(68% 0.13 165) | oklch(58% 0.13 165) | Success, CLI green |
| --secondary-foreground | oklch(15% 0.01 165) | oklch(98% 0.003 165) | Text on secondary |
| --accent | oklch(65% 0.12 45) | oklch(55% 0.12 45) | Warnings, highlights |
| --accent-foreground | oklch(15% 0.01 45) | oklch(15% 0.01 45) | Text on accent |

### Surfaces

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| --background | oklch(97% 0.005 260) | oklch(11% 0.008 260) | Page background |
| --foreground | oklch(14% 0.01 260) | oklch(94% 0.005 260) | Default text |
| --card | oklch(100% 0 0) | oklch(16% 0.01 260) | Card/panel background |
| --card-foreground | oklch(14% 0.01 260) | oklch(94% 0.005 260) | Card text |
| --muted | oklch(94% 0.007 260) | oklch(21% 0.009 260) | Secondary bg |
| --muted-foreground | oklch(50% 0.018 260) | oklch(62% 0.018 260) | Comments, labels |
| --border | oklch(88% 0.007 260) | oklch(27% 0.009 260) | Borders |
| --input | oklch(88% 0.007 260) | oklch(27% 0.009 260) | Input borders |
| --ring | oklch(50% 0.15 268) | oklch(65% 0.15 268) | Focus rings |

### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| --success | oklch(58% 0.16 145) | Build success, tests pass |
| --warning | oklch(72% 0.15 78) | Deprecation, caution |
| --error | oklch(54% 0.20 25) | Errors, failed builds |
| --info | oklch(57% 0.14 240) | Logs, info states |

## Typography

| Property | Value |
|----------|-------|
| Display font | JetBrains Mono |
| Body font | Geist |
| Mono font | JetBrains Mono |
| Base size | 0.875rem / 14px |
| Scale | compact |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
:root {
  --font-display: "JetBrains Mono", monospace;
  --font-body: "Geist", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

## Spacing (4px grid)

| Property | Value |
|----------|-------|
| Base unit | 4px |
| Border radius | sharp — precise, technical |
| --radius | 4px |
| --radius-lg | 8px |
| --radius-full | 9999px |

## Motion (Minimal/Corporate)

| Property | Value |
|----------|-------|
| Profile | corporate |
| Quick | 80ms |
| Standard | 150ms |
| Emphasis | 220ms |
| Easing | ease-out |
| Reduced motion | Always respected |

```css
:root {
  --motion-quick: 80ms ease-out;
  --motion-standard: 150ms ease-out;
  --motion-emphasis: 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
```
