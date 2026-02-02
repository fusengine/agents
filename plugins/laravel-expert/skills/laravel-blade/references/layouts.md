---
name: layouts
description: Page layout strategy selection
when-to-use: Structuring page templates and reusable shells
keywords: layouts, extends, section, yield, component-layout
---

# Layouts

## Decision Tree

```
Need fine-grained sections (@yield)?
├── YES → Template inheritance (@extends)
└── NO → Component layout (<x-layout>) ← RECOMMENDED
    │
    Need multiple stacks (scripts, styles)?
    ├── YES → @stack/@push in either approach
    └── NO → Simple component layout
```

## Layout Approaches

| Approach | Use When | Template |
|----------|----------|----------|
| **Component** `<x-layout>` | Modern apps, simple structure | [LayoutComponent.blade.md](templates/LayoutComponent.blade.md) |
| **Inheritance** `@extends` | Complex sections, legacy apps | [LayoutComponent.blade.md](templates/LayoutComponent.blade.md) |

## Comparison

| Feature | Component | Inheritance |
|---------|-----------|-------------|
| Syntax | `<x-layout>` | `@extends('layout')` |
| Content areas | Named slots | `@section/@yield` |
| Props | `<x-layout title="...">` | `@section('title', '...')` |
| Default content | `{{ $header ?? '' }}` | `@yield('header')` |
| Extensibility | Composition | `@parent` directive |

## Key Directives

| Directive | Purpose | Used In |
|-----------|---------|---------|
| `@yield('name')` | Placeholder for section | Layout file |
| `@yield('name', 'default')` | With default value | Layout file |
| `@section('name')...@endsection` | Define content | Page file |
| `@section('name', 'value')` | Short syntax | Page file |
| `@parent` | Include parent's content | Page file |
| `@stack('name')` | Stack placeholder | Layout file |
| `@push('name')` | Add to stack | Page file |
| `@prepend('name')` | Prepend to stack | Page file |

## File Organization

| File | Location | Purpose |
|------|----------|---------|
| App layout | `components/layouts/app.blade.php` | Main shell |
| Guest layout | `components/layouts/guest.blade.php` | Auth pages |
| Admin layout | `components/layouts/admin.blade.php` | Dashboard |
| Page | `pages/dashboard.blade.php` | Uses layout |

## Common Patterns

| Pattern | Solution |
|---------|----------|
| Page title | Prop: `<x-layout title="Dashboard">` |
| Meta tags | Named slot: `<x-slot:meta>` |
| Scripts at end | Stack: `@push('scripts')` |
| Breadcrumbs | Named slot: `<x-slot:breadcrumb>` |
| Sidebar | Named slot or prop |

→ **Code examples**: See [LayoutComponent.blade.md](templates/LayoutComponent.blade.md)
