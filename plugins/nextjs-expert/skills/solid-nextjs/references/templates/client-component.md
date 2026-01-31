---
name: client-component-template
description: Client Component template with hooks, state, and event handlers
---

# Client Component (< 60 lines)

```typescript
// modules/auth/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/modules/cores/components/Button'
import { Input } from '@/modules/cores/components/Input'
import { useLogin } from '../src/hooks/useLogin'
import type { LoginFormProps } from '../src/interfaces/form.interface'

/**
 * Login form - Client Component
 *
 * @param onSuccess - Callback on successful login
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ email, password })
    if (success) onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" loading={loading}>
        Sign In
      </Button>
    </form>
  )
}
```

## With useActionState (React 19)

```typescript
// modules/auth/components/SignupForm.tsx
'use client'

import { useActionState } from 'react'
import { signupAction } from '../src/actions/auth.actions'
import type { SignupFormState } from '../src/interfaces/form.interface'

const initialState: SignupFormState = {
  success: false,
  error: null
}

/**
 * Signup form with Server Action
 */
export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState
  )

  return (
    <form action={formAction} className="space-y-4">
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  )
}
```
