---
name: preprocessors
description: Sass, Less, Stylus, PostCSS configuration
when-to-use: Using CSS preprocessors or Tailwind
keywords: sass, less, stylus, postcss, tailwind, css
---

# Preprocessors

## Decision Tree

```
Using Tailwind CSS?
├── YES → v4? @tailwindcss/vite
│         v3? PostCSS config
└── NO → Using preprocessor?
    ├── Sass → npm install sass-embedded
    ├── Less → npm install less
    ├── Stylus → npm install stylus
    └── Plain CSS → No config needed
```

## Installation

| Preprocessor | Package | Command |
|--------------|---------|---------|
| Sass | `sass-embedded` | `npm add -D sass-embedded` |
| Less | `less` | `npm add -D less` |
| Stylus | `stylus` | `npm add -D stylus` |
| PostCSS | Built-in | Create `postcss.config.js` |

## Tailwind CSS

| Version | Setup |
|---------|-------|
| v4 | `@tailwindcss/vite` plugin |
| v3 | PostCSS + `tailwindcss` |

## Sass Options

| Option | Purpose |
|--------|---------|
| `additionalData` | Prepend imports |
| `silenceDeprecations` | Suppress warnings |
| `includePaths` | Additional paths |
| `sourceMap` | Source maps |

## Less Options

| Option | Purpose |
|--------|---------|
| `modifyVars` | Override variables |
| `javascriptEnabled` | Enable JS in Less |
| `math` | Math mode |

## PostCSS Plugins

| Plugin | Purpose |
|--------|---------|
| `tailwindcss` | Tailwind |
| `autoprefixer` | Vendor prefixes |
| `postcss-import` | @import support |
| `postcss-nesting` | CSS nesting |
| `cssnano` | Minification |

## File Extensions

| Preprocessor | Extensions |
|--------------|------------|
| Sass | `.scss`, `.sass` |
| Less | `.less` |
| Stylus | `.styl`, `.stylus` |
| PostCSS | `.css` (with config) |

→ **Code examples**: See [ViteConfig.js.md](templates/ViteConfig.js.md)
