---
name: laravel-livewire
description: Livewire 4 reactive components on Laravel 13 - wire:model, actions, events, Volt, Folio. Use when building reactive UI without JavaScript.
versions:
  laravel: "13.0"
  livewire: "4.4"
  php: "8.3"
user-invocable: true
references: references/components.md, references/wire-directives.md, references/lifecycle.md, references/forms-validation.md, references/events.md, references/alpine-integration.md, references/file-uploads.md, references/nesting.md, references/loading-states.md, references/navigation.md, references/testing.md, references/security.md, references/volt.md, references/folio.md, references/precognition.md, references/reverb.md, references/templates/BasicComponent.php.md, references/templates/FormComponent.php.md, references/templates/VoltComponent.blade.md, references/templates/DataTableComponent.php.md, references/templates/FileUploadComponent.php.md, references/templates/NestedComponents.php.md, references/templates/ComponentTest.php.md
related-skills: laravel-blade, laravel-testing, laravel-api
---

<objective>
Covers Livewire 4 on Laravel 13: reactive class-based components with Blade
views, wire:model two-way binding and its modifiers (.blur, .live,
.debounce), actions, component lifecycle hooks, forms/validation, events
(dispatch/listen), Alpine.js integration ($wire, @entangle), file uploads,
component nesting, loading states, SPA navigation, testing, security
(auth/rate limiting), and the Volt (single-file components) and Folio
(file-based routing) sub-features, including Precognition live validation
and Reverb WebSocket integration.
</objective>

# Laravel Livewire

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Check existing Livewire components
2. **fuse-ai-pilot:research-expert** - Verify Livewire 4 patterns via Context7
3. **mcp__context7__query-docs** - Check specific Livewire features

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **Components** | Reactive PHP classes with Blade views |
| **wire:model** | Two-way data binding |
| **Actions** | Call PHP methods from frontend |
| **Events** | Component communication |
| **Volt** | Single-file components |
| **Folio** | File-based routing |

---

## Critical Rules

1. **Always use wire:key** in loops
2. **Use wire:model.live.blur** for live validation (Livewire 4.1+: plain `.blur` only syncs client state), not .live everywhere
3. **Debounce search inputs** with .debounce.300ms
4. **#[Locked]** for sensitive IDs
5. **authorize()** in destructive actions
6. **protected methods** for internal logic

---

## Decision Guide

### Component Type

```
Component choice?
├── Complex logic → Class-based component
├── Simple page → Volt functional API
├── Medium complexity → Volt class-based
├── Quick embed → @volt inline
└── File-based route → Folio + Volt
```

### Data Binding

```
Binding type?
├── Form fields (live validation) → wire:model.live.blur
├── Search input → wire:model.live.debounce.300ms
├── Checkbox/toggle → wire:model.live
├── Select → wire:model
└── No sync → Local Alpine x-data
```

---

## Reference Guide

### Core Concepts (WHY & Architecture)

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Components** | [components.md](references/components.md) | Creating components |
| **Wire Directives** | [wire-directives.md](references/wire-directives.md) | Data binding, events |
| **Lifecycle** | [lifecycle.md](references/lifecycle.md) | Hooks, mount, hydrate |
| **Forms** | [forms-validation.md](references/forms-validation.md) | Validation, form objects |
| **Events** | [events.md](references/events.md) | Dispatch, listen |
| **Alpine** | [alpine-integration.md](references/alpine-integration.md) | $wire, @entangle |
| **File Uploads** | [file-uploads.md](references/file-uploads.md) | Upload handling |
| **Nesting** | [nesting.md](references/nesting.md) | Parent-child |
| **Loading** | [loading-states.md](references/loading-states.md) | wire:loading, lazy |
| **Navigation** | [navigation.md](references/navigation.md) | SPA mode |
| **Testing** | [testing.md](references/testing.md) | Component tests |
| **Security** | [security.md](references/security.md) | Auth, rate limit |
| **Volt** | [volt.md](references/volt.md) | Single-file components |

### Advanced Features

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Folio** | [folio.md](references/folio.md) | File-based routing |
| **Precognition** | [precognition.md](references/precognition.md) | Live validation |
| **Reverb** | [reverb.md](references/reverb.md) | WebSockets |

### Templates (Complete Code)

| Template | When to Use |
|----------|-------------|
| [BasicComponent.php.md](references/templates/BasicComponent.php.md) | Standard component |
| [FormComponent.php.md](references/templates/FormComponent.php.md) | Form with validation |
| [VoltComponent.blade.md](references/templates/VoltComponent.blade.md) | Volt patterns |
| [DataTableComponent.php.md](references/templates/DataTableComponent.php.md) | Table with search/sort |
| [FileUploadComponent.php.md](references/templates/FileUploadComponent.php.md) | File uploads |
| [NestedComponents.php.md](references/templates/NestedComponents.php.md) | Parent-child |
| [ComponentTest.php.md](references/templates/ComponentTest.php.md) | Testing patterns |

---

## Quick Reference

### Basic Component

```php
class Counter extends Component
{
    public int $count = 0;

    public function increment(): void
    {
        $this->count++;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

### Volt Functional

```php
<?php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn() => $this->count++;
?>

<button wire:click="increment">{{ $count }}</button>
```

### Wire Directives

```blade
<input wire:model.live.blur="email">
<input wire:model.live.debounce.300ms="search">
<button wire:click="save" wire:loading.attr="disabled">Save</button>
```

---

## Best Practices

### DO
- Use wire:key in @foreach loops
- Debounce search/filter inputs
- Use Form Objects for reusable logic
- Test with Livewire::test()
- #[Locked] for IDs, #[Computed] for derived data

### DON'T
- wire:model.live on every field
- Query in render() method
- Forget authorization in actions
- Skip wire:key in loops
- Store sensitive data in public properties

---

## Laravel 13 Notes

### Livewire 4 on Laravel 13
Livewire 4 (current 4.4) is the current major, used by the L13 Livewire starter kit. Key points:

- Livewire 4 requirements: PHP 8.1+ / Laravel 10+ (Laravel 13 requires PHP 8.3 anyway)
- `#[Locked]`, `#[Computed]`, `#[On]` still supported
- Native single-file / multi-file components (`make_command.type` = `sfc` by default); Volt stays on 1.x (current 1.11), Folio on 1.x (current 1.2)
- Pages: `Route::livewire('/dashboard', Dashboard::class)` is now the recommended method (mandatory for single/multi-file components)
- Hashed endpoints: `/livewire-{hash}/update` (derived from `APP_KEY`) instead of `/livewire/update` — update firewall/CDN/middleware rules that target `/livewire/`
- `wire:model.live`: parallel requests; `wire:poll` is non-blocking

### Migrating from Livewire 3
- `composer require livewire/livewire:^4.0` then `php artisan optimize:clear`
- Renamed config: `layout` → `component_layout` (`layouts::app`), `lazy_placeholder` → `component_placeholder`; `smart_wire_keys` = `true` by default
- **4.1+**: `.blur` / `.change` also control client-side sync → for the old behavior (network request on blur) write `wire:model.live.blur`
- `wire:model` ignores events from children (add `.deep` if needed); `<livewire:x />` tags must be closed
- `wire:transition` uses the View Transitions API (modifiers removed); `wire:scroll` → `wire:navigate:scroll`
- `$this->stream()`: `to:` renamed `el:`; `$wire.$js('name', fn)` deprecated → `$wire.$js.name = fn`
- `wire:poll.5s`, `$this->dispatch('event')`, Form Objects (`#[\Livewire\Attributes\Validate]`) → unchanged
