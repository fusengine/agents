---
name: test-doubles
description: PHPUnit 12 stubs, mocks, fixtures, and coverage patterns
keywords: stub, mock, createstub, createmock, fixture, fakes, coverage, template
---

# Test Doubles, Fixtures & Coverage Template

Complete PHPUnit 12 examples. Pest exposes the same API via `$this->` in closures.

## Stub — canned return values (no expectations)

Use when the double only needs to feed the code under test. `createStub()` results
**cannot** carry expectations in PHPUnit 12.

```php
<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class PriceServiceTest extends TestCase
{
    public function testAppliesRate(): void
    {
        $rates = $this->createStub(RateProvider::class);
        $rates->method('current')->willReturn(1.2);

        $service = new PriceService($rates);

        self::assertSame(120.0, $service->convert(100.0));
    }
}
```

## Mock — verify interaction (expectations)

Use when the test asserts *how* collaborators are called. Only `createMock()`
supports `->expects()`.

```php
public function testNotifiesOnce(): void
{
    $mailer = $this->createMock(Mailer::class);
    $mailer->expects($this->once())
        ->method('send')
        ->with($this->stringContains('@'));

    (new Signup($mailer))->register('user@example.com');
}
```

## Fixtures — lifecycle setup/teardown

```php
private Database $db;

protected function setUp(): void
{
    $this->db = Database::inMemory();
    $this->db->migrate();
}

protected function tearDown(): void
{
    $this->db->close();
}
```

For heavy shared setup use `#[Before]` / `#[After]` attributes, or
`setUpBeforeClass()` for once-per-class fixtures.

## Fakes vs mocks

| Double | When |
|--------|------|
| Stub | Supply inputs; don't care about calls |
| Mock | Assert calls/order/arguments |
| Fake | Lightweight working impl (in-memory repo) — hand-written class, not a double |

Prefer a hand-written **fake** (e.g. `InMemoryUserRepository`) over a mock when the
collaborator has real behavior worth reusing across tests.

## Coverage

```bash
# PHPUnit
vendor/bin/phpunit --coverage-text --coverage-clover build/clover.xml

# Pest (fails under threshold)
vendor/bin/pest --coverage --min=80
```

Coverage needs Xdebug (`XDEBUG_MODE=coverage`) or PCOV installed.

## Notes

- Mock **boundaries** (network, DB, clock), never the class under test.
- Over-mocking couples tests to implementation — reach for fakes when possible.
- Gate CI on a coverage minimum; a bare report never fails a build.
