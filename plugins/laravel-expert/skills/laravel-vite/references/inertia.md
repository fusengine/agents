---
name: inertia
description: Inertia.js SPA integration with Laravel and Vite
when-to-use: Building SPA without API using Vue/React
keywords: inertia, spa, vue, react, single-page, routing
---

# Inertia.js

## Decision Tree

```
Need SPA with Laravel?
├── YES → API-driven (REST/GraphQL)?
│   ├── YES → Traditional SPA (separate frontend)
│   └── NO → Inertia.js ✓
└── NO → Traditional Blade + Livewire
```

## When to Use

| Scenario | Use Inertia? |
|----------|--------------|
| SPA without building API | ✅ YES |
| Server-side routing, client rendering | ✅ YES |
| Laravel controllers + JS components | ✅ YES |
| Need SEO (with SSR) | ✅ YES |
| Separate API for mobile app | ❌ NO |
| Already have REST API | ❌ NO |

## Framework Choice

| Framework | When to Choose |
|-----------|----------------|
| **Vue + Inertia** | Team knows Vue, simpler reactivity |
| **React + Inertia** | Team knows React, larger ecosystem |
| **Svelte + Inertia** | Smaller bundle, less boilerplate |

## Installation

| Package | Command |
|---------|---------|
| Laravel adapter | `composer require inertiajs/inertia-laravel` |
| Vue adapter | `npm install @inertiajs/vue3` |
| React adapter | `npm install @inertiajs/react` |

## Key Components

| Component | Purpose |
|-----------|---------|
| `Inertia::render()` | Return page from controller |
| `<Link>` | Client-side navigation |
| `<Head>` | Manage page title/meta |
| `usePage()` | Access shared data |
| `useForm()` | Form handling with validation |

## Shared Data

| Method | Use For |
|--------|---------|
| `HandleInertiaRequests` middleware | Global shared data |
| `Inertia::share()` | Conditional sharing |
| Flash messages | `$request->session()->flash()` |

## Navigation

| Feature | Method |
|---------|--------|
| Link component | `<Link href="/users">` |
| Programmatic | `router.visit('/users')` |
| Replace history | `router.visit(url, { replace: true })` |
| Preserve scroll | `router.visit(url, { preserveScroll: true })` |
| Preserve state | `router.visit(url, { preserveState: true })` |

## Forms

| Feature | Method |
|---------|--------|
| Create form | `const form = useForm({ name: '' })` |
| Submit | `form.post('/users')` |
| Processing state | `form.processing` |
| Errors | `form.errors.name` |
| Reset | `form.reset()` |
| Transform | `form.transform(data => ...)` |

## Server-Side Rendering

| Need SEO? | Action |
|-----------|--------|
| YES | Enable SSR → See [SSRSetup.md](templates/SSRSetup.md) |
| NO | CSR is sufficient |

## File Structure

| Directory | Content |
|-----------|---------|
| `resources/js/Pages/` | Page components |
| `resources/js/Layouts/` | Layout components |
| `resources/js/Components/` | Reusable components |
| `resources/views/app.blade.php` | Root template |

## Common Patterns

| Pattern | Reference |
|---------|-----------|
| Page component | [InertiaSetup.md](templates/InertiaSetup.md) |
| Form handling | [InertiaSetup.md](templates/InertiaSetup.md) |
| Shared data | [InertiaSetup.md](templates/InertiaSetup.md) |
| SSR configuration | [SSRSetup.md](templates/SSRSetup.md) |

→ **Complete setup**: See [InertiaSetup.md](templates/InertiaSetup.md)
→ **SSR configuration**: See [SSRSetup.md](templates/SSRSetup.md)
