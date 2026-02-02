---
name: entry-points
description: Single and multiple entry point configuration
when-to-use: Page-specific bundles, admin/frontend split
keywords: input, entry, multiple, page-specific, bundles
---

# Entry Points

## Decision Tree

```
Single bundle for all pages?
├── YES → Single entry point
└── NO → Need admin + frontend?
    ├── YES → Multiple named entries
    └── NO → Page-specific?
        ├── YES → Dynamic entries with glob
        └── NO → Single entry is fine
```

## Entry Types

| Type | Use When | Example |
|------|----------|---------|
| **Single** | Simple apps | `'resources/js/app.js'` |
| **Array** | CSS + JS together | `['app.css', 'app.js']` |
| **Multiple** | Admin/frontend split | Separate builds |
| **Dynamic** | Page-specific | Glob patterns |

## Configuration Patterns

| Pattern | Input Format |
|---------|--------------|
| Single string | `input: 'resources/js/app.js'` |
| Array | `input: ['resources/css/app.css', 'resources/js/app.js']` |
| Named (rollup) | `rollupOptions.input: { main, admin }` |

## Blade Usage

| Entry Type | Directive |
|------------|-----------|
| Single | `@vite('resources/js/app.js')` |
| Multiple | `@vite(['resources/css/app.css', 'resources/js/app.js'])` |
| Admin only | `@vite('resources/js/admin.js')` |

## Dynamic Imports

| Method | Use When |
|--------|----------|
| `import()` | Lazy load components |
| `import.meta.glob()` | Load multiple files |
| `import.meta.globEager()` | Eager load (deprecated) |

## Glob Patterns

| Pattern | Matches |
|---------|---------|
| `./Pages/**/*.vue` | All Vue pages |
| `./components/*.js` | Direct children only |
| `!./excluded/**` | Exclude pattern |

## Output Structure

| Build | Location |
|-------|----------|
| Main | `public/build/assets/app-[hash].js` |
| Admin | `public/build/assets/admin-[hash].js` |
| Chunks | `public/build/assets/[name]-[hash].js` |

→ **Code examples**: See [ViteConfigAdvanced.js.md](templates/ViteConfigAdvanced.js.md)
