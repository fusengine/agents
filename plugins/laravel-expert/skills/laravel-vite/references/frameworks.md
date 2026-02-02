---
name: frameworks
description: Vue, React, Svelte integration with Vite
when-to-use: Setting up JavaScript framework with Laravel
keywords: vue, react, svelte, inertia, framework
---

# Framework Integration

## Decision Tree

```
Which framework?
├── Vue → @vitejs/plugin-vue
├── React → @vitejs/plugin-react
├── Svelte → @sveltejs/vite-plugin-svelte
└── None → Plain JS
```

## Installation

| Framework | Packages |
|-----------|----------|
| Vue | `vue @vitejs/plugin-vue` |
| Vue + Inertia | `+ @inertiajs/vue3` |
| React | `react react-dom @vitejs/plugin-react` |
| React + Inertia | `+ @inertiajs/react` |
| Svelte | `svelte @sveltejs/vite-plugin-svelte` |

## Plugin Options

### Vue

| Option | Purpose |
|--------|---------|
| `template.transformAssetUrls` | Asset URL handling |
| `script.defineModel` | Enable defineModel |
| `script.propsDestructure` | Props destructure |

### React

| Option | Purpose |
|--------|---------|
| `fastRefresh` | Fast Refresh (default: true) |
| `jsxRuntime` | 'automatic' or 'classic' |
| `babel` | Babel config |

### Svelte

| Option | Purpose |
|--------|---------|
| `compilerOptions` | Svelte compiler |
| `preprocess` | Preprocessors |

## Blade Directives

| Framework | Directive |
|-----------|-----------|
| Vue | `@vite('resources/js/app.js')` |
| React | `@viteReactRefresh` + `@vite(...)` |
| Svelte | `@vite('resources/js/app.js')` |

## TypeScript Support

| Framework | Config |
|-----------|--------|
| Vue | `vue-tsc` for type checking |
| React | Built-in with tsconfig |
| Svelte | `svelte-check` |

## Inertia Integration

| Step | Purpose |
|------|---------|
| Install adapter | Framework-specific |
| Create app entry | Initialize Inertia |
| Configure resolvePageComponent | Page loading |

→ **Code examples**: See [InertiaSetup.md](templates/InertiaSetup.md)
