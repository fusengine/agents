---
name: "Reactivity Form Template"
description: "TanStack Form reactivity patterns: field subscriptions, store selectors, optimized re-renders"
tags: ["forms", "tanstack-form", "reactivity", "performance", "selectors", "typescript"]
difficulty: "advanced"
---

# Reactivity Form Template: Optimized Field Subscriptions & Performance

Complete guide to TanStack Form reactivity patterns, field subscriptions, and performance optimization techniques.

## Installation

```bash
npm install @tanstack/react-form zustand
npm install --save-dev @types/react
```

## Complete Code

```typescript
'use client';

import React, { useMemo, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import { create } from 'zustand';

/**
 * User profile form data type
 */
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  age: number;
  country: string;
};

/**
 * Zustand store for managing form-related external state
 * Demonstrates pattern 1: useStore with selector for single field
 * Pattern 2: useStore for multiple values
 */
type FormStore = {
  isPhoneVisible: boolean;
  savedAt: Date | null;
  userCountries: string[];
  setPhoneVisible: (visible: boolean) => void;
  setSavedAt: (date: Date | null) => void;
  setUserCountries: (countries: string[]) => void;
};

/**
 * Zustand store with memoized selectors for optimal re-renders
 *
 * @example
 * ```tsx
 * // Pattern 1: Single value selector (prevents re-render if value unchanged)
 * const isPhoneVisible = useFormStore((state) => state.isPhoneVisible);
 *
 * // Pattern 2: Multiple values (memoized selector)
 * const { isPhoneVisible, savedAt } = useFormStore(
 *   (state) => ({
 *     isPhoneVisible: state.isPhoneVisible,
 *     savedAt: state.savedAt,
 *   }),
 *   (prev, curr) => prev.isPhoneVisible === curr.isPhoneVisible &&
 *     prev.savedAt === curr.savedAt // shallow equality check
 * );
 * ```
 */
export const useFormStore = create<FormStore>((set) => ({
  isPhoneVisible: false,
  savedAt: null,
  userCountries: [],
  setPhoneVisible: (visible) => set({ isPhoneVisible: visible }),
  setSavedAt: (date) => set({ savedAt: date }),
  setUserCountries: (countries) => set({ userCountries: countries }),
}));

/**
 * Pattern 1: Field subscription hook using useStore with selector
 *
 * Subscribes to a single field value in external store.
 * Prevents re-render if value doesn't change.
 *
 * @param selector - Function to select specific store value
 * @returns Selected store value
 *
 * @example
 * ```tsx
 * const isPhoneVisible = useFormStore((state) => state.isPhoneVisible);
 * ```
 */
function usePhoneVisibility() {
  return useFormStore((state) => state.isPhoneVisible);
}

/**
 * Pattern 2: Multiple values from store using custom hook
 *
 * Prevents re-render if any selected value changes.
 * Uses memoized selector for efficient shallow equality checks.
 *
 * @returns Object with isPhoneVisible and savedAt
 *
 * @example
 * ```tsx
 * const { isPhoneVisible, savedAt } = useFormMetadata();
 * ```
 */
function useFormMetadata() {
  return useFormStore(
    (state) => ({
      isPhoneVisible: state.isPhoneVisible,
      savedAt: state.savedAt,
    }),
    (prev, curr) =>
      prev.isPhoneVisible === curr.isPhoneVisible &&
      prev.savedAt === curr.savedAt
  );
}

/**
 * Pattern 3: form.Subscribe with selector
 *
 * Subscribe to specific form state changes using selector function.
 * Only re-renders when selected values change.
 * Best for fine-grained reactivity within form component.
 *
 * @example
 * ```tsx
 * <form.Subscribe
 *   selector={(state) => ({
 *     canSubmit: state.canSubmit,
 *     isSubmitting: state.isSubmitting,
 *   })}
 *   children={(state) => (
 *     <button disabled={!state.canSubmit || state.isSubmitting}>
 *       {state.isSubmitting ? 'Saving...' : 'Save'}
 *     </button>
 *   )}
 * />
 * ```
 */

/**
 * Pattern 4: Optimized submit button
 *
 * Component that only re-renders when canSubmit or isSubmitting changes.
 * Prevents full form re-renders when other fields change.
 */
interface OptimizedSubmitButtonProps {
  /** Form instance for submit state access */
  form: any;
  /** Callback on submit */
  onSubmit: () => void;
}

/**
 * OptimizedSubmitButton
 *
 * Demonstrates pattern 4: form.Subscribe selector for button-specific state.
 * Only subscribes to canSubmit and isSubmitting fields.
 *
 * @param form - TanStack Form instance
 * @param onSubmit - Callback fired on button click
 *
 * @example
 * ```tsx
 * <OptimizedSubmitButton
 *   form={form}
 *   onSubmit={() => form.handleSubmit()}
 * />
 * ```
 */
function OptimizedSubmitButton({
  form,
  onSubmit,
}: OptimizedSubmitButtonProps) {
  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
      children={({ canSubmit, isSubmitting }) => (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    />
  );
}

/**
 * Individual field component demonstrating reactive updates
 *
 * Uses field.Subscribe to only re-render when this specific field changes.
 * Prevents re-renders from other fields.
 */
interface FormFieldProps {
  /** Field name from form */
  name: keyof FormData;
  /** Label text */
  label: string;
  /** Input type */
  type?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Form instance */
  form: any;
  /** Optional field validator */
  validator?: (value: any) => string | undefined;
}

/**
 * FormField Component
 *
 * Demonstrates pattern 3: field.Subscribe for granular reactivity.
 * Only re-renders when THIS field's state changes.
 * Other form fields changing won't trigger this component's re-render.
 *
 * @param form - TanStack Form instance
 * @param name - Field name
 * @param label - Label text
 * @param type - Input type (text, email, number, etc.)
 * @param placeholder - Input placeholder
 * @param validator - Custom validator function
 *
 * @example
 * ```tsx
 * <FormField
 *   form={form}
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="user@example.com"
 * />
 * ```
 */
function FormField({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  validator,
}: FormFieldProps) {
  return (
    <form.Field
      name={name}
      validators={{
        onBlur: validator,
        onChange: validator,
      }}
      children={(field) => (
        <div className="space-y-1">
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>

          {/* Input with field-level reactivity */}
          <input
            id={name}
            name={name}
            type={type}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              field.state.meta.errors.length > 0
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />

          {/* Error display - only updates when field errors change */}
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-600">
              {field.state.meta.errors[0]?.toString()}
            </p>
          )}

          {/* Dirty state indicator - only shows when field is dirty */}
          {field.state.meta.isDirty && (
            <p className="text-xs text-gray-500">Unsaved changes</p>
          )}
        </div>
      )}
    />
  );
}

/**
 * Phone field component with conditional rendering
 *
 * Uses store selector to control visibility.
 * Demonstrates pattern 1: useStore with selector.
 */
function PhoneField({ form }: { form: any }) {
  /**
   * Pattern 1: Single value from store using selector
   * Only subscribes to isPhoneVisible changes
   * Other store updates (savedAt, userCountries) don't trigger re-render
   */
  const isPhoneVisible = usePhoneVisibility();

  if (!isPhoneVisible) return null;

  return (
    <FormField
      form={form}
      name="phone"
      label="Phone Number"
      type="tel"
      placeholder="+1 (555) 000-0000"
      validator={(value) => {
        if (!value) return 'Phone is required';
        if (!/^\+?[0-9\s\-()]{10,}$/.test(value))
          return 'Invalid phone number';
        return undefined;
      }}
    />
  );
}

/**
 * Form metadata display
 *
 * Uses pattern 2: Multiple values from store via custom hook.
 * Only re-renders when isPhoneVisible OR savedAt changes.
 */
function FormMetadata() {
  /**
   * Pattern 2: Multiple values from store
   * Custom hook provides memoized selector
   * Prevents re-render if neither isPhoneVisible nor savedAt changed
   */
  const { isPhoneVisible, savedAt } = useFormMetadata();

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
      <p>Phone field: {isPhoneVisible ? 'Visible' : 'Hidden'}</p>
      {savedAt && (
        <p>Last saved: {savedAt.toLocaleTimeString()}</p>
      )}
    </div>
  );
}

interface ReactivityFormProps {
  /** Initial form data */
  initialData?: Partial<FormData>;
  /** Callback on successful form submission */
  onSubmit: (data: FormData) => Promise<void>;
}

/**
 * ReactivityForm Component
 *
 * Complete form demonstrating all 6 reactivity patterns:
 * 1. useStore with selector (single value)
 * 2. useStore for multiple values
 * 3. form.Subscribe with selector
 * 4. Optimized submit button (form.Subscribe)
 * 5. Avoiding full form re-renders (field-level subscriptions)
 * 6. Performance comparison (tracking re-renders)
 *
 * @param initialData - Pre-populate form fields
 * @param onSubmit - Async callback on form submission
 *
 * @example
 * ```tsx
 * <ReactivityForm
 *   initialData={{ firstName: 'John', email: 'john@example.com' }}
 *   onSubmit={async (data) => {
 *     await updateProfile(data);
 *   }}
 * />
 * ```
 */
export function ReactivityForm({
  initialData,
  onSubmit,
}: ReactivityFormProps) {
  const [renderCount, setRenderCount] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  /**
   * Track re-renders for performance monitoring
   * Demonstrates how to measure optimization effectiveness
   */
  React.useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, []);

  const form = useForm<FormData>({
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      bio: initialData?.bio || '',
      age: initialData?.age || 0,
      country: initialData?.country || '',
    },
    onSubmit: async (values) => {
      try {
        setSubmitError(null);
        await onSubmit(values.value as FormData);
        useFormStore.getState().setSavedAt(new Date());
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred'
        );
      }
    },
  });

  /**
   * Memoized handler for toggling phone visibility
   * Prevents unnecessary function recreation on each render
   */
  const togglePhoneVisibility = useCallback(() => {
    const currentState = useFormStore.getState();
    useFormStore.getState().setPhoneVisible(!currentState.isPhoneVisible);
  }, []);

  /**
   * Memoized handler for form submission
   * Prevents unnecessary function recreation
   */
  const handleSubmit = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Render count debug info */}
      <div className="text-xs text-gray-500">
        Component renders: {renderCount}
      </div>

      {/* Error alert */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <form className="space-y-4">
        {/* Basic fields - each has its own field.Subscribe to prevent
            full form re-renders when any field changes */}
        <FormField
          form={form}
          name="firstName"
          label="First Name"
          placeholder="John"
        />

        <FormField
          form={form}
          name="lastName"
          label="Last Name"
          placeholder="Doe"
        />

        <FormField
          form={form}
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          validator={(value) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
              return 'Invalid email';
            return undefined;
          }}
        />

        {/* Pattern 1 & 3: Phone field with store selector + field.Subscribe */}
        <PhoneField form={form} />

        <FormField
          form={form}
          name="age"
          label="Age"
          type="number"
          validator={(value) => {
            if (!value) return undefined;
            if (value < 18) return 'Must be at least 18';
            if (value > 150) return 'Invalid age';
            return undefined;
          }}
        />

        <FormField
          form={form}
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
        />

        {/* Pattern 1 & 3: Subscribe to form canSubmit state only */}
        <form.Subscribe
          selector={(state) => ({
            isValid: state.isFormValid,
            isDirty: state.isDirty,
          })}
          children={({ isValid, isDirty }) => (
            <div className="text-xs text-gray-600 space-y-1">
              <p>Form valid: {isValid ? 'Yes' : 'No'}</p>
              <p>Has unsaved changes: {isDirty ? 'Yes' : 'No'}</p>
            </div>
          )}
        />

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          {/* Pattern 4: Optimized submit button with form state selector */}
          <OptimizedSubmitButton form={form} onSubmit={handleSubmit} />

          {/* Button to toggle phone field visibility (pattern 1) */}
          <button
            type="button"
            onClick={togglePhoneVisibility}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Toggle Phone Field
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Pattern 2: Form metadata display with multiple store values */}
      <FormMetadata />

      {/* Performance comparison section */}
      <PerformanceComparison form={form} />
    </div>
  );
}

/**
 * Pattern 6: Performance Comparison Examples
 *
 * Demonstrates the difference between:
 * - Components that use form.Subscribe (optimal)
 * - Components that render full form state (not optimal)
 */
interface PerformanceComparisonProps {
  form: any;
}

/**
 * PerformanceComparison Component
 *
 * Shows side-by-side comparison of optimized vs non-optimized patterns.
 *
 * @param form - TanStack Form instance
 *
 * @example
 * OptimizedComponent uses form.Subscribe selector:
 * - Only subscribes to 2 fields
 * - Re-renders only when those fields change
 *
 * NonOptimizedComponent uses full form state:
 * - Subscribes to entire form object
 * - Re-renders on ANY form state change
 */
function PerformanceComparison({ form }: PerformanceComparisonProps) {
  const [optimizedRenders, setOptimizedRenders] = React.useState(0);
  const [nonOptimizedRenders, setNonOptimizedRenders] = React.useState(0);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4">
      {/* Optimized: form.Subscribe with selector */}
      <div className="p-3 bg-green-50 rounded-md">
        <h3 className="font-semibold text-green-900 text-sm mb-2">
          Optimized (form.Subscribe with selector)
        </h3>
        <form.Subscribe
          selector={(state) => ({
            isDirty: state.isDirty,
            isValid: state.isFormValid,
          })}
          children={({ isDirty, isValid }) => {
            setOptimizedRenders((prev) => prev + 1);
            return (
              <div className="text-xs space-y-1">
                <p>Renders: {optimizedRenders}</p>
                <p>Dirty: {isDirty ? 'Yes' : 'No'}</p>
                <p>Valid: {isValid ? 'Yes' : 'No'}</p>
              </div>
            );
          }}
        />
      </div>

      {/* Non-optimized: full form state */}
      <div className="p-3 bg-red-50 rounded-md">
        <h3 className="font-semibold text-red-900 text-sm mb-2">
          Non-Optimized (full form state)
        </h3>
        <form.Subscribe
          selector={(state) => state}
          children={(state) => {
            setNonOptimizedRenders((prev) => prev + 1);
            return (
              <div className="text-xs space-y-1">
                <p>Renders: {nonOptimizedRenders}</p>
                <p className="text-red-600">
                  Re-renders on ANY form change!
                </p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
```

