---
name: phpunit-12
description: PHPUnit 13 attributes, data providers, and test-double changes (incl. the PHPUnit 12 breaks)
when-to-use: Load when writing or configuring PHPUnit 13 tests
keywords: phpunit, attributes, dataprovider, createstub, createmock, php84, removed, seal
priority: high
related: annotations-to-attributes.md, templates/phpunit-xml.md, templates/test-doubles.md
---

# PHPUnit 13

## Overview

PHPUnit 13 (released 2026-02-06, current line 13.3) requires **PHP 8.4+**. It builds on
PHPUnit 12 (released 2025-02-07), which completed the move from docblock annotations
to PHP 8 attributes. PHPUnit 12 keeps receiving bug fixes until 2027-02-05 for PHP 8.3 projects.

Source: https://phpunit.de/announcements/phpunit-13.html + https://github.com/sebastianbergmann/phpunit/blob/13.0.0/ChangeLog-13.0.md

## Breaking changes to know

| Since | Change | Impact |
|-------|--------|--------|
| 12 | Annotations **removed** | `@test`, `@dataProvider`, `@covers`, ... no longer work — use attributes |
| 12 | `createStub()` non-configurable | Configuring expectations on a stub was deprecated in 11, now impossible |
| 12 | Abstract-class & trait mocks removed | `getMockForAbstractClass()` / trait mocking gone |
| 13 | PHP 8.3 support removed | PHP 8.4+ only |
| 13 | `isType()`, `assertContainsOnly()`, `assertNotContainsOnly()`, `containsOnly()` removed | Use the typed variants: `isInt()`/`isString()`…, `assertContainsOnlyInt()`/`assertContainsOnlyString()`…, `assertContainsNotOnlyInt()`… |
| 13 | `#[CoversNothing]` on a test **method** and `#[RunClassInSeparateProcess]` removed | Put `#[CoversNothing]` on the class |
| 13 | Version strings without an operator removed | `#[RequiresPhp('8.4')]` → `#[RequiresPhp('>= 8.4')]` (or Composer syntax `'^8.4'`) |
| 13 | `any()` matcher hard-deprecated | Use `createStub()`, or a real count: `once()`, `exactly(n)`, `atLeast(1)`, `never()` |

Rule: if your suite still emits deprecation warnings on PHPUnit 12.5, fix those
before upgrading to 13 (same rule as 11.5 → 12).

## New in PHPUnit 13

- **Sealed test doubles** — end the fluent chain with `->seal()`
  (`$stub->method('x')->willReturn('v')->seal();`) to freeze configuration; on mocks,
  unconfigured methods then reject calls. Enforce suite-wide with `requireSealedMockObjects="true"` in `phpunit.xml`.
- **`withParameterSetsInOrder()` / `withParameterSetsInAnyOrder()`** — replacement for the
  long-removed `withConsecutive()`.
- **Array assertions** — `assertArraysAreIdentical()`, `assertArraysAreEqual()`,
  `assertArraysHaveIdenticalValues()` (+ `…IgnoringOrder` / `…EqualValues` variants).

## Attributes — the essentials

```php
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(Calculator::class)]
final class CalculatorTest extends TestCase
{
    #[Test]
    #[DataProvider('additionProvider')]
    public function itAdds(int $a, int $b, int $expected): void
    {
        $this->assertSame($expected, $a + $b);
    }

    // Data providers MUST be public AND static
    public static function additionProvider(): array
    {
        return [[0, 0, 0], [1, 1, 2]];
    }
}
```

Tests can also be plain `public function test*()` methods without `#[Test]`.

## Test doubles

| Need | Method |
|------|--------|
| Isolate code from a dependency (canned returns) | `createStub()` — returns only, no expectations |
| Verify interaction between objects | `createMock()` — set `->expects()` expectations (`with*()` without `expects()` is hard-deprecated since 13.0.2) |

→ Full stub/mock/fixture examples in [templates/test-doubles.md](templates/test-doubles.md)

## Exceptions

```php
$this->expectException(InvalidArgumentException::class);
// call the code that should throw AFTER expectException()
```

`expectExceptionMessage()` does a **contains** match, not exact. It is soft-deprecated
since PHPUnit 13.2 — prefer `expectExceptionMessageIsOrContains()`, which names that behavior.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Non-static data provider | Make it `public static` |
| `->expects()` on `createStub()` | Use `createMock()` for expectations |
| Keeping `@dataProvider` docblocks | Migrate to `#[DataProvider(...)]` |
| `$this->any()` on a mock | `createStub()`, or an explicit count like `once()` |

→ Config in [templates/phpunit-xml.md](templates/phpunit-xml.md)
