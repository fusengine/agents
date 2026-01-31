---
name: solid-principles
description: Overview of 5 SOLID principles for Next.js modular architecture
when-to-use: understanding SOLID, choosing which principle to apply, architecture overview
keywords: SOLID, principles, architecture, design patterns, Next.js, modular
priority: high
related: single-responsibility.md, open-closed.md, liskov-substitution.md, interface-segregation.md, dependency-inversion.md
---

# SOLID Principles - Overview

## What is SOLID?

SOLID is an acronym for 5 design principles for maintainable, extensible code.

---

## Modular Architecture (CRITICAL)

All SOLID principles use this structure:

```
modules/[feature]/
├── api/                    # API routes
├── components/             # UI components
└── src/
    ├── interfaces/         # Types and contracts ONLY
    ├── services/           # Business logic
    ├── queries/            # Database queries
    ├── hooks/              # React hooks
    ├── stores/             # Zustand stores
    ├── validators/         # Zod schemas
    ├── actions/            # Server actions
    ├── constants/          # Constants
    └── i18n/               # Feature translations
```

Shared code goes in:
```
modules/cores/
├── components/             # Shared UI
├── database/               # Prisma singleton
├── hooks/                  # Shared hooks
├── stores/                 # Global stores
├── lib/
│   └── factories/          # DI factories
├── middleware/             # Auth, rate-limit
└── i18n/                   # Global translations
```

---

## The 5 Principles

### S - Single Responsibility

**When:** File > 90 lines, does multiple things

**Action:** Split into modular structure:
- Types → `modules/[feature]/src/interfaces/`
- Logic → `modules/[feature]/src/services/`
- State → `modules/[feature]/src/hooks/`
- Validation → `modules/[feature]/src/validators/`

→ See `single-responsibility.md`

---

### O - Open/Closed

**When:** Adding if/switch for new provider

**Action:**
- Interface in `modules/[feature]/src/interfaces/`
- Each provider in `modules/[feature]/src/services/`
- Factory in `modules/cores/lib/factories/`

→ See `open-closed.md`

---

### L - Liskov Substitution

**When:** Implementing interfaces, multiple providers

**Action:** All implementations in `services/` must:
- Return same type as interface
- Throw same exceptions
- Be interchangeable

→ See `liskov-substitution.md`

---

### I - Interface Segregation

**When:** Interface > 5 methods

**Action:** Split in `modules/[feature]/src/interfaces/`:
- `user-reader.interface.ts`
- `user-writer.interface.ts`
- `user-auth.interface.ts`

→ See `interface-segregation.md`

---

### D - Dependency Inversion

**When:** Direct import of Prisma/Stripe/etc in component

**Action:**
- Interface in `modules/[feature]/src/interfaces/`
- Implementation in `modules/[feature]/src/services/`
- Factory in `modules/cores/lib/factories/`

→ See `dependency-inversion.md`

---

## Quick Decision Guide

| Symptom | Principle | Where to Put Code |
|---------|-----------|-------------------|
| File > 90 lines | **S** | Split into `interfaces/`, `services/`, `hooks/` |
| Adding if/switch | **O** | New file in `services/` |
| Different behaviors | **L** | Fix implementations in `services/` |
| Interface > 5 methods | **I** | Split files in `interfaces/` |
| Direct SDK import | **D** | Interface + Factory |

---

## Global Checklist

- [ ] Types in `modules/[feature]/src/interfaces/` ONLY
- [ ] Services in `modules/[feature]/src/services/`
- [ ] Queries in `modules/[feature]/src/queries/`
- [ ] Hooks in `modules/[feature]/src/hooks/`
- [ ] Stores in `modules/[feature]/src/stores/`
- [ ] Validators in `modules/[feature]/src/validators/`
- [ ] Translations in `modules/[feature]/src/i18n/`
- [ ] Factories in `modules/cores/lib/factories/`
- [ ] Files < 100 lines (split at 90)
- [ ] All exports have JSDoc