## 6 Reactivity Patterns Explained

### Pattern 1: useStore with Single Field Selector

```typescript
/**
 * Only re-renders if this specific value changes
 * Perfect for boolean flags or single feature toggles
 */
const isPhoneVisible = useFormStore((state) => state.isPhoneVisible);
```

**When to use:**
- Boolean flags (show/hide fields)
- Feature toggles
- Single values from external store

**Performance:** Excellent - prevents all other updates from triggering re-render

---

### Pattern 2: useStore with Multiple Values

```typescript
/**
 * Memoized selector prevents re-render if BOTH values are unchanged
 * Shallow equality comparison on returned object
 */
const { isPhoneVisible, savedAt } = useFormStore(
  (state) => ({
    isPhoneVisible: state.isPhoneVisible,
    savedAt: state.savedAt,
  }),
  (prev, curr) =>
    prev.isPhoneVisible === curr.isPhoneVisible &&
    prev.savedAt === curr.savedAt
);
```

**When to use:**
- Multiple related values from store
- Avoid unnecessary object recreations
- Group logically related subscriptions

**Performance:** Very good - prevents re-render unless one of the selected values changes

---

### Pattern 3: form.Subscribe with Selector

```typescript
/**
 * Subscribe to specific form state fields only
 * Prevents re-render when other form fields change
 */
form.Subscribe
  selector={(state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
  })}
  children={({ canSubmit, isSubmitting }) => (
    <button disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </button>
  )}
/>
```

