---
name: interface-template
description: TypeScript interface templates for generic projects
when-to-use: creating interfaces, type contracts, API boundaries
keywords: interface, contract, type, boundary, abstraction
priority: medium
related: interface-segregation.md, dependency-inversion.md
applies-to: "**/*interface*.ts, **/*.interface.ts"
trigger-on-edit: "interfaces/"
level: template
---

# TypeScript Interfaces

## Entity Interface

```typescript
// modules/users/src/interfaces/user.interface.ts

/** User entity from API. */
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

/** User roles. */
export type UserRole = 'admin' | 'user' | 'guest'

/** Input for creating a user. */
export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: UserRole
}

/** Input for updating a user. */
export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>>
```

---

## Service Contract Interface

```typescript
// modules/cores/interfaces/http.interface.ts

/** HTTP client interface for dependency injection. */
export interface HttpClient {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: unknown): Promise<T>
  patch<T>(url: string, data: unknown): Promise<T>
  delete(url: string): Promise<void>
}

/** API response wrapper. */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

/** Paginated response. */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

---

## Segregated Interfaces (ISP)

```typescript
// modules/cores/interfaces/storage.interface.ts

/** Read-only storage operations. */
export interface StorageReader {
  get(key: string): Promise<string | null>
  has(key: string): Promise<boolean>
}

/** Write storage operations. */
export interface StorageWriter {
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

/** Full storage contract. */
export interface Storage extends StorageReader, StorageWriter {}
```

---

## Configuration Interface

```typescript
// modules/cores/interfaces/config.interface.ts

/** Application configuration. */
export interface AppConfig {
  port: number
  host: string
  debug: boolean
}

/** Database configuration. */
export interface DatabaseConfig {
  url: string
  maxConnections: number
}

/** Combined configuration. */
export interface Config {
  app: AppConfig
  database: DatabaseConfig
}
```

---

## Hook System Interface

```typescript
// modules/cores/interfaces/hook.interface.ts

/** Hook input from stdin. */
export interface HookInput {
  tool_name?: string
  tool_input?: Record<string, unknown>
  session_id?: string
}

/** Hook output response. */
export interface HookOutput {
  hookSpecificOutput?: {
    hookEventName: string
    permissionDecision?: 'allow' | 'deny'
    permissionDecisionReason?: string
  }
}
```

---

## Rules

- Feature types: `modules/[feature]/src/interfaces/`
- Shared types: `modules/cores/interfaces/`
- One file per domain (user.interface.ts, config.interface.ts)
- JSDoc for all exports
- Use `type` for unions/aliases, `interface` for objects
- NEVER put interfaces in implementation files
