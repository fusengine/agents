---
name: channels
description: Public, private, and presence channels with authorization and event broadcasting
file-type: markdown
---

# Channels & Broadcasting

## Channel Types

| Type | Prefix | Auth | Use Case |
|------|--------|------|----------|
| **Public** | (none) | No | Dashboards |
| **Private** | `private-` | Yes | User data |
| **Presence** | `presence-` | Yes | Who's online |

---

## Broadcasting Events

```php
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

final class OrderShipped implements ShouldBroadcast
{
    public function __construct(
        public readonly Order $order,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('orders.' . $this->order->user_id)];
    }

    public function broadcastAs(): string
    {
        return 'order.shipped';
    }

    public function broadcastWith(): array
    {
        return ['order_id' => $this->order->id];
    }
}
```

---

## Channel Authorization

Define in `routes/channels.php`:

```php
// Private channel
Broadcast::channel('orders.{userId}', function (User $user, int $userId) {
    return $user->id === $userId;
});

// Presence channel — return user data or false
Broadcast::channel('chat.{roomId}', function (User $user, int $roomId) {
    if ($user->canJoinRoom($roomId)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```

---

## Dispatching Broadcasts

```php
event(new OrderShipped($order));                    // Via event
broadcast(new OrderShipped($order));                // Direct
broadcast(new OrderShipped($order))->toOthers();    // Exclude sender
```

---

## Best Practices

### DO
- Use `broadcastAs()` for clean event names
- Use `broadcastWith()` to limit payload
- Use `toOthers()` for user-initiated actions

### DON'T
- Return full Eloquent models in `broadcastWith()`
- Forget to authorize private/presence channels
- Use public channels for sensitive information
