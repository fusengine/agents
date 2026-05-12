---
name: fusecore
description: FuseCore Modular Architecture - Laravel 13 modular monolith with auto-discovery, React 19 integration, and SOLID principles. Use when creating modules, understanding FuseCore structure, or implementing features in FuseCore projects.
versions:
  laravel: "13.0"
  php: "8.3"
  react: "19"
  typescript: "5.8"
user-invocable: true
references: references/architecture.md, references/module-structure.md, references/module-discovery.md, references/module-json.md, references/contracts.md, references/traits.md, references/service-provider.md, references/react-integration.md, references/routes.md, references/migrations.md, references/i18n.md, references/creating-module.md
related-skills: solid-php, laravel-permission, laravel-api
---

# FuseCore Modular Architecture

## Agent Workflow (MANDATORY)

Before ANY implementation in FuseCore project, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing modules in `/FuseCore/`
2. **fuse-ai-pilot:research-expert** - Verify Laravel 13 patterns via Context7
3. **fuse-laravel:laravel-expert** - Apply Laravel best practices

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

FuseCore is a **Modular Monolith** architecture for Laravel 13 with React 19 integration.

| Component | Purpose |
|-----------|---------|
| **Module** | Self-contained feature (User, Dashboard, Blog) |
| **Auto-Discovery** | Automatic registration via `module.json` |
| **Traits** | `HasModule` for resource loading |
| **Contracts** | `ModuleInterface`, `ReactModuleInterface` |
| **React Integration** | Isolated React per module |
| **i18n** | Multi-language support (FR/EN/DE/IT/ES) |

---

## Critical Rules

1. **All code in `/FuseCore/{Module}/`** - Never in `/app/`
2. **One module.json per module** - Required for discovery
3. **ServiceProvider per module** - Use `HasModule` trait
4. **Files < 100 lines** - Split at 90 lines (SOLID)
5. **Interfaces in `/App/Contracts/`** - Never in components
6. **Migrations in module** - `/Database/Migrations/`
7. **Routes in module** - `/Routes/api.php`

---

## Architecture Overview

```
FuseCore/
├── Core/                    # Infrastructure (priority 0)
│   ├── App/
│   │   ├── Contracts/       # ModuleInterface, ReactModuleInterface
│   │   ├── Services/        # ModuleDiscovery, RouteAggregator
│   │   ├── Traits/          # HasModule, HasModuleDatabase
│   │   └── Providers/       # FuseCoreServiceProvider
│   ├── Config/fusecore.php
│   └── module.json
│
├── User/                    # Auth module
│   ├── App/Models/          # User.php, Profile.php
│   ├── Config/              # Module config (sanctum.php, etc.)
│   ├── Database/Migrations/
│   ├── Resources/React/     # Isolated React
│   ├── Routes/api.php
│   └── module.json          # dependencies: []
│
└── {YourModule}/            # Your new module
    ├── App/
    │   ├── Models/
    │   ├── Http/Controllers/
    │   ├── Services/
    │   └── Providers/{YourModule}ServiceProvider.php
    ├── Config/              # Module-specific config
    ├── Database/Migrations/
    ├── Resources/React/
    ├── Routes/api.php
    └── module.json          # dependencies: ["User"]
```

---

## Reference Guide

### Architecture

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Overview** | [architecture.md](references/architecture.md) | Understanding FuseCore design |
| **Module Structure** | [module-structure.md](references/module-structure.md) | Directory organization |
| **Auto-Discovery** | [module-discovery.md](references/module-discovery.md) | How modules are loaded |
| **module.json** | [module-json.md](references/module-json.md) | Module configuration |

### Implementation

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Contracts** | [contracts.md](references/contracts.md) | ModuleInterface, ReactModuleInterface |
| **Traits** | [traits.md](references/traits.md) | HasModule, HasModuleDatabase |
| **ServiceProvider** | [service-provider.md](references/service-provider.md) | Module registration |
| **Routes** | [routes.md](references/routes.md) | API routing |

### Resources

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **React Integration** | [react-integration.md](references/react-integration.md) | Frontend per module |
| **Migrations** | [migrations.md](references/migrations.md) | Database per module |
| **i18n** | [i18n.md](references/i18n.md) | Multi-language setup |

### Guides

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Creating Module** | [creating-module.md](references/creating-module.md) | Step-by-step guide |

---

### Templates (Code Examples)

