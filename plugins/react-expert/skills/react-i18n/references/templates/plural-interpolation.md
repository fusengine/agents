# Pluralization and Interpolation Examples

Complete examples of plural forms and variable interpolation.

---

## Translation Files

### public/locales/en/common.json

```json
{
  "items": {
    "count_zero": "No items",
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  },
  "notifications": {
    "unread_zero": "No unread messages",
    "unread_one": "You have {{count}} unread message",
    "unread_other": "You have {{count}} unread messages"
  },
  "cart": {
    "empty": "Your cart is empty",
    "items_one": "{{count}} item in cart",
    "items_other": "{{count}} items in cart",
    "total": "Total: {{price}}"
  },
  "comments": {
    "count_zero": "No comments yet",
    "count_one": "{{count}} comment",
    "count_other": "{{count}} comments"
  },
  "files": {
    "selected_zero": "No files selected",
    "selected_one": "{{count}} file selected ({{size}})",
    "selected_other": "{{count}} files selected ({{size}} total)"
  },
  "users": {
    "online_zero": "No users online",
    "online_one": "{{count}} user online",
    "online_other": "{{count}} users online",
    "typing_one": "{{name}} is typing...",
    "typing_two": "{{name}} and {{other}} are typing...",
    "typing_other": "{{count}} people are typing..."
  },
  "time": {
    "minutes_one": "{{count}} minute ago",
    "minutes_other": "{{count}} minutes ago",
    "hours_one": "{{count}} hour ago",
    "hours_other": "{{count}} hours ago",
    "days_one": "{{count}} day ago",
    "days_other": "{{count}} days ago"
  },
  "greeting": {
    "morning": "Good morning, {{name}}!",
    "afternoon": "Good afternoon, {{name}}!",
    "evening": "Good evening, {{name}}!"
  },
  "welcome": {
    "new": "Welcome, {{name}}! This is your first visit.",
    "returning": "Welcome back, {{name}}! Last visit: {{lastVisit}}"
  }
}
```

### public/locales/fr/common.json

```json
{
  "items": {
    "count_zero": "Aucun élément",
    "count_one": "{{count}} élément",
    "count_other": "{{count}} éléments"
  },
  "notifications": {
    "unread_zero": "Aucun message non lu",
    "unread_one": "Vous avez {{count}} message non lu",
    "unread_other": "Vous avez {{count}} messages non lus"
  },
  "cart": {
    "empty": "Votre panier est vide",
    "items_one": "{{count}} article dans le panier",
    "items_other": "{{count}} articles dans le panier",
    "total": "Total : {{price}}"
  },
  "comments": {
    "count_zero": "Aucun commentaire",
    "count_one": "{{count}} commentaire",
    "count_other": "{{count}} commentaires"
  },
  "files": {
    "selected_zero": "Aucun fichier sélectionné",
    "selected_one": "{{count}} fichier sélectionné ({{size}})",
    "selected_other": "{{count}} fichiers sélectionnés ({{size}} au total)"
  },
  "users": {
    "online_zero": "Aucun utilisateur en ligne",
    "online_one": "{{count}} utilisateur en ligne",
    "online_other": "{{count}} utilisateurs en ligne",
    "typing_one": "{{name}} est en train d'écrire...",
    "typing_two": "{{name}} et {{other}} sont en train d'écrire...",
    "typing_other": "{{count}} personnes sont en train d'écrire..."
  },
  "time": {
    "minutes_one": "il y a {{count}} minute",
    "minutes_other": "il y a {{count}} minutes",
    "hours_one": "il y a {{count}} heure",
    "hours_other": "il y a {{count}} heures",
    "days_one": "il y a {{count}} jour",
    "days_other": "il y a {{count}} jours"
  },
  "greeting": {
    "morning": "Bonjour, {{name}} !",
    "afternoon": "Bon après-midi, {{name}} !",
    "evening": "Bonsoir, {{name}} !"
  },
  "welcome": {
    "new": "Bienvenue, {{name}} ! C'est votre première visite.",
    "returning": "Bon retour, {{name}} ! Dernière visite : {{lastVisit}}"
  }
}
```

---

## Usage Examples

### Basic Pluralization

```typescript
import { useTranslation } from 'react-i18next'

function ItemCount({ count }: { count: number }) {
  const { t } = useTranslation()

  return <span>{t('items.count', { count })}</span>
}

// count=0: "No items" / "Aucun élément"
// count=1: "1 item" / "1 élément"
// count=5: "5 items" / "5 éléments"
```

