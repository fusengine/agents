---
name: components
description: Component type selection and architecture decisions
when-to-use: Choosing between anonymous and class-based components
keywords: components, class-based, anonymous, props, artisan
---

# Blade Components

## Decision Tree

```
Need dependency injection?
├── YES → Class-based component
└── NO → Need computed properties?
    ├── YES → Class-based component
    └── NO → Anonymous component (default)
```

## Component Types

| Type | Use When | Template |
|------|----------|----------|
| **Anonymous** | Simple UI, no logic | [AnonymousComponent.blade.md](templates/AnonymousComponent.blade.md) |
| **Class-based** | DI, services, computed props | [ClassComponent.php.md](templates/ClassComponent.php.md) |
| **Dynamic** | Runtime component selection | [DynamicComponent.blade.md](templates/DynamicComponent.blade.md) |

## When to Use What

| Scenario | Type | Why |
|----------|------|-----|
| Button, card, alert | Anonymous | No logic needed |
| User avatar with API call | Class-based | Needs service injection |
| Form field based on type | Dynamic | Runtime selection |
| Layout wrapper | Anonymous | Just slots |
| Stats with calculations | Class-based | Computed properties |

## Artisan Commands

| Action | Command |
|--------|---------|
| Create anonymous | `php artisan make:component alert --view` |
| Create class-based | `php artisan make:component Alert` |
| Create nested | `php artisan make:component Form/Input --view` |

## File Locations

| Type | PHP Class | Blade View |
|------|-----------|------------|
| Anonymous | None | `resources/views/components/` |
| Class-based | `app/View/Components/` | `resources/views/components/` |
| Nested | `app/View/Components/Form/` | `resources/views/components/form/` |

## Usage Syntax

| Component Location | Usage |
|-------------------|-------|
| `components/alert.blade.php` | `<x-alert />` |
| `components/form/input.blade.php` | `<x-form.input />` |
| `components/card/index.blade.php` | `<x-card />` |
| Package component | `<x-package::button />` |

## Key Concepts

| Concept | Purpose | See |
|---------|---------|-----|
| `@props` | Declare expected props | [slots-attributes.md](slots-attributes.md) |
| `$attributes` | Pass-through HTML attrs | [slots-attributes.md](slots-attributes.md) |
| `$slot` | Default content area | [slots-attributes.md](slots-attributes.md) |
| `shouldRender()` | Conditional rendering | [ClassComponent.php.md](templates/ClassComponent.php.md) |

→ **Code examples**: See templates/
