---
name: "TanStack Form Reset Patterns"
description: "Complete reset form patterns with TanStack Form including basic reset, field-level reset, async data, and confirmation dialogs"
version: "1.0.0"
category: "forms"
tags: ["tanstack-form", "react", "forms", "reset", "validation"]
---

# TanStack Form Reset Patterns

Complete TypeScript patterns for form reset operations using TanStack Form.

## Pattern 1: Basic Form Reset Button

```typescript
import { FormApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';

interface UserFormData {
  name: string;
  email: string;
}

/**
 * Basic form reset pattern with a simple reset button
 * Resets all fields to their initial values
 * @returns React component with form and reset functionality
 */
export function BasicResetForm(): React.ReactElement {
  const form = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted:', value);
    },
  });

  /**
   * Handles form reset to initial values
   */
  const handleReset = (): void => {
    form.reset();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div>
        <label htmlFor="name">Name:</label>
        <form.Field
          name="name"
          children={(field) => (
            <input
              id="name"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <form.Field
          name="email"
          children={(field) => (
            <input
              id="email"
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
```

## Pattern 2: Reset with New Default Values

```typescript
import { useForm } from '@tanstack/react-form';

interface ProductFormData {
  title: string;
  price: number;
  description: string;
}

/**
 * Reset form with custom default values
 * Allows resetting to different initial state than original defaults
 * @param initialDefaults - Custom default values for reset
 * @returns React component with customizable reset
 */
export function ResetWithNewDefaultsForm({
  initialDefaults,
}: {
  initialDefaults: ProductFormData;
}): React.ReactElement {
  const form = useForm<ProductFormData>({
    defaultValues: initialDefaults,
    onSubmit: async ({ value }) => {
      console.log('Product submitted:', value);
    },
  });

  /**
   * Resets form to new default values
   * @param newDefaults - New default values to reset to
   */
  const handleResetWithDefaults = (
    newDefaults: ProductFormData
  ): void => {
    form.reset();
    form.setFieldValue('title', newDefaults.title);
    form.setFieldValue('price', newDefaults.price);
    form.setFieldValue('description', newDefaults.description);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div>
        <label htmlFor="title">Title:</label>
        <form.Field
          name="title"
          children={(field) => (
            <input
              id="title"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <form.Field
          name="price"
          children={(field) => (
            <input
              id="price"
              name={field.name}
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <form.Field
          name="description"
          children={(field) => (
            <textarea
              id="description"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <button type="submit">Save Product</button>
        <button
          type="button"
          onClick={() => handleResetWithDefaults(initialDefaults)}
        >
          Reset to Original
        </button>
        <button
          type="button"
          onClick={() =>
            handleResetWithDefaults({
              title: '',
              price: 0,
              description: '',
            })
          }
        >
          Clear All
        </button>
      </div>
    </form>
  );
}
```

## Pattern 3: Reset Single Field

```typescript
import { useForm } from '@tanstack/react-form';

interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
}

/**
 * Reset individual form fields
 * Resets only specific fields to their initial values
 * @returns React component with field-level reset capability
 */
export function ResetSingleFieldForm(): React.ReactElement {
  const form = useForm<ContactFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Message sent:', value);
    },
  });

  /**
   * Resets a single field to its initial value
   * @param fieldName - Name of the field to reset
   */
  const resetField = (
    fieldName: keyof ContactFormData
  ): void => {
    const initialValues = form.getState().values;
    const defaultValue =
      initialValues[fieldName];
    form.setFieldValue(fieldName, defaultValue);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div>
        <label htmlFor="firstName">First Name:</label>
        <div>
          <form.Field
            name="firstName"
            children={(field) => (
              <input
                id="firstName"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button
            type="button"
            onClick={() => resetField('firstName')}
          >
            Reset First Name
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <div>
          <form.Field
            name="lastName"
            children={(field) => (
              <input
                id="lastName"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button
            type="button"
            onClick={() => resetField('lastName')}
          >
            Reset Last Name
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="phone">Phone:</label>
        <div>
          <form.Field
            name="phone"
            children={(field) => (
              <input
                id="phone"
                name={field.name}
                type="tel"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button
            type="button"
            onClick={() => resetField('phone')}
          >
            Reset Phone
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <form.Field
          name="message"
          children={(field) => (
            <textarea
              id="message"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <button type="submit">Send Message</button>
        <button type="button" onClick={() => form.reset()}>
          Reset All
        </button>
      </div>
    </form>
  );
}
```

## Pattern 4: Reset After Successful Submission

```typescript
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

/**
 * Reset form after successful API submission
 * Clears form and shows success message after submission completes
 * @returns React component with post-submit reset
 */
export function ResetAfterSubmissionForm(): React.ReactElement {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useForm<SignupFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Account created:', value);

        // Show success message
        setSubmitMessage(`Welcome, ${value.username}!`);
        setIsSubmitted(true);

        // Reset form after successful submission
        form.reset();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setSubmitMessage('');
        }, 3000);
      } catch (error) {
        console.error('Submission failed:', error);
      }
    },
  });

  return (
    <div>
      {isSubmitted && (
        <div role="status">
          <p>{submitMessage}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div>
          <label htmlFor="username">Username:</label>
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Username is required' : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  id="username"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && (
                  <span>{field.state.meta.errors.join(', ')}</span>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Email is required' : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  id="email"
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && (
                  <span>{field.state.meta.errors.join(', ')}</span>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Password is required' : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  id="password"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && (
                  <span>{field.state.meta.errors.join(', ')}</span>
                )}
              </div>
            )}
          />
        </div>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
```

