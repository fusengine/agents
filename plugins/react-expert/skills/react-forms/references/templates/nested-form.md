---
title: Nested Object Fields
description: Handle nested form fields (user profile with address) using React Hook Form and Zod
category: forms
complexity: intermediate
tags: [nested-forms, react-hook-form, zod, validation]
version: 1.0.0
lastUpdated: 2026-01-31
author: React Expert
---

# Nested Form Template

Template for managing nested object fields in forms, such as user profiles with embedded address information. Demonstrates dot notation field names, nested validation, and section-based UI organization.

## Key Concepts

- **Nested defaultValues**: Structure mirrors form data hierarchy
- **Dot notation**: Access nested fields with `user.profile.firstName`
- **Nested validation**: Zod `z.object()` for nested structures
- **Section grouping**: Organize complex forms by logical sections
- **Type safety**: Full TypeScript inference for nested objects

## Complete Example

### 1. Type Definitions

```typescript
/**
 * Address information interface
 */
interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

/**
 * User profile interface
 */
interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: Address
}

/**
 * Complete user form data
 */
interface UserFormData {
  user: UserProfile
}
```

### 2. Zod Validation Schema

```typescript
import { z } from 'zod'

/**
 * Zod schema for nested address validation
 * @remarks Validates all address fields with proper error messages
 */
const addressSchema = z.object({
  street: z.string().min(5, 'Street must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
})

/**
 * Zod schema for nested user profile validation
 * @remarks Combines personal info and nested address validation
 */
const userProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: addressSchema,
})

/**
 * Root form schema with nested user object
 * @remarks Complete schema for entire form with nested structure
 */
export const userFormSchema = z.object({
  user: userProfileSchema,
})

/**
 * Type inference from Zod schema
 */
export type UserFormValues = z.infer<typeof userFormSchema>
```

### 3. Form Component

```typescript
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, UserFormValues } from './validation'

/**
 * Nested form component for user profile with address
 *
 * @returns JSX element rendering the complete form with nested sections
 *
 * @example
 * ```tsx
 * <UserProfileForm onSubmit={(data) => console.log(data)} />
 * ```
 */
export function UserProfileForm({
  onSubmit,
}: {
  onSubmit: (data: UserFormValues) => Promise<void> | void
}): JSX.Element {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    // Nested defaultValues structure matching form hierarchy
    defaultValues: {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States',
        },
      },
    },
    mode: 'onBlur',
  })

  // Watch nested field for conditional rendering
  const country = watch('user.address.country')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      {/* Personal Information Section */}
      <fieldset className="border border-gray-300 rounded-lg p-6 mb-8">
        <legend className="text-lg font-semibold text-gray-900 px-2">
          Personal Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* First Name - Nested field using dot notation */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              {...register('user.firstName')}
              id="firstName"
              type="text"
              placeholder="John"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.user?.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name - Nested field using dot notation */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              {...register('user.lastName')}
              id="lastName"
              type="text"
              placeholder="Doe"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.user?.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.lastName.message}
              </p>
            )}
          </div>

          {/* Email - Nested field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register('user.email')}
              id="email"
              type="email"
              placeholder="john@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.user?.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.email.message}
              </p>
            )}
          </div>

          {/* Phone - Nested field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone (10 digits)
            </label>
            <input
              {...register('user.phone')}
              id="phone"
              type="tel"
              placeholder="5551234567"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.user?.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.phone.message}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Address Section */}
      <fieldset className="border border-gray-300 rounded-lg p-6 mb-8">
        <legend className="text-lg font-semibold text-gray-900 px-2">
          Address
        </legend>

        <div className="space-y-6 mt-6">
          {/* Street - Nested field in address object */}
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              {...register('user.address.street')}
              id="street"
              type="text"
              placeholder="123 Main Street"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.user?.address?.street && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.address.street.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                {...register('user.address.city')}
                id="city"
                type="text"
                placeholder="New York"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.user?.address?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.address.city.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                {...register('user.address.state')}
                id="state"
                type="text"
                placeholder="NY"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.user?.address?.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.address.state.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ZIP Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                {...register('user.address.zipCode')}
                id="zipCode"
                type="text"
                placeholder="10001 or 10001-1234"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.user?.address?.zipCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.address.zipCode.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                {...register('user.address.country')}
                id="country"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
              </select>
              {errors.user?.address?.country && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.address.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Conditional field based on watched nested value */}
          {country === 'United States' && (
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                ZIP code format: 5 digits or 5+4 format (e.g., 10001-1234)
              </p>
            </div>
          )}
        </div>
      </fieldset>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="reset"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
```

