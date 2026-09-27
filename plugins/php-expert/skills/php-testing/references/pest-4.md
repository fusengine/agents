---
name: pest-4
description: Pest 5 basics, browser testing, and framework-agnostic setup
when-to-use: Load when writing or configuring Pest 5 tests
keywords: pest, expect, it, describe, browser-testing, arch-testing, drift, tia, php84
priority: high
related: choosing-framework.md, templates/pest-setup.md
---

# Pest 5

## Overview

Pest 5 (current 5.2) is an expressive testing framework built on the PHPUnit 13 engine. It
requires **PHP 8.4+** and is framework-agnostic (works without Laravel). Upgrading from
Pest 4 is `"pestphp/pest": "^5.0"` plus `^5.0` for every Pest plugin; PHPUnit 13's
breaking changes apply (see [phpunit-12.md](phpunit-12.md)).

Source: https://pestphp.com/docs/installation + /docs/pest5-now-available + /docs/upgrade-guide

## Install

```bash
composer remove phpunit/phpunit
composer require pestphp/pest --dev --with-all-dependencies
./vendor/bin/pest --init   # creates Pest.php
./vendor/bin/pest
```

## Core syntax

```php
it('adds two numbers', function () {
    expect(1 + 1)->toBe(2);
});

describe('Greeter', function () {
    it('greets by name', function () {
        expect((new Greeter)->greet('Al'))->toBe('Hi, Al');
    });
});
```

`expect()` chains readable matchers (`toBe`, `toBeTrue`, `toThrow`, ...). PHPUnit
assertions remain available via `$this->assert*` inside closures.

## What Pest adds beyond assertions

| Capability | Doc |
|------------|-----|
| Browser testing | `pest-plugin-browser` (`/docs/browser-testing`) |
| Architecture testing | `arch()` presets (`/docs/arch-testing`) |
| Mutation testing | `/docs/mutation-testing` |
| Type + test coverage | `/docs/type-coverage`, `/docs/test-coverage` |
| Stress testing | Stressless (`/docs/stress-testing`) |

## New in Pest 5

| Capability | How | Doc |
|------------|-----|-----|
| Test Impact Analysis (Tia) | `./vendor/bin/pest --parallel --tia` — reruns only affected tests (needs PCOV/Xdebug; keep it out of CI) | `/docs/tia` |
| First-party PHPStan plugin | `pestphp/pest-plugin-phpstan` — types `it()`/`expect()`/`$this` | `/docs/phpstan` |
| Rector rules | `pestphp/pest-plugin-rector` + `PestSetList::CODING_STYLE` | `/docs/rector` |
| Time-balanced sharding | `--update-shards` once, commit `tests/.pest/shards.json`, then `--shard=1/4` | `/docs/optimizing-tests` |
| Agent / Evals plugins | `pestphp/pest-plugin-agent` (`--agent='…'`), `pestphp/pest-plugin-evals` (`--evals`) | `/docs/agent`, `/docs/evals` |
| New expectations | `toBeEmail()`, `toBeUlid()`, `toBeIpAddress()`, `toBeHostname()`, `toBeDomain()`, … | `/docs/expectations` |

## Migrating from PHPUnit

`pest-plugin-drift` auto-converts existing PHPUnit test classes into Pest syntax —
a one-time codemod, review the diff afterward.

## Datasets (Pest's data providers)

```php
it('validates emails', function (string $email, bool $valid) {
    expect(isValid($email))->toBe($valid);
})->with([
    ['a@b.com', true],
    ['nope', false],
]);
```

→ Complete `Pest.php` + tests in [templates/pest-setup.md](templates/pest-setup.md)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Keeping `phpunit/phpunit` as the runner | `composer remove` it; Pest brings its own |
| Rewriting PHPUnit suites by hand | Use `pest-plugin-drift` |
| Assuming PHP 8.3 works | Pest 5 needs PHP 8.4+ (stay on Pest 4 for 8.3) |
| Bumping only `pestphp/pest` | Bump every `pestphp/pest-plugin-*` to `^5.0` too |
