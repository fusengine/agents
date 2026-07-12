---
name: phpunit-xml
description: Complete phpunit.xml and a first PHPUnit 12 TestCase
keywords: phpunit, xml, config, coverage, testcase, template
---

# phpunit.xml + First Test Template

Complete PHPUnit 12 configuration for a framework-agnostic project.

## phpunit.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- phpunit.xml  (repo root) -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         cacheDirectory=".phpunit.cache"
         requireCoverageMetadata="true"
         beStrictAboutOutputDuringTests="true"
         failOnRisky="true"
         failOnWarning="true"
         displayDetailsOnPhpunitDeprecations="true">
    <testsuites>
        <testsuite name="default">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>

    <coverage>
        <report>
            <text outputFile="php://stdout" showOnlySummary="true"/>
            <clover outputFile="build/clover.xml"/>
        </report>
    </coverage>
</phpunit>
```

## First test

```php
<?php

// tests/GreeterTest.php
declare(strict_types=1);

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

#[CoversClass(Greeter::class)]
final class GreeterTest extends TestCase
{
    #[DataProvider('names')]
    public function testGreetsWithName(string $name, string $expected): void
    {
        self::assertSame($expected, (new Greeter)->greet($name));
    }

    public static function names(): array
    {
        return [
            'simple' => ['Alice', 'Hello, Alice!'],
            'empty'  => ['', 'Hello, !'],
        ];
    }
}
```

## Run

```bash
composer require --dev phpunit/phpunit
vendor/bin/phpunit                       # run suite
vendor/bin/phpunit --coverage-text       # requires Xdebug or PCOV
```

## Notes

- `requireCoverageMetadata="true"` forces every test to declare `#[CoversClass]`.
- `failOnWarning` / `failOnRisky` turn latent issues into CI failures.
- `displayDetailsOnPhpunitDeprecations` surfaces anything that will break in the next major.
