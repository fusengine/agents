---
name: advanced-components
description: Advanced component patterns and features
when-to-use: Nested components, conditional rendering, index components
keywords: aware, shouldRender, index, namespacing, nested
---

# Advanced Components

## Decision Tree - Data Flow

```
Need parent component data in child?
├── YES → @aware(['color'])
└── NO → Use @props normally
```

## Decision Tree - Conditional Render

```
Component should hide based on logic?
├── YES → shouldRender() in class
└── NO → Always render
```

## @aware - Parent Data Access

| Use When | Purpose |
|----------|---------|
| Menu → MenuItem | Child inherits menu color |
| Accordion → AccordionItem | Child knows parent state |
| Tabs → TabPanel | Child knows active tab |
| Card → CardHeader | Child inherits card style |

| vs @props | @aware |
|-----------|--------|
| Declared props | Inherited from parent |
| Passed explicitly | Passed implicitly |
| Required in usage | Automatic |

## shouldRender() Method

| Use When | Purpose |
|----------|---------|
| Alert with no message | Hide completely |
| Feature flag component | Show based on flag |
| Permission-based UI | Hide unauthorized |
| Empty state | Hide wrapper |

| Returns | Result |
|---------|--------|
| `true` | Component renders |
| `false` | Component hidden (no HTML) |

## Index Components

| Structure | Usage |
|-----------|-------|
| `components/card/index.blade.php` | `<x-card>` |
| `components/form/index.blade.php` | `<x-form>` |
| `components/modal/index.blade.php` | `<x-modal>` |

| Benefit | Description |
|---------|-------------|
| Cleaner structure | Related files together |
| Same usage | No change in templates |
| Sub-components | `card/header.blade.php` → `<x-card.header>` |

## Component Namespacing

| Scope | Registration | Usage |
|-------|--------------|-------|
| Package | `Blade::anonymousComponentPath(path, 'pkg')` | `<x-pkg::button>` |
| Module | `Blade::componentNamespace('Namespace', 'module')` | `<x-module::alert>` |

## Render Conditions

| Method | Use When |
|--------|----------|
| `shouldRender()` | Class component |
| `@if` in template | Anonymous component |
| `@props` + check | Props-based condition |

## Component Accessors

| Property | Purpose |
|----------|---------|
| `$component->data` | All component data |
| `$component->name` | Component name |
| `$component->attributes` | Attribute bag |
| `$component->slot` | Default slot |

## Nested Component Patterns

| Pattern | Use When |
|---------|----------|
| Parent passes `$color` | All children need same style |
| Child uses `@aware` | Inherit without explicit pass |
| Scoped slots | Child passes data to parent |

→ **Code examples**: See [templates/AdvancedComponents.blade.md](templates/AdvancedComponents.blade.md)
