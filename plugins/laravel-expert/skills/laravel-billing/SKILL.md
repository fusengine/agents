---
name: laravel-billing
description: Integrate Stripe and Paddle payments with Laravel Cashier. Use when implementing subscriptions, invoices, payment methods, or billing portals.
versions:
  laravel: "12.46"
  cashier-stripe: "16.2"
  cashier-paddle: "2.6"
  php: "8.5"
user-invocable: false
references: references/billing.md, references/cashier-paddle.md
related-skills: laravel-auth
---

# Laravel Billing (Cashier)

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Check existing billing setup
2. **fuse-ai-pilot:research-expert** - Verify Cashier docs via Context7
3. **mcp__context7__query-docs** - Check subscription patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel Cashier provides subscription billing with Stripe or Paddle.

| Provider | Package |
|----------|---------|
| Stripe | `laravel/cashier` |
| Paddle | `laravel/cashier-paddle` |

---

## Critical Rules

1. **Use webhooks** for payment confirmations
2. **Handle grace periods** after cancellation
3. **Never store card details** - Use payment tokens
4. **Test with test keys** before production

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Stripe** | [billing.md](references/billing.md) | Stripe Cashier |
| **Paddle** | [cashier-paddle.md](references/cashier-paddle.md) | Paddle Cashier |

---

## Quick Reference

```php
// Check subscription
$user->subscribed('default');
$user->onTrial('default');
$user->subscription('default')->cancelled();

// Create subscription
$user->newSubscription('default', 'price_monthly')
    ->create($paymentMethodId);

// Billing portal
return $user->redirectToBillingPortal(route('dashboard'));
```
