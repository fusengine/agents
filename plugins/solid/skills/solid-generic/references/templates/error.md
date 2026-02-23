---
name: error-template
description: Custom error class template (< 40 lines)
when-to-use: error handling, custom errors, error boundaries
keywords: error, exception, handling, boundary, custom error
priority: medium
related: single-responsibility.md
applies-to: "**/*error*.ts, **/*Error*.ts"
trigger-on-edit: "errors/"
level: template
---

# Error Classes (< 40 lines)

## Base Application Error

```typescript
// modules/cores/errors/app.error.ts

/** Base error for all application errors. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

---

## Domain-Specific Errors

```typescript
// modules/cores/errors/validation.error.ts
import { AppError } from './app.error'

/** Validation error with field details. */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}
```

```typescript
// modules/cores/errors/not-found.error.ts
import { AppError } from './app.error'

/** Resource not found error. */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}
```

```typescript
// modules/cores/errors/config.error.ts
import { AppError } from './app.error'

/** Configuration error. */
export class ConfigError extends AppError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR', 500)
    this.name = 'ConfigError'
  }
}
```

---

## Error Handling Pattern

```typescript
// modules/cores/lib/error-handler.ts
import { AppError } from '../errors/app.error'

/**
 * Handle error and return structured response.
 *
 * @param error - Caught error
 * @returns Structured error object
 */
export function handleError(error: unknown): { code: string; message: string } {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message }
  }
  return { code: 'UNKNOWN', message: 'An unexpected error occurred' }
}
```

---

## Rules

- Max 40 lines per error file
- Extend `AppError` base class
- Include `code` for programmatic handling
- Include `statusCode` for HTTP responses
- JSDoc for all error classes
- Location: `modules/cores/errors/` (shared base errors)
