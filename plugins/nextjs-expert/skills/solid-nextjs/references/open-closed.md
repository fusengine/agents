---
name: open-closed
description: OCP Guide - Extensible code without modification via interfaces
when-to-use: adding features, multi-providers, plugins, avoiding if/switch
keywords: open closed, OCP, extension, plugin, provider, adapter, strategy
priority: high
related: dependency-inversion.md, templates/adapter.md, templates/factory.md
---

# Open/Closed Principle (OCP)

**Open for extension, closed for modification**

---

## When to Apply OCP?

### Symptoms of Violation

1. **Adding `if/else` or `switch` for a new case**
   - Each new provider = new `case`
   - File grows with each addition

2. **Modifying existing code to add a feature**
   - Risk of breaking what works

3. **Cannot add a provider without touching core**
   - PayPal requires modifying PaymentService

---

## Why It Matters?

### Without OCP (Bad)

Add Stripe → Modify `PaymentService`
Add PayPal → Modify `PaymentService`

Each modification risks breaking existing code.

### With OCP (Good)

Add Stripe → Create `StripeAdapter` in `modules/payments/src/services/`
Add PayPal → Create `PayPalAdapter` in `modules/payments/src/services/`

No modification to existing code.

---

## How to Apply OCP - Modular Structure

### Step 1: Interface in interfaces/

```
modules/payments/src/interfaces/
└── payment-provider.interface.ts
```

Define the contract that all providers must follow.

### Step 2: Implementations in services/

```
modules/payments/src/services/
├── stripe.service.ts      # Implements PaymentProvider
├── paypal.service.ts      # Implements PaymentProvider
└── apple-pay.service.ts   # Implements PaymentProvider
```

Each new provider = new file, no modification.

### Step 3: Factory in cores/

```
modules/cores/lib/factories/
└── payment.factory.ts     # Creates correct provider
```

Factory chooses implementation based on config.

---

## File Location Summary

| Type | Location |
|------|----------|
| Interface | `modules/[feature]/src/interfaces/` |
| Provider implementations | `modules/[feature]/src/services/` |
| Factory | `modules/cores/lib/factories/` |

---

## Concrete Cases

### Multi-Provider Payment

```
modules/payments/
├── src/
│   ├── interfaces/
│   │   └── payment-provider.interface.ts
│   └── services/
│       ├── stripe.service.ts
│       ├── paypal.service.ts
│       └── checkout.service.ts
```

Add new provider → Create new file in `services/`

### Multi-Provider Email

```
modules/email/
├── src/
│   ├── interfaces/
│   │   └── email-provider.interface.ts
│   └── services/
│       ├── sendgrid.service.ts
│       ├── mailgun.service.ts
│       └── resend.service.ts
```

### Multi-Provider Auth

```
modules/auth/
├── src/
│   ├── interfaces/
│   │   └── auth-provider.interface.ts
│   └── services/
│       ├── google.service.ts
│       ├── github.service.ts
│       └── apple.service.ts
```

---

## Decision Criteria

### Should I Apply OCP Here?

1. **Will there be other implementations?**
   - Likely yes → Apply OCP

2. **Will the switch/if grow?**
   - Yes → Refactor to interface + implementations

3. **Is it an external service?**
   - Yes → Interface + adapter pattern

---

## Where to Find Code Templates?

→ `templates/adapter.md` - Adapter in `modules/[feature]/src/services/`
→ `templates/factory.md` - Factory in `modules/cores/lib/factories/`
→ `templates/interface.md` - Interface in `modules/[feature]/src/interfaces/`

---

## OCP Checklist

- [ ] Interface in `modules/[feature]/src/interfaces/`
- [ ] One implementation file per provider in `services/`
- [ ] Factory in `modules/cores/lib/factories/`
- [ ] No switch/if that grows with features
- [ ] New feature = new file, not modification
- [ ] Config determines which implementation
