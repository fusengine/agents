---
name: storekit2
description: StoreKit 2 in-app purchases, subscriptions, transaction management, and testing
when-to-use: implementing purchases, subscriptions, restoring transactions
keywords: StoreKit, in-app purchase, subscription, Product, Transaction
priority: high
related: app-store.md, testflight.md
---

# StoreKit 2

## Product Types

| Type | Description |
|------|-------------|
| **Consumable** | Use once (coins, gems) |
| **Non-Consumable** | Buy once, keep forever |
| **Auto-Renewable** | Recurring subscription |
| **Non-Renewable** | Time-limited, manual renewal |

---

## Loading & Purchasing

```swift
import StoreKit

let products = try await Product.products(for: ["com.app.premium"])

func purchase(_ product: Product) async throws -> Transaction? {
    let result = try await product.purchase()
    switch result {
    case .success(let verification):
        let transaction = try checkVerified(verification)
        await transaction.finish()
        return transaction
    case .userCancelled, .pending: return nil
    @unknown default: return nil
    }
}

func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    switch result {
    case .unverified: throw StoreError.failedVerification
    case .verified(let value): return value
    }
}
```

---

## Entitlements & Subscriptions

```swift
func checkEntitlements() async -> Set<String> {
    var entitled: Set<String> = []
    for await result in Transaction.currentEntitlements {
        guard case .verified(let tx) = result else { continue }
        entitled.insert(tx.productID)
    }
    return entitled
}
```

---

## Transaction Listener

Start at app launch to catch pending transactions:

```swift
func listenForTransactions() -> Task<Void, Error> {
    Task.detached {
        for await result in Transaction.updates {
            guard case .verified(let tx) = result else { continue }
            await self.updateEntitlements()
            await tx.finish()
        }
    }
}
```

---

## Testing

Create a **StoreKit Configuration File** (.storekit), add products matching App Store Connect IDs, and use **Transaction Manager** to simulate scenarios.

---

## Best Practices

- Always verify with `VerificationResult`
- Call `transaction.finish()` after delivering content
- Listen for `Transaction.updates` at app launch
- Test all flows with StoreKit Testing in Xcode
