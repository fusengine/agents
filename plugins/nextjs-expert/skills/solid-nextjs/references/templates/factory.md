---
name: factory-template
description: Factory pattern template for dependency injection
---

# Factory Pattern

```typescript
// modules/cores/lib/factories/service.factory.ts
import type { Database } from '../interfaces/database.interface'
import type { PaymentProvider } from '../interfaces/payment.interface'
import { PostgresDatabase } from '../database/postgres.db'
import { MongoDatabase } from '../database/mongo.db'
import { StripePayment } from '../payments/stripe.payment'
import { PayPalPayment } from '../payments/paypal.payment'

/**
 * Service configuration
 */
interface ServiceConfig {
  database: 'postgres' | 'mongo'
  payment: 'stripe' | 'paypal'
}

/**
 * Service factory for dependency injection
 */
export class ServiceFactory {
  /**
   * Create database instance
   *
   * @param type - Database type
   * @returns Database implementation
   */
  static createDatabase(type: ServiceConfig['database']): Database {
    switch (type) {
      case 'postgres':
        return new PostgresDatabase()
      case 'mongo':
        return new MongoDatabase()
      default:
        throw new Error(`Unknown database: ${type}`)
    }
  }

  /**
   * Create payment provider
   *
   * @param type - Provider type
   * @returns Payment provider implementation
   */
  static createPayment(type: ServiceConfig['payment']): PaymentProvider {
    switch (type) {
      case 'stripe':
        return new StripePayment(process.env.STRIPE_KEY!)
      case 'paypal':
        return new PayPalPayment(process.env.PAYPAL_ID!)
      default:
        throw new Error(`Unknown payment: ${type}`)
    }
  }
}
```

## Usage

```typescript
// app/api/checkout/route.ts
import { ServiceFactory } from '@/modules/cores/lib/factories/service.factory'
import { PaymentService } from '@/modules/payments/src/services/payment.service'

export async function POST(request: Request) {
  const { provider: providerType, amount } = await request.json()

  // Factory creates the right implementation
  const provider = ServiceFactory.createPayment(providerType)
  const service = new PaymentService(provider)

  const result = await service.process(amount)
  return Response.json(result)
}
```
