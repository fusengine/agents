---
name: slots-attributes
description: Content injection and attribute pass-through decisions
when-to-use: Building flexible, reusable components
keywords: slots, attributes, x-slot, merge, class, props
---

# Slots & Attributes

## Decision Tree - Slots

```
Component needs multiple content areas?
├── YES → Named slots (<x-slot:name>)
└── NO → Default slot ($slot)
    │
    Slot needs attributes?
    ├── YES → <x-slot:name class="...">
    └── NO → Simple content
```

## Decision Tree - Attributes

```
Need to accept HTML attributes?
├── YES → Use $attributes
│   │
│   Need default classes?
│   ├── YES → $attributes->merge()
│   └── NO → {{ $attributes }}
└── NO → Just use @props
```

## Slot Types

| Type | Use When | Template |
|------|----------|----------|
| **Default** | Single content area | [AnonymousComponent.blade.md](templates/AnonymousComponent.blade.md) |
| **Named** | Header/body/footer pattern | [CardWithSlots.blade.md](templates/CardWithSlots.blade.md) |
| **Scoped** | Pass data back to parent | [CardWithSlots.blade.md](templates/CardWithSlots.blade.md) |

## Attribute Methods

| Method | Use When |
|--------|----------|
| `{{ $attributes }}` | Render all attributes |
| `$attributes->merge([...])` | Add defaults, allow overrides |
| `$attributes->class([...])` | Conditional CSS classes |
| `$attributes->only(['id'])` | Filter specific attributes |
| `$attributes->except(['class'])` | Exclude attributes |
| `$attributes->has('wire:model')` | Check attribute exists |
| `$attributes->get('id', 'default')` | Get with fallback |

## Slot Methods

| Method | Use When |
|--------|----------|
| `$slot->isEmpty()` | Hide wrapper if empty |
| `$slot->isNotEmpty()` | Show only with content |
| `$header->attributes` | Access slot's attributes |

## @props vs $attributes

| Declared in @props | Behavior |
|--------------------|----------|
| YES | Becomes variable, removed from $attributes |
| NO | Stays in $attributes for pass-through |

## Common Patterns

| Pattern | Solution | Template |
|---------|----------|----------|
| Card with header/footer | Named slots | [CardWithSlots.blade.md](templates/CardWithSlots.blade.md) |
| Button with merged classes | `$attributes->merge()` | [FormComponent.blade.md](templates/FormComponent.blade.md) |
| Conditional wrapper | `$slot->isNotEmpty()` | [LayoutComponent.blade.md](templates/LayoutComponent.blade.md) |
| Form input pass-through | `{{ $attributes }}` | [FormComponent.blade.md](templates/FormComponent.blade.md) |

→ **Code examples**: See templates/
