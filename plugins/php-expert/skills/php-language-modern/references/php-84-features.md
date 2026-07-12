---
name: php-84-features
description: PHP 8.4 language additions — property hooks, asymmetric visibility, lazy objects, #[\Deprecated], parenthesis-free new chaining
when-to-use: Load when the project targets PHP 8.4+ and you need computed properties, restricted setters, or deferred initialization
keywords: php 8.4, property hooks, virtual property, asymmetric visibility, lazy objects, newLazyGhost, Deprecated attribute
priority: high
related: php-85-features.md
---

# PHP 8.4 Features

## Overview

PHP 8.4 (released Nov 2024) is the big OOP release: property hooks and asymmetric visibility remove most getter/setter boilerplate. Source: php.net/manual/en/migration84.new-features.php.

---

## Key Additions

| Feature | What it does |
|---------|--------------|
| **Property hooks** | `get`/`set` logic on a property; may be virtual (no backing value) |
| **Asymmetric visibility** | `public private(set)` — read/write visibility set independently |
| **Lazy objects** | `ReflectionClass::newLazyGhost($init)` defers initialization until access |
| **`#[\Deprecated]`** | Native attribute to deprecate functions/methods/class constants |
| **`new Foo()->bar()`** | Chain off `new` without wrapping parentheses |
| **`request_parse_body()`** | Parse RFC1867 multipart bodies in non-POST requests |

---

## Property Hooks

```php
class Person
{
    // Virtual — computed, cannot be set.
    public string $fullName {
        get => $this->first . ' ' . $this->last;
    }

    // Interception — transforms on write, normal backing storage.
    public string $first {
        set => ucfirst(strtolower($value));
    }
}
```

Replaces `__get`/`__set` magic and most explicit getter/setter pairs.

→ See [modern-class.md](templates/modern-class.md) for hooks + validation

---

## Asymmetric Visibility

```php
class Example
{
    // Public read, private write. get-visibility must not be narrower than set.
    public private(set) string $id;
}
```

Ideal for entities whose identity is public but immutable from outside.

---

## Lazy Objects

```php
$reflector = new ReflectionClass(Service::class);
$service = $reflector->newLazyGhost(static function (Service $ghost): void {
    $ghost->__construct(loadExpensiveDeps());
});
// Deps resolved only on first property/method access.
```

Used by DI containers/ORMs to defer expensive construction.

---

## Chaining new Without Parentheses

```php
// 8.4+
$name = new ReflectionClass($obj)->getName();
// Pre-8.4 required: (new ReflectionClass($obj))->getName()
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing `__get`/`__set` for computed props | Use property hooks |
| Public property with manual "readonly-ish" guard | Use `public private(set)` |
| Eager construction in DI for heavy services | Use `newLazyGhost()` |

---

## Related References

- [php-85-features.md](php-85-features.md) - Static aviz + pipe operator build on this
