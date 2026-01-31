---
name: test-template
description: Test templates for services, components, and hooks
---

# Service Test

```typescript
// modules/users/src/__tests__/user.service.test.ts
import { UserService } from '../services/user.service'
import { prisma } from '@/modules/cores/database/prisma'
import type { User } from '../interfaces/user.interface'

vi.mock('@/modules/cores/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('UserService', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findById', () => {
    it('should return user when found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await UserService.findById('1')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      })
      expect(result).toEqual(mockUser)
    })

    it('should throw NotFoundError when not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      await expect(UserService.findById('999')).rejects.toThrow('not found')
    })
  })
})
```

# Component Test

```typescript
// modules/auth/components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../LoginForm'
import { useAuth } from '../../src/hooks/useAuth'

vi.mock('../../src/hooks/useAuth')

describe('LoginForm', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn()
    })
  })

  it('should render form inputs', () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('should call login on submit', async () => {
    mockLogin.mockResolvedValue(true)
    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})
```

# Hook Test

```typescript
// modules/auth/src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthService } from '../../services/auth.service'

vi.mock('../../services/auth.service')
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('useAuth', () => {
  it('should login successfully', async () => {
    vi.mocked(AuthService.login).mockResolvedValue({
      user: { id: '1', name: 'Test' },
      token: 'token',
      expiresAt: new Date()
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: '123' })
    })

    expect(result.current.isAuthenticated).toBe(true)
  })
})
```
