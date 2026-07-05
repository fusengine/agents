---
name: php-81-83-baseline
description: PHP 8.1–8.3 features every modern codebase relies on — enums, readonly, first-class callables, fibers, #[\Override]
when-to-use: Load when writing PHP for any project on 8.1+ (the common floor); these are the features LLMs still skip in favor of pre-8.0 style
keywords: php 8.1, php 8.2, php 8.3, enum, readonly class, first-class callable, fibers, Override, typed constants
priority: high
related: php-84-features.md, attributes-over-docblocks.md
---

# PHP 8.1–8.3 Baseline

## Overview

These features form the floor of modern PHP. They are well-established and stable across 8.1, 8.2, and 8.3. Confirm the exact minimum with `composer.json` `require.php`, then verify any borderline syntax on php.net.

---

## Feature Map

| Feature | Version | Replaces |
|---------|---------|----------|
| **Enums** (pure + backed) | 8.1 | Class constants for closed sets |
| **Enums with methods/interfaces** | 8.1 | Ad-hoc value+label maps |
| **First-class callable syntax** `f(...)` | 8.1 | `'strlen'`, `[$obj, 'm']`, `Closure::fromCallable` |
| **`readonly` properties** | 8.1 | Manual immutability guards |
| **Fibers** | 8.1 | Callback-based async primitives |
| **`never` return type** | 8.1 | Undocumented always-throw/exit |
| **`readonly` classes** | 8.2 | Per-property `readonly` repetition |
| **DNF types** `(A&B)\|null` | 8.2 | Loose `mixed` on intersections |
| **Typed class constants** | 8.3 | Untyped `const` |
| **`#[\Override]`** | 8.3 | Silent broken inheritance |
| **`json_validate()`** | 8.3 | `json_decode` + error check to test validity |

---

## Backed Enum With Behavior

```php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Live',
        };
    }
}
```

Enums may implement interfaces and hold constants. Prefer them over `const` groups.

→ See [modern-class.md](templates/modern-class.md) for a full enum + interface

---

## First-Class Callables

```php
$lengths = array_map(strlen(...), $words);   // not 'strlen'
$handler = $this->handle(...);               // not [$this, 'handle']
```

---

## readonly Class + #[\Override]

```php
readonly class Coordinates
{
    public function __construct(public float $lat, public float $lng) {}
}

class ChildController extends BaseController
{
    #[\Override]
    public function handle(): Response { /* ... */ }  // errors if parent has no handle()
}
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| String/array callables | Use `f(...)` first-class syntax |
| Class constants for value sets | Use backed enums |
| Untyped class constants on 8.3+ | Add the type |
| Overriding without `#[\Override]` | Add it to catch signature drift |

---

## Related References

- [attributes-over-docblocks.md](attributes-over-docblocks.md) - Native attributes since 8.0 replace annotations
- [php-84-features.md](php-84-features.md) - The next tier of OOP features
