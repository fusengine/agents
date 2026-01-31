---
name: msw-setup
description: Mock Service Worker 2.0 for API mocking
when-to-use: Mocking API calls in tests
keywords: msw, mock, api, handlers, network
priority: high
related: async-testing.md, templates/api-integration.md
---

# MSW (Mock Service Worker)

## Why MSW

| Approach | Problem |
|----------|---------|
| Mock fetch | Leaky, hard to maintain |
| Mock modules | Tight coupling |
| **MSW** | Network-level, decoupled |

---

## How It Works

MSW intercepts network requests at the service worker level.
Tests hit real fetch/axios code, MSW intercepts before network.

---

## Project Structure

```
src/mocks/
├── handlers.ts   # Request handlers
└── server.ts     # MSW server
```

---

## Handler Types

| Method | Purpose |
|--------|---------|
| `http.get()` | GET requests |
| `http.post()` | POST requests |
| `http.patch()` | PATCH requests |
| `http.delete()` | DELETE requests |

---

## Response Types

| Response | Use Case |
|----------|----------|
| `HttpResponse.json()` | JSON data |
| `new HttpResponse(null, { status: 500 })` | Error |
| `HttpResponse.error()` | Network failure |

---

## Test Override Pattern

Override handlers per-test for error scenarios:

```typescript
server.use(http.get('/api', () => ...))
```

Resets after each test via `server.resetHandlers()`.

---

## Best Practice

**Test effects, not requests:**
- Check what user sees, not what fetch was called with
- Assert on UI changes, not network calls

---

## Where to Find Code?

→ `templates/api-integration.md` - Complete MSW setup
→ `templates/basic-setup.md` - Vitest + MSW config
