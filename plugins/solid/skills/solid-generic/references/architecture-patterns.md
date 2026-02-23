---
name: architecture-patterns
description: Modular TypeScript project structure (MANDATORY modules/ pattern)
when-to-use: project setup, architecture decisions, code organization
keywords: architecture, modular, structure, TypeScript, Bun, Node, modules
priority: high
related: single-responsibility.md, templates/module.md, templates/service.md
applies-to: "**/*.ts, **/modules/**"
trigger-on-edit: "modules/, src/"
level: architecture
---

# Architecture Patterns for Generic TypeScript

## Project Structure - Modular (MANDATORY)

```text
modules/
|- cores/                      # Shared across ALL features
|  |- interfaces/              # Shared types and contracts
|  |- lib/                     # Shared utilities
|  |- errors/                  # Base error classes
|  |- constants/               # Global defaults
|  \- factories/               # DI factories
|- [feature]/                  # Feature module
|  \- src/
|     |- interfaces/           # Feature types
|     |- services/             # Feature logic
|     |- validators/           # Feature schemas
|     |- utils/                # Feature helpers
|     |- errors/               # Feature errors
|     \- constants/            # Feature constants
\- [feature-b]/
   \- src/
      |- interfaces/
      \- services/
```

### Module Import Rules

```typescript
// Feature -> Cores (ALLOWED)
import type { BaseConfig } from '@/modules/cores/interfaces/config.interface'
import { handleError } from '@/modules/cores/lib/error-handler'

// Feature -> Own src (ALLOWED)
import type { User } from '../src/interfaces/user.interface'

// Feature -> Another Feature (FORBIDDEN)
// import { orderService } from '@/modules/orders/src/services/order.service'
```

If 2+ features need the same code -> move to `modules/cores/`.

---

## Project Structure - CLI Tool (Modular)

```text
modules/
|- cores/                  # Shared interfaces, errors, utils
|  |- interfaces/
|  |- lib/
|  \- errors/
|- commands/               # CLI command modules
|  \- src/
|     |- interfaces/
|     \- services/
\- cli/                    # Entry point module
   \- src/
      \- services/         # CLI wiring
```

---

## Project Structure - Plugin/Hook System (Modular)

```text
modules/
|- cores/                  # Shared hook utilities
|  |- interfaces/
|  |  \- hook.interface.ts
|  \- lib/
|     \- core.ts
|- pre-tool-use/           # Pre-hook modules
|  \- src/
|     \- services/
\- post-tool-use/          # Post-hook modules
   \- src/
      \- services/
```

---

## File Size Rules

| Type | Max Lines | Purpose |
|------|-----------|---------|
| Module | 80 | Main logic unit |
| Service | 60 | Business operations |
| Validator | 40 | Schema definitions |
| Utility | 60 | Pure helpers |
| Error class | 40 | Error definitions |
| Constants | 40 | Static values |
| Entry point | 30 | Wiring only |
| Total file | 100 | Split at 90 |

---

## Import Rules

| Direction | Allowed? |
|-----------|----------|
| Entry point -> Services | Yes |
| Services -> Interfaces | Yes |
| Feature -> Cores | Yes (modular) |
| Feature -> Own src | Yes (modular) |
| Service -> Service | **FORBIDDEN** (use DI) |
| Feature -> Feature | **FORBIDDEN** (move to cores) |

---

## Forbidden Patterns

| Pattern | Why | Solution |
|---------|-----|----------|
| Types in service files | Violates SRP | -> `interfaces/` |
| Logic in entry point | Hard to test | -> `services/` |
| Files > 100 lines | Maintenance cost | -> Split |
| Service -> Service import | Tight coupling | -> DI via factory |
| Feature -> Feature import | Cross-dependency | -> Move to `cores/` |
| `any` type | No type safety | -> Proper typing |
| Barrel exports | Bundle bloat | -> Direct imports |

