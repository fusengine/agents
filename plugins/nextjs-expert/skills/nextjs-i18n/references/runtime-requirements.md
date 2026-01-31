# next-intl Runtime Requirements

## Supported Environments

| Environment | Support |
|-------------|---------|
| Node.js 18+ | ✓ Full |
| Edge Runtime | ✓ Full |
| Cloudflare Workers | ✓ Full |
| Vercel Edge | ✓ Full |
| Deno | ✓ Partial |

## Browser Support

- Chrome 71+
- Firefox 65+
- Safari 14+
- Edge 79+

## Intl API Requirements

next-intl uses native `Intl` APIs:

```typescript
// Required APIs
Intl.NumberFormat      // Numbers, currencies
Intl.DateTimeFormat    // Dates, times
Intl.RelativeTimeFormat // Relative time
Intl.ListFormat        // Lists
Intl.PluralRules       // Pluralization
```

## Polyfills (If Needed)

```bash
bun add @formatjs/intl-numberformat @formatjs/intl-datetimeformat
```

```typescript
// polyfills.ts (import at app entry)
import '@formatjs/intl-numberformat/polyfill'
import '@formatjs/intl-datetimeformat/polyfill'
```

## Edge Runtime Configuration

```typescript
// next.config.ts
export default {
  experimental: {
    runtime: 'edge'
  }
}
```

## Memory Considerations

- Messages are loaded per-locale
- Use message splitting for large apps
- Consider lazy loading namespaces

```typescript
// Lazy load specific namespace
const messages = {
  ...baseMessages,
  Dashboard: await import('./dashboard.json')
}
```

## Timezone Support

```typescript
// Set timezone globally
<NextIntlClientProvider timeZone="Europe/Paris">

// Or per-request
getRequestConfig(async () => ({
  timeZone: 'America/New_York'
}))
```
