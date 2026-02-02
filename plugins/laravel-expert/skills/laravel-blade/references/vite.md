---
name: vite
description: Asset bundling decisions with Vite
when-to-use: Setting up CSS/JS compilation and hot reload
keywords: vite, assets, css, javascript, bundling, hmr
---

# Vite Integration

## Decision Tree

```
Using Tailwind CSS?
├── YES → v4? Use @tailwindcss/vite plugin
│         v3? Use PostCSS config
└── NO → Standard laravel-vite-plugin only
    │
    Using Vue/React?
    ├── YES → Add framework plugin
    └── NO → Just CSS + JS entry points
```

## Setup Options

| Stack | Plugins Needed |
|-------|----------------|
| Tailwind v4 | `laravel-vite-plugin` + `@tailwindcss/vite` |
| Tailwind v3 | `laravel-vite-plugin` + PostCSS |
| Vue | `laravel-vite-plugin` + `@vitejs/plugin-vue` |
| React | `laravel-vite-plugin` + `@vitejs/plugin-react` |
| Plain JS/CSS | `laravel-vite-plugin` only |

## Blade Directives

| Directive | Use When |
|-----------|----------|
| `@vite(['...'])` | Include CSS/JS assets |
| `@viteReactRefresh` | React Fast Refresh |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |

## Entry Points

| File Type | Default Location |
|-----------|------------------|
| CSS | `resources/css/app.css` |
| JavaScript | `resources/js/app.js` |
| Images | `resources/images/` |

## Asset URLs

| Context | Method |
|---------|--------|
| In Blade | `Vite::asset('resources/images/logo.png')` |
| In CSS | Relative paths work |
| In JS | `import logo from '@/images/logo.png'` |

## Environment Variables

| Location | Prefix | Access |
|----------|--------|--------|
| `.env` | `VITE_` | `import.meta.env.VITE_*` |
| Laravel | None | Not exposed to frontend |

## Common Patterns

| Pattern | Solution |
|---------|----------|
| Page-specific JS | Multiple entry points |
| Vendor split | Vite handles automatically |
| Legacy browsers | `@vitejs/plugin-legacy` |
| PWA | `vite-plugin-pwa` |

## SSR (Server-Side Rendering)

| Setup | Use When |
|-------|----------|
| Inertia SSR | Vue/React with Inertia |
| `@vite` with SSR | Hybrid rendering |

| File | Purpose |
|------|---------|
| `resources/js/ssr.js` | SSR entry point |
| `bootstrap/ssr/` | SSR build output |

## Inertia.js Integration

| Stack | Setup |
|-------|-------|
| Vue + Inertia | `@vitejs/plugin-vue` + `@inertiajs/vue3` |
| React + Inertia | `@vitejs/plugin-react` + `@inertiajs/react` |
| Svelte + Inertia | `@sveltejs/vite-plugin-svelte` |

## CSP (Content Security Policy)

| Directive | Use When |
|-----------|----------|
| `@vite(['...'])` | Standard (auto nonce) |
| `Vite::useCspNonce($nonce)` | Custom CSP nonce |
| `Vite::useScriptTagAttributes([...])` | Custom attributes |

## Hot Reload Config

| Setting | Purpose |
|---------|---------|
| `server.host` | Network access |
| `server.hmr.host` | HMR websocket host |
| `server.https` | HTTPS in dev |

| Environment | Config |
|-------------|--------|
| Docker | Set `VITE_HOST` in `.env` |
| Sail | Auto-configured |
| Homestead | Manual host config |

## File Organization

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite configuration |
| `resources/css/app.css` | Main CSS entry |
| `resources/js/app.js` | Main JS entry |
| `resources/js/ssr.js` | SSR entry (if SSR) |
| `public/build/` | Production output |

→ **Code examples**: See [LayoutComponent.blade.md](templates/LayoutComponent.blade.md)
