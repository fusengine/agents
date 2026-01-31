---
name: error-template
description: Custom error classes template for structured error handling
---

# Custom Error Classes

```typescript
// modules/cores/lib/errors/index.ts

/**
 * Base application error
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

/**
 * Authentication error
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string> = {}
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}
```

## Error Handler

```typescript
// modules/cores/lib/errors/handler.ts
import { NextResponse } from 'next/server'
import { AppError } from './index'

/**
 * Handle API errors uniformly
 *
 * @param error - Caught error
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  console.error('Unexpected error:', error)

  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}
```
