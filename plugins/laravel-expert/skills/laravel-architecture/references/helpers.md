---
name: helpers
description: Laravel global helper functions overview
when-to-use: Using array, string, path, URL helpers in Laravel
keywords: laravel, php, helpers, arr, str, utilities
priority: medium
related: strings.md, configuration.md
---

# Laravel Helpers

## Overview

Laravel provides global helper functions for common operations. These functions are used throughout the framework and available in your applications. Main categories include arrays, strings, paths, URLs, and utilities.

## Helper Categories

| Category | Class/Prefix | Purpose |
|----------|--------------|---------|
| **Arrays** | `Arr::` | Array manipulation, access, transformation |
| **Strings** | `Str::` | String manipulation, formatting |
| **Paths** | `*_path()` | Application directory paths |
| **URLs** | `url()`, `route()` | URL generation |
| **Misc** | `app()`, `config()`, etc. | Framework utilities |

## Array Helpers (Arr::)

The `Arr` class provides methods for working with arrays. Common use cases:

| Method | Purpose |
|--------|---------|
| `Arr::get($array, 'key.nested')` | Get value using dot notation |
| `Arr::set($array, 'key', $value)` | Set value using dot notation |
| `Arr::has($array, 'key')` | Check if key exists |
| `Arr::only($array, ['key1', 'key2'])` | Get only specified keys |
| `Arr::except($array, ['key'])` | Get all except specified keys |
| `Arr::pluck($array, 'name')` | Extract column values |
| `Arr::first($array, $callback)` | Get first matching element |
| `Arr::flatten($array)` | Flatten multi-dimensional array |
| `Arr::dot($array)` | Flatten with dot notation keys |

## String Helpers (Str::)

The `Str` class handles string operations. See [strings.md](../laravel-api/references/strings.md) for detailed reference.

| Method | Purpose |
|--------|---------|
| `Str::uuid()` | Generate UUID |
| `Str::slug($text)` | Create URL-friendly slug |
| `Str::random(32)` | Generate random string |
| `Str::limit($text, 100)` | Truncate with ellipsis |
| `Str::camel($text)` | Convert to camelCase |
| `Str::snake($text)` | Convert to snake_case |

## Path Helpers

Functions returning absolute paths to application directories:

| Function | Returns |
|----------|---------|
| `app_path('Models')` | `app/Models` |
| `base_path('config')` | Project root + path |
| `config_path('app.php')` | `config/app.php` |
| `database_path('migrations')` | `database/migrations` |
| `public_path('images')` | `public/images` |
| `resource_path('views')` | `resources/views` |
| `storage_path('logs')` | `storage/logs` |

## URL Helpers

| Function | Purpose |
|----------|---------|
| `url('/path')` | Generate full URL |
| `route('posts.show', $post)` | Generate named route URL |
| `asset('css/app.css')` | Generate asset URL |
| `secure_url('/path')` | Generate HTTPS URL |

## Utility Helpers

| Function | Purpose |
|----------|---------|
| `app()` | Service container instance |
| `config('app.name')` | Get config value |
| `env('APP_DEBUG')` | Get environment variable |
| `logger('message')` | Log message |
| `now()` | Current Carbon instance |
| `today()` | Current date Carbon |
| `collect($array)` | Create Collection |
| `data_get($data, 'key')` | Get from object/array |
| `filled($value)` | Check if not blank |
| `blank($value)` | Check if blank |
| `throw_if($condition)` | Conditional throw |
| `throw_unless($condition)` | Throw unless true |
| `retry(3, fn() => ...)` | Retry operation |

## Benchmarking

Measure execution time:

```php
$time = Benchmark::measure(fn () => expensiveOperation());
```

## Deferred Functions

Run code after response is sent:

```php
defer(fn () => cleanup());
```

## Pipeline

Process data through stages:

```php
Pipeline::send($data)
    ->through([Stage1::class, Stage2::class])
    ->thenReturn();
```

## Best Practices

1. **Use class methods** - Prefer `Arr::get()` over `data_get()` for clarity
2. **Avoid env() in code** - Use config values instead
3. **Type safety** - Use `Arr::integer()`, `Arr::boolean()` for casting
4. **Null safety** - Helpers handle null gracefully

## Related References

- [configuration.md](configuration.md) - Config and environment
- [Laravel Docs](https://laravel.com/docs/12.x/helpers) - Full helper list
