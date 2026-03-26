---
name: client
description: Laravel Echo setup, listening to events, whisper, and presence channel members
file-type: markdown
---

# Client-Side (Laravel Echo)

## Setup

```bash
npm install laravel-echo pusher-js
```

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

---

## Listening to Events

```typescript
// Private channel
Echo.private('orders.' + userId)
    .listen('.order.shipped', (e) => console.log(e.order_id));

// Public channel
Echo.channel('dashboard')
    .listen('.stats.updated', (e) => updateDashboard(e));

// Stop listening
Echo.leave('orders.' + userId);
```

---

## Presence Channels

```typescript
Echo.join('chat.' + roomId)
    .here((users) => setOnlineUsers(users))
    .joining((user) => addUser(user))
    .leaving((user) => removeUser(user))
    .listen('.message.sent', (e) => addMessage(e));
```

---

## Whisper (Client Events)

```typescript
// Send (requires private or presence channel)
Echo.private('chat.' + roomId)
    .whisper('typing', { user: userName });

// Listen
Echo.private('chat.' + roomId)
    .listenForWhisper('typing', (e) => showTyping(e.user));
```

---

## Notifications

```typescript
Echo.private('App.Models.User.' + userId)
    .notification((n) => console.log(n.type));
```

---

## Best Practices

### DO
- Use `.listen('.event.name')` with dot prefix for `broadcastAs()` events
- Clean up with `Echo.leave()` on component unmount
- Use whisper for ephemeral data (typing indicators)

### DON'T
- Forget the dot prefix when using `broadcastAs()`
- Keep stale channel subscriptions open
- Use whisper for data that needs persistence
