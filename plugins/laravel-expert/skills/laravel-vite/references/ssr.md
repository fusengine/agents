---
name: ssr
description: Server-side rendering configuration
when-to-use: SEO requirements, fast first paint
keywords: ssr, server-side, rendering, inertia
---

# SSR (Server-Side Rendering)

## Decision Tree

```
Need SEO for dynamic content?
├── YES → Using Inertia?
│   ├── YES → Inertia SSR
│   └── NO → Consider Inertia or Livewire
└── NO → Need fast first paint?
    ├── YES → SSR beneficial
    └── NO → Client-side is fine
```

## SSR vs CSR

| Aspect | SSR | CSR |
|--------|-----|-----|
| First paint | Fast | Slower |
| SEO | Excellent | Limited |
| Server load | Higher | Lower |
| Complexity | Higher | Lower |
| Interactivity | After hydration | Immediate |

## Vite SSR Config

| Option | Purpose |
|--------|---------|
| `ssr` | SSR entry point |
| `ssrOutputDirectory` | SSR build output |

## File Structure

| File | Purpose |
|------|---------|
| `resources/js/app.js` | Client entry |
| `resources/js/ssr.js` | SSR entry |
| `bootstrap/ssr/` | SSR build output |

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build client + SSR |
| `php artisan inertia:start-ssr` | Start SSR server |
| `php artisan inertia:stop-ssr` | Stop SSR server |

## Inertia SSR

| Framework | Package |
|-----------|---------|
| Vue | `@inertiajs/vue3` |
| React | `@inertiajs/react` |
| Svelte | `@inertiajs/svelte` |

## SSR Considerations

| Aspect | Note |
|--------|------|
| Window/document | Not available in SSR |
| Browser APIs | Wrap in `onMounted` |
| State | Hydration must match |
| Memory | Monitor server usage |

## Deployment

| Step | Action |
|------|--------|
| Build | `npm run build` |
| Start | `php artisan inertia:start-ssr` |
| Process manager | Use PM2 or Supervisor |

→ **Code examples**: See [SSRSetup.md](templates/SSRSetup.md)