**When to use:**
- Submit button reactivity
- Form-level state display
- Status indicators

**Performance:** Excellent - only subscribes to necessary form state

---

### Pattern 4: Optimized Submit Button

```typescript
/**
 * Dedicated component with form.Subscribe selector
 * Prevents full form re-renders
 */
function OptimizedSubmitButton({ form, onSubmit }) {
  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
      children={({ canSubmit, isSubmitting }) => (
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    />
  );
}
```

**When to use:**
- Primary form action buttons
- Any button whose state depends on form state

**Performance:** Prevents entire form wrapper from re-rendering on field changes

---

### Pattern 5: Avoiding Full Form Re-renders

```typescript
/**
 * Each field uses its own field.Subscribe (implicit in form.Field)
 * Prevents sibling fields from triggering re-renders
 */
function FormField({ form, name, label }) {
  return (
    <form.Field
      name={name}
      children={(field) => (
        // This component only re-renders when THIS field changes
        <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      )}
    />
  );
}
```

**Key insight:**
- `form.Field` automatically subscribes to only that field's state
- When user types in firstName, lastName component doesn't re-render
- Each field is isolated from sibling updates

**Performance:** Critical optimization - enables form to scale to 50+ fields

---

### Pattern 6: Performance Comparison

```typescript
// OPTIMIZED (uses selector)
<form.Subscribe
  selector={(state) => ({
    isDirty: state.isDirty,
    isValid: state.isFormValid,
  })}
  children={({ isDirty, isValid }) => (
    // Re-renders only if isDirty OR isValid changes
    <div>{isDirty ? 'Unsaved' : 'Saved'}</div>
  )}
/>

// NON-OPTIMIZED (uses full state)
<form.Subscribe
  selector={(state) => state}
  children={(state) => (
    // Re-renders on ANY form state change
    // Slow with large forms!
    <div>{state.isDirty ? 'Unsaved' : 'Saved'}</div>
  )}
/>
```

