---
name: interface-template
description: TypeScript interface templates for entities, DTOs, and contracts
---

# Interface Definition

```typescript
// modules/auth/src/interfaces/user.interface.ts

/**
 * User entity
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

/**
 * User roles
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * User creation payload
 */
export interface CreateUserInput {
  email: string
  name: string
  password: string
  role?: UserRole
}

/**
 * User update payload
 */
export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: User
  token: string
  expiresAt: Date
}
```

## Service Contract Interface

```typescript
// modules/payments/src/interfaces/payment-provider.interface.ts

/**
 * Payment provider contract
 */
export interface PaymentProvider {
  /**
   * Process payment
   *
   * @param amount - Amount in cents
   * @returns Transaction ID
   */
  process(amount: number): Promise<string>

  /**
   * Refund payment
   *
   * @param transactionId - Original transaction
   * @returns Refund ID
   */
  refund(transactionId: string): Promise<string>

  /**
   * Get payment status
   */
  getStatus(transactionId: string): Promise<PaymentStatus>
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface PaymentResult {
  transactionId: string
  status: PaymentStatus
  amount: number
  timestamp: Date
}
```

## Component Props Interface

```typescript
// modules/users/src/interfaces/props.interface.ts

import type { User } from './user.interface'

/**
 * User card props
 */
export interface UserCardProps {
  user: User
  onClick?: (user: User) => void
  showActions?: boolean
}

/**
 * User list props
 */
export interface UserListProps {
  users: User[]
  onSelect?: (user: User) => void
  emptyMessage?: string
}

/**
 * Form props with callback
 */
export interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string
}
```
