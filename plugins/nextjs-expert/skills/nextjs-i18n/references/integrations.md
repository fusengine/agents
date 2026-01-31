---
name: integrations
description: i18n-ally VSCode, Crowdin, Storybook, CI/CD validation messages
when-to-use: outillage, traduction teams, Storybook development, CI workflows
keywords: i18n-ally, Crowdin, Storybook, VSCode extension, CI/CD, validation
priority: low
requires: installation.md, messages-validation.md
related: testing.md
---

# next-intl Integrations

## When to Use

- IDE support with i18n-ally extension
- Translation management with Crowdin/Lokalise
- Storybook for component development
- CI/CD for message validation

## Why Integrate Tooling

| Manual | With Tooling |
|--------|--------------|
| Check JSON files manually | Inline preview in IDE |
| Email translators | Crowdin workflow |
| No Storybook locale | Locale switcher in Storybook |

## VSCode Extension (i18n-ally)

```json
// .vscode/settings.json
{
  "i18n-ally.localesPaths": ["modules/cores/i18n/messages"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sourceLanguage": "en"
}
```

Features:
- Inline translation preview
- Auto-complete for keys
- Missing translation detection

## Crowdin Integration

```yaml
# crowdin.yml
project_id: "your-project-id"
api_token_env: "CROWDIN_TOKEN"

files:
  - source: /modules/cores/i18n/messages/en.json
    translation: /modules/cores/i18n/messages/%locale%.json
```

```bash
crowdin push   # Push source to Crowdin
crowdin pull   # Pull translations
```

## Storybook

```typescript
// .storybook/preview.tsx
import { NextIntlClientProvider } from 'next-intl'
import messages from '../modules/cores/i18n/messages/en.json'

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
    toolbar: { icon: 'globe', items: ['en', 'fr', 'de'] }
  }
}
```

## CI Message Validation

```yaml
# .github/workflows/i18n.yml
jobs:
  validate:
    steps:
      - run: bun run validate:i18n
```
