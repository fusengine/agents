---
name: annotations-to-attributes
description: Migrating pre-12 PHPUnit docblock annotations to PHP 8 attributes
when-to-use: Load when upgrading a PHPUnit suite to version 12
keywords: annotations, attributes, migration, dataprovider, test, covers, upgrade
priority: medium
related: phpunit-12.md
---

# Annotations → Attributes

## Overview

PHPUnit 10 introduced PHP 8 attributes, deprecated docblock annotations in 11, and
**removed** them in 12. Every `@`-annotation on a test must become an attribute.

Source: https://phpunit.de/announcements/phpunit-12.html + docs.phpunit.de/en/12.0/attributes.html

## Mapping table

| Old annotation | New attribute |
|----------------|---------------|
| `@test` | `#[Test]` |
| `@dataProvider m` | `#[DataProvider('m')]` |
| `@covers ::class` | `#[CoversClass(Foo::class)]` |
| `@coversNothing` | `#[CoversNothing]` |
| `@depends m` | `#[Depends('m')]` |
| `@group slow` | `#[Group('slow')]` |
| `@testWith [...]` | `#[TestWith([...])]` |
| `@requires PHP 8.3` | `#[RequiresPhp('8.3')]` |
| `@doesNotPerformAssertions` | `#[DoesNotPerformAssertions]` |

All attributes live under the `PHPUnit\Framework\Attributes\` namespace.

## Before / after

```php
// BEFORE (removed in 12)
/**
 * @test
 * @dataProvider provideNumbers
 */
public function itAdds($a, $b, $expected) { /* ... */ }

/** @return array */
public function provideNumbers() { return [[1, 1, 2]]; }
```

```php
// AFTER
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

#[Test]
#[DataProvider('provideNumbers')]
public function itAdds(int $a, int $b, int $expected): void { /* ... */ }

public static function provideNumbers(): array { return [[1, 1, 2]]; } // now static
```

## Automate it

- **Rector** ships a PHPUnit set that converts annotations to attributes in bulk —
  run it before the manual pass (see php-quality-tooling rector-upgrades).
- **PHP-CS-Fixer** `@autoPHPUnitMigration:risky` covers style-level PHPUnit modernization.

Both are codemods — review the diff, then run the suite on PHPUnit 11.5 (clean of
deprecation warnings) before bumping to 12.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Provider left non-static after migration | Add `static` — attributes don't fix this |
| Migrating straight to 12 with warnings | Get green on 11.5 first |
| Hand-editing hundreds of tests | Run Rector's PHPUnit set first |
