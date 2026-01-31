---
name: "Form Composition Template"
description: "Reusable form components with createFormHook pattern for scalable forms"
tags: ["forms", "composition", "reusable-components", "tanstack-form", "typescript", "patterns"]
difficulty: "intermediate"
---

# Form Composition: Reusable Components with createFormHook

Advanced pattern for building scalable, maintainable forms using composable field components and custom hooks.

## Installation

```bash
npm install @tanstack/react-form zod
npm install --save-dev @types/react
```

## Architecture Overview

This pattern provides:
- **Custom field components** (TextField, NumberField, SelectField)
- **createFormHook factory** for form-specific state management
- **AppField wrapper** for consistent field rendering
- **useAppForm hook** for form orchestration

---

## 1. Form Hook Factory

Create a factory function to generate form-specific hooks with type safety.

```typescript
/**
 * Hook factory for creating form-specific hooks with Zod validation
 *
 * @example
 * ```tsx
 * const useLoginForm = createFormHook(loginSchema, async (data) => {
 *   await authService.login(data)
 * })
 *
 * function LoginPage() {
 *   const { form, isSubmitting } = useLoginForm()
 *   return <form onSubmit={form.handleSubmit}>...</form>
 * }
 * ```
 */
import { useForm as useFormCore } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useState } from 'react'

type FormValues = Record<string, unknown>

/**
 * Factory function to create form-specific hooks
 *
 * @param schema - Zod schema for validation
 * @param onSubmit - Async submission handler
 * @returns Custom hook for managing form state
 */
export function createFormHook<T extends FormValues>(
  schema: z.ZodType<T>,
  onSubmit: (data: T) => Promise<void>
) {
  return function useFormHook(initialValues?: Partial<T>) {
    const [serverError, setServerError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useFormCore<T>({
      defaultValues: (initialValues || {}) as T,
      onSubmit: async (values) => {
        try {
          setIsSubmitting(true)
          setServerError(null)
          await onSubmit(values.value as T)
        } catch (error) {
          setServerError(
            error instanceof Error ? error.message : 'An error occurred'
          )
        } finally {
          setIsSubmitting(false)
        }
      },
      validatorAdapter: zodValidator(),
      validators: {
        onChange: schema,
        onBlur: schema,
        onSubmit: schema,
      },
    })

    return {
      form,
      isSubmitting,
      serverError,
      setServerError,
    }
  }
}
```

---

## 2. Generic Field Components

Create reusable field components for different input types.

```typescript
/**
 * Generic text input field component
 * Handles focus state, error display, and accessibility
 */
import React, { ReactNode } from 'react'

interface TextFieldProps {
  /** HTML input ID and label htmlFor attribute */
  id: string
  /** Field label text */
  label: string
  /** Placeholder text */
  placeholder?: string
  /** Current field value */
  value: string
  /** Handle input change */
  onChange: (value: string) => void
  /** Handle blur event */
  onBlur: () => void
  /** Field validation errors */
  errors: string[]
  /** Disable field (e.g., during form submission) */
  disabled?: boolean
  /** Help text below field */
  helperText?: string
  /** Custom icon or addon */
  icon?: ReactNode
}

/**
 * TextField Component
 *
 * Reusable text input with error handling and optional helper text
 *
 * @param id - Unique field identifier
 * @param label - Field label
 * @param value - Controlled input value
 * @param onChange - Change handler
 * @param onBlur - Blur handler
 * @param errors - Validation errors array
 * @param disabled - Disable state
 * @param helperText - Optional help text
 * @param icon - Optional icon element
 *
 * @example
 * ```tsx
 * <TextField
 *   id="email"
 *   label="Email Address"
 *   value={field.state.value}
 *   onChange={field.handleChange}
 *   onBlur={field.handleBlur}
 *   errors={field.state.meta.errors}
 *   helperText="We'll never share your email"
 * />
 * ```
 */
export function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  errors,
  disabled = false,
  helperText,
  icon,
}: TextFieldProps) {
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5">{icon}</div>}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
            icon ? 'pl-10' : ''
          } ${
            hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
        />
      </div>
      {helperText && !hasError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      {errors.length > 0 && (
        <p className="text-sm text-red-600">{errors[0]}</p>
      )}
    </div>
  )
}

/**
 * NumberField Component
 *
 * Specialized numeric input with min/max constraints and step control
 */
interface NumberFieldProps {
  id: string
  label: string
  value: number | string
  onChange: (value: string) => void
  onBlur: () => void
  errors: string[]
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}

/**
 * NumberField Component
 *
 * @param id - Unique field identifier
 * @param label - Field label
 * @param value - Numeric value (as string for form compatibility)
 * @param onChange - Change handler
 * @param onBlur - Blur handler
 * @param errors - Validation errors
 * @param disabled - Disable state
 * @param min - Minimum value
 * @param max - Maximum value
 * @param step - Step increment
 *
 * @example
 * ```tsx
 * <NumberField
 *   id="age"
 *   label="Age"
 *   value={field.state.value}
 *   onChange={field.handleChange}
 *   onBlur={field.handleBlur}
 *   errors={field.state.meta.errors}
 *   min={0}
 *   max={120}
 * />
 * ```
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  onBlur,
  errors,
  disabled = false,
  min,
  max,
  step = 1,
}: NumberFieldProps) {
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
      />
      {errors.length > 0 && (
        <p className="text-sm text-red-600">{errors[0]}</p>
      )}
    </div>
  )
}

/**
 * SelectField Component
 *
 * Dropdown select with grouped options support
 */
interface SelectOption {
  value: string | number
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  value: string | number
  onChange: (value: string) => void
  onBlur: () => void
  errors: string[]
  options: SelectOption[]
  disabled?: boolean
  placeholder?: string
}

/**
 * SelectField Component
 *
 * @param id - Unique field identifier
 * @param label - Field label
 * @param value - Selected value
 * @param onChange - Change handler
 * @param onBlur - Blur handler
 * @param errors - Validation errors
 * @param options - Array of select options
 * @param disabled - Disable state
 * @param placeholder - Default placeholder option text
 *
 * @example
 * ```tsx
 * <SelectField
 *   id="country"
 *   label="Country"
 *   value={field.state.value}
 *   onChange={field.handleChange}
 *   onBlur={field.handleBlur}
 *   errors={field.state.meta.errors}
 *   options={countries}
 *   placeholder="Select a country"
 * />
 * ```
 */
export function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  errors,
  options,
  disabled = false,
  placeholder,
}: SelectFieldProps) {
  const hasError = errors.length > 0

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.length > 0 && (
        <p className="text-sm text-red-600">{errors[0]}</p>
      )}
    </div>
  )
}
```

