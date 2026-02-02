---
name: setup
description: Vite installation and basic configuration
when-to-use: Initial project setup, migrating from Mix
keywords: install, config, laravel-vite-plugin, setup
---

# Setup

## Decision Tree

```
New Laravel project?
├── YES → Vite included by default
└── NO → Migrating from Mix?
    ├── YES → Remove webpack.mix.js, install Vite
    └── NO → Install laravel-vite-plugin
```

## Installation

| Step | Command |
|------|---------|
| Install plugin | `npm install --save-dev vite laravel-vite-plugin` |
| Create config | Create `vite.config.js` |
| Update package.json | Add dev/build scripts |

## Package.json Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Development server |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production |

## Plugin Options

| Option | Type | Purpose |
|--------|------|---------|
| `input` | string/array | Entry point(s) |
| `refresh` | boolean/array | HMR for Blade views |
| `publicDirectory` | string | Public dir (default: public) |
| `buildDirectory` | string | Build output (default: build) |
| `hotFile` | string | Hot file path |
| `valetTls` | string | Valet HTTPS domain |
| `ssr` | string | SSR entry point |
| `ssrOutputDirectory` | string | SSR output dir |

## Blade Integration

| Directive | Purpose |
|-----------|---------|
| `@vite(['...'])` | Include assets |
| `@viteReactRefresh` | React Fast Refresh |

## Migration from Mix

| Mix | Vite Equivalent |
|-----|-----------------|
| `webpack.mix.js` | `vite.config.js` |
| `mix()` helper | `@vite()` directive |
| `npm run watch` | `npm run dev` |
| `npm run prod` | `npm run build` |

→ **Code examples**: See [ViteConfig.js.md](templates/ViteConfig.js.md)
