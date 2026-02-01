---
name: module-structure
description: Directory structure of a FuseCore module
when-to-use: Creating new modules, understanding organization
keywords: structure, directory, folder, organization, layout
priority: high
related: architecture.md, creating-module.md
---

# Module Structure

## Overview

Every FuseCore module follows a consistent directory structure for predictability and auto-discovery.

## Complete Structure

```
FuseCore/{ModuleName}/
├── App/
│   ├── Contracts/           # Module-specific interfaces
│   ├── Http/
│   │   ├── Controllers/     # API controllers
│   │   ├── Middleware/      # Module middleware
│   │   ├── Requests/        # Form requests
│   │   └── Resources/       # API resources
│   ├── Models/              # Eloquent models
│   ├── Services/            # Business logic
│   ├── Providers/           # Service providers
│   ├── Exceptions/          # Custom exceptions
│   └── Events/              # Event classes
│
├── Database/
│   ├── Migrations/          # Database migrations
│   ├── Seeders/             # Database seeders
│   └── Factories/           # Model factories
│
├── Resources/
│   ├── React/               # React components
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── schemas/         # Validation schemas
│   │   ├── constants/       # Constants
│   │   ├── utils/           # Utility functions
│   │   └── i18n/locales/    # Translations
│   └── views/               # Blade views (rare)
│
├── Routes/
│   └── api.php              # API routes
│
├── Config/                  # Module config (optional)
│   └── {module}.php
│
├── Tests/                   # Module tests
│   ├── Feature/
│   └── Unit/
│
└── module.json              # Module manifest
```

## Required Directories

| Directory | Purpose | Required |
|-----------|---------|----------|
| `App/Providers/` | ServiceProvider | ✅ Yes |
| `Routes/` | API routes | ✅ Yes |
| `module.json` | Configuration | ✅ Yes |

## Optional Directories

| Directory | When to use |
|-----------|-------------|
| `App/Models/` | Module has database tables |
| `App/Http/Controllers/` | Module has API endpoints |
| `App/Services/` | Complex business logic |
| `Database/Migrations/` | Database changes |
| `Resources/React/` | Frontend components |
| `Config/` | Module-specific config |

## Minimal Module

For simple modules:

```
FuseCore/{ModuleName}/
├── App/Providers/{ModuleName}ServiceProvider.php
├── Routes/api.php
└── module.json
```

## Directory Responsibilities

### App/Contracts/

Module-specific interfaces. Cross-module interfaces go in Core.

### App/Http/Controllers/

API controllers only. Keep thin - delegate to services.

### App/Http/Requests/

Form request validation classes.

### App/Http/Resources/

API resource transformers for JSON responses.

### App/Models/

Eloquent models with relationships, scopes, casts.

### App/Services/

Business logic layer. Controllers call services.

### App/Providers/

ServiceProvider with `HasModule` trait.

### Database/Migrations/

Module-specific migrations. Auto-loaded via trait.

### Resources/React/

Isolated React application structure.

### Routes/api.php

API routes with `api` middleware.

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Controller | `{Resource}Controller` | `PostController` |
| Model | Singular PascalCase | `Post` |
| Migration | `{date}_create_{table}_table` | `2026_01_01_create_posts_table` |
| Request | `{Action}{Resource}Request` | `StorePostRequest` |
| Resource | `{Resource}Resource` | `PostResource` |
| Service | `{Domain}Service` | `PostService` |

## SOLID Compliance

| Rule | Application |
|------|-------------|
| Files < 100 lines | Split at 90 lines |
| Interfaces in Contracts/ | Never in components |
| Single responsibility | One class = one job |

## Related Templates

| Template | Purpose |
|----------|---------|
| [ServiceProvider.php.md](templates/ServiceProvider.php.md) | Provider example |
| [Controller.php.md](templates/Controller.php.md) | Controller example |
| [Model.php.md](templates/Model.php.md) | Model example |

## Related References

- [creating-module.md](creating-module.md) - Step-by-step guide
- [service-provider.md](service-provider.md) - Provider setup
