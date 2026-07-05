---
name: pest-setup
description: Complete Pest.php config and first Pest 4 tests
keywords: pest, config, expectations, datasets, hooks, template
---

# Pest.php + First Tests Template

Complete Pest 4 setup for a framework-agnostic project (no Laravel).

## Pest.php

```php
<?php

// tests/Pest.php  (created by ./vendor/bin/pest --init)
declare(strict_types=1);

// Bind a base TestCase to a directory (optional; default is PHPUnit\TestCase)
uses(PHPUnit\Framework\TestCase::class)->in('Unit', 'Feature');

// Shared expectations
expect()->extend('toBeSlug', function () {
    return $this->toMatch('/^[a-z0-9-]+$/');
});

// Global hooks
beforeEach(function () {
    // reset shared state
});
```

## phpunit.xml (Pest reads the same file)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/pestphp/pest/vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

## First tests

```php
<?php

// tests/Unit/GreeterTest.php
declare(strict_types=1);

it('greets by name', function () {
    expect((new Greeter)->greet('Al'))->toBe('Hi, Al');
});

it('rejects empty names', function () {
    expect(fn () => (new Greeter)->greet(''))
        ->toThrow(InvalidArgumentException::class);
});

it('validates emails', function (string $email, bool $valid) {
    expect(isValidEmail($email))->toBe($valid);
})->with([
    'ok'  => ['a@b.com', true],
    'bad' => ['nope', false],
]);
```

## Run

```bash
composer require pestphp/pest --dev --with-all-dependencies
./vendor/bin/pest
./vendor/bin/pest --coverage --min=80   # fail below 80% coverage
```

## Notes

- Custom matchers via `expect()->extend()` keep assertions domain-readable.
- Datasets (`->with([...])`) are Pest's equivalent of PHPUnit data providers.
- `--min=80` turns coverage into a hard gate; wire it into CI.
