---
name: decision-guide
applies-to: "**/*.php"
description: Decision tables for pattern selection
when-to-use: Choosing between Service, Action, Repository patterns
keywords: patterns, service, action, repository, dto, decision-tree
priority: high
related: solid-principles.md, anti-patterns.md
---

# Decision Guide

## Pattern Selection

| I Need To... | Use | Location | Max Lines |
|--------------|-----|----------|-----------|
| Handle HTTP request | Controller | `Http/Controllers/` | 50 |
| Validate input | FormRequest | `Http/Requests/` | 50 |
| Transform API response | Resource | `Http/Resources/` | 50 |
| Execute single action | Action | `Actions/` | 50 |
| Orchestrate business logic | Service | `Services/` | 100 |
| Access database | Repository | `Repositories/` | 100 |
| Transfer data between layers | DTO | `DTOs/` | 50 |
| Define contract | Interface | `Contracts/` | 30 |
| React to domain event | Listener | `Listeners/` | 50 |
| Authorize action | Policy | `Policies/` | 50 |

---

## Principle Selection

| Symptom | Principle | Action |
|---------|-----------|--------|
| Class has multiple reasons to change | **S**RP | Split into focused classes |
| Adding feature requires modifying code | **O**CP | Extract interface, add impl |
| Subclass breaks parent behavior | **L**SP | Redesign inheritance |
| Class implements unused methods | **I**SP | Segregate interfaces |
| High-level depends on low-level | **D**IP | Inject interface |

---

## Layer Responsibilities

```
Request Flow:
┌─────────────┐
│  Controller │ ← HTTP concerns only (< 50 lines)
└──────┬──────┘
       │
┌──────▼──────┐
│  FormRequest│ ← Validation only
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │ ← Business logic (< 100 lines)
└──────┬──────┘
       │
┌──────▼──────┐
│ Repository  │ ← Data access (< 100 lines)
└──────┬──────┘
       │
┌──────▼──────┐
│    Model    │ ← Relations + Casts (< 80 lines)
└─────────────┘
```

---

## Service vs Action vs Repository

| Question | Service | Action | Repository |
|----------|---------|--------|------------|
| Multiple operations? | ✅ | ❌ | ❌ |
| Single focused task? | ❌ | ✅ | ❌ |
| Database queries? | ❌ | ❌ | ✅ |
| Business rules? | ✅ | ✅ | ❌ |
| Reusable across controllers? | ✅ | ✅ | ✅ |

---

## Interface Location

| Architecture | Interface Location |
|--------------|-------------------|
| Standard Laravel | `app/Contracts/` |
| FuseCore Modular | `app/Modules/[Feature]/Contracts/` |
| DDD | `app/Domain/[Context]/Contracts/` |

---

## When to Split a File

| Indicator | Threshold | Action |
|-----------|-----------|--------|
| Line count | > 90 lines | Split into 2 files |
| Public methods | > 5 | Extract related methods |
| Dependencies | > 4 | Split responsibilities |
| Nested conditions | > 3 levels | Extract to methods |

---

## Split Strategy

```
UserService.php (90+ lines)
        ↓
Split into:
├── UserService.php (orchestration)
├── UserValidator.php (validation helpers)
├── UserDTO.php (data structures)
└── UserHelper.php (utilities)
```

---

## Decision Tree: New Feature

```
New feature request?
│
├── Affects HTTP layer?
│   ├── Yes → Controller + FormRequest
│   └── No ↓
│
├── Single focused operation?
│   ├── Yes → Action class
│   └── No ↓
│
├── Complex business logic?
│   ├── Yes → Service class
│   └── No ↓
│
├── Database operation?
│   ├── Yes → Repository method
│   └── No → Utility/Helper
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| Start with Action, grow to Service | Start with Service always |
| One interface per domain concept | One generic interface |
| Split at 90 lines proactively | Wait until code breaks |
| Use Repository for queries | Query in Controllers/Services |
