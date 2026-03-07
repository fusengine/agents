---
name: palette-generator
description: Use when generating color palettes for projects. Covers OKLCH color system, WCAG contrast ratios, and sector-specific palette generation.
versions:
  tailwindcss: "4.1"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task
references: references/oklch-system.md, references/contrast-ratios.md, references/templates/palette-template.md
related-skills: identity-system, designing-systems, theming-tokens
---

# Palette Generator

## Agent Workflow (MANDATORY)

Before ANY palette generation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Find existing color tokens and CSS variables
2. **fuse-ai-pilot:research-expert** - Verify OKLCH best practices and P3 gamut
3. **design-expert:identity-system** - Load sector palette from design-system.md

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **OKLCH System** | Perceptually uniform color format with P3 gamut |
| **Scale Generation** | Lightness ramp from 95% to 15% with consistent chroma |
| **Contrast Ratios** | WCAG AA/AAA compliance checking |
| **Dark Mode** | Inverted lightness scale with chroma adjustment |

---

## Critical Rules

1. **OKLCH only** - Never use hex, HSL, or RGB in design tokens
2. **WCAG AA minimum** - 4.5:1 for normal text, 3:1 for large text and UI
3. **Scale from identity** - Generate scale from brand primary, not from scratch
4. **Dark mode inversion** - Invert L, adjust C for vibrancy, keep H
5. **Semantic colors** - Always define success, warning, error, info

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **OKLCH System** | [oklch-system.md](references/oklch-system.md) | Understanding OKLCH format |
| **Contrast Ratios** | [contrast-ratios.md](references/contrast-ratios.md) | WCAG compliance checking |

### Templates

| Template | When to Use |
|----------|-------------|
| [palette-template.md](references/templates/palette-template.md) | Generate CSS vars + Tailwind config |

---

## Quick Reference

### OKLCH Format

```
oklch(lightness% chroma hue)

lightness: 0% (black) to 100% (white)
chroma:    0 (gray) to ~0.37 (max saturation)
hue:       0-360 (color wheel degrees)
```

### Generate a 10-Step Scale

```
Given: primary = oklch(55% 0.18 245)

50:  oklch(97% 0.01 245)   <- lightest
100: oklch(93% 0.03 245)
200: oklch(85% 0.06 245)
300: oklch(75% 0.10 245)
400: oklch(65% 0.14 245)
500: oklch(55% 0.18 245)   <- primary
600: oklch(47% 0.16 245)
700: oklch(38% 0.14 245)
800: oklch(28% 0.10 245)
900: oklch(20% 0.08 245)
950: oklch(15% 0.05 245)   <- darkest
```

### Auto-Foreground Rule

```
if background L > 60% -> use dark foreground (L: 15%)
if background L <= 60% -> use light foreground (L: 95%)
```

---

## Validation Checklist

- [ ] All colors use OKLCH format
- [ ] Primary scale has 10+ steps
- [ ] Dark mode palette defined (inverted L)
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] UI element contrast meets 3:1
- [ ] Semantic colors defined (success, warning, error, info)
- [ ] CSS custom properties used (no hard-coded values)
- [ ] Foreground colors auto-calculated from background L

---

## Best Practices

### DO
- Generate scales by varying L while keeping C and H consistent
- Test contrast ratios for all text/background combinations
- Provide dark mode variant for every color token
- Use CSS custom properties for all color values
- Match palette to sector personality

### DON'T
- Use hex or HSL in design tokens
- Skip dark mode palette generation
- Hard-code colors in components
- Use default shadcn/ui purple palette
- Ignore WCAG contrast requirements
