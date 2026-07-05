---
name: rector-php
description: Complete rector.php for PHP upgrade plus quality refactors
keywords: rector, config, withPhpSets, withPreparedSets, levels, template
---

# rector.php Template

Complete configuration. Drop at repo root; run `--dry-run` before applying.

## Greenfield / actively maintained

Apply full sets — the codebase is already clean, so diffs stay small:

```php
<?php

// rector.php  (repo root)
declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ])
    // Reads the PHP version from composer.json and upgrades syntax to match
    ->withPhpSets()
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        naming: true,
    )
    ->withImportNames(removeUnusedImports: true);
```

## Legacy — incremental levels

Full sets would rewrite most files. Adopt one level per PR instead:

```php
<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src', __DIR__ . '/tests'])
    // Upgrade PHP step by step for enormous jumps
    ->withPhpLevel(5)
    // Raise each of these by 1, review, merge, repeat
    ->withTypeCoverageLevel(0)
    ->withTypeCoverageDocblockLevel(0) // Rector 2.2+: fills @param/@return/@var
    ->withDeadCodeLevel(0)
    ->withCodeQualityLevel(0)
    ->withCodingStyleLevel(0);
```

## Commands

```bash
composer require --dev rector/rector

vendor/bin/rector process --dry-run   # preview diff, no writes
vendor/bin/rector process             # apply
vendor/bin/rector --clear-cache process # if results look stale
```

## Notes

- Commit (or stash) before a bare `process` — Rector edits files in place.
- Add framework sets via `withSets([DoctrineSetList::DOCTRINE_CODE_QUALITY])`.
- Keep Rector (semantic refactor) and PHP-CS-Fixer (whitespace/style) separate;
  run Fixer after Rector so final formatting is consistent.
