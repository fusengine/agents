---
name: packages
description: Creating Laravel packages for reusability
when-to-use: Building reusable packages, distributing code
keywords: laravel, php, packages, composer, reusable
priority: low
related: providers.md, facades.md
---

# Package Development

## Overview

Laravel packages are reusable code bundles that can be shared across projects via Composer. They typically include service providers, facades, config, views, and migrations.

## Package Structure

```
vendor/your-package/
├── config/
│   └── package.php
├── database/
│   └── migrations/
├── resources/
│   └── views/
├── src/
│   ├── PackageServiceProvider.php
│   └── YourClass.php
├── composer.json
└── README.md
```

## Service Provider

```php
class PackageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/package.php', 'package');
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/package.php' => config_path('package.php'),
        ], 'config');

        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'package');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
    }
}
```

## composer.json

```json
{
    "name": "vendor/package-name",
    "autoload": {
        "psr-4": {
            "Vendor\\Package\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Vendor\\Package\\PackageServiceProvider"
            ]
        }
    }
}
```

## Publishing Assets

```php
// Config
$this->publishes([
    __DIR__.'/../config/package.php' => config_path('package.php'),
], 'config');

// Views
$this->publishes([
    __DIR__.'/../resources/views' => resource_path('views/vendor/package'),
], 'views');

// Migrations
$this->publishesMigrations([
    __DIR__.'/../database/migrations' => database_path('migrations'),
]);
```

## Commands

```php
if ($this->app->runningInConsole()) {
    $this->commands([
        YourCommand::class,
    ]);
}
```

## Testing Package

Use Orchestra Testbench for testing packages in isolation.

## Best Practices

1. **Auto-discovery** - Register in `composer.json` extra
2. **Publish selectively** - Tag publishable assets
3. **Prefix config** - Avoid conflicts
4. **Document** - Clear installation instructions

## Related References

- [providers.md](providers.md) - Service Provider details
