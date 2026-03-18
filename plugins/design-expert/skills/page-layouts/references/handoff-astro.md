---
name: handoff-astro
description: Token-to-Astro mapping for design handoff — Islands, scoped CSS, View Transitions
related: framework-integration.md, handoff-livewire.md, handoff-swift.md
---

## Color Tokens → Astro

| Design Token | Implementation |
|---|---|
| `--color-primary` | `:root { --color-primary: oklch(65% 0.15 250); }` in `src/styles/tokens.css` |
| Dark mode | `.dark { --color-primary: oklch(75% 0.12 250); }` — toggled via class on `<html>` |
| Import | `import '../styles/tokens.css'` in `src/layouts/Base.astro` `<head>` |
| Usage | `class="bg-[--color-primary]"` (Tailwind) or `var(--color-primary)` (inline CSS) |

## Spacing Tokens → Tailwind v4

| Token | Value | Tailwind Classes |
|---|---|---|
| `--space-xs` | 4px | `p-1`, `gap-1` |
| `--space-sm` | 8px | `p-2`, `gap-2` |
| `--space-md` | 16px | `p-4`, `gap-4` |
| `--space-lg` | 24px | `p-6`, `gap-6` |
| `--space-xl` | 32px | `p-8`, `gap-8` |

Custom spacing in Tailwind v4: `@theme { --spacing-18: 4.5rem; }` in `src/styles/global.css`.

## Typography → Astro

- Install: `npm install @fontsource/inter @fontsource/clash-display`
- Import in `Base.astro`: `import '@fontsource/inter/400.css'`
- CSS vars: `--font-heading: "Clash Display", sans-serif;` + `--font-body: "Inter", sans-serif;`
- Never use system fallback as primary — always import explicit font package

## Motion → CSS + View Transitions

| Preset | Implementation |
|---|---|
| micro | `transition: 150ms ease-out` — CSS native on element |
| standard | `transition:animate={fade({ duration: '0.3s' })}` — Astro View Transitions |
| slow | `@keyframes slideIn { ... }` in `<style is:global>` |

```astro
---
import { ViewTransitions, fade } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
<nav transition:persist>...</nav>
<main transition:animate={fade({ duration: '0.3s' })}>...</main>
```

`prefers-reduced-motion` is respected automatically by Astro View Transitions.

## Component Mapping → Astro Islands

| Component Type | Implementation | Directive |
|---|---|---|
| Static (Badge, Card, Table, Avatar, Separator) | `.astro` file | None |
| Interactive Radix (Dialog, Dropdown, Popover, Sheet, Drawer) | React `.tsx` wrapper | `client:load` |
| Below-fold (Accordion, Tabs, Carousel) | React `.tsx` wrapper | `client:visible` |
| Mobile-only (MobileDrawer) | React `.tsx` wrapper | `client:media="(max-width: 768px)"` |
| Browser API (Chart, Map, Canvas) | React `.tsx` | `client:only="react"` |
| Dynamic server (avatar, cart, pricing) | `.astro` | `server:defer` + `<Fragment slot="fallback">` |

**CRITICAL**: React Context is NOT shared between islands. Wrap interdependent shadcn components (e.g., `Dialog` + `DialogTrigger` + `DialogContent`) in a **single** `.tsx` file hydrated with one directive.

## Dark Mode → Astro

FOUC prevention — inline script in `<head>` before any styles:

```html
<script is:inline>
  const theme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.addEventListener('astro:after-swap', () => {
    document.documentElement.classList.toggle('dark', localStorage.getItem('theme') === 'dark');
  });
</script>
```

`astro:after-swap` ensures class persists across View Transitions page navigations.

## Responsive → Astro

- Tailwind mobile-first: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Pattern: `<div class="flex flex-col md:flex-row">`
- Conditional hydration: `client:media="(max-width: 768px)"` avoids loading JS on desktop
