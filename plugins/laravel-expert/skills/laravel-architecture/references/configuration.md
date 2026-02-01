---
name: configuration
description: Laravel configuration and environment management
when-to-use: Managing config, environment variables, secrets
keywords: laravel, php, configuration, env, environment
priority: high
related: providers.md, deployment.md
---

# Configuration

## Overview

Laravel configuration is stored in `config/` directory. Environment-specific values use `.env` file. Always access config via `config()` helper, never `env()` in application code.

## Environment File

```env
APP_NAME="My App"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=myapp

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

## Accessing Config

```php
// Get value
$name = config('app.name');
$debug = config('app.debug');

// With default
$timeout = config('services.api.timeout', 30);

// Set at runtime
config(['app.timezone' => 'America/Chicago']);
```

## Config Files

| File | Purpose |
|------|---------|
| `app.php` | Application settings |
| `auth.php` | Authentication guards |
| `cache.php` | Cache drivers |
| `database.php` | Database connections |
| `filesystems.php` | Storage disks |
| `logging.php` | Log channels |
| `mail.php` | Email drivers |
| `queue.php` | Queue connections |
| `services.php` | Third-party services |
| `session.php` | Session drivers |

## Environment Detection

```php
if (App::environment('production')) {
    // Production-only code
}

if (App::environment(['local', 'staging'])) {
    // Local or staging
}
```

## Config Caching

In production, cache configuration:

```shell
php artisan config:cache
```

**Important**: After caching, `env()` returns `null`. Always use `config()`.

Clear cache:

```shell
php artisan config:clear
```

## Custom Config Files

Create `config/payment.php`:

```php
return [
    'gateway' => env('PAYMENT_GATEWAY', 'stripe'),
    'key' => env('PAYMENT_KEY'),
    'secret' => env('PAYMENT_SECRET'),
];
```

Access via `config('payment.gateway')`.

## Encrypted Environment

Store sensitive env vars encrypted:

```shell
php artisan env:encrypt
php artisan env:decrypt
```

## Best Practices

1. **Never use env() in code** - Only in config files
2. **Cache in production** - `config:cache`
3. **Don't commit .env** - Use .env.example
4. **Use secrets manager** - For production secrets
5. **Type cast** - `(bool)`, `(int)` in config files

## Related References

- [deployment.md](deployment.md) - Production config
- [providers.md](providers.md) - Config in providers
