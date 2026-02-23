---
name: validator-template
description: Zod validation schema template (< 40 lines)
when-to-use: validation logic, schema validation, input validation
keywords: validator, validation, schema, input, sanitize
priority: medium
related: single-responsibility.md, interface-segregation.md
applies-to: "**/*validator*.ts, **/*schema*.ts"
trigger-on-edit: "validators/"
level: template
---

# Validator (< 40 lines)

## Basic Schema

```typescript
// modules/users/src/validators/user.validator.ts
import { z } from 'zod'

/** User creation schema. */
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user', 'guest']).default('user')
})

/** User update schema (all fields optional). */
export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial()

/** Inferred types from schemas. */
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

---

## Configuration Schema

```typescript
// modules/cores/validators/config.validator.ts
import { z } from 'zod'

/** Application config schema with defaults. */
export const configSchema = z.object({
  port: z.number().int().min(1).max(65535).default(3000),
  host: z.string().default('localhost'),
  debug: z.boolean().default(false),
  database: z.object({
    url: z.string().url(),
    maxConnections: z.number().int().min(1).default(10)
  })
})

export type Config = z.infer<typeof configSchema>

/**
 * Parse and validate config from unknown input.
 *
 * @param input - Raw config data
 * @returns Validated config with defaults applied
 */
export function parseConfig(input: unknown): Config {
  return configSchema.parse(input)
}
```

---

## CLI Arguments Schema

```typescript
// modules/cli/src/validators/cli.validator.ts
import { z } from 'zod'

/** CLI arguments schema. */
export const cliArgsSchema = z.object({
  command: z.enum(['init', 'build', 'watch']),
  output: z.string().default('./dist'),
  verbose: z.boolean().default(false),
  config: z.string().optional()
})

export type CliArgs = z.infer<typeof cliArgsSchema>
```

---

## Rules

- Max 40 lines per validator file
- Export schema AND inferred type together
- Use `.default()` for optional fields with defaults
- JSDoc for complex schemas
- Location: `modules/[feature]/src/validators/`
