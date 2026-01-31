---
name: "Basic Form Template"
description: "Complete login/signup form with TanStack Form (React Hook Form) + Zod validation"
tags: ["forms", "tanstack-form", "zod", "validation", "typescript"]
difficulty: "beginner"
---

# Basic Form Template: Login/Signup with TanStack Form + Zod

Complete working example of a form with client-side validation, error display, and loading states.

## Installation

```bash
npm install @tanstack/react-form zod
npm install --save-dev @types/react
```

## Complete Code

```typescript
'use client';

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

/**
 * Zod validation schema for login/signup form
 * Defines field requirements and validation rules
 */
const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    // For signup: confirm passwords must match
    if (data.confirmPassword !== undefined) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

type FormData = z.infer<typeof formSchema>;

interface BasicFormProps {
  /** Whether form is in signup mode (shows confirmPassword field) */
  isSignup?: boolean;
  /** Callback fired on successful form submission */
  onSubmit: (data: FormData) => Promise<void>;
}

/**
 * BasicForm Component
 *
 * Reusable login/signup form with:
 * - Client-side Zod validation
 * - Error display below each field
 * - Loading state on submit button
 * - Responsive design
 *
 * @param isSignup - Enable signup mode with password confirmation
 * @param onSubmit - Async callback to handle form submission
 *
 * @example
 * ```tsx
 * <BasicForm
 *   isSignup={false}
 *   onSubmit={async (data) => {
 *     await authService.login(data.email, data.password);
 *   }}
 * />
 * ```
 */
export function BasicForm({ isSignup = false, onSubmit }: BasicFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: isSignup ? '' : undefined,
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setServerError(null);
        await onSubmit(values.value as FormData);
      } catch (error) {
        setServerError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: formSchema,
      onBlur: formSchema,
      onSubmit: formSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="w-full max-w-md mx-auto space-y-4"
    >
      {/* Server Error Alert */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{serverError}</p>
        </div>
      )}

      {/* Email Field */}
      <form.Field
        name="email"
        validators={{
          onChange: formSchema.shape.email,
          onBlur: formSchema.shape.email,
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="you@example.com"
            />
            {/* Error Message */}
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]?.toString()}
              </p>
            )}
          </div>
        )}
      />

      {/* Password Field */}
      <form.Field
        name="password"
        validators={{
          onChange: formSchema.shape.password,
          onBlur: formSchema.shape.password,
        }}
        children={(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="••••••••"
            />
            {/* Error Message */}
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]?.toString()}
              </p>
            )}
          </div>
        )}
      />

      {/* Confirm Password Field (Signup Only) */}
      {isSignup && (
        <form.Field
          name="confirmPassword"
          validators={{
            onChange: formSchema,
            onBlur: formSchema,
          }}
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="••••••••"
              />
              {/* Error Message */}
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !form.state.isFormValid}
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading && (
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
        <span>{isSignup ? 'Sign Up' : 'Sign In'}</span>
      </button>
    </form>
  );
}

/**
 * Example usage in a page/route component
 *
 * @example
 * ```tsx
 * export default function LoginPage() {
 *   const router = useRouter();
 *
 *   const handleLogin = async (data: FormData) => {
 *     const response = await fetch('/api/auth/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(data),
 *     });
 *
 *     if (!response.ok) {
 *       throw new Error('Login failed');
 *     }
 *
 *     router.push('/dashboard');
 *   };
 *
 *   return (
 *     <div className="min-h-screen flex items-center justify-center bg-gray-50">
 *       <BasicForm isSignup={false} onSubmit={handleLogin} />
 *     </div>
 *   );
 * }
 * ```
 */
```

## Key Features

### Validation
- **Zod Schema**: Type-safe validation with clear error messages
- **Real-time Validation**: Validates on change and blur
- **Cross-field Validation**: Password confirmation match check
- **Error Display**: Individual field errors shown below inputs

### UX
- **Loading State**: Submit button disabled and shows spinner during submission
- **Server Errors**: Display server-side errors in alert banner
- **Visual Feedback**: Red borders on invalid fields, blue focus ring
- **Accessible**: Proper labels, ARIA attributes, keyboard navigation

### Form State
- **Controlled Inputs**: React Hook Form manages all state
- **Default Values**: Pre-populate form fields
- **Dirty Tracking**: Know which fields have been changed

## Usage

### Login Mode
```tsx
<BasicForm
  isSignup={false}
  onSubmit={async (data) => {
    const result = await signIn(data.email, data.password);
    if (!result.success) throw new Error(result.error);
  }}
/>
```

### Signup Mode
```tsx
<BasicForm
  isSignup={true}
  onSubmit={async (data) => {
    await createUser({
      email: data.email,
      password: data.password,
    });
  }}
/>
```

## Styling

Uses Tailwind CSS utility classes. Adapt classNames for your design system:
- Focus: `focus:ring-blue-500` → your primary color
- Error: `text-red-600` → your error color
- Button: `bg-blue-600 hover:bg-blue-700` → your button colors

## Customization

Extend validation schema:
```typescript
const signupSchema = formSchema.extend({
  username: z.string().min(3).max(20),
  acceptTerms: z.boolean().refine(v => v === true, 'Required'),
});
```

Add more fields:
```tsx
<form.Field name="username">
  {/* field component */}
</form.Field>
```

## Error Handling

- **Validation Errors**: Displayed inline below fields
- **Server Errors**: Shown in top banner
- **Network Errors**: Caught in try-catch, displayed to user
