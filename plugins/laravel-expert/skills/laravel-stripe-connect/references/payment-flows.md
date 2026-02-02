---
name: payment-flows
description: Direct, Destination, and Transfer payment patterns
when-to-use: Choosing how money flows through your platform
keywords: direct, destination, transfer, charges, payments
---

# Payment Flows

## Three Approaches

| Flow | Statement Name | Fee Collection | Complexity |
|------|---------------|----------------|------------|
| **Direct** | Seller | On-behalf-of | Simple |
| **Destination** | Platform | Application fee | Medium |
| **Separate** | Platform | Manual transfer | Complex |

## Decision Guide

```
Whose name on customer's bank statement?
│
├── Seller's name → Direct Charges
│   └── Customer relationship with seller
│
├── Platform's name → Destination Charges
│   └── Platform owns customer relationship (recommended)
│
└── Complex splits (3+ parties)? → Separate Charges + Transfers
    └── Revenue sharing, affiliates, multiple sellers
```

## Flow Diagrams

### Direct Charges

```
Customer → Seller Account → (fee) → Platform
           Statement: "Seller Name"
```
- Payment created on seller's account
- Platform collects fee separately
- Seller handles disputes

### Destination Charges (Recommended)

```
Customer → Platform Account → (transfer) → Seller
           Statement: "Platform Name"
```
- Payment on platform account
- Automatic transfer to seller
- Application fee deducted
- Platform handles disputes initially

### Separate Charges + Transfers

```
Customer → Platform Account
                │
                ├── Transfer → Seller A (40%)
                ├── Transfer → Seller B (40%)
                └── Keep → Platform (20%)
```
- Full control over fund distribution
- Manual transfer management
- Complex but flexible

## When to Use Each

| Use Case | Recommended Flow |
|----------|-----------------|
| Simple marketplace | Destination |
| Multi-seller orders | Separate + Transfers |
| Seller owns brand | Direct |
| Platform owns brand | Destination |
| Subscription + Connect | Destination |
| Complex revenue share | Separate + Transfers |

## Statement Descriptors

| Flow | Configurable? |
|------|--------------|
| Direct | Seller's descriptor |
| Destination | Platform's descriptor (customizable) |
| Separate | Platform's descriptor |

→ **Implementation:** See [templates/MarketplacePaymentController.php.md](templates/MarketplacePaymentController.php.md)
