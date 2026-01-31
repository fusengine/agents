---
name: action-form-template
description: Form with useActionState - error handling and pending state
---

# Form with useActionState

## Basic Form with Error Handling

```typescript
// modules/auth/components/LoginForm.tsx
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { LoginFormProps } from '../src/interfaces/auth.interface'
import { authService } from '../src/services/auth.service'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </button>
  )
}

/**
 * Login form with action state.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, submitAction, isPending] = useActionState(
    async (prevError: string | null, formData: FormData) => {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      const result = await authService.login({ email, password })

      if (result.error) {
        return result.error
      }

      onSuccess(result.user)
      return null
    },
    null
  )

  return (
    <form action={submitAction} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          disabled={isPending}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          disabled={isPending}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <SubmitButton />
    </form>
  )
}
```

---

## Form with Validation

```typescript
// modules/users/components/ProfileForm.tsx
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { profileSchema } from '../src/validators/user.validator'
import { userService } from '../src/services/user.service'

interface FormState {
  error: string | null
  fieldErrors: Record<string, string>
}

/**
 * Profile form with Zod validation.
 */
export function ProfileForm({ userId }: { userId: string }) {
  const [state, submitAction, isPending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      // Validate with Zod
      const parsed = profileSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email')
      })

      if (!parsed.success) {
        return {
          error: 'Validation failed',
          fieldErrors: parsed.error.flatten().fieldErrors
        }
      }

      // Submit to API
      const result = await userService.update(userId, parsed.data)

      if (result.error) {
        return { error: result.error, fieldErrors: {} }
      }

      return { error: null, fieldErrors: {} }
    },
    { error: null, fieldErrors: {} }
  )

  return (
    <form action={submitAction}>
      <div>
        <input name="name" placeholder="Name" />
        {state.fieldErrors.name && (
          <span className="text-red-500">{state.fieldErrors.name}</span>
        )}
      </div>
      <div>
        <input name="email" type="email" placeholder="Email" />
        {state.fieldErrors.email && (
          <span className="text-red-500">{state.fieldErrors.email}</span>
        )}
      </div>

      {state.error && <p className="text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

---

## Multiple Actions Form

```typescript
// modules/posts/components/PostEditor.tsx
import { useActionState } from 'react'

export function PostEditor({ postId }: { postId: string }) {
  const [saveState, saveAction] = useActionState(
    async (prev, formData) => {
      await postService.save(postId, formData)
      return { saved: true }
    },
    { saved: false }
  )

  const [publishState, publishAction] = useActionState(
    async (prev, formData) => {
      await postService.publish(postId, formData)
      return { published: true }
    },
    { published: false }
  )

  return (
    <form>
      <textarea name="content" />

      <button formAction={saveAction}>Save Draft</button>
      <button formAction={publishAction}>Publish</button>

      {saveState.saved && <span>Draft saved!</span>}
      {publishState.published && <span>Published!</span>}
    </form>
  )
}
```

---

## Rules

- Use `useFormStatus` in **child component** of form
- Return errors from action, don't throw
- Use Zod for validation before API call
- Disable inputs during `isPending`
