---
name: TanStack Form Listeners Patterns
description: Complete guide to form-level and field-level listeners with debouncing, analytics, and conditional submit patterns
---

# TanStack Form Listeners Patterns

## 1. Form-Level Listeners (onMount, onChange, onSubmit)

```typescript
import { useForm } from '@tanstack/react-form';
import type { FormApi } from '@tanstack/react-form';

interface FormData {
  email: string;
  name: string;
  acceptTerms: boolean;
}

/**
 * Form-level listeners pattern demonstrating onMount, onChange, and onSubmit hooks
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   return <FormLevelListenersExample />
 * }
 * ```
 */
export function FormLevelListenersExample() {
  const form = useForm<FormData>({
    defaultValues: {
      email: '',
      name: '',
      acceptTerms: false,
    },
    onMount: (formApi: FormApi<FormData>) => {
      /**
       * Called when form mounts - initialize side effects
       * Use for: loading initial data, analytics tracking, feature flags
       */
      console.log('Form mounted', formApi.getState());

      // Track form initialization
      analyticsService.track('form_initialized', {
        formName: 'user_registration',
        timestamp: new Date().toISOString(),
      });

      return () => {
        /**
         * Cleanup function called on unmount
         */
        console.log('Form unmounted');
      };
    },
    onChange: (formApi: FormApi<FormData>) => {
      /**
       * Called on any form state change (values, touched, validity)
       * Use for: real-time validation, dependent field updates
       */
      const state = formApi.getState();
      console.log('Form changed:', state.values);

      // Update dependent fields
      if (state.values.name && !state.values.email) {
        formApi.setFieldValue('email', `${state.values.name.toLowerCase()}@example.com`);
      }
    },
    onSubmit: async ({ value }) => {
      /**
       * Called when form is submitted with valid data
       */
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        });

        const result = await response.json();
        console.log('Form submitted successfully:', result);

        analyticsService.track('form_submitted', {
          formName: 'user_registration',
          success: true,
        });
      } catch (error) {
        console.error('Form submission failed:', error);
        analyticsService.track('form_submitted', {
          formName: 'user_registration',
          success: false,
          error: String(error),
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Name"
          />
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Email"
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 2. Field-Level Listeners

```typescript
import { useForm } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';

interface UserFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

/**
 * Field-level listeners pattern with onMount, onChange, onBlur, and onTouched hooks
 * Demonstrates independent field state tracking and validation
 */
export function FieldLevelListenersExample() {
  const form = useForm<UserFormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Username Field with onMount and onChange listeners */}
      <form.Field
        name="username"
        onMount={(fieldApi: FieldApi<UserFormData, 'username'>) => {
          /**
           * Called when field mounts
           * Use for: loading field-specific configuration, debounce setup
           */
          console.log('Username field mounted');

          return () => {
            console.log('Username field unmounted');
          };
        }}
        onChange={(value: string) => {
          /**
           * Called when field value changes
           * Use for: real-time validation, dependent field updates
           */
          console.log('Username changed to:', value);

          // Check username availability in real-time
          if (value.length >= 3) {
            checkUsernameAvailability(value).then((isAvailable) => {
              console.log(`Username "${value}" is ${isAvailable ? 'available' : 'taken'}`);
            });
          }
        }}
        children={(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Username"
              className={field.state.meta.isTouched ? 'touched' : ''}
            />
            {field.state.meta.errors && (
              <span className="error">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />

      {/* Password Field with validation listener */}
      <form.Field
        name="password"
        onChange={(value: string) => {
          /**
           * Trigger confirmation password re-validation when password changes
           */
          const confirmPasswordField = form.getFieldInfo('confirmPassword');
          if (confirmPasswordField) {
            confirmPasswordField.validate();
          }
        }}
        children={(field) => (
          <input
            type="password"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder="Password"
          />
        )}
      />

      {/* Confirm Password Field with cross-field validation */}
      <form.Field
        name="confirmPassword"
        validators={{
          onChange: ({ value }) => {
            const password = form.getFieldValue('password');
            return value !== password ? 'Passwords must match' : undefined;
          },
        }}
        children={(field) => (
          <div>
            <input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Confirm Password"
            />
            {field.state.meta.errors && (
              <span className="error">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />

      <button type="submit">Register</button>
    </form>
  );
}

/**
 * Simulates API call to check username availability
 */
async function checkUsernameAvailability(username: string): Promise<boolean> {
  const response = await fetch(`/api/check-username?username=${username}`);
  const data = await response.json();
  return data.available;
}
```

---

## 3. Debounced onChange with Auto-Save

```typescript
import { useForm } from '@tanstack/react-form';
import { useCallback, useRef } from 'react';

interface DraftData {
  title: string;
  content: string;
}

/**
 * Debounced onChange listener pattern for auto-save functionality
 * Prevents excessive API calls during rapid user input
 */
export function DebouncedAutoSaveForm() {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveRef = useRef<DraftData | null>(null);

  const form = useForm<DraftData>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  /**
   * Debounced auto-save handler
   * @param data - Form data to save
   * @param delayMs - Debounce delay in milliseconds
   */
  const debouncedAutoSave = useCallback(
    (data: DraftData, delayMs = 2000) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(async () => {
        // Only save if data has changed
        if (JSON.stringify(data) === JSON.stringify(lastSaveRef.current)) {
          console.log('No changes, skipping save');
          return;
        }

        try {
          console.log('Auto-saving...', data);
          const response = await fetch('/api/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          const saved = await response.json();
          lastSaveRef.current = saved;

          analyticsService.track('draft_auto_saved', {
            timestamp: new Date().toISOString(),
            contentLength: data.content.length,
          });
        } catch (error) {
          console.error('Auto-save failed:', error);
          analyticsService.track('draft_auto_save_failed', {
            error: String(error),
          });
        }
      }, delayMs);
    },
    []
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        onChange={(value: string) => {
          /**
           * Trigger debounced save on title change
           */
          const currentData = form.getState().values;
          debouncedAutoSave(currentData);
        }}
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Draft Title"
          />
        )}
      />

      <form.Field
        name="content"
        onChange={(value: string) => {
          /**
           * Trigger debounced save on content change
           */
          const currentData = form.getState().values;
          debouncedAutoSave(currentData);
        }}
        children={(field) => (
          <textarea
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Draft Content"
            rows={10}
          />
        )}
      />

      <button type="submit">Publish</button>
    </form>
  );
}
```

---

## 4. Analytics/Logging Pattern

```typescript
import { useForm } from '@tanstack/react-form';
import type { FormApi } from '@tanstack/react-form';

interface AnalyticsEvent {
  eventType: string;
  timestamp: string;
  formName: string;
  data?: Record<string, unknown>;
}

interface AnalyticsData {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
}

/**
 * Analytics service for form tracking
 */
class FormAnalyticsService {
  private events: AnalyticsEvent[] = [];

  /**
   * Track form events for analytics
   */
  track(event: AnalyticsEvent) {
    this.events.push(event);
    console.log('Analytics event:', event);

    // In production: send to analytics service (Mixpanel, Google Analytics, etc.)
    this.sendToAnalyticsBackend(event);
  }

  /**
   * Get all tracked events for debugging
   */
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear tracked events
   */
  clearEvents() {
    this.events = [];
  }

  private async sendToAnalyticsBackend(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }
}

const analyticsService = new FormAnalyticsService();

/**
 * Form with comprehensive analytics and logging
 * Tracks user interactions, validation errors, and submission attempts
 */
export function AnalyticsTrackingForm() {
  const form = useForm<AnalyticsData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      industry: '',
    },
    onMount: (formApi: FormApi<AnalyticsData>) => {
      /**
       * Log form initialization
       */
      analyticsService.track({
        eventType: 'form_initialized',
        timestamp: new Date().toISOString(),
        formName: 'contact_form',
        data: {
          formState: formApi.getState(),
        },
      });

      return () => {
        /**
         * Log form unmount with final state
       */
        analyticsService.track({
          eventType: 'form_unmounted',
          timestamp: new Date().toISOString(),
          formName: 'contact_form',
          data: {
            finalState: formApi.getState(),
          },
        });
      };
    },
    onChange: (formApi: FormApi<AnalyticsData>) => {
      /**
       * Log form state changes
       */
      const state = formApi.getState();
      analyticsService.track({
        eventType: 'form_changed',
        timestamp: new Date().toISOString(),
        formName: 'contact_form',
        data: {
          changedFields: Object.keys(state.values).filter(
            (key) => state.values[key as keyof AnalyticsData]
          ),
          isValid: !Object.keys(state.fieldMeta).some(
            (key) => state.fieldMeta[key as keyof AnalyticsData]?.errors?.length
          ),
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="firstName"
        onChange={(value: string) => {
          /**
           * Log individual field changes
           */
          analyticsService.track({
            eventType: 'field_changed',
            timestamp: new Date().toISOString(),
            formName: 'contact_form',
            data: {
              fieldName: 'firstName',
              value: value,
              length: value.length,
            },
          });
        }}
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={() => {
              field.handleBlur();
              analyticsService.track({
                eventType: 'field_blurred',
                timestamp: new Date().toISOString(),
                formName: 'contact_form',
                data: {
                  fieldName: 'firstName',
                  hasTouched: field.state.meta.isTouched,
                  hasErrors: Boolean(field.state.meta.errors?.length),
                },
              });
            }}
            placeholder="First Name"
          />
        )}
      />

      <form.Field
        name="email"
        children={(field) => (
          <input
            type="email"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Email"
          />
        )}
      />

      <form.Field
        name="industry"
        children={(field) => (
          <select
            value={field.state.value}
            onChange={(e) => {
              field.handleChange(e.target.value);
              analyticsService.track({
                eventType: 'dropdown_selected',
                timestamp: new Date().toISOString(),
                formName: 'contact_form',
                data: {
                  fieldName: 'industry',
                  selectedValue: e.target.value,
                },
              });
            }}
          >
            <option value="">Select Industry</option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
          </select>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 5. Conditional Submit on Valid State

```typescript
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import type { FormApi } from '@tanstack/react-form';

interface SignupData {
  email: string;
  password: string;
  acceptTerms: boolean;
}

/**
 * Form with conditional submit based on validation state
 * Enables/disables submit button and displays validation feedback
 */
export function ConditionalSubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SignupData>({
    defaultValues: {
      email: '',
      password: '',
      acceptTerms: false,
    },
    onChange: (formApi: FormApi<SignupData>) => {
      /**
       * Monitor form validity in real-time
       * Use for: enabling/disabling submit button, showing/hiding validation hints
       */
      const state = formApi.getState();
      const hasErrors = Object.keys(state.fieldMeta).some(
        (fieldName) => state.fieldMeta[fieldName as keyof SignupData]?.errors?.length
      );

      console.log('Form is valid:', !hasErrors);
    },
  });

  /**
   * Check if all fields are valid for conditional submit
   */
  const isFormValid = (): boolean => {
    const state = form.getState();
    const fieldErrors = Object.values(state.fieldMeta).filter(
      (meta) => meta?.errors?.length
    );
    return fieldErrors.length === 0 && state.values.acceptTerms;
  };

  /**
   * Handle form submission with conditional logic
   */
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSubmitError('Please fill all fields and accept terms');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.getState().values),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const result = await response.json();
      console.log('Signup successful:', result);

      // Reset form on success
      form.reset();
      analyticsService.track('signup_completed', {
        success: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setSubmitError(message);
      analyticsService.track('signup_failed', {
        error: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Email Field with validation */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return 'Invalid email format';
            }
            return undefined;
          },
        }}
        children={(field) => (
          <div className="field-group">
            <input
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Email"
              disabled={isSubmitting}
              className={field.state.meta.errors ? 'error' : ''}
            />
            {field.state.meta.errors && (
              <span className="error-message">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />

      {/* Password Field with validation */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
            if (!/[0-9]/.test(value)) return 'Password must contain number';
            return undefined;
          },
        }}
        children={(field) => (
          <div className="field-group">
            <input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Password"
              disabled={isSubmitting}
              className={field.state.meta.errors ? 'error' : ''}
            />
            {field.state.meta.errors && (
              <span className="error-message">{field.state.meta.errors[0]}</span>
            )}
            <span className="help-text">
              At least 8 characters, 1 uppercase, 1 number
            </span>
          </div>
        )}
      />

      {/* Terms Acceptance */}
      <form.Field
        name="acceptTerms"
        validators={{
          onChange: ({ value }) => {
            return !value ? 'You must accept terms to continue' : undefined;
          },
        }}
        children={(field) => (
          <div className="field-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                disabled={isSubmitting}
              />
              I accept the terms and conditions
            </label>
            {field.state.meta.errors && (
              <span className="error-message">{field.state.meta.errors[0]}</span>
            )}
          </div>
        )}
      />

      {/* Error Message Display */}
      {submitError && (
        <div className="alert alert-error">{submitError}</div>
      )}

      {/* Conditional Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid() || isSubmitting}
        className={isFormValid() ? 'btn-primary' : 'btn-disabled'}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>

      {/* Validation Status Indicator */}
      <div className="validation-status">
        {isFormValid() ? (
          <p className="success">All fields are valid and ready to submit</p>
        ) : (
          <p className="pending">Complete the form to enable submit</p>
        )}
      </div>
    </form>
  );
}

/**
 * Mock analytics service for demonstration
 */
const analyticsService = {
  track: (event: string, data: Record<string, unknown>) => {
    console.log(`Analytics: ${event}`, data);
  },
};
```

---

## Key Patterns Summary

| Pattern | Use Case | Key Method |
|---------|----------|-----------|
| **Form-level listeners** | Global form tracking, initialization | `onMount`, `onChange`, `onSubmit` |
| **Field-level listeners** | Individual field validation, side effects | Field's `onChange`, field validators |
| **Debounced auto-save** | Real-time persistence without API spam | `setTimeout` + timer reference |
| **Analytics/Logging** | User behavior tracking, debugging | Custom analytics service |
| **Conditional submit** | Disable/enable submit based on validity | `form.getState()` validation check |

## Best Practices

1. **Always clean up**: Return cleanup functions from `onMount`
2. **Check before saving**: Compare data before auto-save to prevent redundant requests
3. **Debounce user input**: 500-2000ms depending on use case
4. **Validate on blur**: Provide immediate feedback without being intrusive
5. **Track meaningful events**: Focus on user actions, not every keystroke
6. **Handle errors gracefully**: Always catch and log API failures
7. **Disable submit during processing**: Prevent double submissions
8. **Show validation hints**: Help users understand what's required
