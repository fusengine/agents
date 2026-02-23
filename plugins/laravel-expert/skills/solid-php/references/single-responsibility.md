---
name: single-responsibility
description: SRP Guide - When and how to split files, line limits for Laravel 12
when-to-use: file too long, controller doing too much, fat models, refactoring
keywords: single responsibility, SRP, splitting, lines, controller, service
priority: high
related: decision-guide.md, templates/code-templates.md, templates/controller-templates.md
---

# Single Responsibility Principle (SRP) for Laravel

**One class = One reason to change**

---

## When to Apply SRP?

### Symptoms of Violation

1. **Class exceeds 90 lines** -> Trigger a split
2. **Controller has business logic** -> Extract to Service
3. **Model has queries AND business logic** -> Split
4. **Service handles validation + logic + notifications** -> Extract each

### Line Limits by Type

| File Type | Max Lines | Split Threshold |
|-----------|-----------|-----------------|
| Controller | 50 | 40 |
| FormRequest | 50 | 40 |
| Action | 50 | 40 |
| Service | 100 | 90 |
| Repository | 100 | 90 |
| Model | 80 (excl. relations) | 70 |
| DTO | 50 | 40 |
| Policy | 50 | 40 |

---

## How to Split? - MODULAR PATHS (FuseCore MANDATORY)

When file approaches limit, split using FuseCore modular structure:

```
FuseCore/[Module]/App/
|- Contracts/               # Module interfaces ONLY
|  \- UserRepositoryInterface.php
|- Services/                # Module business logic
|  \- UserService.php
|- Repositories/            # Module data access
|  \- EloquentUserRepository.php
|- Actions/                 # Single operations
|  \- CreateUserAction.php
|- DTOs/                    # Data transfer
|  \- CreateUserDTO.php
|- Http/
|  |- Controllers/          # HTTP layer only
|  |- Requests/             # Validation only
|  \- Resources/            # API transformation only
|- Events/                  # Domain events
|- Listeners/               # Event handlers
\- Policies/                # Authorization
```

Shared code goes in `FuseCore/Core/App/`.

### Split Example

Before (fat controller of 120 lines):
```
UserController -> Validation, CRUD, Email, Report
```

After (in `FuseCore/User/App/`):
```
Http/Controllers/UserController.php    -> HTTP only (< 50 lines)
Http/Requests/StoreUserRequest.php     -> Validation (< 50 lines)
Services/UserService.php               -> Business logic (< 100 lines)
Repositories/EloquentUserRepository.php -> Data access (< 100 lines)
DTOs/CreateUserDTO.php                 -> Data structure (< 50 lines)
Events/UserCreated.php                 -> Domain event
```

---

## Layer Responsibilities

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| Controller | Route to Service, return Resource | Business logic, queries, validation |
| FormRequest | Validation rules, `toDTO()` | Business logic, queries |
| Service | Orchestrate logic, call Repository | Direct queries, HTTP concerns |
| Repository | Eloquent queries | Business logic, HTTP concerns |
| Action | Single focused operation | Multiple operations |
| DTO | Data structure, `from()` factory | Logic, side effects |

---

## Decision Criteria

1. **Can you describe class in one sentence?** -> No -> Split
2. **Does controller have DB queries?** -> Yes -> Extract to Repository
3. **Does service validate data?** -> Yes -> Move to FormRequest
4. **Does model have business logic?** -> Yes -> Extract to Service

---

## Where to Find Code Templates?

-> `templates/code-templates.md` - Service, DTO, Repository, Interface
-> `templates/controller-templates.md` - Controller, Action, FormRequest, Policy

---

## SRP Checklist

- [ ] Controllers < 50 lines (HTTP only)
- [ ] Services < 100 lines (logic only)
- [ ] Repositories < 100 lines (queries only)
- [ ] Models < 80 lines (relations + casts only)
- [ ] Interfaces in `FuseCore/[Module]/App/Contracts/` only
- [ ] Validation in FormRequests only
- [ ] No business logic in Controllers
