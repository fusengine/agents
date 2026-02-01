---
name: laravel-livewire
description: Build reactive components with Livewire 4, wire:model, actions, lifecycle hooks, Volt, and Folio. Use when creating interactive UI without JavaScript, forms, or real-time updates.
versions:
  laravel: "12.46"
  livewire: "4.1"
  php: "8.5"
user-invocable: false
references: references/folio.md, references/precognition.md, references/prompts.md, references/reverb.md
related-skills: laravel-blade
---

# Laravel Livewire 3

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing Livewire components
2. **fuse-ai-pilot:research-expert** - Verify Livewire 3 docs via Context7
3. **mcp__context7__query-docs** - Check component and action patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Livewire enables reactive UI without writing JavaScript.

| Feature | Description |
|---------|-------------|
| **Components** | PHP classes with Blade views |
| **wire:model** | Two-way data binding |
| **Actions** | PHP methods called from UI |
| **Volt** | Single-file components |
| **Folio** | File-based routing |

---

## Critical Rules

1. **Use wire:key** in loops for proper DOM diffing
2. **Debounce search** with `wire:model.live.debounce.300ms`
3. **Use computed** for derived data
4. **Dispatch events** for component communication

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Folio** | [folio.md](references/folio.md) | File-based routing |
| **Precognition** | [precognition.md](references/precognition.md) | Live validation |
| **Reverb** | [reverb.md](references/reverb.md) | WebSockets |
| **Prompts** | [prompts.md](references/prompts.md) | CLI prompts |

---

## Quick Reference

```php
// Component
#[Rule('required|min:3')]
public string $title = '';

#[Computed]
public function posts() { ... }

public function create(): void { ... }
```

```blade
{{-- View --}}
<input wire:model.live.debounce.300ms="search">
<button wire:click="create">Save</button>
```
