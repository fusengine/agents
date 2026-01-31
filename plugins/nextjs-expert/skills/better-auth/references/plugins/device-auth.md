# Better Auth Device Authorization Plugin

## Overview
OAuth 2.0 Device Authorization Grant for TV, CLI, and limited-input devices.

## Installation

```typescript
import { betterAuth } from "better-auth"
import { deviceAuthorization } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [deviceAuthorization()]
})
```

## Device Flow

### 1. Request Device Code

```bash
curl -X POST https://yourapp.com/api/auth/device/code \
  -d "client_id=cli_app"
```

Response:
```json
{
  "device_code": "xxx",
  "user_code": "ABCD-1234",
  "verification_uri": "https://yourapp.com/device",
  "expires_in": 600
}
```

### 2. Display to User
Show user: "Go to yourapp.com/device and enter code: ABCD-1234"

### 3. User Authorizes (Browser)
User visits URL, enters code, logs in, approves.

### 4. Device Polls for Token

```bash
curl -X POST https://yourapp.com/api/auth/device/token \
  -d "client_id=cli_app" \
  -d "device_code=xxx" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code"
```

## Verification Page

```typescript
// app/device/page.tsx
export default function DevicePage() {
  return (
    <form action="/api/auth/device/verify" method="POST">
      <input name="user_code" placeholder="Enter code" />
      <button type="submit">Authorize</button>
    </form>
  )
}
```

## Configuration

```typescript
deviceAuthorization({
  codeExpiresIn: 600,      // 10 minutes
  pollingInterval: 5,       // 5 seconds
  userCodeLength: 8,        // ABCD-1234
  verificationUri: "/device"
})
```

## Use Cases
- CLI tools
- Smart TVs
- IoT devices
- Game consoles
