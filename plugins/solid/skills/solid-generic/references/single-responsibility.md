---
name: single-responsibility
description: SRP Guide - When and how to split files, line limits, modular paths for generic TypeScript
when-to-use: file too long, module doing too much, refactoring, code organization
keywords: single responsibility, SRP, splitting, lines, refactoring, modular
priority: high
related: architecture-patterns.md, templates/service.md, templates/module.md
applies-to: "**/*.ts, **/*.tsx, **/*.js"
trigger-on-edit: "src/, lib/, modules/"
level: principle
---

# Single Responsibility Principle (SRP)

**One file = One reason to change**

---

## When to Apply SRP?

### Symptoms of Violation

1. **File exceeds 90 lines** -> Trigger a split
2. **Cannot describe file in one sentence** -> Too many responsibilities
3. **File has more than 15 imports** -> Doing too much
4. **File has more than 5 exports** -> Mixed responsibilities

### Line Limits by Type

| File Type | Max Limit | Split Threshold |
|-----------|-----------|-----------------|
| Module | 80 lines | 70 lines |
| Service | 60 lines | 50 lines |
| Validator | 40 lines | 35 lines |
| Utility | 60 lines | 50 lines |
| Any other file | 100 lines | 90 lines |

---

## How to Split? - MODULAR PATHS (MANDATORY)

When file approaches limit, split using modular structure:

```
modules/
|- cores/               # Shared across features
|  |- interfaces/       # Shared types
|  |- lib/              # Shared utils
|  \- errors/           # Base error classes
\- [feature]/
   \- src/
      |- interfaces/    # Feature types
      |- services/      # Feature logic
      |- validators/    # Feature schemas
      |- utils/         # Feature helpers
      \- constants/     # Feature constants
```

### Split Example

Before (1 file of 150 lines):
```
modules/config/src/config.ts -> Types, Parsing, Validation, Defaults, Errors
```

After (split into modular structure):
```
modules/config/src/interfaces/config.interface.ts  -> Types
modules/config/src/services/config.service.ts      -> Parsing logic
modules/config/src/validators/config.validator.ts  -> Validation
modules/config/src/constants/config.constants.ts   -> Defaults
modules/cores/errors/config.error.ts               -> Error classes (shared)
```

---

## File Location Rules (Modular MANDATORY)

| Content Type | Location |
|--------------|----------|
| Feature types | `modules/[feature]/src/interfaces/` |
| Feature logic | `modules/[feature]/src/services/` |
| Feature validation | `modules/[feature]/src/validators/` |
| Feature helpers | `modules/[feature]/src/utils/` |
| Feature constants | `modules/[feature]/src/constants/` |
| Shared types | `modules/cores/interfaces/` |
| Shared utils | `modules/cores/lib/` |
| Shared errors | `modules/cores/errors/` |
| Entry points | `src/` (root, wiring only) |

---

## Decision Criteria

### Should This File Be Split?

1. **Can you describe its responsibility in 5 words?**
   - No -> Split it

2. **Does it mix types, logic, and validation?**
   - Yes -> Split into `interfaces/`, `services/`, `validators/`

3. **Is validation logic in a service?**
   - Yes -> Extract to `validators/`

4. **Are types defined in a service file?**
   - Yes -> Move to `interfaces/`

---

## Module-Specific Rules

### Entry Points Should ONLY:
- Import and wire dependencies
- Export public API
- Parse CLI arguments (if applicable)

### Entry Points Should NEVER:
- Define types (-> `interfaces/`)
- Contain business logic (-> `services/`)
- Validate data (-> `validators/`)
- Define constants (-> `constants/`)

---

## Where to Find Code Templates?

-> `templates/module.md` - Module < 80 lines
-> `templates/service.md` - Service < 60 lines
-> `templates/interface.md` - Interface definitions
-> `templates/validator.md` - Validation schemas

---

## SRP Checklist

- [ ] File < line limit for its type
- [ ] Types in `interfaces/` only
- [ ] Services in `services/`
- [ ] Validators in `validators/`
- [ ] Utils in `utils/`
- [ ] Entry points only wire dependencies
