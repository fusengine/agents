---
name: laravel-testing
description: Use when testing controllers, services, or models, or implementing TDD on Laravel 13 with Pest 5 / PHPUnit 13 (or Pest 4 / PHPUnit 12 on PHP 8.3).
versions:
  laravel: "13.0"
  pest: "5.2"
  phpunit: "13.3"
  php: "8.3"
user-invocable: false
references: references/pest-basics.md, references/pest-datasets.md, references/pest-arch.md, references/http-requests.md, references/http-json.md, references/http-auth.md, references/http-assertions.md, references/database-basics.md, references/database-factories.md, references/database-assertions.md, references/mocking-services.md, references/mocking-fakes.md, references/mocking-http.md, references/console-tests.md, references/troubleshooting.md, references/templates/FeatureTest.php.md, references/templates/UnitTest.php.md, references/templates/ArchTest.php.md, references/templates/ApiTest.php.md, references/templates/PestConfig.php.md
related-skills: laravel-architecture, laravel-eloquent
---

<objective>
Covers Laravel 13 testing with Pest 5 / PHPUnit 13 (Pest 4 / PHPUnit 12 on PHP 8.3): feature tests (HTTP,
full stack), unit tests (isolated classes), and architecture tests; Pest
syntax (it/test/describe), datasets; HTTP testing (requests, JSON
assertions, auth/actingAs, status/redirect assertions); database testing
(RefreshDatabase, factories, DB assertions); mocking (services, spies,
Mail/Queue/Event fakes, Http::fake, time travel); console/Artisan command
tests; and PHPUnit-attribute-based seeding (#[Seed], #[Seeder]).
</objective>

# Laravel Testing

## Agent Workflow (MANDATORY)

Before ANY implementation, spawn 3 agents in parallel, one `Agent` call each with a `name`:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing test patterns
2. **fuse-ai-pilot:research-expert** - Verify Pest/PHPUnit docs via Context7
3. **mcp__context7__query-docs** - Check assertion and mocking patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Type | Purpose | Location |
|------|---------|----------|
| **Feature** | HTTP, full stack | `tests/Feature/` |
| **Unit** | Isolated classes | `tests/Unit/` |
| **Arch** | Code architecture | `tests/Arch.php` |

---

## Decision Guide: Test Type

```
What to test?
├── HTTP endpoint → Feature test
├── Service/Policy logic → Unit test
├── Code structure → Arch test
├── External API → Mock with Http::fake()
├── Mail/Queue/Event → Use Fakes
└── Database state → assertDatabaseHas()
```

---

## Decision Guide: Test Strategy

```
Coverage strategy?
├── Feature tests (70%) → Critical flows
├── Unit tests (25%) → Business logic
├── E2E tests (5%) → User journeys
└── Arch tests → Structural rules
```

---

## Critical Rules

1. **Use RefreshDatabase** for database isolation
2. **Use factories** for test data (never raw inserts)
3. **Mock external services** - Never call real APIs
4. **Test edge cases** - Empty, null, boundaries
5. **Run parallel** - `pest --parallel` for speed

---

## Reference Guide

### Pest Basics

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Pest Syntax** | [pest-basics.md](references/pest-basics.md) | it(), test(), describe() |
| **Datasets** | [pest-datasets.md](references/pest-datasets.md) | Data providers, hooks |
| **Architecture** | [pest-arch.md](references/pest-arch.md) | arch() tests |

### HTTP Testing

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Requests** | [http-requests.md](references/http-requests.md) | GET, POST, headers |
| **JSON API** | [http-json.md](references/http-json.md) | API assertions |
| **Authentication** | [http-auth.md](references/http-auth.md) | actingAs, guards |
| **Assertions** | [http-assertions.md](references/http-assertions.md) | Status, redirects |

### Database Testing

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Basics** | [database-basics.md](references/database-basics.md) | RefreshDatabase |
| **Factories** | [database-factories.md](references/database-factories.md) | Factory patterns |
| **Assertions** | [database-assertions.md](references/database-assertions.md) | DB assertions |

### Mocking

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Services** | [mocking-services.md](references/mocking-services.md) | Mock, spy |
| **Fakes** | [mocking-fakes.md](references/mocking-fakes.md) | Mail, Queue, Event |
| **HTTP & Time** | [mocking-http.md](references/mocking-http.md) | Http::fake, travel |

### Other

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Console** | [console-tests.md](references/console-tests.md) | Artisan tests |
| **Troubleshooting** | [troubleshooting.md](references/troubleshooting.md) | Common errors |

### Templates

| Template | When to Use |
|----------|-------------|
| [FeatureTest.php.md](references/templates/FeatureTest.php.md) | HTTP feature test |
| [UnitTest.php.md](references/templates/UnitTest.php.md) | Service unit test |
| [ArchTest.php.md](references/templates/ArchTest.php.md) | Architecture test |
| [ApiTest.php.md](references/templates/ApiTest.php.md) | REST API test |
| [PestConfig.php.md](references/templates/PestConfig.php.md) | Pest configuration |

---

## Quick Reference

```php
// Feature test
it('creates a post', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/posts', ['title' => 'Test'])
        ->assertCreated()
        ->assertJsonPath('data.title', 'Test');

    $this->assertDatabaseHas('posts', ['title' => 'Test']);
});

// With dataset
it('validates emails', function (string $email, bool $valid) {
    // test logic
})->with([
    ['valid@test.com', true],
    ['invalid', false],
]);

// Mock facade
Mail::fake();
// ... action ...
Mail::assertSent(OrderShipped::class);
```

---

## Commands

```bash
# Run all tests
php artisan test

# Pest directly
./vendor/bin/pest

# Parallel execution
./vendor/bin/pest --parallel

# Filter by name
./vendor/bin/pest --filter "user can"

# Coverage
./vendor/bin/pest --coverage --min=80

# Profile slow tests
./vendor/bin/pest --profile
```

---

## Best Practices

### DO
- Use `RefreshDatabase` trait
- Follow AAA pattern (Arrange-Act-Assert)
- Name tests descriptively
- Test one thing per test
- Use factories for data

### DON'T
- Create test dependencies
- Call real external APIs
- Use production database
- Skip edge cases

---

## Laravel 13 Notes

### PHPUnit 12/13 + Pest 4/5
The Laravel 13 skeleton ships **PHPUnit 12** (`^12.5`); the framework also accepts **PHPUnit 13**. **Pest 5** (current, requires **PHP 8.4+** and PHPUnit 13, plus `pestphp/pest-plugin-laravel ^5.0` which needs Laravel `^13.23`) — stay on **Pest 4** (PHPUnit 12) if the app still runs PHP 8.3. PHP attributes replace docblock annotations.

```php
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Foundation\Testing\Attributes\Seed;
use Illuminate\Foundation\Testing\Attributes\Seeder;

#[Seed]                          // runs DatabaseSeeder
#[Seeder(UserSeeder::class)]     // runs a targeted seeder
final class UserTest extends TestCase
{
    #[Test]
    public function it_creates_user(): void { /* ... */ }
}
```

### Str factories reset
Laravel 13 resets custom `Str` factories (UUID / ULID / random string) during test teardown. Tests relying on a factory persisting across methods must set it in each test or setup hook.

### `#[UnitTest]` (L13)
`Illuminate\Foundation\Testing\Attributes\UnitTest` on a test method skips booting the application for that test.

### Migration from Pest 3 → 4
- Bump `pestphp/pest` and all Pest plugins to `^4.0` (PHP 8.3+, PHPUnit 12)
- Snapshot names changed: run `./vendor/bin/pest --update-snapshots`
- `pest-plugin-watch` and `pest-plugin-faker` are archived

### Migration from Pest 4 → 5
- Requires **PHP 8.4+**; bump `pestphp/pest` and all Pest plugins to `^5.0` (built on PHPUnit 13)
- New in 5: `--tia` (test impact analysis, local only), first-party PHPStan/Rector plugins, Agent and Evals plugins, time-balanced sharding