**Difference:**
- Optimized: Re-renders only when selected fields change
- Non-optimized: Re-renders on every form update (firstName, lastName, email, etc.)

---

## Usage Example

```tsx
import { ReactivityForm } from '@/components/forms/ReactivityForm';

export default function ProfilePage() {
  const handleSubmit = async (data: FormData) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ReactivityForm
        initialData={{
          firstName: 'John',
          email: 'john@example.com',
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## Performance Tips

### 1. Always Use Selectors
```typescript
// Good: Selector limits re-renders
<form.Subscribe
  selector={(state) => state.canSubmit}
  children={(canSubmit) => ...}
/>

// Bad: Full state causes re-renders
<form.Subscribe
  selector={(state) => state}
  children={(state) => ...}
/>
```

### 2. Memoize Custom Hooks
```typescript
// Custom hook with memoized selector
export const useFormState = () =>
  useFormStore(
    (state) => ({ isDirty: state.isDirty, isSaved: state.isSaved }),
    (prev, curr) =>
      prev.isDirty === curr.isDirty && prev.isSaved === curr.isSaved
  );
```

### 3. Extract Components
```typescript
// Before: All logic in one component (many re-renders)
function Form() {
  return (
    <>
      <field1 />
      <field2 />
      <SubmitButton /> {/* re-renders on all field changes */}
    </>
  );
}

// After: Separate component with selector (optimal)
function SubmitButton({ form }) {
  return (
    <form.Subscribe
      selector={(state) => ({ canSubmit: state.canSubmit })}
      children={({ canSubmit }) => (
        <button disabled={!canSubmit}>Submit</button>
      )}
    />
  );
}
```

### 4. Use useCallback for Handlers
```typescript
const handleToggle = useCallback(() => {
  useFormStore.setState({ isPhoneVisible: !isPhoneVisible });
}, []);
```

## Debugging Re-renders

Use React DevTools Profiler to measure:
1. How many times each component renders
2. Which prop/state changes triggered the render
3. Time spent rendering

Compare optimized vs non-optimized versions to see performance improvement.

## Common Mistakes

1. **Full form state in button:** Re-renders button on every field change
2. **No selectors in Subscribe:** Causes unnecessary component updates
3. **Object recreation in selector:** Create new object each time, preventing memoization
4. **Multiple stores without memoization:** Each access recreates object

