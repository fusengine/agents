---
name: laravel12-structure
description: Laravel 12 standard directory structure with SOLID principles
when-to-use: Standard Laravel projects without FuseCore modules
keywords: laravel, structure, directory, app, contracts, services
priority: high
related: fusecore-structure.md, solid-principles.md
---

# Laravel 12 Structure

## Directory Layout

```
app/
├── Http/
│   ├── Controllers/      # < 50 lines each
│   ├── Requests/         # Form validation
│   └── Resources/        # API transformations
├── Models/               # < 80 lines (relations only)
├── Services/             # < 100 lines (business logic)
├── Contracts/            # Interfaces ONLY
├── Repositories/         # Data access
├── Actions/              # Single-purpose (< 50 lines)
├── DTOs/                 # Data transfer objects
├── Enums/                # PHP 8.1+ enums
├── Events/               # Domain events
├── Listeners/            # Event handlers
└── Policies/             # Authorization
```

---

## Responsibility Matrix

| Directory | Responsibility | Max Lines | Depends On |
|-----------|---------------|-----------|------------|
| Controllers | HTTP handling | 50 | Services |
| Requests | Validation | 50 | - |
| Resources | API transform | 50 | Models |
| Services | Business logic | 100 | Repositories |
| Repositories | Data access | 100 | Models |
| Actions | Single operation | 50 | Services/Repos |
| Models | Relations/Casts | 80 | - |
| DTOs | Data structure | 50 | - |
| Contracts | Interfaces | 30 | - |

---

## Code Placement Flowchart

```
Where does this code belong?
│
├── Handles HTTP? ──────────────→ Controllers/
├── Validates input? ───────────→ Requests/
├── Transforms for API? ────────→ Resources/
├── Single focused task? ───────→ Actions/
├── Complex business rules? ────→ Services/
├── Database queries? ──────────→ Repositories/
├── Data structure? ────────────→ DTOs/
├── Contract definition? ───────→ Contracts/
├── Reacts to event? ───────────→ Listeners/
└── Authorizes action? ─────────→ Policies/
```

---

## Layer Communication

```
Controller → Service → Repository → Model
     ↓           ↓           ↓
  Request      DTO       Eloquent
```

**Rules:**
- Controllers ONLY call Services
- Services ONLY call Repositories
- Repositories ONLY use Models
- No layer skipping

---

## Interface Locations

| Type | Location |
|------|----------|
| Repository contracts | `app/Contracts/Repositories/` |
| Service contracts | `app/Contracts/Services/` |
| External services | `app/Contracts/External/` |

---

## File Size Limits

| Type | Max Lines | Split Strategy |
|------|-----------|----------------|
| Controller | 50 | Extract to Service |
| Service | 100 | Split into Actions |
| Repository | 100 | Split by entity |
| Model | 80 | Extract scopes |
| Action | 50 | Single purpose |
| DTO | 50 | One per use case |

---

## Best Practices

| DO | DON'T |
|----|-------|
| Keep Controllers thin | Put logic in Controllers |
| Use DTOs for data | Pass arrays |
| Define interfaces in Contracts | Mix interfaces with impl |
| One Model per table | Business logic in Models |
| Repository for queries | Query in Services |
