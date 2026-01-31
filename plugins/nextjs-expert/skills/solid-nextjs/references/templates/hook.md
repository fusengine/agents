---
name: hook-template
description: React hook template with state management and async operations
---

# React Hook (< 60 lines)

```typescript
// modules/auth/src/hooks/useAuth.ts
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../services/auth.service'
import { useAuthStore } from '../stores/auth.store'
import type { LoginCredentials } from '../interfaces/user.interface'

/**
 * Authentication hook
 *
 * @returns Auth state and methods
 */
export function useAuth() {
  const router = useRouter()
  const { user, setUser, clearUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)

    try {
      const result = await AuthService.login(credentials)
      setUser(result.user)
      router.push('/dashboard')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [router, setUser])

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    clearUser()
    router.push('/login')
  }, [clearUser, router])

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout
  }
}
```

## Data Fetching Hook

```typescript
// modules/users/src/hooks/useUsers.ts
'use client'

import { useState, useEffect } from 'react'
import { UserService } from '../services/user.service'
import type { User } from '../interfaces/user.interface'

/**
 * Hook for fetching users list
 *
 * @param teamId - Team ID filter
 */
export function useUsers(teamId: string) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await UserService.findByTeam(teamId)
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [teamId])

  return { users, loading, error }
}
```
