---
name: php-85-features
description: PHP 8.5 language additions — pipe operator, clone() function, #[\NoDiscard], static asymmetric visibility, closures in constant expressions
when-to-use: Load when the project targets PHP 8.5+ and you need pipe chains, immutable clone updates, or return-value enforcement
keywords: php 8.5, pipe operator, clone, NoDiscard, void cast, asymmetric visibility static, constant expressions
priority: high
related: php-84-features.md
---

# PHP 8.5 Features

## Overview

PHP 8.5 (released Nov 2025) refines the OOP + expression system. Source: php.net/manual/en/migration85.new-features.php.

---

## Key Additions

| Feature | What it does |
|---------|--------------|
| **Pipe operator `\|>`** | Passes the left value as the single argument to the right callable |
| **`clone()` function** | `clone` is now a function; `$withProperties` reassigns properties (incl. `readonly`) during clone |
| **`#[\NoDiscard]`** | Marks a return value that must be consumed; `(void)` cast silences it intentionally |
| **Static asymmetric visibility** | `private(set)` etc. now allowed on `static` properties |
| **Closures in constant expressions** | Closures + first-class callables allowed in attribute args, property/param defaults, constants |
| **Casts in constant expressions** | `const T = (int) 0.3;` now compiles |
| **Attributes on constants** | `#[\Deprecated] const FOO = 1;` — attributes on non-class `const` |
| **`#[\Override]` on properties** | Override attribute now applies to properties, not just methods |
| **`#[\DelayedTargetValidation]`** | Defers attribute-target errors to `newInstance()` runtime |

---

## Pipe Operator

```php
// Chains left-to-right; each step receives the previous result.
$result = "Hello World"
    |> trim(...)
    |> strlen(...);   // 11
```

Right side must be a callable — use first-class callable syntax `fn(...)`.

→ See [modern-class.md](templates/modern-class.md) for pipe + clone() in context

---

## clone() with $withProperties

```php
final class Point
{
    public function __construct(
        public readonly int $x,
        public readonly int $y,
    ) {}
}

$a = new Point(1, 2);
$b = clone($a, ['x' => 10]); // readonly reassigned only during clone
```

Replaces the `readonly`-clone workaround (manual `__clone` + reflection).

---

## #[\NoDiscard]

```php
#[\NoDiscard]
function query(string $sql): Result { /* ... */ }

query($sql);          // Warning: return value should be used
(void) query($sql);   // OK — explicitly discarded
$r = query($sql);     // OK — consumed
```

Use on methods whose result is the whole point (builders returning `$this` are the exception — do not annotate those).

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `\|>` with a non-callable right side | Right side must be `f(...)` or a closure |
| `clone $obj` then mutating readonly | Use `clone($obj, [...])` |
| Emitting 8.5 syntax on 8.4 project | Check `require.php` first |

---

## Related References

- [php-84-features.md](php-84-features.md) - Property hooks + aviz introduced one version earlier
