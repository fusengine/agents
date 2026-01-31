---
name: error-template
description: Custom error class templates (< 30 lines)
---

# Custom Errors (< 30 lines)

## Base Application Error

```typescript
// modules/cores/errors/app.error.ts

/**
 * Base application error.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

---

## Domain-Specific Errors

```typescript
// modules/auth/src/errors/auth.error.ts
import { AppError } from '@/modules/cores/errors/app.error'

/**
 * Authentication error.
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

/**
 * Authorization error.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}
```

```typescript
// modules/users/src/errors/user.error.ts
import { AppError } from '@/modules/cores/errors/app.error'

/**
 * User not found error.
 */
export class UserNotFoundError extends AppError {
  constructor(userId: string) {
    super(`User ${userId} not found`, 'USER_NOT_FOUND', 404)
    this.name = 'UserNotFoundError'
  }
}

/**
 * User validation error.
 */
export class UserValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super(message, 'USER_VALIDATION', 400)
    this.name = 'UserValidationError'
  }
}
```

---

## API Error Handler

```typescript
// modules/cores/errors/api.error.ts
import { AppError } from './app.error'

/**
 * API error with response data.
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    public data?: unknown
  ) {
    super(message, 'API_ERROR', statusCode)
    this.name = 'ApiError'
  }

  /**
   * Create from fetch Response.
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    const data = await response.json().catch(() => null)
    return new ApiError(
      data?.message ?? `HTTP ${response.status}`,
      response.status,
      data
    )
  }
}
```

---

## Error Boundary Helper

```typescript
// modules/cores/errors/boundary.error.ts

/**
 * Check if error is a known application error.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Get user-friendly error message.
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
```

---

## Rules

- Max 30 lines per error class
- Location: `modules/cores/errors/` or `modules/[feature]/src/errors/`
- Extend base `AppError` class
- Include error code and status code
- JSDoc for all exports
