---
name: solid-php
description: SOLID principles for Laravel 12 and PHP 8.5. Files < 100 lines, interfaces separated, PHPDoc mandatory.
versions:
  laravel: "12.46"
  php: "8.5"
user-invocable: true
references: references/solid-principles.md, references/php85-features.md, references/laravel12-structure.md, references/templates/code-templates.md
related-skills: laravel-architecture
---

# SOLID PHP - Laravel 12 + PHP 8.5

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing architecture
2. **fuse-ai-pilot:research-expert** - Verify Laravel/PHP docs via Context7
3. **mcp__context7__query-docs** - Check SOLID patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Critical Rules (MANDATORY)

### 1. Files < 100 lines
- **Split at 90 lines** - Never exceed 100
- Controllers < 50 lines
- Models < 80 lines (excluding relations)
- Services < 100 lines

### 2. Interfaces Separated
```
app/
├── Contracts/           # Interfaces ONLY
│   ├── UserRepositoryInterface.php
│   └── PaymentGatewayInterface.php
├── Repositories/        # Implementations
│   └── EloquentUserRepository.php
└── Services/            # Business logic
    └── UserService.php
```

### 3. PHPDoc Mandatory
```php
/**
 * Create a new user from DTO.
 *
 * @param CreateUserDTO $dto User data transfer object
 * @return User Created user model
 * @throws ValidationException If email already exists
 */
public function create(CreateUserDTO $dto): User
```

### 4. Split Strategy
```
UserService.php (main)
├── UserValidator.php (validation)
├── UserDTO.php (types)
└── UserHelper.php (utils)
```

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **SOLID** | [solid-principles.md](references/solid-principles.md) | S, O, L, I, D principles |
| **PHP 8.5** | [php85-features.md](references/php85-features.md) | New PHP features |
| **Structure** | [laravel12-structure.md](references/laravel12-structure.md) | Directory layout |

### Templates

| Template | When to use |
|----------|-------------|
| [code-templates.md](references/templates/code-templates.md) | Service, DTO, Repository |

---

## DRY - Reuse Before Creating

**Before writing ANY new code:**
1. Search existing codebase for similar functionality
2. Check shared locations: `app/Services/`, `app/Actions/`, `app/Traits/`
3. If similar code exists → extend/reuse instead of duplicate

---

## Forbidden

- ❌ Files > 100 lines
- ❌ Controllers > 50 lines
- ❌ Interfaces in implementation files
- ❌ Business logic in Models/Controllers
- ❌ Concrete dependencies (always use interfaces)
- ❌ Code without PHPDoc
- ❌ Missing `declare(strict_types=1)`
- ❌ Fat classes (> 5 public methods)
- ❌ N+1 queries (use eager loading)
