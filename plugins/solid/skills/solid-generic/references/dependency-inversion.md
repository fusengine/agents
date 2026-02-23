---
name: dependency-inversion
description: DIP Guide - Depend on abstractions via interfaces, factory injection for TypeScript
when-to-use: tight coupling, service architecture, testing, mocking
keywords: dependency inversion, DIP, injection, abstraction, factory, decoupling
priority: high
related: open-closed.md, templates/factory.md, templates/service.md
applies-to: "**/*service*.ts, **/*factory*.ts"
trigger-on-edit: "services/, factories/"
level: principle
---

# Dependency Inversion Principle (DIP)

**Depend on abstractions, not concrete implementations**

---

## When to Apply DIP?

### Symptoms of Violation

1. **Direct `fetch()` or `fs.readFile()` in services** -> Cannot mock
2. **`new ConcreteClass()` in business logic** -> Tight coupling
3. **Changing provider requires modifying 10+ files** -> Cascading changes
4. **Cannot test without real database/API** -> Missing abstraction layer

---

## Why It Matters?

### Without DIP
```
Service -> fetch() -> External API
Service -> fs.readFile() -> Filesystem
```
Problems: Cannot mock, cannot swap provider, cannot test in isolation.

### With DIP
```
Service <- HttpClient interface <- fetchClient (production)
                                <- mockClient (tests)
```
Advantages: Swap implementation in one place, easy testing, no cascading changes.

---

## Interface Location (CRITICAL - Modular MANDATORY)

Feature interfaces: `modules/[feature]/src/interfaces/`
Shared interfaces: `modules/cores/interfaces/`

```
modules/
|- cores/
|  |- interfaces/
|  |  |- http.interface.ts      # Shared HTTP contract
|  |  \- storage.interface.ts   # Shared storage contract
|  \- lib/
|     |- fetch-client.ts        # HttpClient implementation
|     \- file-storage.ts        # Storage implementation
\- users/
   \- src/
      |- interfaces/
      |  \- user.interface.ts   # Feature-specific types
      \- services/
         \- user.service.ts     # Implements via injected deps
```

---

## How to Apply DIP?

### Step 1: Define Shared Interface

```typescript
// modules/cores/interfaces/http.interface.ts
export interface HttpClient {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: unknown): Promise<T>
}
```

### Step 2: Create Implementation in Cores

```typescript
// modules/cores/lib/fetch-client.ts
import type { HttpClient } from '../interfaces/http.interface'

export function createFetchClient(baseUrl: string): HttpClient {
  return {
    get: async <T>(url: string) => {
      const res = await fetch(`${baseUrl}${url}`)
      return res.json() as T
    },
    post: async <T>(url: string, data: unknown) => {
      const res = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json() as T
    }
  }
}
```

### Step 3: Create Feature Service with DI

```typescript
// modules/users/src/services/user.service.ts
import type { HttpClient } from '@/modules/cores/interfaces/http.interface'
import type { User } from '../interfaces/user.interface'

export function createUserService(client: HttpClient) {
  return {
    getById: (id: string) => client.get<User>(`/users/${id}`),
    create: (data: Partial<User>) => client.post<User>('/users', data)
  }
}
```

### Step 4: Wire in Entry Point

```typescript
// src/main.ts (thin wiring only)
import { createFetchClient } from '@/modules/cores/lib/fetch-client'
import { createUserService } from '@/modules/users/src/services/user.service'

const client = createFetchClient('https://api.example.com')
const userService = createUserService(client)
```

-> See `templates/factory.md` for complete patterns

---

## Anti-Patterns

| Anti-Pattern | Fix |
|--------------|-----|
| Direct `fetch()` in service | Inject `HttpClient` interface |
| `new Class()` in business logic | Use factory function |
| Importing concrete in service | Import interface only |
| Types outside `interfaces/` | Move to `modules/[feature]/src/interfaces/` |

---

## Decision Criteria

1. **Is it an external dependency?** -> Yes -> Interface + factory
2. **Could implementation change?** -> Yes -> Use interface
3. **Do I need to test this?** -> Yes -> Inject for mocking

---

## Where to Find Code Templates?

-> `templates/factory.md` - Factory with DI patterns
-> `templates/service.md` - Service with injected dependencies
-> `templates/interface.md` - Interface definitions

---

## DIP Checklist

- [ ] Shared interfaces in `modules/cores/interfaces/`
- [ ] Feature interfaces in `modules/[feature]/src/interfaces/`
- [ ] Services accept dependencies via factory
- [ ] No direct `fetch()`, `fs`, or `new Class()` in services
- [ ] Entry point wires implementations
- [ ] Tests use mock implementations