| Template | Purpose |
|----------|---------|
| [module.json.md](references/templates/module.json.md) | Module configuration |
| [ServiceProvider.php.md](references/templates/ServiceProvider.php.md) | Module service provider |
| [Controller.php.md](references/templates/Controller.php.md) | API controller |
| [Model.php.md](references/templates/Model.php.md) | Eloquent model |
| [Migration.php.md](references/templates/Migration.php.md) | Database migration |
| [ReactStructure.md](references/templates/ReactStructure.md) | React module structure |
| [ApiRoutes.php.md](references/templates/ApiRoutes.php.md) | API routes file |
| [Resource.php.md](references/templates/Resource.php.md) | API Resource |
| [Request.php.md](references/templates/Request.php.md) | Form Request |
| [Service.php.md](references/templates/Service.php.md) | Business logic service |

---

## Quick Reference

### Create New Module

```bash
# 1. Create directory structure
mkdir -p FuseCore/{ModuleName}/{App/{Models,Http/Controllers,Services,Providers},Database/Migrations,Resources/React,Routes}

# 2. Create module.json
# 3. Create ServiceProvider with HasModule trait
# 4. Create routes/api.php
# 5. Run: php artisan fusecore:cache-clear
```

### module.json

```json
{
    "name": "ModuleName",
    "version": "1.0.0",
    "enabled": true,
    "isCore": false,
    "dependencies": ["User"]
}
```

### ServiceProvider

```php
class ModuleNameServiceProvider extends ServiceProvider
{
    use HasModule;

    public function boot(): void
    {
        $this->loadModuleMigrations();
    }
}
```

### Routes

```php
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    Route::apiResource('items', ItemController::class);
});
```

---

## Module Checklist

- [ ] `/FuseCore/{Module}/` directory created
- [ ] `module.json` with name, version, dependencies
- [ ] `{Module}ServiceProvider.php` with `HasModule` trait
- [ ] Routes in `/Routes/api.php`
- [ ] Migrations in `/Database/Migrations/`
- [ ] Models in `/App/Models/`
- [ ] Controllers in `/App/Http/Controllers/`
- [ ] React in `/Resources/React/` (if needed)
- [ ] i18n in `/Resources/React/i18n/locales/`

---

## SOLID Compliance

| Rule | FuseCore Implementation |
|------|-------------------------|
| **Single Responsibility** | One module = one feature |
| **Open/Closed** | Extend via `ModuleInterface` |
| **Liskov Substitution** | `ReactModuleInterface extends ModuleInterface` |
| **Interface Segregation** | Separate contracts |
| **Dependency Inversion** | Inject via ServiceProvider |

**File limits**: All files < 100 lines. Split at 90.

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Module folder | PascalCase | `BlogPost` |
| module.json name | PascalCase | `"name": "BlogPost"` |
| ServiceProvider | `{Module}ServiceProvider` | `BlogPostServiceProvider` |
| Controller | `{Resource}Controller` | `PostController` |
| Model | Singular | `Post` |
| Migration | `create_{table}_table` | `create_posts_table` |
| Routes file | `api.php` | Always `api.php` |

---

## Laravel 13 Notes

### Stack FuseCore L13
- **Laravel 13.0** + **PHP 8.3** minimum
- **React 19** + **TypeScript 5.8** (côté frontend module)
- **Inertia 2** pour le bridge React ↔ modules

### Module ServiceProvider et L13
`new Model()` dans `register()` est désormais interdit (LogicException). Toute instanciation Eloquent doit migrer dans `boot()`.

```php
public function register(): void
{
    $this->app->bind(PostRepositoryContract::class, EloquentPostRepository::class);
    // NE PAS faire : $defaults = new Post(); ← LogicException en L13
}

public function boot(): void
{
    Post::observe(PostObserver::class);
}
```

### Cache prefixes par module
L13 utilise hyphens par défaut. Pour FuseCore, configurer le préfixe par module via `module.json` reste compatible :

```json
{
  "name": "BlogPost",
  "cache_prefix": "blogpost-"
}
```

## Best Practices

### DO
- Créer un module = un dossier `FuseCore/<Module>/` complet (Contracts/, Services/, Http/, Models/)
- Déclarer toutes les dépendances inter-modules via Contracts (jamais classes concrètes)
- Utiliser `final readonly class` pour DTOs de module (PHP 8.3+)
- Migrer toute logique Model du `register()` vers `boot()`
- Préférer Inertia 2 + React 19 pour les modules avec UI

### DON'T
- Importer une classe d'un autre module sans passer par son Contract
- Mettre la logique métier dans Controllers (extraire en Service du module)
- Instancier un modèle Eloquent dans `register()` (LogicException L13)
- Dépasser 100 lignes par fichier (splitter en sous-modules ou Services)
- Partager des migrations entre modules (chaque module possède ses tables)
