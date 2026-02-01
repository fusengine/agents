---
name: artisan
description: Laravel Artisan CLI commands and custom commands
when-to-use: Creating CLI commands, using built-in commands
keywords: laravel, php, artisan, cli, commands
priority: high
related: providers.md, container.md
---

# Artisan Console

## Overview

Artisan is Laravel's CLI interface with built-in commands and support for custom commands.

## Common Commands

### Development

| Command | Purpose |
|---------|---------|
| `php artisan serve` | Dev server |
| `php artisan tinker` | REPL |
| `php artisan route:list` | List routes |

### Code Generation

| Command | Creates |
|---------|---------|
| `make:model Post -mfc` | Model + migration + factory + controller |
| `make:controller PostController --api` | API controller |
| `make:request StorePostRequest` | Form Request |
| `make:resource PostResource` | API Resource |
| `make:migration create_posts_table` | Migration |
| `make:command SendEmails` | Custom command |

### Database & Cache

| Command | Purpose |
|---------|---------|
| `migrate` | Run migrations |
| `migrate:fresh --seed` | Drop all, migrate, seed |
| `optimize` | Cache config, routes, views |
| `optimize:clear` | Clear all caches |

## Creating Commands

```shell
php artisan make:command SendEmails
```

## Command Structure

```php
class SendEmails extends Command
{
    protected $signature = 'emails:send {user} {--queue}';
    protected $description = 'Send emails to user';

    public function handle(): int
    {
        $userId = $this->argument('user');
        $this->info('Sending emails...');
        return Command::SUCCESS;
    }
}
```

## Signature Syntax

| Pattern | Meaning |
|---------|---------|
| `{user}` | Required |
| `{user?}` | Optional |
| `{user=default}` | With default |
| `{--queue}` | Boolean option |
| `{--Q\|queue}` | With shortcut |

## Input/Output

| Method | Purpose |
|--------|---------|
| `$this->argument('name')` | Get argument |
| `$this->option('name')` | Get option |
| `$this->info('msg')` | Green text |
| `$this->error('msg')` | Red text |
| `$this->ask('Question?')` | Prompt |
| `$this->confirm('Sure?')` | Yes/no |

## Calling Commands

```php
Artisan::call('emails:send', ['user' => 1]);
Artisan::queue('emails:send', ['user' => 1]);
```

## Scheduling

```php
// routes/console.php
Schedule::command('emails:send')->daily();
```

## Best Practices

1. **Return codes** - `SUCCESS`, `FAILURE`, `INVALID`
2. **Validate input** - Check arguments
3. **Inject dependencies** - Constructor injection

## Related References

- [providers.md](providers.md) - Registering commands
