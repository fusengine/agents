---
name: validator-template
description: Zod validation schema templates (< 30 lines)
---

# Zod Validators (< 30 lines)

## Basic Validator

```typescript
// modules/users/src/validators/user.validator.ts
import { z } from 'zod'

/**
 * User creation validation schema.
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'user', 'guest']).optional().default('user')
})

export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * User update validation schema.
 */
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional()
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

---

## Form Validator with Refinements

```typescript
// modules/auth/src/validators/auth.validator.ts
import { z } from 'zod'

/**
 * Login validation schema.
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Register validation schema with password confirmation.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type RegisterInput = z.infer<typeof registerSchema>
```

---

## Search Params Validator (TanStack Router)

```typescript
// modules/products/src/validators/search.validator.ts
import { z } from 'zod'

/**
 * Product search params validation.
 */
export const productSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().min(10).max(100).catch(20),
  sort: z.enum(['name', 'price', 'createdAt']).catch('name'),
  order: z.enum(['asc', 'desc']).catch('asc'),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().optional()
})

export type ProductSearch = z.infer<typeof productSearchSchema>

// Usage in TanStack Router
// export const Route = createFileRoute('/products')({
//   validateSearch: (search) => productSearchSchema.parse(search)
// })
```

---

## API Response Validator

```typescript
// modules/cores/validators/api.validator.ts
import { z } from 'zod'

/**
 * Paginated response schema factory.
 */
export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number()
  })
}

// Usage
// const paginatedUsersSchema = paginatedSchema(userSchema)
```

---

## Rules

- Max 30 lines per file
- Location: `modules/[feature]/src/validators/`
- Export both schema and inferred type
- Use `.catch()` for search params (graceful fallback)
- JSDoc for all exports
