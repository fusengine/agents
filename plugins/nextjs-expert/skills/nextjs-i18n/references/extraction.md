# next-intl Message Extraction

## useExtracted Hook (Beta)

Extract messages from React components at build time.

```typescript
import { useExtracted } from 'next-intl'

function Component() {
  const t = useExtracted('Namespace')

  return (
    <div>
      {t('title', 'Default title text')}
      {t('description', 'Default description')}
    </div>
  )
}
```

## Extraction Script

```bash
# Extract messages from source
bunx next-intl extract
```

## Configuration

```json
// next-intl.config.json
{
  "extract": {
    "include": ["src/**/*.{ts,tsx}"],
    "exclude": ["**/*.test.ts"],
    "output": "messages/extracted.json"
  }
}
```

## Output Format

```json
// messages/extracted.json
{
  "Namespace": {
    "title": "Default title text",
    "description": "Default description"
  }
}
```

## Merge with Translations

```typescript
// scripts/merge-messages.ts
import extracted from './messages/extracted.json'
import en from './messages/en.json'

const merged = {
  ...extracted,
  ...en  // Translated values override defaults
}

await fs.writeFile('messages/en.json', JSON.stringify(merged, null, 2))
```

## CI Integration

```yaml
# .github/workflows/extract.yml
jobs:
  extract:
    steps:
      - run: bunx next-intl extract
      - run: git diff --exit-code messages/
        # Fail if extracted messages changed
```

## Alternative: Manual Keys

```typescript
// Define keys manually in messages/*.json
// Reference in code with t('key')
const t = useTranslations('Namespace')
t('title')  // Must exist in messages
```
