---
name: composer-json
description: Complete modern composer.json for a framework-agnostic PHP package — PSR-4 autoload, autoload-dev, scripts, PSR deps
keywords: template, composer.json, psr-4, autoload-dev, scripts, minimum-stability, php-cs-fixer
---

# composer.json Template

Complete, copy-paste `composer.json` for a library. Adjust vendor/namespace/PHP constraint.

---

## Full File

```json
{
    "name": "vendor/package",
    "description": "A framework-agnostic PHP library.",
    "type": "library",
    "license": "MIT",
    "keywords": ["php", "library"],
    "authors": [
        { "name": "Your Name", "email": "you@example.com" }
    ],
    "require": {
        "php": ">=8.3",
        "psr/log": "^3.0",
        "psr/clock": "^1.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^12.5 || ^13.3",
        "friendsofphp/php-cs-fixer": "^3.95",
        "phpstan/phpstan": "^2.2"
    },
    "autoload": {
        "psr-4": { "Vendor\\Package\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Vendor\\Package\\Tests\\": "tests/" }
    },
    "bin": ["bin/console"],
    "scripts": {
        "test": "phpunit",
        "cs": "php-cs-fixer fix --dry-run --diff",
        "cs:fix": "php-cs-fixer fix",
        "stan": "phpstan analyse src tests --level=8",
        "check": ["@cs", "@stan", "@test"]
    },
    "config": {
        "sort-packages": true,
        "optimize-autoloader": true
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

Notes:
- `scripts` and `config` are root-only fields (ignored in dependencies).
- `@cs` inside `check` references another script by name.
- Bump `require.php` to `>=8.4` or `>=8.5` only when you actually use those features.
- PHPUnit 13 needs PHP 8.4+; the `^12.5 || ^13.3` range lets Composer pick PHPUnit 12 on
  PHP 8.3 CI jobs. Once `require.php` is `>=8.4`, use `"^13.3"` alone.

---

## php-cs-fixer With PER-CS

```php
<?php
// .php-cs-fixer.dist.php
declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/tests']);

return (new Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PER-CS' => true,
        '@PER-CS:risky' => true,
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

The `@PER-CS` ruleset tracks the newest PER-CS revision PHP-CS-Fixer ships — PER-CS 3.0
as of v3.95 (the PER-CS 3.1 spec has no dedicated set yet).

---

## Bootstrapping

```bash
composer init                 # interactive scaffold
composer require psr/log      # add a PSR interface
composer dump-autoload -o     # optimized autoloader
composer check                # run cs + stan + test
```
