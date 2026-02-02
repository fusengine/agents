---
name: onboarding
description: Seller verification and KYC process
when-to-use: Implementing seller registration flow
keywords: onboarding, kyc, verification, identity, account-link
---

# Seller Onboarding

## Onboarding Flow

```
1. Create Account → 2. Generate Link → 3. Stripe Hosted → 4. Webhook → 5. Ready
      │                    │                  │               │           │
   Express             AccountLink         KYC Form     account.updated  Payouts OK
```

## Requirements by Account Type

| Requirement | Standard | Express | Custom |
|-------------|----------|---------|--------|
| Email | ✅ | ✅ | ✅ |
| Legal name | Stripe | Stripe | You collect |
| Address | Stripe | Stripe | You collect |
| Tax ID | Stripe | Stripe | You collect |
| Bank account | Stripe | Stripe | You collect |
| ID verification | Stripe | Stripe | You + Stripe Radar |

## Onboarding States

| State | Meaning | Action |
|-------|---------|--------|
| `requirements.currently_due` | Info needed now | Send to onboarding |
| `requirements.eventually_due` | Info needed later | Remind seller |
| `requirements.past_due` | Deadline passed | Urgent: complete or restrict |
| `charges_enabled: true` | Can accept payments | ✅ Ready |
| `payouts_enabled: true` | Can receive payouts | ✅ Fully ready |

## Decision: When is Seller "Ready"?

```
Can seller accept payments?
└── charges_enabled: true

Can seller receive money?
└── payouts_enabled: true

Is there pending info?
└── requirements.currently_due is empty
```

## Webhook Events

| Event | Meaning |
|-------|---------|
| `account.updated` | Account status changed |
| `account.application.authorized` | OAuth connected |
| `account.application.deauthorized` | Seller disconnected |
| `capability.updated` | Capability status changed |

## Re-onboarding Triggers

Sellers may need to re-verify when:
- Legal structure changes
- Address changes
- Thresholds reached (volume-based verification)
- Stripe policy updates

## Best Practices

| Practice | Reason |
|----------|--------|
| Don't allow sales before `charges_enabled` | Payment will fail |
| Don't promise payouts before `payouts_enabled` | Transfer will fail |
| Track `requirements.currently_due` | Prevent service interruption |
| Send reminder emails | Keep sellers compliant |
| Handle `account.updated` webhook | Real-time status sync |

→ **Implementation:** See [templates/SellerOnboardingController.php.md](templates/SellerOnboardingController.php.md)
