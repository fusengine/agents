---
name: laravel-blade
description: Create Blade templates with components, slots, layouts, and directives. Use when building views, reusable components, or templating.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/blade.md, references/views.md, references/localization.md, references/frontend.md, references/vite.md
related-skills: laravel-i18n, laravel-livewire
---

# Laravel Blade Templates

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing Blade patterns
2. **fuse-ai-pilot:research-expert** - Verify Laravel Blade docs via Context7
3. **mcp__context7__query-docs** - Check component and directive patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Blade is Laravel's templating engine with components, slots, layouts, and directives.

---

## Critical Rules

1. **Use components** for reusable UI elements
2. **Never put logic in views** - Use view composers or components
3. **Escape output** - `{{ }}` auto-escapes, `{!! !!}` for raw HTML
4. **Use @vite** for assets, not manual includes

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Blade** | [blade.md](references/blade.md) | Templating syntax |
| **Views** | [views.md](references/views.md) | View rendering |
| **Frontend** | [frontend.md](references/frontend.md) | Frontend setup |
| **Vite** | [vite.md](references/vite.md) | Asset bundling |
| **i18n** | [localization.md](references/localization.md) | Translations |

---

## Quick Reference

```blade
{{-- Component usage --}}
<x-button type="submit" variant="primary">Save</x-button>

{{-- Layout --}}
<x-layouts.app>
    <x-slot:title>Page Title</x-slot:title>
    Content here
</x-layouts.app>

{{-- Directives --}}
@auth ... @endauth
@can('update', $post) ... @endcan
@foreach($items as $item) ... @endforeach
```
