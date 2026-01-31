---
name: "TanStack Form SSR & Hydration"
description: "Complete SSR patterns with formOptions, mergeForm, useTransform, and server-side validation for Next.js App Router"
---

# TanStack Form SSR & Hydration Patterns

## Setup with formOptions()

```typescript
/**
 * Form configuration for both server and client
 * @param defaultValues - Initial form state
 * @returns FormOptions for type-safe form creation
 */
import { useCallback } from 'react'
import { createServerValidate } from '@tanstack/form'
import { useForm } from '@tanstack/react-form'

interface FormValues {
  email: string
  password: string
  rememberMe: boolean
}

const defaultValues: FormValues = {
  email: '',
  password: '',
  rememberMe: false,
}

export const formOptions = () => {
  const validator = createServerValidate<FormValues>({
    onServer: async (formData) => {
      // Server-side validation runs on submission
      const errors: Record<string, string> = {}

      // Email validation
      if (!formData.email) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format'
      }

      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }

      return errors
    },
  })

  return {
    defaultValues,
    validator,
    onSubmit: async (values) => {
      // Server action or API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      return response.json()
    },
  }
}
```

## mergeForm() for Hydration

```typescript
/**
 * Merge server state with client form instance
 * Hydrates form with server-rendered values
 * @param form - Client form instance
 * @param serverState - Hydration state from server
 */
'use client'

import { useMemo } from 'react'
import { useForm } from '@tanstack/react-form'

interface HydrationState {
  values: FormValues
  errors?: Record<string, string>
  submitting?: boolean
}

export function LoginForm({ initialState }: { initialState: HydrationState }) {
  const form = useForm({
    ...formOptions(),
    defaultValues: initialState.values,
  })

  // Merge server state into form
  useMemo(() => {
    if (initialState.errors) {
      Object.entries(initialState.errors).forEach(([field, error]) => {
        form.setFieldMeta(field as keyof FormValues, (meta) => ({
          ...meta,
          errors: [error],
        }))
      })
    }
  }, [initialState.errors, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* Form fields */}
    </form>
  )
}
```

## useTransform() Hook

```typescript
/**
 * Transform form values for display or validation
 * Useful for formatting, normalization, or computed fields
 * @param form - Form instance
 * @param transform - Transformation function
 * @returns Transformed values
 */
import { useEffect, useState } from 'react'

interface TransformedValues extends FormValues {
  emailDisplay: string
  passwordStrength: 'weak' | 'medium' | 'strong'
}

export function useTransform(form: ReturnType<typeof useForm>) {
  const [transformed, setTransformed] = useState<TransformedValues>({
    email: '',
    password: '',
    rememberMe: false,
    emailDisplay: '',
    passwordStrength: 'weak',
  })

  const transform = useCallback((values: FormValues): TransformedValues => {
    const email = values.email.toLowerCase().trim()
    const passwordLength = values.password.length

    let strength: 'weak' | 'medium' | 'strong' = 'weak'
    if (passwordLength >= 12) strength = 'strong'
    else if (passwordLength >= 8) strength = 'medium'

    return {
      ...values,
      emailDisplay: email,
      passwordStrength: strength,
    }
  }, [])

  useEffect(() => {
    const values = form.getValues()
    setTransformed(transform(values))
  }, [form, transform])

  return transformed
}
```

## Server-Side Validation with createServerValidate()

```typescript
/**
 * Server validation with async checks
 * Runs before client-side submission
 * @returns Validation errors or success
 */
import { createServerValidate } from '@tanstack/form'
import { db } from '@/lib/db'

export const createServerValidate = createServerValidate<FormValues>({
  onServer: async (formData) => {
    const errors: Record<string, string> = {}

    // Email uniqueness check (async)
    const existingUser = await db.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      errors.email = 'Email already registered'
    }

    // Password strength via library
    const passwordStrength = await validatePasswordStrength(
      formData.password
    )
    if (!passwordStrength.isValid) {
      errors.password = passwordStrength.message
    }

    return errors
  },
})

/**
 * Async password strength validation
 * @param password - Password to validate
 * @returns Validation result
 */
async function validatePasswordStrength(
  password: string
): Promise<{ isValid: boolean; message: string }> {
  // Simulate async validation (e.g., API call)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*]/.test(password)

  const score = [hasUppercase, hasNumber, hasSpecial].filter(Boolean).length

  if (score < 2) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, number, and special character',
    }
  }

  return { isValid: true, message: 'Password is strong' }
}
```

## Next.js App Router Integration

