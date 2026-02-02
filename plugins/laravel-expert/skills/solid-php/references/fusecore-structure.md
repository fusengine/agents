---
name: fusecore-structure
description: FuseCore modular architecture structure (Laravel + React)
when-to-use: Working with FuseCore modules, module discovery, cross-module communication
keywords: fusecore, modules, modular, react, frontend, backend
priority: high
related: laravel12-structure.md, solid-principles.md
---

# FuseCore Modular Architecture

## Detection

| File/Directory | Indicates FuseCore |
|----------------|-------------------|
| `FuseCore/` directory | ✅ Modular structure |
| `module.json` in modules | ✅ Auto-discovery enabled |
| `Resources/react/` | ✅ React frontend per module |

---

## Complete Directory Structure

```
FuseCore/
├── Core/                              # Framework core module
│   ├── App/                           # PHP Backend
│   │   ├── Services/ModuleDiscovery.php
│   │   └── Traits/
│   │       ├── HasModule.php
│   │       ├── HasModuleDatabase.php
│   │       └── HasModuleResources.php
│   └── Resources/react/src/           # React Frontend
│       ├── components/
│       │   ├── ui/                    # shadcn-like components
│       │   ├── form/                  # Form components
│       │   └── layout/                # Layout components
│       ├── contexts/                  # React contexts
│       ├── hooks/                     # Custom hooks
│       ├── interfaces/                # TypeScript interfaces
│       ├── stores/                    # Zustand stores
│       ├── api/                       # API calls
│       ├── i18n/                      # Translations
│       ├── lib/                       # Utilities
│       └── main.tsx                   # Entry point
│
└── [Module]/                          # Feature module (User, Dashboard, etc.)
    ├── App/                           # PHP Backend
    │   ├── Contracts/                 # Module interfaces
    │   ├── Services/                  # Business logic (< 100 lines)
    │   ├── Http/Controllers/          # < 50 lines
    │   ├── Http/Requests/             # Validation
    │   ├── Http/Resources/            # API transform
    │   └── Models/                    # Eloquent (< 80 lines)
    ├── Resources/react/src/           # React Frontend
    │   ├── components/                # Module components
    │   ├── pages/                     # Module pages
    │   ├── hooks/                     # Module hooks
    │   └── interfaces/                # Module TS interfaces
    ├── Database/migrations/
    ├── Routes/api.php
    ├── module.json
    └── ModuleServiceProvider.php
```

---

## React Frontend Structure (per Module)

```
Resources/react/src/
├── api/                       # apiClient, endpoints
├── assets/                    # Images, icons, static files
├── components/
│   ├── ui/                    # Button, Card, Dialog, Input...
│   │   └── sidebar/           # Complex component split
│   ├── form/                  # TextField, PasswordField, SubmitButton
│   └── layout/                # RootLayout, PageBreadcrumb
├── contexts/                  # LocaleContext, ThemeContext
├── hooks/                     # useAuth, useApi, useForm
├── i18n/                      # locales, translations
├── interfaces/                # User, ApiResponse, FormData
├── lib/                       # utils, cn(), formatters
├── pages/                     # Route pages (Dashboard, Profile...)
├── routes/                    # Route definitions
├── stores/                    # uiStore (Zustand)
├── styles/                    # Global CSS, themes
├── main.tsx                   # Entry point
└── router.tsx                 # Router config
```

---

## module.json (Auto-Discovery)

```json
{
    "name": "User",
    "alias": "user",
    "providers": ["FuseCore\\User\\ModuleServiceProvider"]
}
```

---

## ModuleServiceProvider with Traits

```php
final class ModuleServiceProvider extends ServiceProvider
{
    use HasModule, HasModuleDatabase, HasModuleResources;

    public array $bindings = [
        Contracts\UserServiceInterface::class => Services\UserService::class,
    ];

    public function boot(): void
    {
        $this->loadRoutesFrom($this->modulePath('Routes/api.php'));
        $this->loadMigrationsFrom($this->modulePath('Database/migrations'));
    }
}
```

---

## Interface Locations

| Layer | Location |
|-------|----------|
| PHP Backend | `FuseCore/[Module]/App/Contracts/` |
| React Frontend | `FuseCore/[Module]/Resources/react/src/interfaces/` |

---

## Best Practices

| DO | DON'T |
|----|-------|
| One module per bounded context | One module per model |
| Communicate via interfaces | Import concrete classes |
| Keep React components < 100 lines | Fat components |
| Use Zustand for state | Prop drilling |
| Split complex components | Single 500-line file |