### 4. Usage Example

```typescript
'use client'

import { UserProfileForm } from './UserProfileForm'
import { UserFormValues } from './validation'

/**
 * Page component demonstrating nested form usage
 *
 * @returns JSX element with form and submission handling
 */
export default function UserProfilePage(): JSX.Element {
  /**
   * Handle nested form submission
   * @param data - Form values with nested user object structure
   * @remarks Access nested values: data.user.firstName, data.user.address.city
   */
  const handleSubmit = async (data: UserFormValues): Promise<void> => {
    try {
      console.log('Form data:', data)

      // Example: Send to API
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to save profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Profile
        </h1>
        <UserProfileForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
```

## Key Features

### Nested defaultValues Structure
```typescript
defaultValues: {
  user: {
    firstName: '',
    // ... other fields
    address: {
      street: '',
      // ... other address fields
    },
  },
}
```

### Dot Notation Field Names
- `user.firstName` - Top-level nested field
- `user.address.street` - Two-level nested field
- `user.address.zipCode` - Deeply nested field

### Nested Error Handling
```typescript
// Access errors for nested fields
errors.user?.firstName           // Top-level error
errors.user?.address?.street     // Nested error
errors.user?.address?.zipCode    // Two-level nested error
```

### Nested Validation
```typescript
userProfileSchema = z.object({
  firstName: z.string().min(2),
  address: addressSchema,  // Nested schema
})
```

### Section Grouping with Fieldset
```tsx
<fieldset className="border rounded-lg p-6">
  <legend>Personal Information</legend>
  {/* Group related fields */}
</fieldset>
```

## Watch Nested Fields

```typescript
// Watch nested field for conditional rendering
const country = watch('user.address.country')

// Watch entire nested object
const addressData = watch('user.address')
```

## Error Patterns

### Common Issues

1. **Missing nested error checks**
   ```typescript
   // ❌ Incorrect: May crash if user object is undefined
   errors.user.address.street.message

   // ✅ Correct: Safe optional chaining
   errors.user?.address?.street?.message
   ```

2. **Incorrect field paths**
   ```typescript
   // ❌ Incorrect path
   register('firstName')  // Won't work for nested structure

   // ✅ Correct path with dot notation
   register('user.firstName')
   ```

3. **Validation not matching structure**
   ```typescript
   // ❌ Validation doesn't match form structure
   z.object({
     firstName: z.string(),  // Schema doesn't nest
   })

   // ✅ Validation mirrors form hierarchy
   z.object({
     user: z.object({
       firstName: z.string(),
     }),
   })
   ```

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.4"
  }
}
```

## Best Practices

1. **Mirror structure**: Nested defaultValues should match nested schema
2. **Type safety**: Use Zod schema inference for full TypeScript support
3. **Error handling**: Always use optional chaining for nested errors
4. **Fieldset grouping**: Organize complex forms into logical sections
5. **Watch deeply**: Use dot notation in watch() for nested fields
6. **Validate early**: Set validation mode to 'onBlur' or 'onChange'

## See Also

- [Basic Form Template](./basic-form.md)
- [Dynamic Arrays](./dynamic-arrays.md)
- [Custom Validation](./custom-validation.md)
