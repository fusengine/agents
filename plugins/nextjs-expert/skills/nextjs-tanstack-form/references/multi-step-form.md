---
name: multi-step-form
description: Multi-step wizard forms with step validation and state persistence
when-to-use: Building checkout flows, signup wizards, onboarding forms
keywords: wizard, steps, multi-step, session-storage, step-validation
priority: medium
requires: basic-usage.md
related: array-fields.md
---

# Multi-Step Form Wizard

## Overview

Multi-step forms distribute complex data collection across sequential steps, improving UX and form completion rates. Each step validates independently before advancing, with state persisting across sessions.

## Step State Management

Track current step and persisted data:

```typescript
// hooks/useMultiStepForm.ts
import { useState, useEffect } from 'react'

export function useMultiStepForm(totalSteps: number, storageKey: string) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  // Load persisted data on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey)
    if (saved) setFormData(JSON.parse(saved))
  }, [storageKey])

  // Persist to sessionStorage
  const updateFormData = (data: Record<string, any>) => {
    const updated = { ...formData, ...data }
    setFormData(updated)
    sessionStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(s => s + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  }
}
```

## Step Validation

Validate before advancing to next step:

```typescript
// utils/stepValidators.ts
export const stepValidators = {
  personal: (data: any) => {
    const errors: Record<string, string> = {}
    if (!data.firstName?.trim()) errors.firstName = 'Required'
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email'
    }
    return errors
  },

  address: (data: any) => {
    const errors: Record<string, string> = {}
    if (!data.street?.trim()) errors.street = 'Required'
    if (!data.city?.trim()) errors.city = 'Required'
    if (!data.zipCode?.match(/^\d{5}$/)) {
      errors.zipCode = 'Must be 5 digits'
    }
    return errors
  },

  payment: (data: any) => {
    const errors: Record<string, string> = {}
    if (!data.cardNumber?.match(/^\d{16}$/)) {
      errors.cardNumber = 'Invalid card'
    }
    return errors
  },
}
```

## Form Component

Integrate TanStack Form with step management:

```typescript
// components/MultiStepForm.tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { useMultiStepForm } from '@/hooks/useMultiStepForm'
import { stepValidators } from '@/utils/stepValidators'

export function MultiStepForm() {
  const { currentStep, formData, updateFormData, nextStep, prevStep, isLastStep } =
    useMultiStepForm(3, 'checkout')

  const form = useForm({
    defaultValues: formData,
    onSubmit: async ({ value }) => {
      if (currentStep === 1) {
        const errors = stepValidators.personal(value)
        if (Object.keys(errors).length === 0) {
          updateFormData(value)
          nextStep()
        }
        return { errors }
      }

      if (currentStep === 2) {
        const errors = stepValidators.address(value)
        if (Object.keys(errors).length === 0) {
          updateFormData(value)
          nextStep()
        }
        return { errors }
      }

      // Final submission
      await submitOrder(value)
    },
  })

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-2 flex-1 rounded ${
              step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {currentStep === 1 && <PersonalStep form={form} />}
        {currentStep === 2 && <AddressStep form={form} />}
        {currentStep === 3 && <PaymentStep form={form} />}

        <div className="mt-8 flex gap-4">
          {!form.state.isSubmitting && currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isLastStep ? 'Complete' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

## Session Persistence

Clear on completion:

```typescript
function clearFormSession(storageKey: string) {
  sessionStorage.removeItem(storageKey)
}
```
