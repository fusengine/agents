---
name: starlight-setup
description: Installing and configuring @astrojs/starlight documentation theme
when-to-use: Starting a new documentation site with Starlight
keywords: starlight, setup, installation, @astrojs/starlight, docs
priority: high
---

# Starlight Setup

## When to Use

- Creating a new documentation site from scratch
- Adding documentation to an existing Astro project

## Create New Starlight Project

```bash
npm create astro@latest -- --template starlight
```

## Add to Existing Project

```bash
npx astro add starlight
```

## Project Structure

```
src/
├── assets/
│   └── houston.png
├── content/
│   ├── docs/           # Documentation pages (Markdown/MDX)
│   │   ├── index.mdx
│   │   └── guides/
│   │       └── getting-started.md
│   └── i18n/           # Translation strings
└── pages/
    └── (Starlight handles routing)
astro.config.mjs
```

## astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      description: 'Documentation for my project',
      logo: {
        src: './src/assets/logo.svg',
        // OR
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      social: {
        github: 'https://github.com/my/repo',
        discord: 'https://discord.gg/...',
      },
      editLink: {
        baseUrl: 'https://github.com/my/repo/edit/main/',
      },
    }),
  ],
});
```

## Page Frontmatter

```md
---
title: Getting Started
description: How to get started with my project
sidebar:
  label: Getting Started  # Override sidebar label
  order: 1               # Position in sidebar group
  badge: New             # Badge in sidebar
---

# Getting Started

Content here...
```

## Key Configuration Options

| Option | Description |
|--------|-------------|
| `title` | Site title in nav and `<title>` |
| `description` | Default meta description |
| `logo` | Logo in navigation header |
| `social` | Social links (GitHub, Discord, etc.) |
| `editLink.baseUrl` | Enable "Edit this page" links |
| `tableOfContents` | `{ minHeadingLevel: 2, maxHeadingLevel: 3 }` |
