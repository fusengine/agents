---
name: laravel-reverb
description: Implement real-time WebSocket communication with Laravel Reverb. Use when adding live updates, chat, notifications, or presence features.
versions:
  laravel: "12.46"
  reverb: "1.4"
  php: "8.5"
user-invocable: false
references: references/channels.md, references/client.md
related-skills: laravel-architecture, laravel-queues
---

# Laravel Reverb

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing broadcasting patterns
2. **fuse-ai-pilot:research-expert** - Verify Reverb docs via Context7
3. **mcp__context7__query-docs** - Check WebSocket and event patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Component | Purpose |
|-----------|---------|
| **Reverb Server** | First-party WebSocket server for Laravel |
| **Broadcasting** | Send events from server to client |
| **Channels** | Public, private, presence scoping |
| **Echo** | Client-side event listener |

---

## Decision Guide

```
Need real-time?
├── Live notifications → Reverb + private channel
├── Chat / messaging → Reverb + presence channel
├── Live dashboard → Reverb + public channel
├── Collaborative editing → Reverb + whisper
└── Background tasks → NOT Reverb (use Queues)
```

---

## Quick Setup

```bash
php artisan install:broadcasting
```

```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=my-app
REVERB_APP_KEY=my-key
REVERB_APP_SECRET=my-secret
REVERB_HOST=0.0.0.0
REVERB_PORT=8080
```

---

## Critical Rules

1. **Use private channels** for authenticated data
2. **Authorize channels** in `routes/channels.php`
3. **Use ShouldBroadcast** for queued delivery (recommended)
4. **Run Reverb behind Nginx/Caddy** in production with SSL

---

## Reference Guide

| Need | Reference |
|------|-----------|
| Channel types, authorization | [channels.md](references/channels.md) |
| Echo setup, client listeners | [client.md](references/client.md) |

---

## Best Practices

### DO
- Use `ShouldBroadcast` with queue for scalability
- Authorize private and presence channels
- Use presence channels for user awareness

### DON'T
- Broadcast sensitive data on public channels
- Forget to configure CORS for cross-origin clients
- Expose Reverb directly without a reverse proxy
