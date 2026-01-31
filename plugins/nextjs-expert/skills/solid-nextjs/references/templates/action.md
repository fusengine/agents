---
name: action-template
description: Server Action template with validation and revalidation
---

# Server Action (< 30 lines)

```typescript
// modules/users/src/actions/user.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { UserService } from '../services/user.service'
import { validateCreateUser } from '../validators/user.validator'

/**
 * Create new user - Server Action
 *
 * @param formData - Form data with user fields
 * @returns Result with success or error
 */
export async function createUser(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    name: formData.get('name') as string,
    password: formData.get('password') as string
  }

  const validated = validateCreateUser(data)
  if (!validated.success) {
    return { success: false, error: validated.error.message }
  }

  try {
    const user = await UserService.create(validated.data)
    revalidatePath('/users')
    return { success: true, user }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Creation failed'
    }
  }
}
```

## With useActionState

```typescript
// modules/auth/src/actions/auth.actions.ts
'use server'

import { redirect } from 'next/navigation'
import { AuthService } from '../services/auth.service'
import type { SignupFormState } from '../interfaces/form.interface'

/**
 * Signup action for useActionState
 *
 * @param prevState - Previous form state
 * @param formData - Form submission data
 */
export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await AuthService.signup({ email, password })
    redirect('/login?registered=true')
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed'
    }
  }
}
```

## Delete Action

```typescript
// modules/users/src/actions/delete.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { UserService } from '../services/user.service'

/**
 * Delete user - Server Action
 *
 * @param userId - User ID to delete
 */
export async function deleteUser(userId: string) {
  await UserService.delete(userId)
  revalidatePath('/users')
}
```
