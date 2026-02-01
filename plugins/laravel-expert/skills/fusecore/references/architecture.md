---
name: architecture
description: FuseCore modular monolith architecture overview
when-to-use: Understanding the overall FuseCore design philosophy
keywords: architecture, modular, monolith, fusecore, design
priority: high
related: module-structure.md, module-discovery.md
---

# FuseCore Architecture

## Overview

FuseCore is a **Modular Monolith** architecture pattern for Laravel 12. It combines the simplicity of a monolith with the organization of microservices.

## Architecture Pattern

| Aspect | Description |
|--------|-------------|
| **Type** | Modular Monolith |
| **Location** | `/FuseCore/` (outside `/app/`) |
| **Discovery** | Automatic via `module.json` |
| **Isolation** | Complete per module |
| **Deployment** | Single application |

## Why Modular Monolith

| Benefit | Description |
|---------|-------------|
| **Simplicity** | Single deployment, no network overhead |
| **Organization** | Clear boundaries between features |
| **Scalability** | Extract modules to microservices later |
| **Team Work** | Teams own specific modules |
| **Consistency** | Shared conventions and utilities |

## Design Principles

### 1. Module Independence

Each module is self-contained:

| Contains | Location |
|----------|----------|
| Models | `/App/Models/` |
| Controllers | `/App/Http/Controllers/` |
| Services | `/App/Services/` |
| Migrations | `/Database/Migrations/` |
| Routes | `/Routes/` |
| React | `/Resources/React/` |

### 2. Explicit Dependencies

Modules declare dependencies in `module.json`:

| Field | Purpose |
|-------|---------|
| `dependencies` | Other modules required |
| `isCore` | Core infrastructure module |
| `enabled` | Toggle module on/off |

### 3. Convention Over Configuration

| Convention | Standard |
|------------|----------|
| Provider naming | `{Module}ServiceProvider` |
| Route file | Always `api.php` |
| Migrations path | `/Database/Migrations/` |
| React path | `/Resources/React/` |

### 4. Composition via Traits

| Trait | Purpose |
|-------|---------|
| `HasModule` | All module resources |
| `HasModuleDatabase` | Migrations, seeders |
| `HasModuleResources` | Views, translations |

## Core Module

The `/FuseCore/Core/` module provides infrastructure:

| Component | Purpose |
|-----------|---------|
| `ModuleDiscovery` | Scan and register modules |
| `RouteAggregator` | Combine module routes |
| `ModuleCacheManager` | Cache module metadata |
| Contracts | Interface definitions |
| Traits | Composition helpers |

## Request Flow

1. **Bootstrap** → `FuseCoreServiceProvider` loads
2. **Discovery** → `ModuleDiscovery` scans `module.json` files
3. **Registration** → Each module's ServiceProvider registers
4. **Routes** → `RouteAggregator` combines all routes
5. **Request** → Laravel handles as normal

## Best Practices

1. **Never use `/app/`** - All code in `/FuseCore/`
2. **Minimal Core** - Keep Core module infrastructure-only
3. **Declare dependencies** - Explicit in `module.json`
4. **One responsibility** - Each module = one feature domain
5. **Share via contracts** - Use interfaces for cross-module

## Anti-Patterns

| Anti-Pattern | Solution |
|--------------|----------|
| Code in `/app/` | Move to `/FuseCore/` |
| Direct module imports | Use dependency injection |
| Circular dependencies | Introduce shared contract |
| Mega-modules | Split into focused modules |

## Related References

- [module-structure.md](module-structure.md) - Detailed structure
- [module-discovery.md](module-discovery.md) - Auto-discovery
- [contracts.md](contracts.md) - Interface contracts
