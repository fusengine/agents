# Form Validation with i18n

Translated form error messages using TanStack Form and Zod.

---

## Translation File

### public/locales/en/validation.json

```json
{
  "required": "This field is required",
  "email": {
    "invalid": "Please enter a valid email address",
    "taken": "This email is already registered"
  },
  "password": {
    "min": "Password must be at least {{min}} characters",
    "max": "Password must be at most {{max}} characters",
    "weak": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    "mismatch": "Passwords do not match"
  },
  "username": {
    "min": "Username must be at least {{min}} characters",
    "max": "Username must be at most {{max}} characters",
    "invalid": "Username can only contain letters, numbers, and underscores",
    "taken": "This username is already taken"
  },
  "phone": {
    "invalid": "Please enter a valid phone number"
  },
  "date": {
    "invalid": "Please enter a valid date",
    "future": "Date must be in the future",
    "past": "Date must be in the past"
  },
  "file": {
    "required": "Please select a file",
    "maxSize": "File size must be less than {{max}}",
    "type": "File type must be one of: {{types}}"
  }
}
```

### public/locales/fr/validation.json

```json
{
  "required": "Ce champ est requis",
  "email": {
    "invalid": "Veuillez entrer une adresse email valide",
    "taken": "Cette adresse email est déjà utilisée"
  },
  "password": {
    "min": "Le mot de passe doit contenir au moins {{min}} caractères",
    "max": "Le mot de passe doit contenir au maximum {{max}} caractères",
    "weak": "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
    "mismatch": "Les mots de passe ne correspondent pas"
  },
  "username": {
    "min": "Le nom d'utilisateur doit contenir au moins {{min}} caractères",
    "max": "Le nom d'utilisateur doit contenir au maximum {{max}} caractères",
    "invalid": "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
    "taken": "Ce nom d'utilisateur est déjà pris"
  },
  "phone": {
    "invalid": "Veuillez entrer un numéro de téléphone valide"
  },
  "date": {
    "invalid": "Veuillez entrer une date valide",
    "future": "La date doit être dans le futur",
    "past": "La date doit être dans le passé"
  },
  "file": {
    "required": "Veuillez sélectionner un fichier",
    "maxSize": "La taille du fichier doit être inférieure à {{max}}",
    "type": "Le type de fichier doit être: {{types}}"
  }
}
```

---

## Translated Zod Schema

### schemas/registration.ts

```typescript
import { z } from 'zod'
import i18n from '@/i18n'

/**
 * Create translated Zod schema for registration.
 * Re-create schema when language changes.
 */
export function createRegistrationSchema() {
  const t = i18n.t.bind(i18n)

  return z.object({
    email: z
      .string()
      .min(1, t('validation:required'))
      .email(t('validation:email.invalid')),

    username: z
      .string()
      .min(3, t('validation:username.min', { min: 3 }))
      .max(20, t('validation:username.max', { max: 20 }))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t('validation:username.invalid')
      ),

    password: z
      .string()
      .min(8, t('validation:password.min', { min: 8 }))
      .max(100, t('validation:password.max', { max: 100 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('validation:password.weak')
      ),

    confirmPassword: z.string().min(1, t('validation:required')),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: t('validation:password.mismatch'),
      path: ['confirmPassword'],
    }
  )
}

export type RegistrationData = z.infer<ReturnType<typeof createRegistrationSchema>>
```

---

## Registration Form Component

### components/RegistrationForm.tsx

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { createRegistrationSchema } from '@/schemas/registration'

/**
 * Registration form with translated validation.
 */
export function RegistrationForm() {
  const { t, i18n } = useTranslation(['validation', 'auth'])

  // Recreate schema when language changes
  const schema = useMemo(
    () => createRegistrationSchema(),
    [i18n.language]
  )

  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Submit:', value)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4 max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold">{t('auth:register.title')}</h1>

      {/* Email Field */}
      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {t('auth:register.email')}
            </label>
            <input
              id={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Username Field */}
      <form.Field name="username">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {t('auth:register.username')}
            </label>
            <input
              id={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password Field */}
      <form.Field name="password">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {t('auth:register.password')}
            </label>
            <input
              id={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Confirm Password Field */}
      <form.Field name="confirmPassword">
        {(field) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium">
              {t('auth:register.confirmPassword')}
            </label>
            <input
              id={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={!form.state.canSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {t('auth:register.submit')}
      </button>
    </form>
  )
}
```

---

## Reusable Field Error Component

### components/FieldError.tsx

```typescript
import { useTranslation } from 'react-i18next'

interface FieldErrorProps {
  errors: string[]
}

/**
 * Display field validation errors.
 */
export function FieldError({ errors }: FieldErrorProps) {
  const { t } = useTranslation('validation')

  if (errors.length === 0) {
    return null
  }

  return (
    <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
      {errors.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  )
}
```

---

## Hook for Translated Validation

### hooks/useTranslatedValidation.ts

```typescript
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

/**
 * Hook for creating translated validation messages.
 */
export function useTranslatedValidation() {
  const { t, i18n } = useTranslation('validation')

  return useMemo(() => ({
    required: () => t('required'),
    email: () => t('email.invalid'),
    minLength: (min: number) => t('password.min', { min }),
    maxLength: (max: number) => t('password.max', { max }),
    passwordMismatch: () => t('password.mismatch'),
  }), [t, i18n.language])
}
```

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Separate namespace | Use `validation` namespace |
| Recreate on change | Rebuild schema when language changes |
| Interpolate values | Use `{{min}}`, `{{max}}` for numbers |
| Consistent keys | Follow pattern like `field.error` |