### Notifications Badge

```typescript
function NotificationBadge({ unreadCount }: { unreadCount: number }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <BellIcon />
      <span>{t('notifications.unread', { count: unreadCount })}</span>
    </div>
  )
}
```

### Cart with Total

```typescript
function CartSummary({ items, total }: { items: number; total: string }) {
  const { t } = useTranslation()

  if (items === 0) {
    return <p>{t('cart.empty')}</p>
  }

  return (
    <div>
      <p>{t('cart.items', { count: items })}</p>
      <p className="font-bold">{t('cart.total', { price: total })}</p>
    </div>
  )
}
```

### File Selection

```typescript
function FileSelection({ files }: { files: File[] }) {
  const { t } = useTranslation()

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const formattedSize = formatBytes(totalSize)

  return (
    <p>
      {t('files.selected', {
        count: files.length,
        size: formattedSize,
      })}
    </p>
  )
}

// 0 files: "No files selected"
// 1 file:  "1 file selected (2.5 MB)"
// 3 files: "3 files selected (10.2 MB total)"
```

### Typing Indicator

```typescript
function TypingIndicator({ users }: { users: string[] }) {
  const { t } = useTranslation()

  if (users.length === 0) return null

  if (users.length === 1) {
    return <span>{t('users.typing', { count: 1, name: users[0] })}</span>
  }

  if (users.length === 2) {
    return (
      <span>
        {t('users.typing', {
          count: 2,
          name: users[0],
          other: users[1],
        })}
      </span>
    )
  }

  return <span>{t('users.typing', { count: users.length })}</span>
}

// 1 user:  "Alice is typing..."
// 2 users: "Alice and Bob are typing..."
// 3 users: "3 people are typing..."
```

### Time Ago

```typescript
function TimeAgo({ date }: { date: Date }) {
  const { t } = useTranslation()

  const now = Date.now()
  const diff = now - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) {
    return <span>{t('time.days', { count: days })}</span>
  }

  if (hours > 0) {
    return <span>{t('time.hours', { count: hours })}</span>
  }

  return <span>{t('time.minutes', { count: Math.max(1, minutes) })}</span>
}
```

### Context-Based Greeting

```typescript
function Greeting({ name }: { name: string }) {
  const { t } = useTranslation()

  const hour = new Date().getHours()
  let context: string

  if (hour < 12) {
    context = 'morning'
  } else if (hour < 18) {
    context = 'afternoon'
  } else {
    context = 'evening'
  }

  return <h1>{t(`greeting.${context}`, { name })}</h1>
}
```

### Conditional Welcome

```typescript
function WelcomeMessage({ user }: { user: User }) {
  const { t } = useTranslation()
  const { formatDate } = useFormatters()

  if (user.isNewUser) {
    return <p>{t('welcome.new', { name: user.name })}</p>
  }

  return (
    <p>
      {t('welcome.returning', {
        name: user.name,
        lastVisit: formatDate(user.lastVisit, { dateStyle: 'medium' }),
      })}
    </p>
  )
}
```

---

## Combined Example Component

```typescript
import { useTranslation } from 'react-i18next'

interface DashboardProps {
  user: { name: string; lastVisit: Date }
  notifications: number
  cartItems: number
  cartTotal: number
  onlineUsers: number
}

function Dashboard({
  user,
  notifications,
  cartItems,
  cartTotal,
  onlineUsers,
}: DashboardProps) {
  const { t } = useTranslation()

  return (
    <div className="p-6 space-y-4">
      {/* Greeting */}
      <h1 className="text-2xl font-bold">
        {t('greeting.morning', { name: user.name })}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Notifications</h3>
          <p className="text-lg font-medium">
            {t('notifications.unread', { count: notifications })}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Cart</h3>
          <p className="text-lg font-medium">
            {t('cart.items', { count: cartItems })}
          </p>
          <p className="text-sm text-gray-600">
            {t('cart.total', { price: `$${cartTotal.toFixed(2)}` })}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-500">Community</h3>
          <p className="text-lg font-medium">
            {t('users.online', { count: onlineUsers })}
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Best Practices

| Practice | Description |
|----------|-------------|
| Use `_zero` | Better UX than "0 items" |
| Named variables | `{{name}}` not `{{0}}` |
| Consistent keys | `entity_one`, `entity_other` |
| Test edge cases | 0, 1, 2, 5, 100, 1000 |
| Avoid concatenation | Use interpolation instead |
