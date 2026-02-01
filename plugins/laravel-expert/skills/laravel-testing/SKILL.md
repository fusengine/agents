---
name: laravel-testing
description: Write tests with Pest/PHPUnit, feature tests, unit tests, mocking, and factories. Use when testing controllers, services, models, or implementing TDD.
versions:
  laravel: "12.46"
  pest: "4.3"
  php: "8.5"
user-invocable: false
references: references/testing.md, references/http-tests.md, references/database-testing.md, references/console-tests.md, references/mocking.md, references/dusk.md, references/pint.md
related-skills: laravel-architecture
---

# Laravel Testing

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing test patterns
2. **fuse-ai-pilot:research-expert** - Verify Pest/PHPUnit docs via Context7
3. **mcp__context7__query-docs** - Check assertion and mocking patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel supports Pest and PHPUnit for testing.

| Type | Purpose |
|------|---------|
| **Feature** | HTTP endpoints, full stack |
| **Unit** | Isolated class testing |
| **Browser** | Dusk for E2E |

---

## Critical Rules

1. **Use RefreshDatabase** for isolated tests
2. **Use factories** for test data
3. **Mock external services** - Never call real APIs
4. **Test edge cases** - Empty, null, boundaries

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Testing** | [testing.md](references/testing.md) | Test basics |
| **HTTP Tests** | [http-tests.md](references/http-tests.md) | API testing |
| **Database** | [database-testing.md](references/database-testing.md) | DB assertions |
| **Mocking** | [mocking.md](references/mocking.md) | Fakes & mocks |
| **Console** | [console-tests.md](references/console-tests.md) | CLI tests |
| **Dusk** | [dusk.md](references/dusk.md) | Browser tests |
| **Pint** | [pint.md](references/pint.md) | Code style |

---

## Quick Reference

```php
// Pest feature test
it('creates a post', function () {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/posts', ['title' => 'Test'])
        ->assertCreated();

    $this->assertDatabaseHas('posts', ['title' => 'Test']);
});

// Mock
$this->mock(PaymentService::class, fn ($m) =>
    $m->shouldReceive('charge')->once()->andReturn(true)
);
```
