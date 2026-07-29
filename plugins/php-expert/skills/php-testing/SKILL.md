---
name: php-testing
description: Use when writing/configuring tests on a non-Laravel PHP project — PHPUnit vs Pest. Do NOT use for Laravel test helpers or quality tooling (php-quality-tooling).
versions:
  phpunit: "12"
  pest: "4"
user-invocable: true
references: references/choosing-framework.md, references/phpunit-12.md, references/pest-4.md, references/annotations-to-attributes.md, references/templates/phpunit-xml.md, references/templates/pest-setup.md, references/templates/test-doubles.md
related-skills: php-quality-tooling, php-language-modern
---

<objective>
Covers testing a framework-agnostic PHP project with PHPUnit 12 (class-based, xUnit-style, attributes only — annotations like @test/@dataProvider were removed) or Pest 4 (closure-based, expressive, adds browser/architecture/mutation testing), both of which run on PHPUnit's engine and require PHP 8.3+.

Includes a decision matrix for choosing between the two (team preference, not capability), plus templates for phpunit.xml, Pest.php setup, and test doubles (stubs, mocks, fixtures, coverage).

Do NOT use this skill for Laravel test helpers such as RefreshDatabase or HTTP testing — those are covered by laravel-expert's laravel-testing skill. Do NOT use it for static analysis or formatting tooling — that is php-quality-tooling.
</objective>


# PHP Testing

Two frameworks, one engine. Pest is a layer over PHPUnit — both need **PHP 8.3+**
and share the same runner and assertions underneath.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Detect existing framework (phpunit.xml vs Pest.php), test layout, PHP version
2. **fuse-ai-pilot:research-expert** - Verify latest PHPUnit 12 / Pest 4 docs via Context7/Exa
3. **mcp__context7__query-docs** - Check attribute names, test-double API, config schema

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Framework | Style | Strength |
|-----------|-------|----------|
| PHPUnit 12 | Class-based, xUnit | Enterprise baseline, explicit, widest tooling/CI support |
| Pest 4 | Closure-based, expressive | Modern DX, browser + arch + mutation testing, less boilerplate |

Pest 4 runs on PHPUnit's engine, so PHPUnit knowledge transfers directly. The
choice is about ergonomics and team preference, not capability.

---

## Critical Rules

1. **PHP 8.3+ required** - Both PHPUnit 12 and Pest 4 drop older PHP
2. **Attributes only, no annotations** - PHPUnit 12 **removed** docblock annotations (`@test`, `@dataProvider`)
3. **Data providers are `public static`** - Non-static providers no longer work
4. **`createStub()` is not configurable** - Configure expectations only on `createMock()`
5. **One framework per project** - Pest or PHPUnit, not both driving the same suite
6. **Mock at boundaries** - Network/DB/clock, never internal implementation detail

---

## Decision Guide

```
Choosing a framework? (non-Laravel)
├── Enterprise / strict CI / mixed team → PHPUnit 12 (explicit, ubiquitous)
├── Modern DX, greenfield, small team → Pest 4 (concise, expressive)
├── Need browser / architecture / mutation testing out of the box → Pest 4
└── Migrating a large PHPUnit suite → stay PHPUnit, or drift-migrate to Pest
```

Honest note: PHPUnit is the enterprise/CI baseline; Pest has strong community
momentum but that trend is **not normative**. Either is a correct, well-supported
choice — pick per team, not per hype.

→ Full matrix in `references/choosing-framework.md`

---

## Reference Guide

### Concepts

| Topic | Reference | Load when |
|-------|-----------|-----------|
| Framework choice | `references/choosing-framework.md` | Deciding PHPUnit vs Pest |
| PHPUnit 12 | `references/phpunit-12.md` | Writing PHPUnit tests |
| Pest 4 | `references/pest-4.md` | Writing Pest tests |
| Annotation migration | `references/annotations-to-attributes.md` | Upgrading pre-12 tests |

### Templates

| Template | Use Case |
|----------|----------|
| `references/templates/phpunit-xml.md` | `phpunit.xml` + first TestCase |
| `references/templates/pest-setup.md` | `Pest.php` + first Pest tests |
| `references/templates/test-doubles.md` | Stubs, mocks, fixtures, coverage |

---

## Quick Start

### PHPUnit 12

```php
use PHPUnit\Framework\TestCase;

final class GreeterTest extends TestCase
{
    public function testGreets(): void
    {
        $this->assertSame('Hi, Al', (new Greeter)->greet('Al'));
    }
}
```

### Pest 4

```php
it('greets', function () {
    expect((new Greeter)->greet('Al'))->toBe('Hi, Al');
});
```

---

## Best Practices

### DO
- Name tests by behavior (`testRejectsExpiredToken`), assert one behavior each
- Use `#[DataProvider]` with `public static` providers for table-driven tests
- Gate CI on an explicit coverage threshold, not a report

### DON'T
- Keep `@test` / `@dataProvider` annotations (removed in PHPUnit 12)
- Configure expectations on `createStub()` results
- Mock the class under test — mock its collaborators
