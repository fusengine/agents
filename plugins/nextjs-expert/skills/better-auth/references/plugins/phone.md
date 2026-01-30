# Better Auth Phone Number Plugin

## Installation

```typescript
// modules/auth/src/services/auth.ts
import { betterAuth } from "better-auth"
import { phoneNumber } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        // Use Twilio, AWS SNS, etc.
        await twilio.messages.create({
          body: `Your code is: ${code}`,
          to: phoneNumber,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      }
    })
  ]
})
```

## Client Setup

```typescript
import { createAuthClient } from "better-auth/react"
import { phoneNumberClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [phoneNumberClient()]
})
```

## Usage

### Send OTP
```typescript
const { phoneNumber } = authClient

await phoneNumber.sendOtp({
  phoneNumber: "+1234567890"
})
```

### Verify OTP
```typescript
const result = await phoneNumber.verifyOtp({
  phoneNumber: "+1234567890",
  code: "123456"
})
```

## Configuration

```typescript
phoneNumber({
  sendOTP: async ({ phoneNumber, code }) => { ... },
  otpLength: 6,          // Default: 6
  expiresIn: 300,        // Seconds (default: 5 min)
  verifyPhoneOnSignUp: false
})
```

## Twilio Integration

```bash
bun add twilio
```

```typescript
import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

phoneNumber({
  sendOTP: async ({ phoneNumber, code }) => {
    await client.messages.create({
      body: `Your verification code: ${code}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    })
  }
})
```

## Environment Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```
