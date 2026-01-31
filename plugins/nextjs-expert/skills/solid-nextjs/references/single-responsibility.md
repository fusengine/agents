---
name: single-responsibility
description: SRP Guide - When and how to split files, line limits, modular paths
when-to-use: file too long, component doing too much, refactoring, code organization
keywords: single responsibility, SRP, splitting, lines, refactoring, modular
priority: high
related: architecture-patterns.md, templates/service.md, templates/hook.md
---

# Single Responsibility Principle (SRP)

**One file = One reason to change**

---

## When to Apply SRP?

### Symptoms of Violation

1. **File exceeds 90 lines** → Trigger a split
2. **Cannot describe file in one sentence** → Too many responsibilities
3. **File has more than 15 imports** → Doing too much
4. **File has more than 5 exports** → Mixed responsibilities

### Line Limits by Type

| File Type | Max Limit | Split Threshold |
|-----------|-----------|-----------------|
| Page component (`app/*/page.tsx`) | 50 lines | 40 lines |
| Client component (`'use client'`) | 60 lines | 50 lines |
| Server component | 80 lines | 70 lines |
| Service / Utility | 80 lines | 70 lines |
| Hook | 60 lines | 50 lines |
| Server Action | 30 lines | 25 lines |
| Any other file | 100 lines | 90 lines |

---

## How to Split? - MODULAR PATHS

When file approaches limit, split using this structure:

```
modules/[feature]/src/
├── interfaces/           # Types ONLY
│   └── xxx.interface.ts
├── services/             # Business logic
│   └── xxx.service.ts
├── queries/              # Database queries
│   └── xxx.queries.ts
├── hooks/                # State/Effects
│   └── useXxx.ts
├── stores/               # Zustand stores
│   └── xxx.store.ts
├── validators/           # Zod schemas
│   └── xxx.validator.ts
├── actions/              # Server Actions
│   └── xxx.actions.ts
├── constants/            # Constants
│   └── xxx.constants.ts
└── i18n/                 # Feature translations
    └── en.json
```

### Split Example

Before (1 file of 150 lines in wrong place):
```
app/login/page.tsx → Types, API calls, State, Validation, UI
```

After (split into modular structure):
```
modules/auth/src/interfaces/auth.interface.ts    → Types
modules/auth/src/services/auth.service.ts        → API calls
modules/auth/src/hooks/useAuth.ts                → State
modules/auth/src/validators/auth.validator.ts    → Validation
modules/auth/components/LoginForm.tsx            → UI only
app/(auth)/login/page.tsx                        → Orchestrator only
```

---

## File Location Rules

| Content Type | Location |
|--------------|----------|
| Types/Interfaces | `modules/[feature]/src/interfaces/` |
| Business logic | `modules/[feature]/src/services/` |
| Database queries | `modules/[feature]/src/queries/` |
| React hooks | `modules/[feature]/src/hooks/` |
| Zustand stores | `modules/[feature]/src/stores/` |
| Validation | `modules/[feature]/src/validators/` |
| Server Actions | `modules/[feature]/src/actions/` |
| Constants | `modules/[feature]/src/constants/` |
| Translations | `modules/[feature]/src/i18n/` |
| UI Components | `modules/[feature]/components/` |
| Pages | `app/` (orchestrator only) |

---

## Decision Criteria

### Should This File Be Split?

1. **Can you describe its responsibility in 5 words?**
   - No → Split it

2. **Does it mix types, logic, and UI?**
   - Yes → Split into `interfaces/`, `services/`, `components/`

3. **Is business logic in a component?**
   - Yes → Extract to `services/`

4. **Are types defined in a service or component?**
   - Yes → Move to `interfaces/`

---

## Next.js Specific Rules

### Pages (`app/*/page.tsx`)

Pages should ONLY:
- Import from `modules/`
- Call services for data
- Compose components
- Handle layout

Pages should NEVER:
- Define types (→ `modules/[feature]/src/interfaces/`)
- Contain business logic (→ `modules/[feature]/src/services/`)
- Have complex state (→ `modules/[feature]/src/hooks/`)

### Server Actions

Location: `modules/[feature]/src/actions/`

One action = One operation:
- `createUser.action.ts`
- `deleteUser.action.ts`
- `updateEmail.action.ts`

---

## Where to Find Code Templates?

→ `templates/server-component.md` - Page template < 50 lines
→ `templates/client-component.md` - Client component template
→ `templates/service.md` - Service in `modules/[feature]/src/services/`
→ `templates/hook.md` - Hook in `modules/[feature]/src/hooks/`
→ `templates/action.md` - Action in `modules/[feature]/src/actions/`

---

## SRP Checklist

- [ ] File < line limit for its type
- [ ] Types in `modules/[feature]/src/interfaces/` only
- [ ] Services in `modules/[feature]/src/services/`
- [ ] Queries in `modules/[feature]/src/queries/`
- [ ] Hooks in `modules/[feature]/src/hooks/`
- [ ] Stores in `modules/[feature]/src/stores/`
- [ ] Validators in `modules/[feature]/src/validators/`
- [ ] Translations in `modules/[feature]/src/i18n/`
- [ ] Components in `modules/[feature]/components/`
- [ ] Pages only orchestrate, no logic
