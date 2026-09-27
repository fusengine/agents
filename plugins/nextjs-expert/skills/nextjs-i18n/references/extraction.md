---
name: extraction
description: useExtracted hook, message extraction scripts, merge translations, CI
when-to-use: message auto-extraction, keys from components, default values, CI workflow
keywords: useExtracted, extract script, extraction config, merge translations
priority: low
requires: translations.md, messages-validation.md
related: messages-validation.md
---

# next-intl Message Extraction

## useExtracted Hook (Experimental)

Inline source messages; keys are auto-generated and extracted during `next dev` / `next build`
(Turbopack or Webpack loader), then `useExtracted` is compiled to `useTranslations`.
Server-side async variant: `getExtracted()` from `next-intl/server`.

```typescript
import { useExtracted } from 'next-intl'

function Component() {
  const t = useExtracted('Namespace')  // namespace is optional

  return (
    <div>
      {t('Default title text')}
      {t({ message: 'Right', description: 'Advance to the next slide' })}
    </div>
  )
}
```

## Configuration (next.config.ts)

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    extract: true,  // enables useExtracted
    messages: { path: './messages', format: 'json', locales: 'infer', sourceLocale: 'en' },  // format: 'json' | 'po' | custom
    srcPath: './src'
  }
})

const config: NextConfig = {}
export default withNextIntl(config)
```

## Manual Extraction (no dev server, e.g. component libraries)

```typescript
import { unstable_extractMessages } from 'next-intl/extractor'

await unstable_extractMessages({
  srcPath: './src',
  messages: { path: './messages', format: 'po', locales: 'infer', sourceLocale: 'en' }
})
```

## Output Format

```json
// messages/en.json (source locale) — target locales get empty entries kept in sync
{
  "Namespace": {
    "VgH3tb": "Default title text"
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
      - run: bunx next build  # extraction runs as part of next build
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
