---
title: "React 19 Server Action Form"
description: "Complete server action form with useActionState, TanStack Form validation, and progressive enhancement"
tags: ["react-19", "server-actions", "forms", "validation", "tanstack-form"]
category: "forms"
difficulty: "intermediate"
version: "1.0.0"
date: 2024-01-31
---

# React 19 Server Action Form Template

Complete template combining React 19's `useActionState` hook with TanStack Form for client-side validation and server-side processing with error handling.

## Architecture Overview

- **Server Action**: Handles form submission, validation, and business logic (`'use server'`)
- **useActionState**: Manages form state, pending state, and server responses
- **TanStack Form**: Client-side form state management and validation
- **Progressive Enhancement**: Works without JavaScript via standard form submission
- **Error Handling**: Server validation errors displayed with field-level feedback

## Files Structure

```
src/
├── actions/
│   └── auth.ts              # Server actions (use server)
├── lib/
│   └── validators.ts        # Validation schemas
├── components/
│   └── LoginForm.tsx        # Form component
└── interfaces/
    └── auth.ts              # Type definitions
```

---

## 1. Type Definitions

**File: `src/interfaces/auth.ts`**

```typescript
/**
 * Login form input data structure
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Server action response structure
 */
export interface AuthActionResponse {
  success: boolean;
  data?: {
    userId: string;
    email: string;
    token: string;
  };
  error?: string;
  fieldErrors?: Record<string, string>;
}
```

---

## 2. Validation Schema

**File: `src/lib/validators.ts`**

```typescript
import { z } from "zod";

/**
 * Login form validation schema using Zod
 * Validates email format and password requirements
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
```

---

## 3. Server Action

**File: `src/actions/auth.ts`**

```typescript
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators";
import type { LoginFormData, AuthActionResponse } from "@/interfaces/auth";

/**
 * Server action for user login
 *
 * @param prevState - Previous form state from useActionState
 * @param formData - FormData from form submission
 * @returns AuthActionResponse with success status or errors
 */
export async function loginAction(
  prevState: AuthActionResponse | null,
  formData: FormData
): Promise<AuthActionResponse> {
  try {
    // 1. Extract form data
    const rawData: LoginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("rememberMe") === "on",
    };

    // 2. Validate with Zod schema
    const validation = await loginSchema.safeParseAsync(rawData);

    if (!validation.success) {
      // Return field-level errors
      const fieldErrors = validation.error.flatten().fieldErrors;
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: Object.entries(fieldErrors).reduce(
          (acc, [key, errors]) => ({
            ...acc,
            [key]: errors?.[0] || "Invalid field",
          }),
          {}
        ),
      };
    }

    // 3. Call authentication service (mock example)
    const response = await authenticateUser(
      validation.data.email,
      validation.data.password
    );

    if (!response.success) {
      return {
        success: false,
        error: response.message || "Authentication failed",
      };
    }

    // 4. Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("authToken", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: validation.data.rememberMe
        ? 60 * 60 * 24 * 30 // 30 days
        : 60 * 60 * 24, // 24 hours
    });

    // 5. Return success response
    return {
      success: true,
      data: {
        userId: response.userId,
        email: validation.data.email,
        token: response.token,
      },
    };
  } catch (error) {
    console.error("[loginAction] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Mock authentication service
 * Replace with real authentication logic
 *
 * @param email - User email
 * @param password - User password
 * @returns Authentication result with token
 */
async function authenticateUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  message?: string;
  userId?: string;
  token?: string;
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock validation
  if (email === "test@example.com" && password === "password123") {
    return {
      success: true,
      userId: "user-123",
      token: "jwt-token-mock",
    };
  }

  return {
    success: false,
    message: "Invalid email or password",
  };
}
```

---

## 4. Form Component with useActionState

**File: `src/components/LoginForm.tsx`**

```typescript
"use client";

import { useActionState, useRef, useEffect } from "react";
import { loginAction } from "@/actions/auth";
import type { AuthActionResponse } from "@/interfaces/auth";

/**
 * Login form component using useActionState for server actions
 *
 * Combines:
 * - useActionState for server-side form handling
 * - Progressive enhancement (works without JS)
 * - Field-level error display
 * - Loading state management
 *
 * @returns LoginForm component
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    AuthActionResponse | null,
    FormData
  >(loginAction, null);

  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Auto-focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Auto-scroll to first error
  useEffect(() => {
    if (state?.fieldErrors) {
      const firstErrorField = Object.keys(state.fieldErrors)[0];
      const field = formRef.current?.elements.namedItem(
        firstErrorField
      ) as HTMLInputElement;
      field?.focus();
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state?.fieldErrors]);

  // Redirect on successful login
  useEffect(() => {
    if (state?.success && state?.data) {
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [state?.success, state?.data]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow"
      noValidate
    >
      {/* General error message */}
      {state?.error && !state?.success && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm"
        >
          {state.error}
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            state?.fieldErrors?.email
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="you@example.com"
          aria-invalid={!!state?.fieldErrors?.email}
          aria-describedby={
            state?.fieldErrors?.email ? "email-error" : undefined
          }
        />
        {state?.fieldErrors?.email && (
          <p id="email-error" className="text-sm text-red-600">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            state?.fieldErrors?.password
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="••••••••"
          aria-invalid={!!state?.fieldErrors?.password}
          aria-describedby={
            state?.fieldErrors?.password ? "password-error" : undefined
          }
        />
        {state?.fieldErrors?.password && (
          <p id="password-error" className="text-sm text-red-600">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          disabled={isPending}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-colors"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isPending && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            aria-hidden="true"
          />
        )}
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      {/* Forgot password link */}
      <div className="text-center">
        <a
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
}
```