```typescript
/**
 * Server Component - Renders hydration state
 * Runs on server, sends data to client
 * @returns Serialized form state
 */
// app/auth/login/page.tsx (Server Component)

import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { LoginFormClient } from './login-form.client'
import type { HydrationState } from '@/types/forms'

async function getInitialFormState(): Promise<HydrationState> {
  const cookieStore = await cookies()
  const savedEmail = cookieStore.get('email')?.value || ''

  return {
    values: {
      email: savedEmail,
      password: '',
      rememberMe: !!savedEmail,
    },
    errors: undefined,
    submitting: false,
  }
}

export default async function LoginPage() {
  const initialState = await getInitialFormState()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormClient initialState={initialState} />
      </Suspense>
    </div>
  )
}
```

## Client Form with Hydration

```typescript
/**
 * Client Component - Interactive form with server hydration
 * Uses useForm with server-provided initial state
 * @param initialState - From server component
 */
'use client'

import { useCallback } from 'react'
import { useForm } from '@tanstack/react-form'
import { useTransform } from '@/hooks/useTransform'
import { formOptions } from './form-options'
import type { HydrationState } from '@/types/forms'

interface LoginFormClientProps {
  initialState: HydrationState
}

export function LoginFormClient({ initialState }: LoginFormClientProps) {
  const form = useForm<FormValues>({
    ...formOptions(),
    defaultValues: initialState.values,
  })

  const transformed = useTransform(form)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate on client first
      const isValid = await form.validateAllFields('onChange')
      if (!isValid) return

      try {
        const values = form.getValues()
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json()
          form.setFieldMeta('email', (meta) => ({
            ...meta,
            errors: [error.message],
          }))
          return
        }

        const result = await response.json()
        if (result.success) {
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
    [form]
  )

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Email is required'
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? 'Invalid email'
                : undefined,
        }}
        children={(field) => (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full px-3 py-2 border rounded-md"
              disabled={form.state.isSubmitting}
            />
            {field.state.meta.errors && (
              <span className="text-sm text-red-600 mt-1">
                {field.state.meta.errors[0]}
              </span>
            )}
            <span className="text-xs text-gray-500 mt-1">
              Display: {transformed.emailDisplay}
            </span>
          </div>
        )}
      />

      {/* Password Field */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Password is required'
              : value.length < 8
                ? 'At least 8 characters'
                : undefined,
        }}
        children={(field) => (
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full px-3 py-2 border rounded-md"
              disabled={form.state.isSubmitting}
            />
            {field.state.meta.errors && (
              <span className="text-sm text-red-600 mt-1">
                {field.state.meta.errors[0]}
              </span>
            )}
            <span className="text-xs text-gray-500 mt-1">
              Strength: {transformed.passwordStrength}
            </span>
          </div>
        )}
      />

      {/* Remember Me Checkbox */}
      <form.Field
        name="rememberMe"
        children={(field) => (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Remember me</span>
          </label>
        )}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={form.state.isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {form.state.isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      {/* Form State Debug */}
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
          {JSON.stringify(form.state, null, 2)}
        </pre>
      )}
    </form>
  )
}
```

## Server Action Integration

```typescript
/**
 * Server Action for form submission
 * Secure server-side handling with authentication
 * @param formData - Client form values
 * @returns Success status with optional errors
 */
'use server'

import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function loginAction(
  values: FormValues
): Promise<{ success: boolean; errors?: Record<string, string> }> {
  try {
    // Server-side validation
    const errors: Record<string, string> = {}

    if (!values.email) {
      errors.email = 'Email is required'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }

    // Authenticate user
    const user = await db.user.findUnique({
      where: { email: values.email },
    })

    if (!user || !user.password) {
      return {
        success: false,
        errors: { email: 'Invalid email or password' },
      }
    }

    // Verify password (bcrypt)
    const isValid = await verifyPassword(values.password, user.password)

    if (!isValid) {
      return {
        success: false,
        errors: { password: 'Invalid email or password' },
      }
    }

    // Create session
    const session = await getSession()
    session.userId = user.id
    await session.save()

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      errors: { form: 'An error occurred. Please try again.' },
    }
  }
}

/**
 * Verify password against hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Implementation with bcrypt or similar
  return true
}
```

## Complete Type Definitions

```typescript
/**
 * Form value types for login form
 */
export interface FormValues {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * Server hydration state
 */
export interface HydrationState {
  values: FormValues
  errors?: Record<string, string>
  submitting?: boolean
}

/**
 * API response type
 */
export interface LoginResponse {
  success: boolean
  userId?: string
  message?: string
}
```

## Key Patterns Summary

| Pattern | Purpose | When to Use |
|---------|---------|------------|
| `formOptions()` | Centralized form config | Shared between server & client |
| `mergeForm()` | Hydrate with server state | SSR initial values |
| `useTransform()` | Transform displayed values | Formatting, computed fields |
| `createServerValidate()` | Async server validation | Database checks, API calls |
| Server Components | Fetch initial state | Render hydration data |
| Client Components | Interactive form | Handle user input |
| Server Actions | Secure submission | Database writes, auth |
| Revalidation | Cache invalidation | Refresh after mutation |

