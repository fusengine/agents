# UnoCSS in Astro

## Overview

UnoCSS is an instant atomic CSS engine — faster than Tailwind, zero runtime, fully configurable via presets. Use `@unocss/astro` for Astro integration.

## Installation

```bash
npm install -D unocss @unocss/astro
```

```typescript
// astro.config.ts
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true })
  ]
});
```

```typescript
// uno.config.ts
import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),   // Tailwind/Windi CSS compatible utilities
    presetIcons(), // Icon preset
  ]
});
```

## Common Presets

| Preset | Package | Purpose |
|--------|---------|---------|
| `presetUno` | `unocss` | Tailwind-compatible utilities |
| `presetIcons` | `@unocss/preset-icons` | Icon classes |
| `presetAttributify` | `@unocss/preset-attributify` | Attribute-based utilities |
| `presetTypography` | `@unocss/preset-typography` | Prose typography |
| `presetWebFonts` | `@unocss/preset-web-fonts` | Web font integration |

## Usage

Same class syntax as Tailwind:
```astro
<div class="flex items-center gap-4 p-6 bg-white rounded-lg">
  <h1 class="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

## Style Reset

```bash
npm install -D @unocss/reset
```

In root layout:
```astro
---
import '@unocss/reset/tailwind.css';
---
```

## When to Use UnoCSS vs Tailwind

| Feature | UnoCSS | Tailwind |
|---------|--------|---------|
| Build speed | Faster | Slower |
| Bundle size | Smaller | Larger |
| Ecosystem | Growing | Larger |
| Config flexibility | Higher | Lower |
| Learning curve | Similar | Similar |