---

## 5. Advanced: TanStack Form Integration

**File: `src/components/LoginFormAdvanced.tsx`**

```typescript
"use client";

import { useActionState, useRef, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { loginAction } from "@/actions/auth";
import type { AuthActionResponse, LoginFormData } from "@/interfaces/auth";

/**
 * Advanced login form using TanStack Form
 *
 * Features:
 * - Client-side form state via TanStack
 * - Server-side validation and processing
 * - Field-level error handling
 * - Real-time validation feedback
 * - Progressive enhancement
 *
 * @returns Advanced login form component
 */
export function LoginFormAdvanced() {
  const [state, formAction, isPending] = useActionState<
    AuthActionResponse | null,
    FormData
  >(loginAction, null);

  const formRef = useRef<HTMLFormElement>(null);

  // Initialize TanStack Form
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async (values) => {
      // Create FormData for server action
      const formData = new FormData();
      formData.set("email", values.email);
      formData.set("password", values.password);
      if (values.rememberMe) {
        formData.set("rememberMe", "on");
      }

      // Call server action
      await formAction(formData);
    },
  });

  // Apply server errors to form
  useEffect(() => {
    if (state?.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([fieldName, error]) => {
        form.setFieldMeta(fieldName as keyof LoginFormData, (prev) => ({
          ...prev,
          errors: [error],
        }));
      });
    }
  }, [state?.fieldErrors, form]);

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      window.location.href = "/dashboard";
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow"
    >
      {/* General error */}
      {state?.error && !state?.success && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm"
        >
          {state.error}
        </div>
      )}

      {/* Email field via TanStack Form */}
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Email is required";
            if (!value.includes("@")) return "Invalid email format";
            return undefined;
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isPending}
              className={`w-full px-4 py-2 border rounded-lg ${
                field.state.meta.errors.length > 0
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      />

      {/* Password field via TanStack Form */}
      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "Password is required";
            if (value.length < 8) return "Must be at least 8 characters";
            return undefined;
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={isPending}
              className={`w-full px-4 py-2 border rounded-lg ${
                field.state.meta.errors.length > 0
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-red-600">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      />

      {/* Remember me */}
      <form.Field
        name="rememberMe"
        children={(field) => (
          <div className="flex items-center">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              disabled={isPending}
              className="h-4 w-4 rounded"
            />
            <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
              Remember me for 30 days
            </label>
          </div>
        )}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !form.state.isFormValid}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:bg-blue-400"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
```

---

## 6. Usage in Page

**File: `src/app/login/page.tsx`**

```typescript
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Login page component
 * Redirects authenticated users to dashboard
 */
export default async function LoginPage() {
  // Redirect if already authenticated
  const cookieStore = await cookies();
  if (cookieStore.has("authToken")) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
```

---

## Key Features

### 1. Progressive Enhancement
- Form works without JavaScript via standard form submission
- `action` prop handles POST data directly to server
- Server action processes FormData natively

### 2. useActionState Hook
```typescript
const [state, formAction, isPending] = useActionState(
  loginAction,    // Server action function
  null            // Initial state
);
```

- **state**: Current form state (errors, response data)
- **formAction**: Bound server action for form submission
- **isPending**: Loading state during server processing

### 3. Field-Level Validation
- Client-side with Zod schema
- Server-side validation before database operation
- Errors mapped to field names
- Auto-scroll and focus on first error

### 4. Error Handling
- General form errors (authentication failures)
- Field-level errors (validation failures)
- ARIA attributes for accessibility
- Error message display below each field

### 5. TanStack Form Integration (Advanced)
- Real-time client-side validation
- Combines with server-side validation
- Server errors applied after submission
- Full form state management

---

## Testing

```typescript
// __tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/LoginForm";

describe("LoginForm", () => {
  it("renders form fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("displays validation errors", async () => {
    render(<LoginForm />);
    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("disables submit during pending state", async () => {
    render(<LoginForm />);
    const button = screen.getByRole("button", { name: /sign in/i });

    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
```

---

## Best Practices

1. **Secure Token Storage**: Always use HTTP-only cookies for auth tokens
2. **HTTPS Only**: Set `secure: true` in cookie options for production
3. **CSRF Protection**: Use Next.js built-in CSRF protection with server actions
4. **Rate Limiting**: Implement rate limiting on login endpoint
5. **Validation**: Always validate on both client and server
6. **Error Messages**: Use generic messages to avoid user enumeration attacks
7. **Logging**: Log authentication failures for security monitoring

---

## Related Patterns

- [Server Action Error Handling](/skills/react-forms/references/patterns/server-action-error-handling.md)
- [Form Validation with Zod](/skills/react-forms/references/patterns/zod-validation.md)
- [TanStack Form Guide](/skills/react-forms/references/guides/tanstack-form.md)
- [Authentication Flow](/skills/authentication/references/guides/auth-flow.md)
