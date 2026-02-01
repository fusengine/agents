---
name: envoy
description: Laravel Envoy for SSH task automation
when-to-use: Deployment scripts, remote server tasks
keywords: laravel, php, envoy, deployment, ssh
priority: medium
related: deployment.md, artisan.md
---

# Laravel Envoy

## Overview

Envoy executes common operations on remote servers via SSH using Blade-style syntax. Define tasks for deployment, artisan commands, and maintenance in `Envoy.blade.php`.

## Installation

```shell
composer require laravel/envoy --dev
```

## Basic Structure

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /var/www/app
    git pull origin main
    php artisan migrate --force
@endtask
```

## Running Tasks

```shell
php vendor/bin/envoy run deploy
php vendor/bin/envoy run deploy --branch=main
```

## Variables

Pass via CLI and use in tasks with Blade syntax:

```blade
@task('deploy', ['on' => 'web'])
    @if ($branch)
        git pull origin {{ $branch }}
    @endif
@endtask
```

## Multiple Servers

```blade
@servers(['web-1' => '192.168.1.1', 'web-2' => '192.168.1.2'])

@task('deploy', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    php artisan down && git pull && php artisan up
@endtask
```

## Stories (Task Groups)

```blade
@story('deploy')
    pull-code
    install-deps
    migrate
@endstory
```

## Hooks

| Hook | When | Receives |
|------|------|----------|
| `@before` | Before each task | `$task` |
| `@after` | After each task | `$task` |
| `@error` | On failure | `$task` |
| `@success` | All succeed | - |
| `@finished` | Always | `$exitCode` |

## Notifications

```blade
@finished
    @slack('webhook-url', '#channel', 'Done!')
    @discord('webhook-url')
    @telegram('bot-id', 'chat-id')
@endfinished
```

## Best Practices

1. **Use stories** - Group related tasks
2. **Add confirmations** - For destructive operations (`'confirm' => true`)
3. **Send notifications** - Keep team informed
4. **Parallel execution** - For independent server tasks

## Related References

- [deployment.md](deployment.md) - Production deployment
