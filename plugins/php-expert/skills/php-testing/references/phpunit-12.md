---
name: phpunit-12
description: PHPUnit 12 attributes, data providers, and test-double changes
when-to-use: Load when writing or configuring PHPUnit 12 tests
keywords: phpunit, attributes, dataprovider, createstub, createmock, php83, removed
priority: high
related: annotations-to-attributes.md, templates/phpunit-xml.md, templates/test-doubles.md
---

# PHPUnit 12

## Overview

PHPUnit 12 (released 2025-02-07) requires **PHP 8.3+** and completes the move from
docblock annotations to PHP 8 attributes.

Source: https://phpunit.de/announcements/phpunit-12.html + docs.phpunit.de/en/12.0

## Breaking changes to know

| Change | Impact |
|--------|--------|
| Annotations **removed** | `@test`, `@dataProvider`, `@covers`, ... no longer work — use attributes |
| `createStub()` non-configurable | Configuring expectations on a stub was deprecated in 11, now impossible |
| Abstract-class & trait mocks removed | `getMockForAbstractClass()` / trait mocking gone |

Rule: if your suite still emits deprecation warnings on PHPUnit 11.5, fix those
before upgrading to 12.

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
| Verify interaction between objects | `createMock()` — set `->expects()` expectations |

→ Full stub/mock/fixture examples in [templates/test-doubles.md](templates/test-doubles.md)

## Exceptions

```php
$this->expectException(InvalidArgumentException::class);
// call the code that should throw AFTER expectException()
```

`expectExceptionMessage()` does a **contains** match, not exact.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Non-static data provider | Make it `public static` |
| `->expects()` on `createStub()` | Use `createMock()` for expectations |
| Keeping `@dataProvider` docblocks | Migrate to `#[DataProvider(...)]` |

→ Config in [templates/phpunit-xml.md](templates/phpunit-xml.md)
