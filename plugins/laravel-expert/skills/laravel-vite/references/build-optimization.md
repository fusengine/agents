---
name: build-optimization
description: Chunks, minification, tree-shaking, source maps
when-to-use: Optimizing production build size and performance
keywords: chunks, minify, tree-shaking, sourcemap, optimization
---

# Build Optimization

## Decision Tree

```
Large vendor bundle?
├── YES → Configure manualChunks
└── NO → Bundle size > 500KB?
    ├── YES → Enable code splitting
    └── NO → Default config is fine
```

## Build Options

| Option | Purpose | Default |
|--------|---------|---------|
| `outDir` | Output directory | `public/build` |
| `manifest` | Generate manifest | `true` |
| `sourcemap` | Source maps | `false` |
| `minify` | Minification | `'esbuild'` |
| `target` | Browser target | `'modules'` |

## Minification

| Engine | Speed | Size | Config |
|--------|-------|------|--------|
| esbuild | Fast | Good | Default |
| terser | Slow | Best | `minify: 'terser'` |

## Terser Options

| Option | Purpose |
|--------|---------|
| `compress.drop_console` | Remove console.log |
| `compress.drop_debugger` | Remove debugger |
| `mangle` | Shorten names |

## Chunk Splitting

| Strategy | Use When |
|----------|----------|
| `manualChunks` object | Known vendors |
| `manualChunks` function | Dynamic logic |
| Default | Let Vite decide |

## Common Chunks

| Chunk | Contents |
|-------|----------|
| `vendor` | All node_modules |
| `vendor-vue` | Vue ecosystem |
| `vendor-ui` | UI libraries |
| `components` | App components |

## Output Naming

| Type | Pattern |
|------|---------|
| Entry | `[name]-[hash].js` |
| Chunk | `[name]-[hash].js` |
| Asset | `[name]-[hash].[ext]` |

## Source Maps

| Value | Use When |
|-------|----------|
| `true` | Development |
| `false` | Production (no debug) |
| `'hidden'` | Production (error tracking) |
| `'inline'` | Development (fast) |

## Size Limits

| Setting | Default |
|---------|---------|
| `chunkSizeWarningLimit` | 500 KB |

→ **Code examples**: See [ViteConfigAdvanced.js.md](templates/ViteConfigAdvanced.js.md)
