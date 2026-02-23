---
name: architecture-patterns
description: Modular Rails - app/modules/[feature]/ MANDATORY structure
when-to-use: Project setup, file organization, layer responsibilities
keywords: architecture, modular, app/modules, layers
priority: critical
related: single-responsibility.md, dependency-inversion.md
---

# Architecture Patterns

## MANDATORY Structure

```
app/modules/[feature]/
├── controllers/      # < 50 lines
├── services/        # < 100 lines
├── queries/         # < 100 lines
├── repositories/    # < 100 lines
├── models/          # < 50 lines
├── contracts/       # < 30 lines
└── concerns/        # < 100 lines

app/modules/core/
├── contracts/       # Shared interfaces
├── services/        # Shared logic (2+ features)
├── concerns/        # Shared mixins
└── models/
```

**NEVER use flat `app/` structure**

---

## Layer Responsibilities

| Layer | Responsibility | Max |
|-------|---|---|
| Controller | HTTP, authorize, delegate | 50 |
| Service | Business logic | 100 |
| Query | Data retrieval | 100 |
| Repository | Persistence | 100 |
| Model | Associations, validations, scopes | 50 |
| Contract | Duck type interface | 30 |

---

## Layer Flow

```
Controller (50)
    ↓ delegates to
Service (100)
    ↓ uses
Repository/Query (100) ← only layer touching DB
    ↓
Database
```

NO direct Controller→DB. NO business logic in Models.

---

## Feature Module Example

```
app/modules/users/
├── controllers/users_controller.rb
├── services/
│   ├── create_user_service.rb
│   └── reset_password_service.rb
├── queries/active_users_query.rb
├── repositories/user_repository.rb
├── models/user.rb
├── contracts/user_creator_contract.rb
└── concerns/user_timestamps_concern.rb
```

---

## DRY: Shared Code Location

- **Feature contracts** → `[feature]/contracts/`
- **Shared contracts** → `core/contracts/` (2+ features)
- **Shared services** → `core/services/` (2+ features)
- **Shared concerns** → `core/concerns/` (mixins)

---

## Import Rules

Within feature:
```ruby
require_relative '../services/create_user_service'
```

Cross-feature:
```ruby
require_relative '../../core/contracts/repository_contract'
```

---

## File Size Limits

- Max 100 lines per file (split at 90)
- Controllers max 50 (split at 40)
- Models max 50 (split at 40)
- Contracts max 30 (split at 25)

Enforce: `find app/modules -name "*.rb" -exec wc -l {} \; | awk '$1 > 100'`
