---
name: interface-template
description: TypeScript interface templates for React
---

# TypeScript Interfaces

## Entity Interface

```typescript
// modules/users/src/interfaces/user.interface.ts

/**
 * User entity from API.
 */
export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

/**
 * User roles.
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * Input for creating a user.
 */
export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: UserRole
}

/**
 * Input for updating a user.
 */
export interface UpdateUserInput {
  name?: string
  email?: string
  avatar?: string
}
```

---

## Component Props Interface

```typescript
// modules/users/src/interfaces/user.interface.ts

/**
 * Props for UserCard component.
 */
export interface UserCardProps {
  user: User
  onEdit: (id: string) => void
  className?: string
}

/**
 * Props for UserList component.
 */
export interface UserListProps {
  users: User[]
  onSelectUser: (user: User) => void
  selectedId?: string
}

/**
 * Props for UserForm component.
 */
export interface UserFormProps {
  initialData?: Partial<User>
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void
  isSubmitting?: boolean
}
```

---

## Service Interface

```typescript
// modules/cores/interfaces/http.interface.ts

/**
 * HTTP client interface for dependency injection.
 */
export interface HttpClient {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: unknown): Promise<T>
  patch<T>(url: string, data: unknown): Promise<T>
  delete(url: string): Promise<void>
}

/**
 * API response wrapper.
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

/**
 * Paginated response.
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

---

## Generic UI Interface

```typescript
// modules/cores/interfaces/ui.interface.ts

/**
 * Props for Card component.
 */
export interface CardProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Props for DataList component.
 */
export interface DataListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  keyExtractor: (item: T) => string
  className?: string
}

/**
 * Props for Modal component.
 */
export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

---

## Rules

- Location: `modules/[feature]/src/interfaces/`
- One file per domain (user.interface.ts, auth.interface.ts)
- JSDoc for all exports
- Use `type` for unions, `interface` for objects
- NEVER put interfaces in component files
