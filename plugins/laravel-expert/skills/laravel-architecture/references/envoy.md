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

Envoy is a task runner for executing common operations on remote servers via SSH. Using Blade-style syntax, you define tasks for deployment, artisan commands, and server maintenance. Envoy runs on macOS and Linux (Windows via WSL2).

## Installation

```shell
composer require laravel/envoy --dev
```

Create `Envoy.blade.php` at your project root.

## Basic Structure

```blade
@servers(['web' => ['user@192.168.1.1']])

@task('deploy', ['on' => 'web'])
    cd /var/www/app
    git pull origin main
    composer install --no-dev
    php artisan migrate --force
@endtask
```

### Server Definition

Define servers at the top of the file:

```blade
@servers([
    'web' => ['user@web1.example.com', 'user@web2.example.com'],
    'worker' => ['user@worker.example.com']
])
```

### Local Tasks

Run tasks locally by using `127.0.0.1`:

```blade
@servers(['localhost' => '127.0.0.1'])
```

## Running Tasks

```shell
php vendor/bin/envoy run deploy

# With variables
php vendor/bin/envoy run deploy --branch=main
```

## Variables

Pass variables via command line and use in tasks:

```blade
@task('deploy', ['on' => 'web'])
    cd /var/www/app
    @if ($branch)
        git pull origin {{ $branch }}
    @endif
    php artisan migrate --force
@endtask
```

## Multiple Servers

### Sequential Execution (Default)

```blade
@task('deploy', ['on' => ['web-1', 'web-2']])
    php artisan down
    git pull origin main
    php artisan up
@endtask
```

### Parallel Execution

```blade
@task('restart', ['on' => ['web-1', 'web-2'], 'parallel' => true])
    sudo systemctl restart nginx
@endtask
```

## Stories (Task Groups)

Combine multiple tasks into a single command:

```blade
@story('deploy')
    pull-code
    install-deps
    migrate
    clear-cache
@endstory

@task('pull-code')
    cd /var/www/app && git pull origin main
@endtask

@task('install-deps')
    cd /var/www/app && composer install --no-dev
@endtask

@task('migrate')
    cd /var/www/app && php artisan migrate --force
@endtask

@task('clear-cache')
    cd /var/www/app && php artisan optimize
@endtask
```

Run with: `php vendor/bin/envoy run deploy`

## Setup Block

Execute PHP code before tasks:

```blade
@setup
    $now = new DateTime;
    $release = 'release_' . $now->format('YmdHis');
@endsetup
```

Include other PHP files:

```blade
@include('vendor/autoload.php')
```

## Hooks

Execute code at different lifecycle points:

| Hook | When | Receives |
|------|------|----------|
| `@before` | Before each task | `$task` name |
| `@after` | After each task | `$task` name |
| `@error` | On task failure | `$task` name |
| `@success` | After all tasks succeed | - |
| `@finished` | After all tasks complete | `$exitCode` |

```blade
@before
    if ($task === 'deploy') {
        // Notify team
    }
@endbefore

@finished
    if ($exitCode > 0) {
        // Handle failure
    }
@endfinished
```

## Confirmation Prompts

For destructive operations:

```blade
@task('rollback', ['on' => 'web', 'confirm' => true])
    cd /var/www/app
    git reset --hard HEAD~1
@endtask
```

## Notifications

### Slack

```blade
@finished
    @slack('webhook-url', '#deployments', 'Deployment complete!')
@endfinished
```

### Discord

```blade
@finished
    @discord('discord-webhook-url')
@endfinished
```

### Telegram

```blade
@finished
    @telegram('bot-id', 'chat-id')
@endfinished
```

### Microsoft Teams

```blade
@finished
    @microsoftTeams('webhook-url')
@endfinished
```

## Importing Tasks

Share tasks across projects:

```blade
@import('vendor/package/Envoy.blade.php')
```

## Best Practices

1. **Use stories** - Group related tasks for easier execution
2. **Add confirmations** - For destructive operations
3. **Send notifications** - Keep team informed of deployments
4. **Test locally first** - Use localhost for testing
5. **Handle failures** - Use `@error` hooks for cleanup

## Related References

- [deployment.md](deployment.md) - Production deployment
- [artisan.md](artisan.md) - Artisan commands
