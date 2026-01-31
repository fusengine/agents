---
name: adapter-template
description: Adapter pattern templates for external integrations (< 40 lines)
---

# Adapter Pattern (< 40 lines)

## API Response Adapter

```typescript
// modules/users/src/adapters/user.adapter.ts
import type { User } from '../interfaces/user.interface'

/**
 * External API user format.
 */
interface ExternalUser {
  user_id: string
  full_name: string
  email_address: string
  profile_image: string | null
  user_type: 'ADMIN' | 'USER' | 'GUEST'
  created_timestamp: string
}

/**
 * Adapt external API user to internal format.
 */
export function adaptUser(external: ExternalUser): User {
  return {
    id: external.user_id,
    name: external.full_name,
    email: external.email_address,
    avatar: external.profile_image,
    role: external.user_type.toLowerCase() as User['role'],
    createdAt: external.created_timestamp,
    updatedAt: external.created_timestamp
  }
}

/**
 * Adapt array of external users.
 */
export function adaptUsers(externals: ExternalUser[]): User[] {
  return externals.map(adaptUser)
}
```

---

## Storage Adapter

```typescript
// modules/cores/adapters/storage.adapter.ts
import type { Storage } from '../interfaces/storage.interface'

/**
 * Adapt localStorage to Storage interface.
 */
export const localStorageAdapter: Storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  }
}

/**
 * Adapt sessionStorage to Storage interface.
 */
export const sessionStorageAdapter: Storage = {
  get<T>(key: string): T | null {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },

  set<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value))
  },

  remove(key: string): void {
    sessionStorage.removeItem(key)
  }
}
```

---

## Third-Party Library Adapter

```typescript
// modules/cores/adapters/date.adapter.ts
import { format, parseISO, formatDistance } from 'date-fns'
import type { DateFormatter } from '../interfaces/date.interface'

/**
 * Adapt date-fns to internal DateFormatter interface.
 */
export const dateFnsAdapter: DateFormatter = {
  format(date: string | Date, formatStr: string): string {
    const parsed = typeof date === 'string' ? parseISO(date) : date
    return format(parsed, formatStr)
  },

  relative(date: string | Date): string {
    const parsed = typeof date === 'string' ? parseISO(date) : date
    return formatDistance(parsed, new Date(), { addSuffix: true })
  },

  toISO(date: Date): string {
    return date.toISOString()
  }
}
```

---

## Event Adapter

```typescript
// modules/analytics/src/adapters/analytics.adapter.ts
import type { AnalyticsEvent } from '../interfaces/analytics.interface'

/**
 * Adapt internal events to Google Analytics format.
 */
export function adaptToGA(event: AnalyticsEvent): void {
  if (typeof gtag !== 'undefined') {
    gtag('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    })
  }
}

/**
 * Adapt internal events to Mixpanel format.
 */
export function adaptToMixpanel(event: AnalyticsEvent): void {
  if (typeof mixpanel !== 'undefined') {
    mixpanel.track(event.name, {
      category: event.category,
      label: event.label,
      value: event.value
    })
  }
}
```

---

## Rules

- Max 40 lines
- Location: `modules/[feature]/src/adapters/`
- Transform external data to internal format
- JSDoc for all exports
- Keep adapters pure (no side effects except the adaptation)
