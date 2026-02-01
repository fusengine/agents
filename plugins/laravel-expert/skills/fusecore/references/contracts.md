---
name: contracts
description: FuseCore interface contracts for modules
when-to-use: Implementing custom module behavior, extending FuseCore
keywords: contract, interface, moduleinterface, reactmoduleinterface
priority: medium
related: architecture.md, traits.md
---

# Module Contracts

## Overview

FuseCore defines contracts (interfaces) that modules can implement for consistent behavior and extensibility.

## Available Contracts

| Contract | Purpose | Location |
|----------|---------|----------|
| `ModuleInterface` | Base module contract | `Core/App/Contracts/` |
| `ReactModuleInterface` | React-enabled modules | `Core/App/Contracts/` |

## ModuleInterface

### Purpose

Defines the contract for all FuseCore modules. Every module must provide these capabilities.

### Methods

| Method | Return | Purpose |
|--------|--------|---------|
| `getName()` | string | Module identifier |
| `getVersion()` | string | Semantic version |
| `getDescription()` | string | Human description |
| `isEnabled()` | bool | Active status |
| `getPath()` | string | Absolute path |
| `getDependencies()` | array | Required modules |
| `getConfig()` | array | Module configuration |
| `register()` | void | Service registration |
| `boot()` | void | Bootstrap module |

### Implementation

Modules don't typically implement directly. The `HasModule` trait provides default implementation.

## ReactModuleInterface

### Purpose

Extends `ModuleInterface` for modules with React components.

### Additional Methods

| Method | Return | Purpose |
|--------|--------|---------|
| `hasReactComponents()` | bool | Has React directory |
| `getReactPath()` | string | Path to React code |
| `getReactRoutes()` | array | Frontend routes |
| `getViteAliases()` | array | Vite import aliases |

### React Detection

| Check | Condition |
|-------|-----------|
| `hasReactComponents()` | `/Resources/React/` exists |
| Alias generation | `@{module}` → module React path |

## When to Implement

### Use Contracts When

| Scenario | Contract |
|----------|----------|
| Custom module behavior | `ModuleInterface` |
| Override trait defaults | Any contract |
| Cross-module communication | Custom contract |

### Use Traits When

| Scenario | Approach |
|----------|----------|
| Standard module | `HasModule` trait |
| Standard + React | Trait auto-detects |
| Quick setup | Trait provides defaults |

## Creating Custom Contracts

### Location

Module-specific contracts go in:
```
FuseCore/{Module}/App/Contracts/
```

Cross-module contracts go in:
```
FuseCore/Core/App/Contracts/
```

### Naming Convention

| Type | Convention | Example |
|------|------------|---------|
| Interface | `{Name}Interface` | `PaymentGatewayInterface` |
| Repository | `{Model}RepositoryInterface` | `UserRepositoryInterface` |
| Service | `{Domain}ServiceInterface` | `OrderServiceInterface` |

## Dependency Injection

### Binding Contracts

Register contract implementations in ServiceProvider:

| Binding Type | Use Case |
|--------------|----------|
| Singleton | Stateful services |
| Bind | New instance each time |
| Contextual | Different impl per consumer |

### Resolving Contracts

| Method | Usage |
|--------|-------|
| Constructor injection | Preferred |
| `app()->make()` | When needed dynamically |
| Facade | Not recommended |

## Best Practices

1. **Interface Segregation** - Small, focused interfaces
2. **Dependency Inversion** - Depend on contracts, not implementations
3. **Consistent naming** - `*Interface` suffix
4. **Location matters** - Core vs module-specific

## SOLID Compliance

| Principle | Application |
|-----------|-------------|
| **I** - Interface Segregation | `ModuleInterface` vs `ReactModuleInterface` |
| **D** - Dependency Inversion | Depend on interfaces |

## Related References

- [traits.md](traits.md) - Default implementations
- [service-provider.md](service-provider.md) - Binding contracts
