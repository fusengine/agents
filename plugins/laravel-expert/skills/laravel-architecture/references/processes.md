---
name: processes
description: Laravel Process facade for running external commands
when-to-use: Running shell commands, managing processes
keywords: laravel, php, processes, shell, commands
priority: low
related: artisan.md
---

# Processes

## Overview

The Process facade provides an expressive API for running external shell commands. It wraps Symfony Process component with Laravel-friendly syntax.

## Basic Usage

```php
use Illuminate\Support\Facades\Process;

$result = Process::run('ls -la');

echo $result->output();
```

## Result Methods

| Method | Returns |
|--------|---------|
| `output()` | Command stdout |
| `errorOutput()` | Command stderr |
| `successful()` | True if exit code 0 |
| `failed()` | True if exit code != 0 |
| `exitCode()` | Exit code |

## Throwing on Failure

```php
$result = Process::run('invalid-command')->throw();
// Throws ProcessFailedException if failed
```

## Command Options

```php
Process::timeout(60)
    ->path('/home/user')
    ->env(['APP_ENV' => 'testing'])
    ->run('php artisan migrate');
```

## Input

```php
Process::input('yes')
    ->run('php artisan migrate --force');
```

## Asynchronous Processes

```php
$process = Process::start('long-running-command');

// Do other work...

$result = $process->wait();
```

## Process Pools

Run multiple processes concurrently:

```php
$pool = Process::pool(function (Pool $pool) {
    $pool->command('npm run build');
    $pool->command('php artisan optimize');
});

$results = $pool->start()->wait();
```

## Fake for Testing

```php
Process::fake([
    'ls *' => Process::result(output: 'file1.txt file2.txt'),
    '*' => Process::result(exitCode: 1),
]);

Process::assertRan('ls *');
```

## Best Practices

1. **Set timeouts** - Prevent hanging processes
2. **Handle failures** - Check `failed()` or use `throw()`
3. **Use pools** - For concurrent operations
4. **Fake in tests** - Don't run real processes

## Related References

- [artisan.md](artisan.md) - Laravel CLI commands
