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

Octane supercharges Laravel applications by keeping them in memory between requests. Instead of bootstrapping the framework for each request, Octane boots once and serves subsequent requests at supersonic speeds. This can provide 10-100x performance improvements.

## When to Use Octane

Use Octane when you need:
- High request throughput
- Low latency responses
- Real-time features
- Concurrent task execution
- In-memory caching at extreme speeds

Avoid Octane if your application relies heavily on mutable global state or poorly designed singletons.

## Available Servers

| Server | Language | Best For |
|--------|----------|----------|
| **FrankenPHP** | Go | Modern PHP, HTTP/2, HTTP/3 |
| **Swoole** | C | Concurrent tasks, ticks, tables |
| **Open Swoole** | C | Same as Swoole, open source |
| **RoadRunner** | Go | Cross-platform, simple setup |

## Installation

```shell
composer require laravel/octane
php artisan octane:install
```

The installer prompts you to choose a server and downloads the necessary binaries.

## Basic Usage

```shell
# Start server
php artisan octane:start

# With file watching (development)
php artisan octane:start --watch

# Specify workers
php artisan octane:start --workers=4

# Reload workers (deployment)
php artisan octane:reload

# Stop server
php artisan octane:stop
```

## Critical Concepts

### The Persistence Problem

Since your application stays in memory, you must be careful about:

1. **Singletons** - Objects bound as singletons persist across requests
2. **Static properties** - Static arrays will accumulate data (memory leak)
3. **Request injection** - Never inject Request into singleton constructors

### Safe Patterns

**Container injection** - Use closures instead of direct injection:

```php
// Bad - stale container
$this->app->singleton(Service::class, fn ($app) => new Service($app));

// Good - always fresh
$this->app->singleton(Service::class, fn () =>
    new Service(fn () => Container::getInstance())
);
```

**Request data** - Pass at method call time, not construction:

```php
// Bad - stale request
return new Service($app['request']);

// Good - pass when needed
$service->process($request->input('name'));
```

### Safe Globals

These always return fresh values:
- `app()` and `Container::getInstance()`
- `request()` helper
- `config()` helper

## Production Deployment

### Supervisor Configuration

```ini
[program:octane]
command=php /var/www/app/artisan octane:start --server=frankenphp --host=127.0.0.1 --port=8000
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/app/storage/logs/octane.log
```

### Nginx Proxy

Place Nginx in front of Octane for static assets and SSL termination. Configure `location @octane` to proxy requests to Octane on port 8000.

## Swoole-Specific Features

These features require Swoole or Open Swoole:

### Concurrent Tasks

```php
[$users, $posts] = Octane::concurrently([
    fn () => User::all(),
    fn () => Post::all(),
]);
```

### Ticks (Intervals)

```php
Octane::tick('heartbeat', fn () =>
    Log::info('Still alive')
)->seconds(10);
```

### Octane Cache

Provides 2M ops/sec caching using Swoole tables:

```php
Cache::store('octane')->put('key', 'value', 30);
```

## Best Practices

1. **Avoid memory leaks** - Don't append to static arrays
2. **Test thoroughly** - Behavior may differ from traditional PHP
3. **Use --watch in dev** - For automatic reloading
4. **Monitor memory** - Watch for gradual increases
5. **Reset state** - Use Octane's flush callbacks if needed
6. **Proxy with Nginx** - For SSL and static files in production

## Related References

- [deployment.md](deployment.md) - Production deployment
- [configuration.md](configuration.md) - Environment setup
