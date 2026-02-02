---
name: refunds-disputes
description: Handling refunds and chargebacks on Connect
when-to-use: Implementing refund logic and dispute handling
keywords: refunds, disputes, chargebacks, liability, reversals
---

# Refunds & Disputes

## Refund Scenarios

| Scenario | Complexity | Consideration |
|----------|------------|---------------|
| Before payout | Simple | Reverse transfer |
| After payout | Complex | Seller balance may go negative |
| Partial refund | Medium | Proportional fee reversal |
| Multi-seller order | Complex | Split refund logic |

## Refund Flow

```
Refund Request
      │
      ▼
┌─────────────────┐
│ Check seller    │
│ balance         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Sufficient  Insufficient
    │         │
    ▼         ▼
Refund    Platform covers
issued    (negative balance)
```

## Who Pays for Refunds?

| Charge Type | Default Liability |
|-------------|-------------------|
| Direct | Seller |
| Destination | Platform (configurable) |
| Separate + Transfer | Platform |

## Dispute (Chargeback) Flow

```
1. Customer disputes → 2. Stripe notifies → 3. Evidence submitted → 4. Decision
         │                    │                      │                   │
     Bank claim         charge.dispute.         Platform/Seller      Won/Lost
                          created              provides docs
```

## Dispute Liability by Account Type

| Account Type | Dispute Liability |
|--------------|-------------------|
| Standard | Seller |
| Express | Platform (default) or Seller |
| Custom | Platform |

## Dispute Fees

| Outcome | Fee |
|---------|-----|
| Lost dispute | €15 (varies by region) |
| Won dispute | No fee |
| Early resolution | May avoid fee |

## Webhook Events

| Event | Action Required |
|-------|-----------------|
| `charge.dispute.created` | Gather evidence |
| `charge.dispute.updated` | Monitor status |
| `charge.dispute.closed` | Update records |
| `charge.refunded` | Sync local state |

## Best Practices

| Practice | Reason |
|----------|--------|
| Hold reserves | Cover potential refunds |
| Delay payouts for new sellers | Fraud window |
| Document transactions | Dispute evidence |
| Notify sellers of disputes | Gather evidence |
| Track dispute rate | Identify bad sellers |
| Implement refund policies | Clear expectations |

## Decision: Refund Policy

```
Who handles refund requests?
│
├── Platform handles all
│   └── Better customer experience
│   └── Platform controls policy
│
├── Seller handles own
│   └── Less platform work
│   └── Inconsistent experience
│
└── Hybrid
    └── Platform policy, seller executes
    └── Balanced approach
```

→ **Implementation:** See [templates/ConnectWebhookHandler.php.md](templates/ConnectWebhookHandler.php.md)
