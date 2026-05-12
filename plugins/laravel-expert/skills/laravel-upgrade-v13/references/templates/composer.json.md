---
name: composer.json
description: Example composer.json after L13 upgrade
when-to-use: Reference for final composer.json state
keywords: composer, dependencies, template
---

# composer.json — Laravel 13 Reference

```json
{
  "name": "vendor/my-app",
  "type": "project",
  "license": "proprietary",
  "require": {
    "php": "^8.3",
    "laravel/framework": "^13.0",
    "laravel/tinker": "^3.0",
    "laravel/sanctum": "^5.0",
    "laravel/cashier": "^16.0",
    "laravel/serializable-closure": "^2.0",
    "laravel/ai": "^1.0",
    "spatie/laravel-permission": "^7.0",
    "guzzlehttp/guzzle": "^7.10"
  },
  "require-dev": {
    "fakerphp/faker": "^1.24",
    "laravel/pail": "^2.0",
    "laravel/pint": "^2.0",
    "laravel/sail": "^2.0",
    "mockery/mockery": "^2.0",
    "nunomaduro/collision": "^9.0",
    "pestphp/pest": "^4.0",
    "pestphp/pest-plugin-laravel": "^4.0",
    "phpstan/phpstan": "^2.0",
    "phpunit/phpunit": "^12.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "app/",
      "Database\\Factories\\": "database/factories/",
      "Database\\Seeders\\": "database/seeders/"
    }
  },
  "autoload-dev": {
    "psr-4": {
      "Tests\\": "tests/"
    }
  },
  "config": {
    "optimize-autoloader": true,
    "preferred-install": "dist",
    "sort-packages": true,
    "allow-plugins": {
      "pestphp/pest-plugin": true,
      "php-http/discovery": true
    }
  },
  "minimum-stability": "stable",
  "prefer-stable": true
}
```

Adjust versions per your stack — these are the L13-compatible minimums verified at release time.
