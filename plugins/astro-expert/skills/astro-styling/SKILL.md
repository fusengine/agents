---
name: astro-styling
description: Use when styling Astro components with scoped CSS, CSS Modules, Tailwind CSS, UnoCSS, or Sass. Covers class:list directive, global styles, CSS custom properties, and Vite-powered preprocessors.
versions:
  astro: "6"
user-invocable: true
references: references/scoped-css.md, references/css-modules.md, references/global-styles.md, references/tailwind.md, references/unocss.md, references/sass.md, references/css-variables.md, references/templates/scoped-component.md, references/templates/tailwind-setup.md, references/templates/unocss-setup.md
related-skills: astro-6, astro-integrations, solid-astro
---

# Astro Styling

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing styles, integrations, and patterns
2. **fuse-ai-pilot:research-expert** - Verify latest Astro/Tailwind/UnoCSS docs via Context7/Exa
3. **mcp__context7__query-docs** - Check integration compatibility with Astro 6

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Styling `.astro` components with component-scoped CSS
- Setting up Tailwind CSS or UnoCSS in an Astro project
- Using CSS Modules for framework-agnostic scoping
- Applying global base styles (reset, fonts, variables)
- Using `class:list` for conditional class application
- Adding Sass/SCSS via Vite preprocessors

### Styling Options

| Method | Scope | When to Use |
|--------|-------|-------------|
| `<style>` in `.astro` | Component | Default — scoped to component |
| `<style is:global>` | Global | Base styles, resets |
| CSS Modules `.module.css` | Component | Framework components (React, Vue) |
| Tailwind CSS | Utility | Rapid UI development |
| UnoCSS | Utility | Lightweight, configurable atomic CSS |
| Sass/SCSS | Component/Global | Advanced features, variables, mixins |

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| Scoped CSS | [scoped-css.md](references/scoped-css.md) | Component styling |
| CSS Modules | [css-modules.md](references/css-modules.md) | Framework components |
| Global styles | [global-styles.md](references/global-styles.md) | Resets, base styles |
| Tailwind | [tailwind.md](references/tailwind.md) | Utility-first CSS |
| UnoCSS | [unocss.md](references/unocss.md) | Atomic CSS engine |
| Sass/SCSS | [sass.md](references/sass.md) | Preprocessor features |
| CSS Variables | [css-variables.md](references/css-variables.md) | Design tokens, themes |

### Templates

| Template | When to Use |
|----------|-------------|
| [scoped-component.md](references/templates/scoped-component.md) | Component with scoped + conditional classes |
| [tailwind-setup.md](references/templates/tailwind-setup.md) | Full Tailwind CSS project setup |
| [unocss-setup.md](references/templates/unocss-setup.md) | Full UnoCSS project setup |

---

## Best Practices

1. **Prefer scoped styles** — Use `<style>` in `.astro` files by default
2. **Global styles in layouts** — Apply resets and base styles in root layout
3. **CSS variables for themes** — Define design tokens as custom properties
4. **Avoid `is:global` in components** — Reserve for layouts and global files
5. **class:list over ternaries** — More readable conditional class logic

---

## Forbidden

- Writing inline styles for layout/theme — use CSS classes instead
- Using `is:global` inside non-layout components
- Importing CSS in multiple components without CSS Modules
- Mixing Tailwind and custom class naming without a clear convention
