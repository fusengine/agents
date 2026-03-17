---
name: sidebar-config
description: Starlight sidebar configuration — auto-gen, manual groups, badges, ordering
when-to-use: Customizing documentation navigation structure
keywords: sidebar, groups, autogenerate, badge, order, collapsed
priority: high
requires: setup.md
---

# Sidebar Configuration

## When to Use

- Override auto-generated sidebar order
- Create grouped navigation sections
- Add badges or labels to sidebar items

## Auto-Generated (Default)

No config needed — Starlight generates from `src/content/docs/` filesystem. File `title` frontmatter becomes the sidebar label.

## Manual Sidebar

```js
// astro.config.mjs
starlight({
  sidebar: [
    // Simple link
    { slug: 'intro' },

    // External link
    { label: 'GitHub', link: 'https://github.com/my/repo', attrs: { target: '_blank' } },

    // Group with items
    {
      label: 'Guides',
      items: [
        { slug: 'guides/getting-started' },
        { slug: 'guides/advanced' },
        {
          label: 'Examples',
          link: '/examples/',
          badge: { text: 'New', variant: 'tip' },
        },
      ],
    },

    // Auto-generate a group from directory
    {
      label: 'API Reference',
      autogenerate: { directory: 'reference' },
    },

    // Collapsible group
    {
      label: 'Archive',
      collapsed: true,
      autogenerate: { directory: 'archive' },
    },
  ],
})
```

## Per-Page Sidebar Control (Frontmatter)

```md
---
title: My Page
sidebar:
  label: Short Label     # Override display label
  order: 2               # Lower = earlier in group
  badge:
    text: Beta
    variant: caution     # tip | note | caution | danger | success | default
  hidden: true           # Hide from sidebar (still accessible by URL)
  attrs:
    class: 'font-bold'   # Custom CSS class on sidebar item
---
```

## Badge Variants

| Variant | Color |
|---------|-------|
| `default` | Neutral |
| `note` | Blue |
| `tip` | Green |
| `caution` | Yellow |
| `danger` | Red |
| `success` | Green |

## Key Rules

- Mix `items` and `autogenerate` in same config is not supported in one group
- `slug` in sidebar refers to `src/content/docs/` path without extension
- `link` accepts any URL, `slug` only for docs content
