---
name: octane
description: Laravel Octane for high-performance applications
when-to-use: Performance optimization, high-traffic applications
keywords: laravel, php, octane, performance, swoole, frankenphp
priority: high
related: deployment.md, configuration.md
---

# Laravel Octane

## Overview

Octane supercharges Laravel by keeping applications in memory between requests. Instead of bootstrapping for each request, Octane boots once and serves subsequent requests at supersonic speeds (10-100x improvement).

## When to Use

Use Octane for high throughput, low latency, real-time features, and concurrent tasks. Avoid if your app relies on mutable global state.

## Available Servers

| Server | Best For |
|--------|----------|
| **FrankenPHP** | Modern PHP, HTTP/2, HTTP/3 |
| **Swoole** | Concurrent tasks, ticks, tables |
| **RoadRunner** | Cross-platform, simple setup |

## Installation

```shell
composer require laravel/octane
php artisan octane:install
```

## Basic Commands

```shell
php artisan octane:start           # Start
php artisan octane:start --watch   # Dev with reload
php artisan octane:start --workers=4
php artisan octane:reload          # Reload workers
php artisan octane:stop            # Stop
```

## Critical: Persistence Problem

Since app stays in memory, be careful about:
1. **Singletons** - Persist across requests
2. **Static arrays** - Accumulate data (memory leak)
3. **Request injection** - Never in singleton constructors

### Safe Patterns

```php
// Bad - stale container
$this->app->singleton(Service::class, fn ($app) => new Service($app));

// Good - always fresh
$this->app->singleton(Service::class, fn () =>
    new Service(fn () => Container::getInstance())
);
```

**Safe globals**: `app()`, `request()`, `config()` - always fresh.

## Production

Use Supervisor to keep Octane running:

```ini
[program:octane]
command=php /var/www/app/artisan octane:start --server=frankenphp --port=8000
autostart=true
autorestart=true
```

Place Nginx in front for SSL and static assets.

## Swoole Features

```php
// Concurrent tasks
[$users, $posts] = Octane::concurrently([
    fn () => User::all(),
    fn () => Post::all(),
]);

// Ticks
Octane::tick('heartbeat', fn () => Log::info('alive'))->seconds(10);

// Octane cache (2M ops/sec)
Cache::store('octane')->put('key', 'value', 30);
```

## Best Practices

1. **Avoid memory leaks** - Don't append to static arrays
2. **Test thoroughly** - Behavior differs from traditional PHP
3. **Monitor memory** - Watch for gradual increases
4. **Proxy with Nginx** - For SSL and static files

## Related References

- [deployment.md](deployment.md) - Production deployment
