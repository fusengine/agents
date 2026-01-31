---
title: Multi-Step Wizard Form
description: Step-by-step form with state management, per-step validation, progress indicator, and final submission with accumulated data
---

# Multi-Step Wizard Form Pattern

Complete multi-step form implementation with TanStack Form, Zod validation, step state management, and progress tracking.

## Features

- ✅ Step-by-step navigation (previous/next)
- ✅ Per-step Zod validation
- ✅ Form state persistence across steps
- ✅ Progress indicator (visual step tracking)
- ✅ Final review step before submit
- ✅ Accumulated data submission
- ✅ TypeScript safety with `z.infer`

## Installation

```bash
bun add @tanstack/react-form zod
```

## Step Schema Definitions

Define validation schemas for each step of the wizard.

```typescript
import { z } from 'zod'

/**
 * Step 1: Personal Information
 */
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be 2+ characters'),
  lastName: z.string().min(2, 'Last name must be 2+ characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
})

/**
 * Step 2: Address Information
 */
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
})

/**
 * Step 3: Billing Information
 */
export const billingSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card must be 16 digits'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3-4 digits'),
  billingAddress: z.string().min(5, 'Billing address required'),
})

/**
 * Complete wizard form data
 */
export const wizardFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
  ...billingSchema.shape,
})

export type WizardFormData = z.infer<typeof wizardFormSchema>
```

## Step State Manager Hook

Create a custom hook to manage wizard state and step validation.

```typescript
import { useState, useCallback } from 'react'
import { ZodSchema } from 'zod'

/**
 * Step configuration
 */
interface Step {
  id: number
  title: string
  schema: ZodSchema
  fields: string[]
}

/**
 * Wizard state hook
 *
 * @param steps - Array of step definitions
 * @param initialData - Initial form data
 * @returns Wizard state and handlers
 */
export function useWizardState<T extends Record<string, any>>(
  steps: Step[],
  initialData: T,
) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<T>(initialData)
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({})

  /**
   * Validate current step data against its schema
   */
  const validateStep = useCallback(async (): Promise<boolean> => {
    const step = steps[currentStep]
    if (!step) return false

    try {
      const stepData = step.fields.reduce(
        (acc, field) => {
          acc[field] = formData[field]
          return acc
        },
        {} as Record<string, any>,
      )

      await step.schema.parseAsync(stepData)
      setStepErrors((prev) => {
        const updated = { ...prev }
        delete updated[currentStep]
        return updated
      })
      return true
    } catch (error) {
      if (error instanceof Error) {
        const messages = error.message.split('\n').filter((msg) => msg.trim())
        setStepErrors((prev) => ({
          ...prev,
          [currentStep]: messages,
        }))
      }
      return false
    }
  }, [currentStep, formData, steps])

  /**
   * Move to next step if current step validates
   */
  const nextStep = useCallback(async () => {
    const isValid = await validateStep()
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, steps.length, validateStep])

  /**
   * Move to previous step (no validation)
   */
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  /**
   * Update form data
   */
  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setCurrentStep(0)
    setFormData(initialData)
    setStepErrors({})
  }, [initialData])

  return {
    currentStep,
    totalSteps: steps.length,
    formData,
    stepErrors: stepErrors[currentStep] || [],
    updateFormData,
    nextStep,
    prevStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  }
}
```

## Wizard Form Component

Main wizard component that orchestrates steps and submission.

```typescript
import { useForm } from '@tanstack/react-form'
import React, { useState } from 'react'
import {
  personalInfoSchema,
  addressSchema,
  billingSchema,
  wizardFormSchema,
  type WizardFormData,
} from './schemas'
import { useWizardState } from './useWizardState'

/**
 * Step definitions
 */
const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    schema: personalInfoSchema,
    fields: ['firstName', 'lastName', 'email', 'phone'],
  },
  {
    id: 2,
    title: 'Address',
    schema: addressSchema,
    fields: ['street', 'city', 'state', 'zipCode'],
  },
  {
    id: 3,
    title: 'Billing',
    schema: billingSchema,
    fields: ['cardNumber', 'expiryDate', 'cvv', 'billingAddress'],
  },
  {
    id: 4,
    title: 'Review',
    schema: wizardFormSchema,
    fields: [],
  },
]

const INITIAL_DATA: WizardFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  billingAddress: '',
}

/**
 * Multi-step wizard form component
 *
 * Manages step-by-step form progression with validation,
 * state persistence, and final submission.
 */
export function MultiStepWizard() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    currentStep,
    totalSteps,
    formData,
    stepErrors,
    updateFormData,
    nextStep,
    prevStep,
    reset,
    isFirstStep,
    isLastStep,
  } = useWizardState(WIZARD_STEPS, INITIAL_DATA)

  /**
   * Handle form submission after final review
   */
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const validatedData = await wizardFormSchema.parseAsync(formData)

      // Submit to backend
      const response = await fetch('/api/wizard-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitSuccess(true)
      reset()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An error occurred'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
          <h1 className="mb-4 text-2xl font-bold text-green-600">
            Submission Complete
          </h1>
          <p className="mb-6 text-gray-600">
            Your information has been submitted successfully.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-4 py-8">
      {/* Progress Indicator */}
      <div className="mb-8 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="rounded-lg bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            {WIZARD_STEPS[currentStep]?.title}
          </h2>

          {/* Step Errors */}
          {stepErrors.length > 0 && (
            <div className="mb-4 rounded bg-red-50 p-4">
              <h3 className="mb-2 font-semibold text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="list-inside list-disc space-y-1 text-red-700">
                {stepErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="mb-4 rounded bg-red-50 p-4 text-red-700">
              {submitError}
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8 space-y-6">
            {currentStep === 0 && (
              <PersonalInfoStep formData={formData} onChange={updateFormData} />
            )}
            {currentStep === 1 && (
              <AddressStep formData={formData} onChange={updateFormData} />
            )}
            {currentStep === 2 && (
              <BillingStep formData={formData} onChange={updateFormData} />
            )}
            {currentStep === 3 && (
              <ReviewStep formData={formData} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {!isFirstStep && (
              <button
                onClick={prevStep}
                className="flex-1 rounded bg-gray-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {!isLastStep ? (
              <button
                onClick={nextStep}
                className="flex-1 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Step Components

Individual components for each step of the wizard.

```typescript
/**
 * Personal Information Step
 *
 * @param formData - Current form data
 * @param onChange - Update handler
 */
