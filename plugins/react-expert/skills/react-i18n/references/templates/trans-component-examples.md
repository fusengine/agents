# Trans Component Examples

Rich text translations with embedded React components.

---

## Translation File

### public/locales/en/common.json

```json
{
  "legal": {
    "terms": "By signing up, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>.",
    "cookie": "We use <link>cookies</link> to improve your experience.",
    "age": "You must be at least <bold>{{age}}</bold> years old to use this service."
  },
  "messages": {
    "welcome": "Welcome to <brand>MyApp</brand>! We're glad you're here.",
    "updated": "Your profile was updated <time>{{date}}</time>.",
    "achievement": "Congratulations! You've earned the <badge>{{name}}</badge> badge."
  },
  "actions": {
    "confirm": "Click <button>Confirm</button> to proceed or <cancel>Cancel</cancel> to go back.",
    "download": "Download the <app>mobile app</app> for the best experience."
  },
  "formatting": {
    "highlight": "This is <highlight>highlighted text</highlight> in a sentence.",
    "code": "Run the command <code>npm install</code> to get started.",
    "quote": "As someone said: <quote>The best code is no code.</quote>"
  },
  "complex": {
    "subscription": "Your <plan>{{planName}}</plan> subscription renews on <date>{{renewDate}}</date> for <price>{{amount}}</price>.",
    "share": "Share this with your friends: <twitter>Twitter</twitter> • <facebook>Facebook</facebook> • <linkedin>LinkedIn</linkedin>"
  },
  "nested": {
    "promo": "Get <discount><bold>{{percent}}</bold> off</discount> your first order!"
  }
}
```

---

## Basic Link Example

### TermsAgreement.tsx

```typescript
import { Trans, useTranslation } from 'react-i18next'

/**
 * Terms agreement with clickable links.
 */
export function TermsAgreement() {
  return (
    <p className="text-sm text-gray-600">
      <Trans
        i18nKey="legal.terms"
        components={{
          terms: (
            <a
              href="/terms"
              className="text-blue-600 hover:underline"
            />
          ),
          privacy: (
            <a
              href="/privacy"
              className="text-blue-600 hover:underline"
            />
          ),
        }}
      />
    </p>
  )
}
```

**Output:**
```html
By signing up, you agree to our
<a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
and
<a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>.
```

---

## Bold Text with Variable

### AgeRequirement.tsx

```typescript
import { Trans } from 'react-i18next'

interface AgeRequirementProps {
  minimumAge: number
}

/**
 * Age requirement notice with bold age.
 */
export function AgeRequirement({ minimumAge }: AgeRequirementProps) {
  return (
    <p className="text-sm">
      <Trans
        i18nKey="legal.age"
        values={{ age: minimumAge }}
        components={{
          bold: <strong className="font-semibold" />,
        }}
      />
    </p>
  )
}
```

**Output:**
```html
You must be at least <strong class="font-semibold">18</strong> years old to use this service.
```

---

## Custom Component Integration

### WelcomeMessage.tsx

```typescript
import { Trans } from 'react-i18next'

/**
 * Welcome message with branded text.
 */
export function WelcomeMessage() {
  return (
    <h1 className="text-2xl">
      <Trans
        i18nKey="messages.welcome"
        components={{
          brand: (
            <span className="font-bold text-blue-600" />
          ),
        }}
      />
    </h1>
  )
}
```

---

## Time Display

### UpdateNotice.tsx

```typescript
import { Trans } from 'react-i18next'

interface UpdateNoticeProps {
  updatedAt: Date
}

/**
 * Profile update notice with formatted date.
 */
export function UpdateNotice({ updatedAt }: UpdateNoticeProps) {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(updatedAt)

  return (
    <p className="text-green-600">
      <Trans
        i18nKey="messages.updated"
        values={{ date: formattedDate }}
        components={{
          time: <time dateTime={updatedAt.toISOString()} />,
        }}
      />
    </p>
  )
}
```

---

## Interactive Buttons

