---
name: logging
description: Laravel logging with channels and Monolog
when-to-use: Implementing logging, configuring log channels
keywords: laravel, php, logging, monolog, channels
priority: medium
related: errors.md, configuration.md
---

# Logging

## Overview

Laravel logging is built on Monolog, providing channels for sending logs to files, Slack, databases, and more. Configure channels in `config/logging.php`.

## Log Levels

| Level | Method | Use Case |
|-------|--------|----------|
| `emergency` | `Log::emergency()` | System unusable |
| `alert` | `Log::alert()` | Immediate action needed |
| `critical` | `Log::critical()` | Critical conditions |
| `error` | `Log::error()` | Runtime errors |
| `warning` | `Log::warning()` | Exceptional but not error |
| `notice` | `Log::notice()` | Normal but significant |
| `info` | `Log::info()` | Informational |
| `debug` | `Log::debug()` | Debug information |

## Basic Usage

```php
use Illuminate\Support\Facades\Log;

Log::info('User logged in', ['user_id' => $user->id]);
Log::error('Payment failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
```

## Channels

| Channel | Driver | Destination |
|---------|--------|-------------|
| `stack` | stack | Multiple channels |
| `single` | single | Single file |
| `daily` | daily | Daily rotated files |
| `slack` | slack | Slack webhook |
| `stderr` | monolog | PHP stderr |
| `syslog` | syslog | System log |

### Using Specific Channel

```php
Log::channel('slack')->critical('Server down!');
```

### Stack Channel

Log to multiple channels simultaneously:

```php
'stack' => [
    'driver' => 'stack',
    'channels' => ['daily', 'slack'],
],
```

## Configuration

```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'level' => 'critical',
    ],
],
```

## Contextual Logging

Add context to all logs:

```php
Log::withContext(['request_id' => $requestId]);
```

## Custom Channels

Create custom Monolog channels in `config/logging.php`:

```php
'custom' => [
    'driver' => 'monolog',
    'handler' => StreamHandler::class,
    'with' => [
        'stream' => 'php://stderr',
    ],
],
```

## Helper Function

```php
logger('Debug message');
logger()->info('Info message');
```

## Best Practices

1. **Use appropriate levels** - Don't log everything as error
2. **Add context** - Include relevant data
3. **Rotate logs** - Use daily driver
4. **Alert on critical** - Send critical to Slack/email
5. **Don't log sensitive data** - Mask passwords, tokens

## Related References

- [errors.md](errors.md) - Exception handling
- [configuration.md](configuration.md) - Log configuration