---

## 3. AppField Wrapper Component

Create a universal field wrapper that works with TanStack Form.

```typescript
/**
 * Universal field wrapper that connects TanStack Form field to UI components
 * Reduces boilerplate when working with custom field components
 */
import { FieldApi } from '@tanstack/react-form'

interface AppFieldProps<T> {
  /** TanStack Form field instance */
  field: FieldApi<any, any, any, any>
  /** Field type: text, number, select, etc. */
  type: 'text' | 'number' | 'select'
  /** Field label */
  label: string
  /** Placeholder text */
  placeholder?: string
  /** Select options (required for type="select") */
  options?: Array<{ value: string | number; label: string }>
  /** Additional field properties */
  disabled?: boolean
  helperText?: string
  min?: number
  max?: number
}

/**
 * AppField Component
 *
 * Universal wrapper for form fields that eliminates repetitive boilerplate
 * Automatically connects field state to appropriate UI component
 *
 * @param field - TanStack Form FieldApi instance
 * @param type - Field type (text, number, select)
 * @param label - Field label
 * @param placeholder - Optional placeholder
 * @param options - Options array for select fields
 * @param disabled - Disable state
 * @param helperText - Optional helper text
 * @param min - Min value (for number fields)
 * @param max - Max value (for number fields)
 *
 * @example
 * ```tsx
 * <form.Field name="email">
 *   {(field) => (
 *     <AppField
 *       field={field}
 *       type="text"
 *       label="Email"
 *       placeholder="you@example.com"
 *       helperText="We'll never share your email"
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function AppField<T extends FormValues>({
  field,
  type,
  label,
  placeholder,
  options,
  disabled = false,
  helperText,
  min,
  max,
}: AppFieldProps<T>) {
  const fieldErrors = (field.state.meta.errors || []).map((e) =>
    e?.toString() || ''
  )

  const commonProps = {
    id: field.name,
    label,
    value: field.state.value,
    onChange: field.handleChange,
    onBlur: field.handleBlur,
    errors: fieldErrors,
    disabled,
  }

  switch (type) {
    case 'text':
      return (
        <TextField
          {...commonProps}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    case 'number':
      return (
        <NumberField
          {...commonProps}
          min={min}
          max={max}
        />
      )
    case 'select':
      return (
        <SelectField
          {...commonProps}
          options={options || []}
          placeholder={placeholder}
        />
      )
    default:
      return null
  }
}
```

---

## 4. Complete Form Example

Full-featured user registration form using the composition pattern.

```typescript
/**
 * User registration form schema with advanced validation
 */
const registrationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase(),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Invalid age'),
  country: z
    .string()
    .min(1, 'Please select a country'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

type RegistrationData = z.infer<typeof registrationSchema>

/**
 * Country options for select field
 */
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
]

/**
 * Create form-specific hook for registration
 */
const useRegistrationForm = createFormHook(
  registrationSchema,
  async (data: RegistrationData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }
  }
)

/**
 * RegistrationForm Component
 *
 * Multi-field registration form using composable field components
 * Demonstrates:
 * - Custom form hook with error handling
 * - Multiple field types (text, number, select)
 * - AppField wrapper for reduced boilerplate
 * - Form submission state management
 */
interface RegistrationFormProps {
  /** Callback after successful registration */
  onSuccess?: () => void
}

/**
 * RegistrationForm Component
 *
 * @param onSuccess - Optional callback after successful registration
 *
 * @example
 * ```tsx
 * function SignupPage() {
 *   return (
 *     <RegistrationForm
 *       onSuccess={() => router.push('/dashboard')}
 *     />
 *   )
 * }
 * ```
 */
export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { form, isSubmitting, serverError, setServerError } =
    useRegistrationForm()

  const handleSubmit = async () => {
    try {
      await form.handleSubmit()
      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Account</h1>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <button
            onClick={() => setServerError(null)}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
          <p className="text-sm text-red-800">{serverError}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-4"
      >
        {/* First Name Field */}
        <form.Field name="firstName">
          {(field) => (
            <AppField
              field={field}
              type="text"
              label="First Name"
              placeholder="John"
            />
          )}
        </form.Field>

        {/* Last Name Field */}
        <form.Field name="lastName">
          {(field) => (
            <AppField
              field={field}
              type="text"
              label="Last Name"
              placeholder="Doe"
            />
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field name="email">
          {(field) => (
            <AppField
              field={field}
              type="text"
              label="Email Address"
              placeholder="john@example.com"
              helperText="We'll never share your email"
            />
          )}
        </form.Field>

        {/* Age Field */}
        <form.Field name="age">
          {(field) => (
            <AppField
              field={field}
              type="number"
              label="Age"
              min={18}
              max={120}
            />
          )}
        </form.Field>

        {/* Country Field */}
        <form.Field name="country">
          {(field) => (
            <AppField
              field={field}
              type="select"
              label="Country"
              options={countryOptions}
              placeholder="Select your country"
            />
          )}
        </form.Field>

        {/* Password Field */}
        <form.Field name="password">
          {(field) => (
            <AppField
              field={field}
              type="text"
              label="Password"
              placeholder="Enter a strong password"
              helperText="At least 8 chars, 1 uppercase, 1 number"
            />
          )}
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isValidating: state.isValidating,
          })}
          children={({ canSubmit, isValidating }) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isValidating}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              <span>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </span>
            </button>
          )}
        />
      </form>
    </div>
  )
}
```

---

## 5. Usage Example

```tsx
/**
 * Page component using the composed RegistrationForm
 */
