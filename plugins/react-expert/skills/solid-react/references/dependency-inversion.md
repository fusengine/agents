---
name: dependency-inversion
description: DIP Guide - Depend on abstractions via interfaces in modules/[feature]/src/interfaces/
when-to-use: tight coupling, service architecture, testing, mocking
keywords: dependency inversion, DIP, injection, abstraction, decoupling, factory
priority: high
related: open-closed.md, templates/factory.md, templates/service.md
---

# Dependency Inversion Principle (DIP)

**Depend on abstractions, not concrete implementations**

---

## When to Apply DIP?

### Symptoms of Violation

1. **Doing direct `fetch()` or `axios` in services**
   - Tight coupling to HTTP implementation
   - Cannot swap or mock easily

2. **Importing concrete implementations directly**
   - Provider change = modification everywhere
   - Testing becomes difficult

3. **Changing provider requires modifying 10+ files**
   - Too tight coupling
   - Cascading changes

---

## Why It Matters?

### Without DIP

```
Component → userService → fetch() → API
```

Problems:
- Switch HTTP client = rewrite service + all usages
- Cannot mock for tests
- Cascading coupling

### With DIP

```
Component → userService ← HttpClient interface
                        ← fetchClient (production)
                        ← mockClient (tests)
```

Advantages:
- Switch client = create new implementation, nothing else
- Easy testing with mock client
- Component doesn't know which implementation

---

## Interface Location (CRITICAL)

ALL interfaces go in: `modules/[feature]/src/interfaces/`

```
modules/[feature]/src/
├── interfaces/
│   ├── [service].interface.ts    # Service contracts
│   └── [entity].interface.ts     # Entity types
├── services/
│   └── [service].service.ts      # Implements interface
└── ...
```

---

## How to Apply DIP?

### Step 1: Define Interface

Create interface in `modules/cores/interfaces/`:

```typescript
// modules/cores/interfaces/http.interface.ts
export interface HttpClient {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: unknown): Promise<T>
}
```

### Step 2: Create Implementation

Create client in `modules/cores/lib/`:

→ See `templates/factory.md` for complete implementation

### Step 3: Create Service with DI

Create service factory that accepts interface:

→ See `templates/service.md` for complete implementation

### Step 4: Use Context for DI

Provide services via React Context:

→ See `templates/factory.md` for ServicesProvider pattern

---

## File Location Summary

| Type | Location |
|------|----------|
| Interface/Contract | `modules/cores/interfaces/` or `modules/[feature]/src/interfaces/` |
| Implementation | `modules/cores/lib/` or `modules/[feature]/src/services/` |
| Factory | `modules/cores/factories/` |

---

## Anti-Patterns to Avoid

### 1. Direct fetch() in Service

**Bad:**
```typescript
export const userService = {
  getUser: (id: string) => fetch(`/api/users/${id}`)
}
```

**Good:**
```typescript
export function createUserService(client: HttpClient) {
  return {
    getUser: (id: string) => client.get(`/users/${id}`)
  }
}
```

### 2. Types Outside interfaces/

**Bad:** Types defined in service file
**Good:** Types in `modules/[feature]/src/interfaces/`

---

## Decision Criteria

### Should I Apply DIP Here?

1. **Is it an external dependency (HTTP, storage)?**
   - Yes → Interface + factory

2. **Could implementation change?**
   - Yes → Use interface

3. **Do I need to test this?**
   - Yes → Inject dependencies for easy mocking

---

## Where to Find Code Templates?

→ `templates/factory.md` - Factory with DI patterns
→ `templates/service.md` - Service with injected dependencies
→ `templates/interface.md` - Interface definitions

---

## DIP Checklist

- [ ] Interfaces in `interfaces/` folder
- [ ] Services accept dependencies via factory
- [ ] No direct `fetch()` or `axios` in services
- [ ] Context provides services for DI
- [ ] Tests use mock implementations
- [ ] Provider change = only 1-2 files to modify