## Pattern 5: Reset with Confirmation Dialog

```typescript
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';

interface SettingsFormData {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
}

/**
 * Reset form with user confirmation dialog
 * Prevents accidental data loss by requiring confirmation before reset
 * @returns React component with confirmation-based reset
 */
export function ResetWithConfirmationForm(): React.ReactElement {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const form = useForm<SettingsFormData>({
    defaultValues: {
      language: 'en',
      theme: 'light',
      notifications: true,
    },
    onSubmit: async ({ value }) => {
      console.log('Settings saved:', value);
    },
  });

  /**
   * Initiates reset with confirmation dialog
   */
  const handleResetClick = (): void => {
    setShowConfirmation(true);
  };

  /**
   * Confirms and executes the form reset
   */
  const confirmReset = (): void => {
    form.reset();
    setShowConfirmation(false);
  };

  /**
   * Cancels the reset operation and closes dialog
   */
  const cancelReset = (): void => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div>
          <label htmlFor="language">Language:</label>
          <form.Field
            name="language"
            children={(field) => (
              <select
                id="language"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="theme">Theme:</label>
          <form.Field
            name="theme"
            children={(field) => (
              <select
                id="theme"
                name={field.name}
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as 'light' | 'dark')
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="notifications">
            <form.Field
              name="notifications"
              children={(field) => (
                <input
                  id="notifications"
                  name={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              )}
            />
            Enable Notifications
          </label>
        </div>

        <div>
          <button type="submit">Save Settings</button>
          <button type="button" onClick={handleResetClick}>
            Reset to Defaults
          </button>
        </div>
      </form>

      {showConfirmation && (
        <div role="dialog" aria-labelledby="confirm-title">
          <h2 id="confirm-title">Confirm Reset</h2>
          <p>Are you sure you want to reset all settings to default values?</p>
          <div>
            <button type="button" onClick={confirmReset}>
              Yes, Reset
            </button>
            <button type="button" onClick={cancelReset}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Pattern 6: Reset with Async Fetched Data

```typescript
import { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';

interface ProfileFormData {
  displayName: string;
  bio: string;
  website: string;
  avatar: string;
}

/**
 * Reset form with data fetched asynchronously
 * Fetches initial values from API and uses them as reset point
 * @param userId - User ID to fetch profile for
 * @returns React component with async-initialized form
 */
export function ResetWithAsyncDataForm({
  userId,
}: {
  userId: string;
}): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: '',
      bio: '',
      website: '',
      avatar: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Simulate API call to update profile
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Profile updated:', value);
      } catch (error) {
        console.error('Update failed:', error);
      }
    },
  });

  /**
   * Fetches user profile data from API
   */
  const fetchUserProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setFetchError(null);

      // Simulate API call
      const response = await new Promise<ProfileFormData>((resolve) => {
        setTimeout(() => {
          resolve({
            displayName: 'John Doe',
            bio: 'Software developer and tech enthusiast',
            website: 'https://johndoe.com',
            avatar: 'https://example.com/avatar.jpg',
          });
        }, 1000);
      });

      // Set fetched data as form values
      form.setFieldValue('displayName', response.displayName);
      form.setFieldValue('bio', response.bio);
      form.setFieldValue('website', response.website);
      form.setFieldValue('avatar', response.avatar);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : 'Failed to fetch profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets form to currently fetched data
   */
  const resetToFetchedData = async (): Promise<void> => {
    await fetchUserProfile();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div>
        <label htmlFor="displayName">Display Name:</label>
        <form.Field
          name="displayName"
          children={(field) => (
            <input
              id="displayName"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <form.Field
          name="bio"
          children={(field) => (
            <textarea
              id="bio"
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="website">Website:</label>
        <form.Field
          name="website"
          children={(field) => (
            <input
              id="website"
              name={field.name}
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="avatar">Avatar URL:</label>
        <form.Field
          name="avatar"
          children={(field) => (
            <input
              id="avatar"
              name={field.name}
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>

      <div>
        <button type="submit">Save Profile</button>
        <button type="button" onClick={resetToFetchedData}>
          Reset to Server Data
        </button>
      </div>
    </form>
  );
}
```

## Usage Examples

```typescript
// Import desired pattern
import {
  BasicResetForm,
  ResetWithNewDefaultsForm,
  ResetSingleFieldForm,
  ResetAfterSubmissionForm,
  ResetWithConfirmationForm,
  ResetWithAsyncDataForm,
} from './reset-form';

// Use in your application
export function App() {
  return (
    <div>
      <section>
        <h1>Basic Reset</h1>
        <BasicResetForm />
      </section>

      <section>
        <h1>Reset with Async Data</h1>
        <ResetWithAsyncDataForm userId="user-123" />
      </section>

      <section>
        <h1>Reset with Confirmation</h1>
        <ResetWithConfirmationForm />
      </section>
    </div>
  );
}
```

## Key Points

- **form.reset()** - Resets all fields to their initial values
- **form.setFieldValue()** - Updates individual field values
- **form.getState().values** - Accesses current form state
- **Async Data** - Use useEffect to fetch and initialize form
- **Confirmation** - Use state to manage dialog visibility
- **Validation** - Validators work the same before/after reset
