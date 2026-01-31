---
name: validator-template
description: Zod validation schema template with custom error messages
---

# Validator with Zod

```typescript
// modules/users/src/validators/user.validator.ts
import { z } from 'zod'

/**
 * Create user validation schema
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'user', 'guest']).optional().default('user')
})

/**
 * Update user validation schema
 */
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user', 'guest']).optional()
})

/**
 * Validate create user input
 *
 * @param data - Input data
 * @returns Validation result
 */
export function validateCreateUser(data: unknown) {
  return createUserSchema.safeParse(data)
}

/**
 * Validate update user input
 *
 * @param data - Input data
 * @returns Validation result
 */
export function validateUpdateUser(data: unknown) {
  return updateUserSchema.safeParse(data)
}

// Type inference
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

## Complex Validation

```typescript
// modules/orders/src/validators/order.validator.ts
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive()
})

export const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1, 'Order must have items'),
  shippingAddress: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().regex(/^\d{5}$/, 'Invalid zip code'),
    country: z.string().length(2)
  }),
  couponCode: z.string().optional()
}).refine(
  (data) => data.items.reduce((sum, i) => sum + i.quantity, 0) <= 100,
  { message: 'Maximum 100 items per order' }
)
```
