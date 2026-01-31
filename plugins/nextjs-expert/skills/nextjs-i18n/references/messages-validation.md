# next-intl Messages Validation

## Script de Validation

```typescript
// scripts/validate-messages.ts
import en from '../modules/cores/i18n/messages/en.json'
import fr from '../modules/cores/i18n/messages/fr.json'

type Messages = typeof en

function validateMessages(
  source: Record<string, any>,
  target: Record<string, any>,
  path = ''
) {
  const errors: string[] = []

  for (const key in source) {
    const currentPath = path ? `${path}.${key}` : key

    if (!(key in target)) {
      errors.push(`Missing key: ${currentPath}`)
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      errors.push(...validateMessages(source[key], target[key], currentPath))
    }
  }

  return errors
}

const errors = validateMessages(en, fr)
if (errors.length > 0) {
  console.error('Missing translations:')
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}
console.log('All translations valid!')
```

## Package.json Script

```json
{
  "scripts": {
    "validate:i18n": "tsx scripts/validate-messages.ts"
  }
}
```

## CI Integration

```yaml
# .github/workflows/ci.yml
jobs:
  validate:
    steps:
      - run: bun run validate:i18n
```

## ICU Syntax Validation

```typescript
import { IntlMessageFormat } from 'intl-messageformat'

function validateICU(message: string, locale: string) {
  try {
    new IntlMessageFormat(message, locale)
    return true
  } catch (error) {
    return false
  }
}
```

## Unused Keys Detection

```typescript
// scripts/find-unused.ts
import { glob } from 'glob'
import messages from '../messages/en.json'

const files = await glob('src/**/*.{ts,tsx}')
const content = files.map((f) => fs.readFileSync(f, 'utf8')).join('')

function findUnused(obj: any, path = ''): string[] {
  const unused: string[] = []
  for (const key in obj) {
    const fullPath = path ? `${path}.${key}` : key
    if (typeof obj[key] === 'object') {
      unused.push(...findUnused(obj[key], fullPath))
    } else if (!content.includes(`'${key}'`) && !content.includes(`"${key}"`)) {
      unused.push(fullPath)
    }
  }
  return unused
}
```
