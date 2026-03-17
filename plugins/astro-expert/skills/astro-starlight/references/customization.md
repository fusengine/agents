---
name: starlight-customization
description: Customizing Starlight appearance — CSS variables, component overrides, custom components
when-to-use: Branding, theme colors, layout changes in Starlight
keywords: CSS variables, custom CSS, component overrides, theme, dark mode
priority: medium
requires: setup.md
---

# Starlight Customization

## When to Use

- Override brand colors while keeping dark/light mode
- Add custom header, footer, or sidebar components
- Inject custom CSS globally

## Custom CSS Variables

```css
/* src/styles/custom.css */
:root {
  --sl-color-accent-low: #1a1a2e;
  --sl-color-accent: #6c63ff;
  --sl-color-accent-high: #a29bfe;
  --sl-font: 'Inter', system-ui, sans-serif;
  --sl-text-h1: 2.5rem;
}
:root[data-theme='dark'] {
  --sl-color-accent-low: #16213e;
  --sl-color-accent: #a29bfe;
  --sl-color-accent-high: #dfe6e9;
}
```

```js
// astro.config.mjs
starlight({
  customCss: ['./src/styles/custom.css'],
})
```

## Component Overrides

```js
starlight({
  components: {
    // Override specific Starlight components
    Header: './src/components/CustomHeader.astro',
    Footer: './src/components/CustomFooter.astro',
    SocialIcons: './src/components/CustomSocialIcons.astro',
  },
})
```

## Custom Header Component

```astro
---
// src/components/CustomHeader.astro
import type { Props } from '@astrojs/starlight/props';
import Default from '@astrojs/starlight/components/Header.astro';
---
<Default {...Astro.props}>
  <span slot="title">
    <img src="/logo.svg" alt="My Logo" height="32" />
  </span>
</Default>
```

## Head Overrides (Custom Scripts/Tags)

```js
starlight({
  head: [
    {
      tag: 'script',
      attrs: { defer: true, src: 'https://analytics.example.com/script.js' },
    },
    {
      tag: 'meta',
      attrs: { name: 'theme-color', content: '#6c63ff' },
    },
  ],
})
```

## Key CSS Variables

| Variable | Controls |
|----------|----------|
| `--sl-color-accent` | Primary accent color |
| `--sl-color-accent-high` | Lighter accent variant |
| `--sl-font` | Body font family |
| `--sl-font-mono` | Code font family |
| `--sl-text-h1..h6` | Heading sizes |
| `--sl-sidebar-width` | Sidebar width |
