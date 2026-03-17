---
name: astro-integrations
description: Expert Astro UI framework integrations — @astrojs/react, @astrojs/vue, @astrojs/svelte, @astrojs/solid-js, @astrojs/preact, @astrojs/alpinejs, @astrojs/lit, @qwikdev/astro, @analogjs/astro-angular. Setup, multi-framework config, usage patterns.
versions:
  astro: 6
user-invocable: true
references: references/overview.md, references/react.md, references/vue.md, references/svelte.md, references/solid.md, references/preact.md, references/others.md, references/multi-framework.md, references/templates/react-setup.md, references/templates/multi-framework.md
related-skills: astro-6, astro-islands, astro-styling
---

# Astro Integrations Expert

Framework-agnostic: use React, Vue, Svelte, Solid, and more in the same Astro project.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Check existing integrations and astro.config.ts
2. **fuse-ai-pilot:research-expert** - Verify latest integration docs via Context7/Exa
3. **mcp__context7__query-docs** - Get setup and configuration examples

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

### When to Use

- Adding React/Vue/Svelte components to an Astro site
- Migrating an existing framework app into Astro
- Using multiple frameworks in the same project
- Integrating web components (Lit) or signals-based frameworks

### Supported Frameworks

| Integration | Package | Notes |
|-------------|---------|-------|
| React | `@astrojs/react` | Requires react + react-dom |
| Vue | `@astrojs/vue` | Requires vue |
| Svelte | `@astrojs/svelte` | Requires svelte |
| SolidJS | `@astrojs/solid-js` | Requires solid-js |
| Preact | `@astrojs/preact` | Lightweight React alternative |
| AlpineJS | `@astrojs/alpinejs` | Minimal JS sprinkles |
| Lit | `@astrojs/lit` | Web components |
| Qwik | `@qwikdev/astro` | Resumability |
| Angular | `@analogjs/astro-angular` | Via AnalogJS |

---

## Quick Setup

```bash
# Official integrations via CLI (recommended)
npx astro add react
npx astro add vue
npx astro add svelte
npx astro add solid-js
npx astro add preact
```

The CLI auto-installs packages and updates `astro.config.ts`.

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Architecture overview | [overview.md](references/overview.md) |
| React setup + options | [react.md](references/react.md) |
| Vue setup + options | [vue.md](references/vue.md) |
| Svelte setup + options | [svelte.md](references/svelte.md) |
| SolidJS setup + options | [solid.md](references/solid.md) |
| Preact setup + options | [preact.md](references/preact.md) |
| Lit, Qwik, Alpine, Angular | [others.md](references/others.md) |
| Multi-framework config | [multi-framework.md](references/multi-framework.md) |
| React full setup | [templates/react-setup.md](references/templates/react-setup.md) |
| Multi-framework project | [templates/multi-framework.md](references/templates/multi-framework.md) |

---

## Best Practices

1. **Use `astro add` CLI** — Auto-configures everything correctly
2. **Separate directories per framework** — `src/components/react/`, `src/components/vue/`
3. **`include` for multiple JSX frameworks** — Avoid React/Preact/Solid conflicts
4. **Apply client directives** — All framework components need hydration directive for interactivity
5. **Prefer single framework** — Mix only when truly necessary for performance
