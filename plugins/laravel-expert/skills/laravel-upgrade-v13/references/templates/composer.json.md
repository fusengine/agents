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
    "laravel/sanctum": "^4.0",
    "laravel/cashier": "^16.0",
    "laravel/serializable-closure": "^2.0",
    "laravel/ai": "^1.0",
    "spatie/laravel-permission": "^8.0",
    "guzzlehttp/guzzle": "^7.10"
  },
  "require-dev": {
    "fakerphp/faker": "^1.24",
    "laravel/pail": "^1.2.5",
    "laravel/pint": "^1.27",
    "laravel/sail": "^1.68",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.6",
    "pestphp/pest": "^4.0",
    "pestphp/pest-plugin-laravel": "^4.0",
    "phpstan/phpstan": "^2.0",
    "phpunit/phpunit": "^12.5"
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

Adjust versions per your stack — these are L13-compatible constraints for a PHP 8.3 app. On PHP 8.4+ you may use `"php": "^8.4"`, `pestphp/pest` + `pestphp/pest-plugin-laravel` `^5.0` and `phpunit/phpunit` `^13.0` (Pest 5 is built on PHPUnit 13).
