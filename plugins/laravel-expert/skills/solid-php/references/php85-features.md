---
name: php85-features
description: PHP 8.5 features for Laravel development
when-to-use: Using readonly classes, constructor promotion, pipe operator, strict types
keywords: php85, readonly, constructor-promotion, pipe-operator, strict-types
priority: medium
related: solid-principles.md, laravel12-structure.md
---

# PHP 8.5 Features

## Pipe Operator

```php
// ❌ Old style
$result = array_sum(array_filter(array_map(fn($x) => $x * 2, $data)));

// ✅ PHP 8.5 - Pipe operator
$result = $data
    |> array_map(fn($x) => $x * 2, ...)
    |> array_filter(...)
    |> array_sum(...);
```

## Clone With (readonly classes)

```php
readonly class UserDTO
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}

// PHP 8.5 - clone with
$updated = clone($dto, email: 'new@email.com');
```

## #[\NoDiscard] Attribute

```php
#[\NoDiscard("Result must be used")]
public function calculate(): Result
{
    return new Result();
}

// Warning if result ignored
$this->calculate(); // ⚠️ Warning
$result = $this->calculate(); // ✅ OK
```

## Key Improvements

- **Pipe operator**: Cleaner function composition
- **Clone with**: Easier immutable object manipulation
- **No-discard attribute**: Catch forgotten return values
- **Type-safe**: Full type inference support
