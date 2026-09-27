---
name: shadcn-theming
description: "Use when defining or auditing shadcn/ui design tokens, OKLCH colors, or dark/light mode CSS variables."
versions:
  shadcn-ui: "4.x"
  tailwindcss: "4.3"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep
references: references/theming-guide.md, references/templates/theme-setup.md
related-skills: shadcn-registries, shadcn-components
---

<objective>
Design tokens and theming for shadcn/ui: CSS custom properties (`--background`, `--primary`, etc.), OKLCH wide-gamut colors, dark/light mode via the `.dark` class or `prefers-color-scheme`, and Tailwind v4 `@theme` directive integration — identical for the Base UI, Radix and React Aria bases. Also covers the 7 base colors, presets (`init --preset`, `apply --preset --only theme,font`), `migrate base-color`, `shadcn/tailwind.css` / `eject`, and shadcn/typeset for rendered markdown.

Documents the token hierarchy (component → semantic → primitive OKLCH values) and the validation checklist (dark-mode overrides, chart/sidebar variables, no hard-coded hex).
</objective>

# shadcn Theming

## Agent Workflow (MANDATORY)

Before theming work, spawn agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Find existing theme tokens
2. **fuse-ai-pilot:research-expert** - Verify OKLCH patterns via Context7

After: Run **fuse-ai-pilot:sniper** for validation.

## Overview

| Feature | Description |
|---------|-------------|
| **CSS Variables** | `--background`, `--foreground`, `--primary` |
| **OKLCH Colors** | Wide-gamut P3 color space |
| **Dark Mode** | `.dark` class or `prefers-color-scheme` |
| **Tailwind v4** | `@theme inline` directive integration + `@custom-variant dark` |
| **Base colors** | `tailwind.baseColor`: `neutral`, `stone`, `zinc`, `mauve`, `olive`, `mist`, `taupe` (set at init; switch with `migrate base-color --to <c>`) |
| **Presets** | Short code bundling style, base color, theme, chart color, icons, fonts, radius, menu color/accent (build on ui.shadcn.com/create) |
| **Radius scale** | `--radius` drives `--radius-sm` ... `--radius-4xl` via `@theme inline` |

## Theme CLI (verified on shadcn 4.21.0)

```bash
{runner} shadcn@latest init --preset <code>                 # new project from a preset
{runner} shadcn@latest apply --preset <code>                # switch preset: reinstalls components, keeps base + RTL
{runner} shadcn@latest apply --preset <code> --only theme   # or --only font, --only theme,font
{runner} shadcn@latest preset decode <code>                 # also: resolve (current project), url, open
{runner} shadcn@latest migrate base-color --to zinc --yes   # rewrite theme CSS vars + baseColor
{runner} shadcn@latest init --no-css-variables              # inline utilities instead of tokens (install-time only)
{runner} shadcn@latest init --pointer                       # cursor: pointer on buttons (not part of presets)
{runner} shadcn@latest eject                                # inline shadcn/tailwind.css, drop the shadcn dependency
```

## Critical Rules

1. **ALWAYS use OKLCH** color space for all tokens
2. **ALWAYS define dark mode** overrides for every token
3. **NEVER hard-code** hex or rgb in components
4. **USE @theme inline** directive for Tailwind v4 integration
5. **MAP semantic tokens** to primitive OKLCH values

## Architecture

```
app/
├── globals.css         # :root + .dark token definitions
└── tailwind.config.ts  # Optional (v3) or @theme (v4)
```

-> See [theme-setup.md](references/templates/theme-setup.md) for complete theme

## Token Hierarchy

```
Component: --card, --card-foreground, --button-*
    ↑
Semantic: --primary, --secondary, --accent, --muted
    ↑
Primitive: oklch(55% 0.20 260), oklch(98% 0.01 260)
```

## Validation Checklist

```
[ ] CSS variables defined in :root
[ ] Dark mode overrides in .dark
[ ] OKLCH color space used
[ ] Chart variables (--chart-1 to --chart-5)
[ ] Sidebar variables if applicable
[ ] New tokens defined in :root + .dark AND exposed in @theme inline (--color-*)
[ ] No hard-coded hex in components
```

## Best Practices

### DO
- Use OKLCH for all colors
- Define semantic tokens mapped to primitives
- Provide dark mode overrides for all tokens
- Use `@theme inline` for Tailwind v4 integration

### DON'T
- Hard-code hex or rgb values
- Skip dark mode definitions
- Mix color spaces (hex + oklch)
- Define tokens only in Tailwind config

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Theming Guide** | [theming-guide.md](references/theming-guide.md) | CSS variables, OKLCH, base colors, new tokens, typeset |

### Templates

| Template | When to Use |
|----------|-------------|
| [theme-setup.md](references/templates/theme-setup.md) | Complete theme configuration |
