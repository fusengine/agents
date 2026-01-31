---
name: query-template
description: Database query patterns with Prisma 7 - TypedSQL, relations, transactions
when-to-use: complex queries, relations, transactions, typed SQL
keywords: prisma, query, database, relations, transaction, TypedSQL
priority: high
related: prisma.md, service.md, interface.md
---

# Database Query Patterns

Location: `modules/[feature]/src/queries/`

---

## Basic Query File

```typescript
// modules/users/src/queries/user.queries.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { User } from '../interfaces/user.interface'

/**
 * Find user by ID with profile
 */
export async function findUserWithProfile(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  })
}

/**
 * Find users by role with pagination
 */
export async function findUsersByRole(
  role: string,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit

  return prisma.user.findMany({
    where: { role },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' }
  })
}
```

---

## Query with Relations

```typescript
// modules/orders/src/queries/order.queries.ts
import { prisma } from '@/modules/cores/database/prisma'

/**
 * Find order with all related data
 */
export async function findOrderComplete(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
      shipping: true,
      payment: true
    }
  })
}

/**
 * Find user orders with items count
 */
export async function findUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      _count: { select: { items: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}
```

---

## Transaction Query

```typescript
// modules/orders/src/queries/order-transaction.queries.ts
import { prisma } from '@/modules/cores/database/prisma'
import type { CreateOrderInput } from '../interfaces/order.interface'

/**
 * Create order with items in transaction
 */
export async function createOrderWithItems(data: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        status: 'pending',
        total: data.total
      }
    })

    // Create order items
    await tx.orderItem.createMany({
      data: data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    })

    // Update product stock
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    return order
  })
}
```

---

## TypedSQL Query (Prisma 7)

```typescript
// modules/analytics/src/queries/analytics.queries.ts
import { prisma } from '@/modules/cores/database/prisma'
import { getOrderStats } from '@prisma/client/sql'

/**
 * Get order statistics using TypedSQL
 */
export async function getOrderStatistics(startDate: Date, endDate: Date) {
  return prisma.$queryRawTyped(
    getOrderStats(startDate, endDate)
  )
}
```

SQL file (Prisma 7):
```sql
-- prisma/sql/getOrderStats.sql
SELECT
  DATE_TRUNC('day', "createdAt") as date,
  COUNT(*) as order_count,
  SUM(total) as revenue
FROM "Order"
WHERE "createdAt" BETWEEN $1 AND $2
GROUP BY DATE_TRUNC('day', "createdAt")
ORDER BY date DESC
```

---

## Aggregation Query

```typescript
// modules/products/src/queries/product.queries.ts
import { prisma } from '@/modules/cores/database/prisma'

/**
 * Get product statistics
 */
export async function getProductStats(productId: string) {
  const [product, orderCount, totalSold] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.orderItem.count({ where: { productId } }),
    prisma.orderItem.aggregate({
      where: { productId },
      _sum: { quantity: true }
    })
  ])

  return {
    product,
    orderCount,
    totalSold: totalSold._sum.quantity ?? 0
  }
}
```

---

## File Structure

```
modules/[feature]/src/
├── interfaces/
│   └── [entity].interface.ts
├── queries/                    # Database queries
│   ├── [entity].queries.ts     # Basic CRUD queries
│   └── [entity]-transaction.queries.ts  # Transaction queries
└── services/
    └── [entity].service.ts     # Uses queries
```

---

## Naming Conventions

| Pattern | Usage |
|---------|-------|
| `find[Entity]By[Field]` | Single record lookup |
| `find[Entities]By[Criteria]` | Multiple records |
| `create[Entity]With[Related]` | Creation with relations |
| `update[Entity][Action]` | Specific update |
| `get[Entity]Stats` | Aggregations |
