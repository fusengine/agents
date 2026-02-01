---
name: laravel-architecture
description: Design Laravel app architecture with services, repositories, actions, and clean code patterns. Use when structuring projects, creating services, implementing DI, or organizing code layers.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: false
references: references/installation.md, references/configuration.md, references/structure.md, references/lifecycle.md, references/upgrade.md, references/releases.md, references/container.md, references/providers.md, references/facades.md, references/contracts.md, references/context.md, references/artisan.md, references/packages.md, references/helpers.md, references/sail.md, references/valet.md, references/homestead.md, references/octane.md, references/envoy.md, references/deployment.md, references/processes.md, references/concurrency.md, references/filesystem.md, references/pennant.md, references/mcp.md, references/errors.md, references/logging.md
related-skills: solid-php
---

# Laravel Architecture Patterns

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify Laravel patterns via Context7
3. **mcp__context7__query-docs** - Check service container and DI

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel architecture with services, repositories, and clean separation of concerns.

```text
app/
├── Actions/              # Single-purpose action classes
├── Services/             # Business logic
├── Repositories/         # Data access layer
├── Contracts/            # Interfaces
├── DTOs/                 # Data transfer objects
├── Http/
│   ├── Controllers/      # Thin controllers
│   ├── Requests/         # Form validation
│   └── Resources/        # API transformations
├── Models/               # Eloquent models only
├── Enums/                # PHP 8.1+ enums
├── Events/               # Domain events
├── Listeners/            # Event handlers
└── Policies/             # Authorization
```

---

## Critical Rules

1. **Thin controllers** - Delegate to services
2. **Interfaces in Contracts/** - Not with implementations
3. **DI over facades** - Constructor injection
4. **Files < 100 lines** - Split when larger

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Container** | [container.md](references/container.md) | Dependency injection |
| **Providers** | [providers.md](references/providers.md) | Service registration |
| **Facades** | [facades.md](references/facades.md) | Static proxies |
| **Contracts** | [contracts.md](references/contracts.md) | Interfaces |
| **Structure** | [structure.md](references/structure.md) | Directory layout |
| **Lifecycle** | [lifecycle.md](references/lifecycle.md) | Request handling |
| **Deployment** | [deployment.md](references/deployment.md) | Production setup |

### Templates

| Template | When to use |
|----------|-------------|
| [UserService.php.md](references/templates/UserService.php.md) | Service + repository |
| [AppServiceProvider.php.md](references/templates/AppServiceProvider.php.md) | DI bindings |

---

## Quick Reference

```php
// Service injection
public function __construct(
    private readonly UserService $userService,
) {}

// Binding
$this->app->bind(Interface::class, Implementation::class);
```