### ConfirmDialog.tsx

```typescript
import { Trans } from 'react-i18next'

interface ConfirmDialogProps {
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation dialog with action buttons.
 */
export function ConfirmDialog({ onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <p className="text-center">
      <Trans
        i18nKey="actions.confirm"
        components={{
          button: (
            <button
              onClick={onConfirm}
              className="px-3 py-1 bg-blue-600 text-white rounded mx-1"
            />
          ),
          cancel: (
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded mx-1"
            />
          ),
        }}
      />
    </p>
  )
}
```

---

## Code Formatting

### CodeInstruction.tsx

```typescript
import { Trans } from 'react-i18next'

/**
 * Instruction with inline code.
 */
export function CodeInstruction() {
  return (
    <p>
      <Trans
        i18nKey="formatting.code"
        components={{
          code: (
            <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm" />
          ),
        }}
      />
    </p>
  )
}
```

---

## Badge Component

### AchievementBadge.tsx

```typescript
import { Trans } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

interface AchievementBadgeProps {
  badgeName: string
}

/**
 * Achievement notification with badge component.
 */
export function AchievementNotification({ badgeName }: AchievementBadgeProps) {
  return (
    <p className="flex items-center gap-2">
      <Trans
        i18nKey="messages.achievement"
        values={{ name: badgeName }}
        components={{
          badge: <Badge variant="secondary" />,
        }}
      />
    </p>
  )
}
```

---

## Multiple Variables

### SubscriptionInfo.tsx

```typescript
import { Trans } from 'react-i18next'

interface SubscriptionInfoProps {
  planName: string
  renewDate: string
  amount: string
}

/**
 * Subscription details with multiple styled variables.
 */
export function SubscriptionInfo({
  planName,
  renewDate,
  amount,
}: SubscriptionInfoProps) {
  return (
    <p className="text-sm">
      <Trans
        i18nKey="complex.subscription"
        values={{ planName, renewDate, amount }}
        components={{
          plan: <strong className="font-medium" />,
          date: <span className="text-gray-600" />,
          price: <span className="font-bold text-green-600" />,
        }}
      />
    </p>
  )
}
```

---

## Social Share Links

### ShareButtons.tsx

```typescript
import { Trans } from 'react-i18next'

interface ShareButtonsProps {
  url: string
}

/**
 * Social share buttons in a sentence.
 */
export function ShareButtons({ url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)

  return (
    <p>
      <Trans
        i18nKey="complex.share"
        components={{
          twitter: (
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          facebook: (
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          linkedin: (
            <a
              href={`https://linkedin.com/shareArticle?mini=true&url=${encodedUrl}`}
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
      />
    </p>
  )
}
```

---

## Nested Components

### PromoMessage.tsx

```typescript
import { Trans } from 'react-i18next'

interface PromoMessageProps {
  discountPercent: number
}

/**
 * Promo message with nested formatting.
 */
export function PromoMessage({ discountPercent }: PromoMessageProps) {
  return (
    <p className="text-lg">
      <Trans
        i18nKey="nested.promo"
        values={{ percent: `${discountPercent}%` }}
        components={{
          discount: <span className="text-red-600" />,
          bold: <strong className="font-bold text-xl" />,
        }}
      />
    </p>
  )
}
```

**JSON:** `"Get <discount><bold>{{percent}}</bold> off</discount> your first order!"`

**Output:**
```html
Get <span class="text-red-600"><strong class="font-bold text-xl">25%</strong> off</span> your first order!
```

---

## Array Notation Alternative

```typescript
// JSON: "Click <0>here</0> or <1>there</1>"

<Trans
  i18nKey="actions.options"
  components={[
    <a href="/here" key="0" />,
    <a href="/there" key="1" />,
  ]}
/>
```

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Named tags | Use `<terms>` not `<0>` |
| Self-closing | Use `<icon/>` for icons |
| Minimal nesting | Keep structure simple |
| Test rendering | Verify HTML output |
| Accessibility | Add ARIA attributes to components |