'use client'

import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/forms/RegistrationForm'

export default function SignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegistrationForm
        onSuccess={() => {
          // Redirect after successful registration
          router.push('/welcome')
        }}
      />
    </div>
  )
}
```

---

## Key Benefits

### Composition
- **Reusable Components**: TextField, NumberField, SelectField used across forms
- **AppField Wrapper**: Eliminates boilerplate when connecting TanStack Form to UI
- **createFormHook Factory**: Generate form-specific hooks from any schema

### Type Safety
- **Zod Inference**: Full TypeScript types from schema
- **Generic Props**: Type-safe field props with generics
- **Error Handling**: Properly typed validation errors

### Maintainability
- **Single Responsibility**: Each component has one purpose
- **No Duplication**: Field logic centralized, not repeated per form
- **Easy Updates**: Change field styling in one place

### DX
- **Less Boilerplate**: AppField reduces field rendering code by 70%
- **Intuitive API**: Natural form composition pattern
- **Extensible**: Add new field types without modifying existing code

---

## Advanced Patterns

### Creating Custom Field Types

```typescript
/**
 * Checkbox field component
 */
interface CheckboxFieldProps {
  id: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
  errors: string[]
}

export function CheckboxField({
  id,
  label,
  value,
  onChange,
  errors,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {errors.length > 0 && (
        <p className="text-sm text-red-600">{errors[0]}</p>
      )}
    </div>
  )
}
```

### Composing Multiple Forms

```typescript
/**
 * Reuse form hooks and components across different forms
 */
const useLoginForm = createFormHook(loginSchema, authService.login)
const useSignupForm = createFormHook(signupSchema, authService.signup)
const useProfileForm = createFormHook(profileSchema, userService.updateProfile)

// All use the same TextField, NumberField, AppField components
```

---

## SOLID Compliance

- **S**: Each component has single responsibility (TextField ≠ NumberField)
- **O**: Extensible via new field component types
- **L**: Field components are interchangeable via AppField
- **I**: Small, focused interfaces per component
- **D**: Components depend on props, not implementation details
