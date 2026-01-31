---
name: "TanStack Form Devtools Integration"
description: "Complete integration of TanStack Form Devtools panel for form state debugging and development"
tags: ["forms", "tanstack-form", "devtools", "debugging", "development", "typescript"]
difficulty: "intermediate"
---

# TanStack Form Devtools Integration Template

Complete working example of integrating TanStack Form Devtools for advanced form state debugging, validation tracking, and submission monitoring during development.

## Installation

```bash
npm install @tanstack/react-form @tanstack/form-devtools
npm install --save-dev @types/react
```

## Complete Code

```typescript
'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { FormDevtools } from '@tanstack/form-devtools';

/**
 * Zod validation schema for the form
 * Defines field requirements and validation rules
 */
const formSchema = z.object({
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
    .email('Invalid email address'),
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Please enter a valid age'),
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, 'You must accept the terms'),
});

type FormData = z.infer<typeof formSchema>;

interface DevtoolsFormProps {
  /** Callback fired on successful form submission */
  onSubmit: (data: FormData) => Promise<void>;
  /** Custom devtools panel position: 'bottom' | 'top' | 'left' | 'right' */
  devtoolsPosition?: 'bottom' | 'top' | 'left' | 'right';
  /** Enable detailed logging to console */
  enableLogging?: boolean;
}

/**
 * DevtoolsForm Component
 *
 * Advanced form with integrated TanStack Form Devtools featuring:
 * - Real-time form state inspection in devtools panel
 * - Field-by-field validation tracking
 * - Submission history and payload inspection
 * - Form state change timeline
 * - Debug logs for form lifecycle events
 * - Development-only rendering (Devtools hidden in production)
 *
 * @param onSubmit - Async callback to handle form submission
 * @param devtoolsPosition - Custom position for devtools panel
 * @param enableLogging - Enable console logging of form events
 *
 * @example
 * ```tsx
 * <DevtoolsForm
 *   onSubmit={async (data) => {
 *     await submitUserData(data);
 *   }}
 *   devtoolsPosition="bottom"
 *   enableLogging={true}
 * />
 * ```
 */
export function DevtoolsForm({
  onSubmit,
  devtoolsPosition = 'bottom',
  enableLogging = true,
}: DevtoolsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isDevEnvironment] = useState(() => {
    // Detect development environment
    return process.env.NODE_ENV === 'development' ||
           (typeof window !== 'undefined' &&
            (window as any).__DEVTOOLS_ENABLED__ === true);
  });

  /**
   * Log form events to console (development only)
   */
  const logEvent = (eventName: string, data?: unknown) => {
    if (enableLogging && isDevEnvironment) {
      console.group(`[Form] ${eventName}`);
      console.log(data);
      console.groupEnd();
    }
  };

  /**
   * Compute form validation summary for debugging
   */
  const formStats = useMemo(
    () => ({
      timestamp: new Date().toISOString(),
      isDevelopment: isDevEnvironment,
    }),
    [isDevEnvironment]
  );

  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      acceptTerms: false,
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setServerError(null);
        setSubmissionCount((prev) => prev + 1);

        logEvent('Form Submitted', {
          submissionCount: submissionCount + 1,
          values: values.value,
          timestamp: new Date().toISOString(),
        });

        await onSubmit(values.value as FormData);

        logEvent('Submission Success', {
          submissionNumber: submissionCount + 1,
        });

        // Reset form after successful submission
        form.reset();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred';
        setServerError(errorMessage);

        logEvent('Submission Error', {
          error: errorMessage,
          submissionNumber: submissionCount + 1,
        });
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

  /**
   * Handle form state changes for debugging
   */
  const handleFormStateChange = React.useCallback(() => {
    logEvent('Form State Changed', {
      isValid: form.state.isFormValid,
      isDirty: form.state.formState.isDirty,
      isSubmitted: form.state.formState.isSubmitted,
      fieldValues: form.state.values,
      fieldTouched: Object.keys(form.state.fieldMeta).reduce(
        (acc, key) => {
          const fieldName = key as keyof FormData;
          const field = form.state.fieldMeta[fieldName];
          acc[fieldName] = field?.isTouched ?? false;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    });
  }, [form, logEvent]);

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFormStateChange();
          form.handleSubmit();
        }}
        className="w-full max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900">User Registration</h1>

        {/* Development Environment Indicator */}
        {isDevEnvironment && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800 font-medium">
              Development Mode: Form Devtools Active
            </p>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{serverError}</p>
          </div>
        )}

        {/* Submission Counter (Debug Info) */}
        {isDevEnvironment && submissionCount > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-xs text-gray-600">
              Form submitted {submissionCount} time{submissionCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name Field */}
          <form.Field
            name="firstName"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    logEvent(`Field Changed: ${field.name}`, {
                      value: e.target.value,
                      errors: field.state.meta.errors,
                    });
                  }}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="John"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]?.toString()}
                  </p>
                )}
              </div>
            )}
          />

          {/* Last Name Field */}
          <form.Field
            name="lastName"
            children={(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    logEvent(`Field Changed: ${field.name}`, {
                      value: e.target.value,
                      errors: field.state.meta.errors,
                    });
                  }}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Doe"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors[0]?.toString()}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Email Field */}
        <form.Field
          name="email"
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
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  logEvent(`Field Changed: ${field.name}`, {
                    value: e.target.value,
                    errors: field.state.meta.errors,
                  });
                }}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="john@example.com"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        />

        {/* Age Field */}
        <form.Field
          name="age"
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(parseInt(e.target.value, 10));
                  logEvent(`Field Changed: ${field.name}`, {
                    value: parseInt(e.target.value, 10),
                    errors: field.state.meta.errors,
                  });
                }}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="25"
                min="18"
                max="120"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        />

        {/* Accept Terms Checkbox */}
        <form.Field
          name="acceptTerms"
          children={(field) => (
            <div className="flex items-center">
              <input
                id={field.name}
                name={field.name}
                type="checkbox"
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.checked);
                  logEvent(`Field Changed: ${field.name}`, {
                    value: e.target.checked,
                    errors: field.state.meta.errors,
                  });
                }}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor={field.name}
                className="ml-2 block text-sm text-gray-700"
              >
                I accept the terms and conditions
              </label>
              {field.state.meta.errors.length > 0 && (
                <p className="ml-2 text-sm text-red-600">
                  {field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        />

        {/* Debug Info Panel (Dev Only) */}
        {isDevEnvironment && (
          <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-xs font-mono">
            <p className="font-bold text-gray-900 mb-2">Form State (Dev)</p>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="font-bold">Valid:</span> {form.state.isFormValid ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-bold">Dirty:</span> {form.state.formState.isDirty ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-bold">Submitted:</span> {form.state.formState.isSubmitted ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-bold">Touched Fields:</span>{' '}
                {Object.keys(form.state.fieldMeta).filter(
                  (k) => form.state.fieldMeta[k as keyof FormData]?.isTouched
                ).length}
              </div>
            </div>
          </div>
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
          <span>Register</span>
        </button>
      </form>

      {/* TanStack Form Devtools Panel (Dev Only) */}
      {isDevEnvironment && typeof window !== 'undefined' && (
        <FormDevtools position={devtoolsPosition} />
      )}
    </div>
  );
}

/**
 * Example usage in a page/route component
 *
 * @example
 * ```tsx
 * export default function RegistrationPage() {
 *   const handleSubmit = async (data: FormData) => {
 *     const response = await fetch('/api/users', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(data),
 *     });
 *
 *     if (!response.ok) {
 *       const error = await response.json();
 *       throw new Error(error.message || 'Registration failed');
 *     }
 *
 *     // Success handling
 *   };
 *
 *   return (
 *     <div className="min-h-screen bg-gray-50">
 *       <DevtoolsForm
 *         onSubmit={handleSubmit}
 *         devtoolsPosition="bottom"
 *         enableLogging={true}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
```

## Key Features

### Devtools Integration

**FormDevtools Panel**
- Real-time form state visualization
- Field-by-field validation tracking
- Submission history with payloads
- Form state change timeline
- Performance metrics and debugging hooks
- Conditional rendering (hidden in production)

**Devtools Position Options**
```typescript
// Position in viewport
<FormDevtools position="bottom" />   // Default, fixed at bottom
<FormDevtools position="top" />      // Fixed at top
<FormDevtools position="left" />     // Fixed at left side
<FormDevtools position="right" />    // Fixed at right side
```

### Debug Logging

**Console Logging (Development Only)**
- Field change events with values and errors
- Form submission attempts with payload
- Validation state changes
- Error events with context

**Enable/Disable Logging**
```tsx
<DevtoolsForm
  onSubmit={handleSubmit}
  enableLogging={true}  // Enable console logs
/>
```

### Form State Inspection

**Built-in Debug Panel**
- Form validity status
- Dirty field tracking
- Submission count
- Touched field summary

**Direct State Access**
```typescript
// Via form object
form.state.isFormValid        // Boolean
form.state.formState.isDirty  // Boolean
form.state.values             // Current form data
form.state.fieldMeta          // Field metadata
```

### Development Environment Detection

```typescript
// Automatic detection
const isDev = process.env.NODE_ENV === 'development';

// Manual override for testing
window.__DEVTOOLS_ENABLED__ = true;  // Force devtools on
```

## Usage Examples

### Basic Setup
```tsx
<DevtoolsForm
  onSubmit={async (data) => {
    await submitUser(data);
  }}
/>
```

### With Custom Position
```tsx
<DevtoolsForm
  onSubmit={handleSubmit}
  devtoolsPosition="top"
/>
```

### With Detailed Logging
```tsx
<DevtoolsForm
  onSubmit={handleSubmit}
  enableLogging={true}
  devtoolsPosition="bottom"
/>
```

### In Production (Devtools Hidden)
```tsx
// Devtools automatically hidden when NODE_ENV !== 'development'
<DevtoolsForm onSubmit={handleSubmit} />
```

## Debugging Tips

### Inspect Form State
1. Open Devtools panel from bottom/top/side
2. Watch "Form State" tab for real-time updates
3. Monitor field validation in "Fields" section
4. Review submission history in "Submissions" tab

### Track Field Changes
```typescript
// Console logs show:
// [Form] Field Changed: firstName
// {
//   value: "John",
//   errors: []
// }
```

### Monitor Submissions
```typescript
// Console logs show:
// [Form] Form Submitted
// {
//   submissionCount: 1,
//   values: { firstName: "John", ... },
//   timestamp: "2024-01-15T10:30:00.000Z"
// }
```

### Check Validation State
- Red borders = Field has errors
- Blue ring = Field focused
- Gray button = Form invalid or submitting

### Performance Monitoring
- Devtools tracks validation performance
- Monitor re-render counts
- Check state change frequency
- Identify unnecessary validations

## Production Considerations

### Disable Devtools in Production
```typescript
// Automatically handled - checks NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // FormDevtools component not rendered
}
```

### Disable Logging in Production
```tsx
// Pass enableLogging={false}
<DevtoolsForm
  onSubmit={handleSubmit}
  enableLogging={process.env.NODE_ENV === 'development'}
/>
```

### Remove Development Code
```bash
# Build tools automatically exclude dev code with tree-shaking
npm run build
```

## Styling

Uses Tailwind CSS utility classes. Customize for your theme:
- Focus: `focus:ring-blue-500` → your primary color
- Error: `text-red-600` → your error color
- Debug: `bg-gray-100` → your background color

## Advanced Debugging

### Watch Form State Changes
```typescript
// In component
React.useEffect(() => {
  console.log('Form state updated:', form.state);
}, [form.state]);
```

### Monitor Specific Field
```typescript
const emailField = form.getFieldMeta('email');
console.log('Email errors:', emailField?.errors);
console.log('Email touched:', emailField?.isTouched);
```

### Custom Devtools Wrapper
```typescript
const FormDevtoolsWrapper = ({ isEnabled }: { isEnabled: boolean }) => {
  if (!isEnabled) return null;
  return <FormDevtools position="bottom" />;
};

// Usage
<FormDevtoolsWrapper isEnabled={process.env.NODE_ENV === 'development'} />
```
