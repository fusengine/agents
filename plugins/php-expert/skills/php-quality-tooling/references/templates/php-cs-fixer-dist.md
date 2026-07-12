---
name: php-cs-fixer-dist
description: Complete .php-cs-fixer.dist.php using the @PER-CS3.0 rule set
keywords: php-cs-fixer, per-cs, config, finder, template
---

# .php-cs-fixer.dist.php Template

Complete configuration. Drop at repo root as `.php-cs-fixer.dist.php`
(the `.dist.` name lets developers override locally via `.php-cs-fixer.php`).

## Config file

```php
<?php

// .php-cs-fixer.dist.php  (repo root)
declare(strict_types=1);

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/tests'])
    ->exclude(['var', 'vendor', 'storage']);

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PER-CS3.0' => true,          // pinned PER Coding Style 3.x
        // '@PER-CS' => true,          // alternative: always-latest alias
        'declare_strict_types' => true, // risky: adds strict_types to every file
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'global_namespace_import' => [
            'import_classes' => true,
            'import_functions' => true,
        ],
    ])
    ->setFinder($finder)
    ->setCacheFile(__DIR__ . '/var/.php-cs-fixer.cache');
```

## Commands

```bash
composer require --dev friendsofphp/php-cs-fixer
# or, on dependency conflicts:
composer require --dev php-cs-fixer/shim

vendor/bin/php-cs-fixer check   # CI gate: non-zero exit if any file would change
vendor/bin/php-cs-fixer fix     # apply fixes locally
```

## Notes

- `@PER-CS3.0` pins the standard; swap to `@PER-CS` to always track the newest revision.
- `setRiskyAllowed(true)` is required for `declare_strict_types`; review risky diffs.
- Prefer `@Symfony` if the team follows Symfony house style, `@PhpCsFixer` for the
  strictest opinionated set.
- On a **Laravel** repo, drop this file and use Pint instead — never run both.
