---
name: dependency-inversion
description: DIP Guide - Depend on abstractions via interfaces in modules/[feature]/src/interfaces/
when-to-use: tight coupling, provider change, service architecture
keywords: dependency inversion, DIP, injection, abstraction, decoupling, factory
priority: high
related: open-closed.md, templates/factory.md, templates/service.md
---

# Dependency Inversion Principle (DIP)

**Depend on abstractions, not concrete implementations**

---

## When to Apply DIP?

### Symptoms of Violation

1. **Doing `new Service()` directly in component**
   - Tight coupling
   - Cannot swap implementation

2. **Importing Prisma, Stripe SDK directly in components**
   - Concrete dependency
   - Provider change = modification everywhere

3. **Changing provider requires modifying 10 files**
   - Stripe → PayPal = changes everywhere
   - Too tight coupling

---

## Why It Matters?

### Without DIP

```
Component → PrismaUserService → Prisma → PostgreSQL
```

Problems:
- Switch to MongoDB = rewrite service + all imports
- Cascading coupling

### With DIP

```
Component → IUserService ← PrismaUserService → Prisma
                         ← MongoUserService → MongoDB
```

Advantages:
- Switch to MongoDB = create MongoUserService, nothing else
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

Create interface in `modules/[feature]/src/interfaces/`:

```typescript
// modules/payments/src/interfaces/payment-provider.interface.ts
export interface PaymentProvider {
  charge(amount: number): Promise<string>
  refund(transactionId: string): Promise<string>
}
```

### Step 2: Create Implementation

Create service in `modules/[feature]/src/services/`:

```typescript
// modules/payments/src/services/stripe.service.ts
import type { PaymentProvider } from '../interfaces/payment-provider.interface'

export class StripeService implements PaymentProvider {
  // Implementation
}
```

### Step 3: Use Factory

Create factory in `modules/cores/lib/factories/`:

```typescript
// modules/cores/lib/factories/payment.factory.ts
import type { PaymentProvider } from '@/modules/payments/src/interfaces/payment-provider.interface'

export function createPaymentProvider(): PaymentProvider {
  // Return implementation based on config
}
```

---

## File Location Summary

| Type | Location |
|------|----------|
| Interface/Contract | `modules/[feature]/src/interfaces/` |
| Service implementation | `modules/[feature]/src/services/` |
| Factory | `modules/cores/lib/factories/` |

---

## Anti-Patterns to Avoid

### 1. Direct Concrete Import in Component

**Bad:**
```typescript
// In component
import { PrismaUserService } from './prisma-user.service'
const service = new PrismaUserService()
```

**Good:**
```typescript
// In component
import { createUserService } from '@/modules/cores/lib/factories/user.factory'
const service = createUserService()
```

### 2. Types Outside interfaces/

**Bad:**
```typescript
// modules/users/src/services/user.service.ts
export interface User { ... } // WRONG LOCATION
```

**Good:**
```typescript
// modules/users/src/interfaces/user.interface.ts
export interface User { ... } // CORRECT LOCATION
```

---

## Decision Criteria

### Should I Apply DIP Here?

1. **Is it an external service (DB, payment, email)?**
   - Yes → Interface in `interfaces/`, implementation in `services/`

2. **Could implementation change?**
   - Yes → Use interface + factory

3. **Does component import concrete class?**
   - Yes → Introduce abstraction

---

## Where to Find Code Templates?

→ `templates/factory.md` - Factory in `modules/cores/lib/factories/`
→ `templates/service.md` - Service in `modules/[feature]/src/services/`
→ `templates/interface.md` - Interface in `modules/[feature]/src/interfaces/`

---

## DIP Checklist

- [ ] Interfaces in `modules/[feature]/src/interfaces/`
- [ ] Implementations in `modules/[feature]/src/services/`
- [ ] Factories in `modules/cores/lib/factories/`
- [ ] No `new ConcreteService()` in components
- [ ] No direct SDK imports in components
- [ ] `import type` for interface imports
- [ ] Provider change = only 1-2 files to modify
