---
name: watch-connectivity
description: Watch Connectivity framework for iPhone-Watch communication and data sync
when-to-use: syncing data between iPhone and Watch, sending messages, transferring files
keywords: WatchConnectivity, WCSession, sendMessage, transferUserInfo, applicationContext
priority: high
related: complications.md, workouts.md
---

# Watch Connectivity

## When to Use

- Syncing data iPhone ↔ Watch
- Real-time messaging
- File transfers
- Background data updates
- Companion app coordination

## Key Concepts

### WCSession
Main communication channel.

**Key Points:**
- Activate on both sides
- Check reachability
- Delegate for callbacks
- Single shared instance

### Communication Methods

| Method | Use Case | Timing |
|--------|----------|--------|
| sendMessage | Real-time chat | Immediate |
| transferUserInfo | Queued data | FIFO delivery |
| updateApplicationContext | Latest state | Overwrites previous |
| transferFile | Binary data | Background |

### sendMessage
Immediate delivery when reachable.

**Key Points:**
- Both apps must be active
- Reply handler optional
- Fails if not reachable
- Use for urgent data

### transferUserInfo
Queued FIFO delivery.

**Key Points:**
- Delivered in order
- Works in background
- Guaranteed delivery
- Good for transactions

### applicationContext
Latest state dictionary.

**Key Points:**
- Only latest value kept
- Delivered when possible
- Good for settings/state
- Overwrites previous

### transferFile
Large data transfer.

**Key Points:**
- For files/binary data
- Background transfer
- Progress tracking
- Metadata support

---

## Reachability

**Check before sendMessage:**
- `session.isReachable` - Can send now
- `session.activationState` - Session status
- `session.isPaired` - Watch paired
- `session.isWatchAppInstalled` - App on watch

---

## Best Practices

- ✅ Activate session early
- ✅ Check reachability before sendMessage
- ✅ Use applicationContext for state
- ✅ Use transferUserInfo for important data
- ✅ Handle offline scenarios
- ❌ Don't assume immediate delivery
- ❌ Don't send large data via sendMessage
- ❌ Don't ignore activation failures
