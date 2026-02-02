---
name: assets
description: Images, fonts, and static file handling
when-to-use: Managing static assets in Vite
keywords: images, fonts, static, public, assets
---

# Assets

## Decision Tree

```
Asset needs versioning/processing?
├── YES → Place in resources/, use Vite
└── NO → Place in public/, use absolute path
```

## Asset Locations

| Location | Processed | Use When |
|----------|-----------|----------|
| `resources/` | YES | Images, fonts bundled |
| `public/` | NO | Favicon, robots.txt |

## Import Methods

| Context | Method |
|---------|--------|
| Blade | `Vite::asset('resources/images/logo.png')` |
| CSS | Relative path `url(../images/logo.png)` |
| JS | `import logo from '@/images/logo.png'` |

## URL Types

| Type | Example | Result |
|------|---------|--------|
| Relative | `../images/logo.png` | Processed, versioned |
| Absolute | `/images/logo.png` | NOT processed |
| Import | `import logo from '...'` | Returns URL string |

## Asset Types

| Type | Handling |
|------|----------|
| Images | Inlined if < 4KB, else URL |
| Fonts | Always URL reference |
| JSON | Imported as object |
| SVG | Inline or URL |
| WASM | URL reference |

## Static Copy

| Need | Solution |
|------|----------|
| Copy files to build | `vite-plugin-static-copy` |
| Keep public structure | Place in `public/` |

## Inline Limit

| Setting | Default |
|---------|---------|
| `build.assetsInlineLimit` | 4096 bytes |

## Public Directory

| File | Access |
|------|--------|
| `public/favicon.ico` | `/favicon.ico` |
| `public/images/logo.png` | `/images/logo.png` |

→ **Code examples**: See [ViteConfig.js.md](templates/ViteConfig.js.md)
