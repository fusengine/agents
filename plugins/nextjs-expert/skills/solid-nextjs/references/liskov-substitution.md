---
name: liskov-substitution
description: LSP Guide - Ensuring implementations respect interface contracts
when-to-use: implementing interfaces, multiple providers, contract compliance
keywords: Liskov, substitution, contract, interface, behavior, LSP
priority: high
related: interface-segregation.md, templates/adapter.md
---

# Liskov Substitution Principle (LSP)

**Implementations must be interchangeable without surprises**

---

## When to Apply LSP?

### Symptoms of Violation

1. **Different implementations have different return types**
   - Stripe returns `{ transactionId: string }`
   - PayPal returns `{ id: number }` ← Different!

2. **Must check concrete type before using**
   - `if (provider instanceof StripeProvider)` → Violation
   - Should work with any provider

3. **One implementation throws where another doesn't**
   - Inconsistent behavior across implementations

4. **Code works with one provider but not another**
   - Works with Stripe, crashes with PayPal

---

## Why It Matters?

All implementations of an interface must:
- Return the same type
- Throw the same types of exceptions
- Have the same observable behavior

If not → Calling code breaks when switching implementations.

---

## Contract Rules

### 1. Return Types Must Match

Interface says `Promise<TransactionResult>` → ALL implementations return `Promise<TransactionResult>`.

Each implementation file in `modules/[feature]/src/services/` must follow the interface from `modules/[feature]/src/interfaces/`.

### 2. Exceptions Must Match

If interface specifies `@throws PaymentError`:
- All implementations in `services/` must throw `PaymentError` on errors
- Not generic `Error`, not `TypeError`

### 3. Same Preconditions

If interface accepts any string for `id`:
- No implementation can require a specific format (UUID only, etc.)
- Must accept what interface specifies

### 4. Same Postconditions

If interface guarantees `amount >= 0`:
- No implementation can return negative amounts

---

## How to Ensure LSP?

### Step 1: Document Interface Contract

In `modules/[feature]/src/interfaces/xxx.interface.ts`:

Document for each method:
- What it returns (always, never null?)
- What exceptions it can throw
- What preconditions on parameters
- What guarantees on result

### Step 2: All Implementations Follow Contract

Each file in `modules/[feature]/src/services/`:
- Returns exact type specified
- Throws exact exceptions specified
- Handles all input cases

---

## File Structure

```
modules/payments/src/
├── interfaces/
│   └── payment-provider.interface.ts  # Contract with JSDoc
└── services/
    ├── stripe.service.ts              # Follows contract
    ├── paypal.service.ts              # Follows contract
    └── checkout.service.ts            # Follows contract
```

All services implement same interface, same behavior.

---

## Decision Criteria

### Does My Implementation Respect LSP?

1. **Same return type as interface?** → Required

2. **Same exceptions as interface?** → Required

3. **Can replace with another implementation without code changes?** → If no, LSP violation

---

## Common Violations

### Different Return Formats

**Bad:**
- Stripe adapter returns `{ transactionId: "xxx" }`
- PayPal adapter returns `{ id: 123, status: "ok" }`

**Good:**
- Both return `{ transactionId: string }` as defined in interface

### Different Error Handling

**Bad:**
- Stripe adapter throws `StripeError`
- PayPal adapter throws `Error`

**Good:**
- Both throw `PaymentError` as defined in interface

---

## Where to Find Code Templates?

→ `templates/adapter.md` - Adapter that respects interface
→ `templates/interface.md` - Interface with documented contract

---

## LSP Checklist

- [ ] Interface in `interfaces/` has clear JSDoc contract
- [ ] All implementations in `services/` return same type
- [ ] All implementations throw same exception types
- [ ] No `instanceof` checks in calling code
- [ ] Can swap implementations without code changes
