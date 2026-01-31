---
name: service-template
description: Service class template with dependency injection and error handling
---

# Service (< 80 lines)

```typescript
// modules/auth/src/services/auth.service.ts
import { prisma } from '@/modules/cores/database/prisma'
import { hashPassword, comparePassword } from '@/modules/cores/lib/crypto'
import { AuthError } from '@/modules/cores/lib/errors'
import type {
  LoginCredentials,
  AuthResult,
  User
} from '../interfaces/user.interface'

/**
 * Authentication service
 */
export class AuthService {
  /**
   * Authenticate user with credentials
   *
   * @param credentials - Login credentials
   * @returns Authentication result with token
   * @throws AuthError if credentials invalid
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user) {
      throw new AuthError('Invalid credentials')
    }

    const valid = await comparePassword(credentials.password, user.passwordHash)
    if (!valid) {
      throw new AuthError('Invalid credentials')
    }

    const token = await this.generateToken(user.id)

    return {
      user: this.toUserDTO(user),
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  }

  /**
   * Generate JWT token
   */
  private static async generateToken(userId: string): Promise<string> {
    return `token_${userId}_${Date.now()}`
  }

  /**
   * Convert DB user to DTO
   */
  private static toUserDTO(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
```

## With Dependency Injection

```typescript
// modules/users/src/services/user.service.ts
import type { Database } from '@/modules/cores/interfaces/database.interface'
import type { User, CreateUserInput } from '../interfaces/user.interface'

/**
 * User service with injected dependencies
 */
export class UserService {
  constructor(private db: Database) {}

  /**
   * Find user by ID
   *
   * @param id - User ID
   * @returns User or null
   */
  async findById(id: string): Promise<User | null> {
    return this.db.findUser(id)
  }

  /**
   * Create new user
   *
   * @param data - User data
   * @returns Created user
   */
  async create(data: CreateUserInput): Promise<User> {
    return this.db.createUser(data)
  }
}
```
