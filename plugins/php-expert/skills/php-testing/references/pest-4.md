---
name: pest-4
description: Pest 4 basics, browser testing, and framework-agnostic setup
when-to-use: Load when writing or configuring Pest 4 tests
keywords: pest, expect, it, describe, browser-testing, arch-testing, drift, php83
priority: high
related: choosing-framework.md, templates/pest-setup.md
---

# Pest 4

## Overview

Pest 4 is an expressive testing framework built on the PHPUnit engine. It
requires **PHP 8.3+** and is framework-agnostic (works without Laravel).

Source: https://pestphp.com/docs/installation + /docs/pest-v4-is-here-now-with-browser-testing

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

## What Pest 4 adds beyond assertions

| Capability | Doc |
|------------|-----|
| Browser testing | `pest-plugin-browser` (`/docs/browser-testing`) |
| Architecture testing | `arch()` presets (`/docs/arch-testing`) |
| Mutation testing | `/docs/mutation-testing` |
| Type + test coverage | `/docs/type-coverage`, `/docs/test-coverage` |
| Stress testing | Stressless (`/docs/stress-testing`) |

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
| Assuming PHP 8.2 works | Pest 4 needs PHP 8.3+ |
