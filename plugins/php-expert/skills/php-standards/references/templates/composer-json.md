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
        "phpunit/phpunit": "^11.0",
        "friendsofphp/php-cs-fixer": "^3.64",
        "phpstan/phpstan": "^2.0"
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

---

## php-cs-fixer With PER-CS 3.0

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

The `@PER-CS` ruleset applies PER Coding Style 3.0.

---

## Bootstrapping

```bash
composer init                 # interactive scaffold
composer require psr/log      # add a PSR interface
composer dump-autoload -o     # optimized autoloader
composer check                # run cs + stan + test
```
