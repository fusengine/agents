---
name: payouts
description: Transferring money to seller bank accounts
when-to-use: Implementing seller payout functionality
keywords: payouts, transfers, bank, balance, schedule
---

# Payouts

## Payout Flow

```
Customer Payment → Platform Balance → Transfer → Seller Balance → Payout → Bank
                                         │
                                    App Fee retained
```

## Payout Schedules

| Schedule | Description | Use Case |
|----------|-------------|----------|
| **Automatic** | Stripe handles timing | Most platforms |
| **Manual** | You trigger payouts | Custom schedules |
| **Instant** | Immediate (extra fee) | Gig economy |

## Automatic Payout Options

| Interval | Timing |
|----------|--------|
| `daily` | Every day |
| `weekly` | Specific day |
| `monthly` | Specific date |

## Payout Timing

| Region | Standard | Instant Available |
|--------|----------|-------------------|
| US | 2 business days | Yes |
| EU | 2-7 business days | Some countries |
| UK | 2 business days | Yes |

## Balance Types

| Balance | Description |
|---------|-------------|
| **Available** | Ready for payout |
| **Pending** | Processing (1-7 days) |
| **Reserved** | Held for disputes/refunds |

## Decision: Payout Strategy

```
How should sellers receive funds?
│
├── Automatic (default)
│   └── Stripe pays on schedule
│   └── Less control, simpler
│
├── Manual payouts
│   └── You control timing
│   └── Custom thresholds, batching
│
└── Instant payouts
    └── Immediate (1.5% fee)
    └── Gig workers, time-sensitive
```

## Payout Failures

| Reason | Resolution |
|--------|------------|
| Invalid bank details | Seller updates info |
| Account closed | New bank account |
| Insufficient balance | Wait for pending |
| Compliance hold | Complete verification |

## Webhook Events

| Event | Meaning |
|-------|---------|
| `payout.created` | Payout initiated |
| `payout.paid` | Successfully deposited |
| `payout.failed` | Payout failed |
| `balance.available` | New funds available |

## Best Practices

| Practice | Reason |
|----------|--------|
| Monitor `payout.failed` | React to bank issues |
| Notify sellers of payouts | Transparency |
| Keep reserves for disputes | Protect platform |
| Delay first payout | Fraud prevention |

→ **Implementation:** See [templates/PayoutController.php.md](templates/PayoutController.php.md)
