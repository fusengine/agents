---
name: browser-extension
description: Implement Better Auth in browser extensions
when-to-use: browser extension, chrome extension, extension auth
keywords: browser extension, chrome extension, extension authentication
priority: low
requires: client.md
related: integrations/other-frameworks.md
---

# Better Auth Browser Extension Guide

## When to Use

- Building Chrome/Firefox extensions
- Extension-to-webapp authentication
- OAuth in extension context
- Shared auth across extension/web

## Why Extension Auth

| Separate auth | Shared auth |
|---------------|-------------|
| Duplicate login | Single session |
| Sync complexity | Automatic sync |
| Extension-only data | Unified user |
| No web features | Full webapp access |

## Manifest

```json
{
  "manifest_version": 3,
  "permissions": ["identity", "storage"],
  "host_permissions": ["https://yourapp.com/*"]
}
```

## Auth Client

```typescript
import { createAuthClient } from "better-auth/client"
const authClient = createAuthClient({ baseURL: "https://yourapp.com" })
```

## Sign In - Popup

```typescript
async function signIn() {
  chrome.windows.create({
    url: "https://yourapp.com/auth/extension",
    type: "popup",
    width: 500, height: 600
  })
}
```

## Sign In - OAuth

```typescript
async function signInWithGoogle() {
  const redirectUrl = chrome.identity.getRedirectURL()
  const authUrl = `https://yourapp.com/api/auth/sign-in/social?provider=google&callbackURL=${encodeURIComponent(redirectUrl)}`

  chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, (responseUrl) => {
    const token = new URL(responseUrl).searchParams.get("token")
    chrome.storage.local.set({ authToken: token })
  })
}
```

## Session Storage

```typescript
chrome.storage.local.set({ session: sessionData })
const { session } = await chrome.storage.local.get("session")
```

## API Requests

```typescript
async function fetchWithAuth(url: string) {
  const { session } = await chrome.storage.local.get("session")
  return fetch(url, { headers: { Authorization: `Bearer ${session.token}` } })
}
```

## Content Script Communication

```typescript
// background.ts
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (msg.type === "GET_SESSION") {
    chrome.storage.local.get("session", (data) => respond(data.session))
    return true
  }
})
```