function PersonalInfoStep({
  formData,
  onChange,
}: {
  formData: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="1234567890"
        />
      </div>
    </>
  )
}

/**
 * Address Step
 *
 * @param formData - Current form data
 * @param onChange - Update handler
 */
function AddressStep({
  formData,
  onChange,
}: {
  formData: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => onChange({ street: e.target.value })}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="123 Main St"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onChange({ state: e.target.value.toUpperCase() })}
            maxLength={2}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="NY"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => onChange({ zipCode: e.target.value })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="10001"
          />
        </div>
      </div>
    </>
  )
}

/**
 * Billing Step
 *
 * @param formData - Current form data
 * @param onChange - Update handler
 */
function BillingStep({
  formData,
  onChange,
}: {
  formData: WizardFormData
  onChange: (updates: Partial<WizardFormData>) => void
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Card Number
        </label>
        <input
          type="text"
          value={formData.cardNumber}
          onChange={(e) =>
            onChange({
              cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16),
            })
          }
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="1234567890123456"
          maxLength={16}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Expiry (MM/YY)
          </label>
          <input
            type="text"
            value={formData.expiryDate}
            onChange={(e) => onChange({ expiryDate: e.target.value })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="12/25"
            maxLength={5}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            CVV
          </label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => onChange({ cvv: e.target.value.replace(/\D/g, '') })}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Billing Address
        </label>
        <input
          type="text"
          value={formData.billingAddress}
          onChange={(e) => onChange({ billingAddress: e.target.value })}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="123 Billing St"
        />
      </div>
    </>
  )
}

/**
 * Review Step
 *
 * Summary of all entered data before final submission
 *
 * @param formData - Complete form data
 */
function ReviewStep({ formData }: { formData: WizardFormData }) {
  return (
    <div className="space-y-6">
      <div className="rounded bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">Personal Information</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Name:</dt>
            <dd className="font-medium">
              {formData.firstName} {formData.lastName}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Email:</dt>
            <dd className="font-medium">{formData.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Phone:</dt>
            <dd className="font-medium">{formData.phone}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">Address</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Street:</dt>
            <dd className="font-medium">{formData.street}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">City:</dt>
            <dd className="font-medium">{formData.city}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">State:</dt>
            <dd className="font-medium">{formData.state}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">ZIP Code:</dt>
            <dd className="font-medium">{formData.zipCode}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">Billing</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Card:</dt>
            <dd className="font-medium">****{formData.cardNumber.slice(-4)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Expiry:</dt>
            <dd className="font-medium">{formData.expiryDate}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Billing Address:</dt>
            <dd className="font-medium">{formData.billingAddress}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
```

## Key Patterns

### 1. Per-Step Validation
Each step validates only its own fields before allowing navigation:

```typescript
const isValid = await validateStep()
if (isValid && currentStep < steps.length - 1) {
  setCurrentStep((prev) => prev + 1)
}
```

### 2. Form State Persistence
Data is maintained across all steps in a single state object:

```typescript
const [formData, setFormData] = useState<T>(initialData)
updateFormData((updates) => ({ ...formData, ...updates }))
```

### 3. Progress Tracking
Visual indicator shows completed and current steps:

```typescript
<div
  className={`h-10 w-10 rounded-full ${
    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
  }`}
/>
```

### 4. Review Before Submit
Final step displays all data for verification before submission.

### 5. Error Handling
Step-specific errors displayed above navigation buttons.

## Best Practices

1. **Validate on next, not on blur** - Better UX, less interruption
2. **Accumulate data** - Keep all form state until final submit
3. **Review step** - Always include summary before final submission
4. **Disable fields during submit** - Prevent double submissions
5. **Clear sensitive data** - Clear card data after successful submit
6. **Show progress** - Visual indicators reduce abandonment
7. **Type safety** - Use `z.infer` for form data types
