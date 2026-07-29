---
name: tailwindcss-v4
description: "Use when migrating a project from Tailwind v3 to v4, mapping @theme namespaces to generated utilities, or looking up renamed/removed v3 utilities."
user-invocable: false
---

<objective>
Documents Tailwind CSS v4.1 core features relevant to a v3→v4 migration: the `@theme` namespace-to-generated-utility mapping (`--color-*`→`bg-*`/`text-*`, `--spacing-*`→`p-*`/`m-*`/`gap-*`, etc.), the v3→v4 breaking changes (removed `@tailwind` directives, renamed utilities like `shadow-sm`→`shadow-xs`, removed `bg-opacity-*`/`flex-shrink-*`, the `@utility` custom-utility syntax change, arbitrary-value variable syntax, important-modifier position), and the `@tailwindcss/upgrade` CLI tool.

Not the day-to-day CSS-first configuration reference (`tailwindcss-core` owns `@theme`/`@utility`/`@variant` usage) and not a utility-class lookup (the category skills own that).
</objective>

# Tailwind CSS v4.1 Core

## Documentation

- CSS theme variables, design tokens, customization -> [tailwindcss-core](../tailwindcss-core/SKILL.md#2-theme)
- Directives (@utility, @variant, @theme, @apply) -> [tailwindcss-core](../tailwindcss-core/SKILL.md)
- Custom utilities and variants -> [tailwindcss-custom-styles](../tailwindcss-custom-styles/SKILL.md)
- Content detection (@source scanning) -> [tailwindcss-core](../tailwindcss-core/SKILL.md#3-source)
- Migration from v3 to v4 -> see "v3 → v4 Breaking Changes" section below

## Quick Reference - @theme Namespaces

| Namespace | Generated Utilities |
|-----------|-------------------|
| `--color-*` | bg-*, text-*, border-*, fill-* |
| `--font-*` | font-* |
| `--text-*` | text-xs, text-sm, text-base, etc. |
| `--spacing-*` | p-*, m-*, gap-*, w-*, h-* |
| `--radius-*` | rounded-* |
| `--shadow-*` | shadow-* |
| `--breakpoint-*` | sm:*, md:*, lg:*, xl:* |
| `--animate-*` | animate-spin, animate-bounce, etc. |
| `--ease-*` | ease-in, ease-out, ease-in-out |

## v3 → v4 Breaking Changes

### Removed @tailwind directives

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

### Renamed utilities

| v3 | v4 |
|----|-----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |

### Removed deprecated utilities

- `bg-opacity-*` → use `bg-black/50`
- `text-opacity-*` → use `text-black/50`
- `flex-shrink-*` → use `shrink-*`
- `flex-grow-*` → use `grow-*`

### Custom utilities syntax

```css
/* v3 */
@layer utilities {
  .tab-4 {
    tab-size: 4;
  }
}

/* v4 */
@utility tab-4 {
  tab-size: 4;
}
```

### Variables in arbitrary values

```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>

<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

### Important modifier position

```html
<!-- v3 -->
<div class="!bg-red-500">

<!-- v4 -->
<div class="bg-red-500!">
```

## Upgrade Tool

```bash
npx @tailwindcss/upgrade
```

Requires Node.js 20+

## Detailed References

- [configuration.md](references/configuration.md) - Load when writing CSS-first `@theme` config or using `@utility`/`@variant`/`@custom-variant` directives
- [api-functions.md](references/api-functions.md) - Load when using the `--alpha()`/`--spacing()` CSS functions or `@apply`
- [installation-support.md](references/installation-support.md) - Load when installing Tailwind v4 (npm/Vite/CLI) or checking browser support
