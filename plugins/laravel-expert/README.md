# Laravel Expert Plugin

Expert Laravel 13 development plugin for Claude Code with comprehensive documentation and best practices.

## Features

- **22 specialized skills** covering all Laravel 13 domains (Attributes, AI SDK, JSON:API, vector search, Eloquent, queues, auth, billing, etc.)
- **Documentation** based on official Laravel 13.x docs
- **PHP Attributes-first** patterns with legacy property migration guides
- **PHP 8.3+** with strict types, typed constants, `#[\Override]`

## Skills

| Skill | Description |
|-------|-------------|
| `laravel-architecture` | Services, repositories, actions, clean code patterns |
| `laravel-eloquent` | ORM, relationships, scopes, casts, query optimization |
| `laravel-api` | RESTful APIs, resources, rate limiting, versioning |
| `laravel-auth` | Sanctum, Passport, policies, gates, social login |
| `laravel-testing` | Pest, PHPUnit, feature tests, factories, mocking |
| `laravel-queues` | Jobs, workers, batches, chains, failure handling |
| `laravel-livewire` | Livewire 3, Volt, reactive components |
| `laravel-blade` | Templates, components, slots, layouts, directives |
| `laravel-migrations` | Schema builder, indexes, foreign keys, seeders |
| `laravel-billing` | Stripe Cashier, Paddle, subscriptions, invoices |

## Usage

```bash
# Install the plugin
claude plugins add fusengine-plugins/laravel-expert

# Use the agent
claude --agent laravel-expert "Create a new API endpoint for users"
```

## Trigger Keywords

The agent activates automatically when you mention:
- Laravel, Eloquent, Blade, Livewire
- API development, authentication, authorization
- Database migrations, queues, testing
- PHP artisan commands

## Requirements

- Laravel 12.x
- PHP 8.3+
- Composer

## License

MIT
