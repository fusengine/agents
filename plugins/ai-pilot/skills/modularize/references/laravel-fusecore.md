# Laravel Modular Architecture Reference

## 1. Detection

| Condition | Architecture |
|---|---|
| `FuseCore/` dir + `artisan` file exist | FuseCore modular |
| Neither condition met | Standard modular |

## 2. Target Structure

**FuseCore:**
```
FuseCore/{Module}/App/{Models,Services,Controllers,Requests,
  Events,Listeners,Jobs,Commands,Repositories,Observers,
  Policies,Mail,Notifications,Resources,Console,Middleware}/
FuseCore/{Module}/module.json
```

**Standard modular:**
```
app/Modules/{Module}/{Models,Services,Controllers,...}/
```

## 3. module.json (required for every FuseCore module)

```json
{
  "name": "ModuleName",
  "namespace": "FuseCore\\ModuleName",
  "version": "1.0.0"
}
```

## 4. Migration Steps

1. **Identify module** — group related classes by business domain
2. **Create directory** — `FuseCore/{Module}/App/` (or `app/Modules/{Module}/`)
3. **Create module.json** — add required fields (name, namespace, version)
4. **Move files** — relocate classes into the module subdirectory
5. **Update namespaces** — adjust `namespace` declarations and `use` imports
6. **Move shared code to Core** — anything used by 2+ modules goes to `FuseCore/Core/`
7. **Validate** — run `php artisan` and confirm no class resolution errors

## 5. Cross-Module Isolation Rules

- Modules NEVER import from each other directly
- All shared code goes through `FuseCore/Core/` (FuseCore) or `app/Modules/Core/` (standard)
- Blocked in `app/` when FuseCore is detected:
  `Models, Services, Actions, Controllers, Requests, Events, Listeners, Jobs,`
  `Commands, Repositories, Observers, Policies, Mail, Notifications,`
  `Resources, Console, Middleware, Contracts, DTOs`

## 6. Quick Migration Example

**Before** (`app/Services/OrderService.php`):
```php
namespace App\Services;
class OrderService { ... }
```

**After** (`FuseCore/Order/App/Services/OrderService.php`):
```php
namespace FuseCore\Order\App\Services;
class OrderService { ... }
```

Also create `FuseCore/Order/module.json` with name, namespace, version.
