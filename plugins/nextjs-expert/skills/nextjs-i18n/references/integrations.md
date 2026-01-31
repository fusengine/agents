# next-intl Integrations

## VSCode Extension

Install `lokalise.i18n-ally` for:
- Inline translation preview
- Auto-complete for keys
- Missing translation detection

```json
// .vscode/settings.json
{
  "i18n-ally.localesPaths": ["messages"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sourceLanguage": "en"
}
```

## Crowdin Integration

```yaml
# crowdin.yml
project_id: "your-project-id"
api_token_env: "CROWDIN_TOKEN"

files:
  - source: /messages/en.json
    translation: /messages/%locale%.json
```

```bash
# Push source to Crowdin
crowdin push

# Pull translations
crowdin pull
```

## Storybook

```typescript
// .storybook/preview.tsx
import { NextIntlClientProvider } from 'next-intl'
import messages from '../messages/en.json'

export const decorators = [
  (Story) => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Story />
    </NextIntlClientProvider>
  )
]
```

## Locale Switcher in Storybook

```typescript
// .storybook/preview.tsx
export const globalTypes = {
  locale: {
    name: 'Locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: ['en', 'fr', 'de']
    }
  }
}
```

## Message Validation

```typescript
// scripts/validate-messages.ts
import en from '../messages/en.json'
import fr from '../messages/fr.json'

function validateMessages(source: object, target: object, path = '') {
  for (const key in source) {
    const currentPath = path ? `${path}.${key}` : key
    if (!(key in target)) {
      console.error(`Missing: ${currentPath}`)
    } else if (typeof source[key] === 'object') {
      validateMessages(source[key], target[key], currentPath)
    }
  }
}

validateMessages(en, fr)
```
