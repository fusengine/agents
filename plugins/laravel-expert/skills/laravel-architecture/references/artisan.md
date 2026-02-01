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

Artisan is Laravel's CLI interface. It provides built-in commands for common tasks and allows creating custom commands for application-specific operations.

## Common Commands

### Development

| Command | Purpose |
|---------|---------|
| `php artisan serve` | Start development server |
| `php artisan tinker` | Interactive REPL |
| `php artisan route:list` | List all routes |
| `php artisan config:show` | Show config values |

### Code Generation

| Command | Creates |
|---------|---------|
| `make:model Post -mfc` | Model + migration + factory + controller |
| `make:controller PostController --api` | API controller |
| `make:request StorePostRequest` | Form Request |
| `make:resource PostResource` | API Resource |
| `make:migration create_posts_table` | Migration |
| `make:seeder PostSeeder` | Database seeder |
| `make:factory PostFactory` | Model factory |
| `make:policy PostPolicy` | Authorization policy |
| `make:middleware EnsureAdmin` | Middleware |
| `make:command SendEmails` | Custom command |

### Database

| Command | Purpose |
|---------|---------|
| `migrate` | Run migrations |
| `migrate:rollback` | Rollback last batch |
| `migrate:fresh --seed` | Drop all, migrate, seed |
| `db:seed` | Run seeders |

### Cache

| Command | Purpose |
|---------|---------|
| `cache:clear` | Clear application cache |
| `config:cache` | Cache configuration |
| `route:cache` | Cache routes |
| `view:cache` | Cache Blade views |
| `optimize` | Cache config, routes, views |
| `optimize:clear` | Clear all caches |

## Creating Commands

```shell
php artisan make:command SendEmails
```

Creates `app/Console/Commands/SendEmails.php`.

## Command Structure

```php
class SendEmails extends Command
{
    protected $signature = 'emails:send {user} {--queue}';
    protected $description = 'Send emails to user';

    public function handle(): int
    {
        $userId = $this->argument('user');
        $queued = $this->option('queue');

        $this->info('Sending emails...');

        return Command::SUCCESS;
    }
}
```

## Signature Syntax

| Pattern | Meaning |
|---------|---------|
| `{user}` | Required argument |
| `{user?}` | Optional argument |
| `{user=default}` | Argument with default |
| `{--queue}` | Boolean option |
| `{--queue=}` | Option with value |
| `{--queue=default}` | Option with default |
| `{--Q\|queue}` | Option with shortcut |

## Input/Output

| Method | Purpose |
|--------|---------|
| `$this->argument('name')` | Get argument |
| `$this->option('name')` | Get option |
| `$this->info('message')` | Green text |
| `$this->error('message')` | Red text |
| `$this->warn('message')` | Yellow text |
| `$this->ask('Question?')` | Prompt for input |
| `$this->confirm('Sure?')` | Yes/no confirmation |
| `$this->choice('Pick', [...])` | Multiple choice |
| `$this->table($headers, $data)` | Display table |

## Progress Bars

```php
$bar = $this->output->createProgressBar(count($users));
foreach ($users as $user) {
    $this->processUser($user);
    $bar->advance();
}
$bar->finish();
```

## Calling Commands

```php
// From code
Artisan::call('emails:send', ['user' => 1]);

// From another command
$this->call('emails:send', ['user' => 1]);

// Queue command
Artisan::queue('emails:send', ['user' => 1]);
```

## Scheduling

Define scheduled commands in `routes/console.php`:

```php
Schedule::command('emails:send')->daily();
Schedule::command('report:generate')->weeklyOn(1, '8:00');
```

## Best Practices

1. **Return codes** - Return `SUCCESS`, `FAILURE`, or `INVALID`
2. **Validate input** - Check arguments before processing
3. **Use progress** - Show progress for long operations
4. **Inject dependencies** - Use constructor injection

## Related References

- [providers.md](providers.md) - Registering commands
- [Laravel Artisan Docs](https://laravel.com/docs/12.x/artisan) - Full documentation
