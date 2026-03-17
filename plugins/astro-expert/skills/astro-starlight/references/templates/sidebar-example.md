---
name: sidebar-example-template
description: Complex sidebar configuration with groups, badges, auto-generate, and external links
type: template
---

# Complex Sidebar Template

## astro.config.mjs — Sidebar Section

```js
starlight({
  sidebar: [
    // Introduction (single pages)
    {
      label: 'Introduction',
      items: [
        { slug: 'overview', label: 'Overview' },
        { slug: 'quickstart', label: 'Quick Start', badge: { text: 'Start Here', variant: 'tip' } },
        { slug: 'installation' },
      ],
    },

    // Guides (manual + auto-generate mixed via separate groups)
    {
      label: 'Guides',
      items: [
        { slug: 'guides/basic-usage' },
        { slug: 'guides/advanced', badge: { text: 'Advanced', variant: 'caution' } },
        { slug: 'guides/migration', badge: { text: 'v2', variant: 'note' } },
      ],
    },

    // API Reference (auto-generated from directory)
    {
      label: 'API Reference',
      collapsed: true,
      autogenerate: { directory: 'reference', collapsed: true },
    },

    // Tutorials (collapsed by default)
    {
      label: 'Tutorials',
      collapsed: true,
      items: [
        { slug: 'tutorials/blog' },
        { slug: 'tutorials/ecommerce' },
        {
          label: 'Video Course',
          link: 'https://youtube.com/...',
          attrs: { target: '_blank', rel: 'noopener' },
        },
      ],
    },

    // External resources
    {
      label: 'Resources',
      items: [
        { label: 'GitHub', link: 'https://github.com/my/project', attrs: { target: '_blank' } },
        { label: 'Discord', link: 'https://discord.gg/...', attrs: { target: '_blank' } },
        { label: 'Changelog', slug: 'changelog', badge: 'Updated' },
      ],
    },
  ],
})
```

## Per-Page Frontmatter Sidebar Control

```md
---
title: Quick Start
sidebar:
  label: Quick Start       # Override auto-generated label
  order: 1                 # First in its group
  badge:
    text: Start Here
    variant: tip
---
```

```md
---
title: Legacy API
sidebar:
  hidden: true             # Hide from sidebar
---
```
