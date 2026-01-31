---
name: input-otp
description: Component for entering one-time passwords and verification codes
when-to-use: 2FA verification, SMS codes, email verification, password reset codes
keywords: otp-input, verification-code, 2fa, one-time-password, pin-input, code-verification
priority: medium
requires: label.md
related: input.md
---

# Input OTP Component

## Overview

The Input OTP (One-Time Password) component provides a specialized input field for entering verification codes, authentication codes, and similar numeric sequences. It supports customizable length, patterns, and visual layouts.

## Installation

```bash
bunx --bun shadcn@latest add input-otp
```

## Basic Usage

```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/modules/cores/shadcn/components/ui/input-otp"

export function BasicInputOTP() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
```

## With Label

```tsx
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/modules/cores/shadcn/components/ui/input-otp"

export function InputOTPWithLabel() {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="otp">Verification Code</Label>
      <InputOTP maxLength={6} id="otp">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to your email
      </p>
    </div>
  )
}
```

## 4-Digit OTP Pattern

```tsx
"use client"

import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/modules/cores/shadcn/components/ui/input-otp"

export function FourDigitOTP() {
  const [otp, setOtp] = useState("")

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={4}
        value={otp}
        onChange={setOtp}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      {otp && <p className="text-sm">Entered code: {otp}</p>}
    </div>
  )
}
```

## 6-Digit OTP with Separator

```tsx
"use client"

import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/modules/cores/shadcn/components/ui/input-otp"

export function SixDigitOTPWithSeparator() {
  const [otp, setOtp] = useState("")

  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {otp.length === 6 && (
        <p className="text-sm text-green-600">
          Code verified: {otp}
        </p>
      )}
    </div>
  )
}
```

## Alphanumeric Pattern

```tsx
"use client"

import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/modules/cores/shadcn/components/ui/input-otp"

export function AlphanumericOTP() {
  const [otp, setOtp] = useState("")

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        pattern="[A-Za-z0-9]*"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">
        Letters and numbers allowed
      </p>
    </div>
  )
}
```

## Two-Factor Authentication Form

```tsx
"use client"

import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Label } from "@/modules/cores/shadcn/components/ui/label"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/modules/cores/shadcn/components/ui/input-otp"

export function TwoFactorForm() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setError("")
      // Handle successful verification
    } catch (err) {
      setError("Invalid code. Please try again.")
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-semibold">
          Two-factor authentication verified!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-sm">
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Verify your identity
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="2fa-code">Verification Code</Label>
          <InputOTP
            id="2fa-code"
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={otp.length !== 6}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Code
        </button>

        <p className="text-xs text-muted-foreground text-center">
          Did not receive a code?{" "}
          <button className="underline hover:text-foreground">
            Resend
          </button>
        </p>
      </div>
    </div>
  )
}
```

## Email Verification

```tsx
"use client"

import { useState } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/modules/cores/shadcn/components/ui/input-otp"

export function EmailVerification() {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    try {
      // Verify email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Email verified with code:", otp)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
      <div>
        <h2 className="text-xl font-bold mb-1">Verify your email</h2>
        <p className="text-sm text-muted-foreground">
          We sent a code to user@example.com
        </p>
      </div>

      <div className="grid gap-3">
        <label className="text-sm font-medium">Confirmation Code</label>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="submit"
        disabled={otp.length !== 6 || isVerifying}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify Email"}
      </button>
    </form>
  )
}
```

## Resendable Code

```tsx
"use client"

import { useState, useEffect } from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/modules/cores/shadcn/components/ui/input-otp"

export function ResendableOTP() {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleResend = () => {
    setOtp("")
    setTimeLeft(60)
    setCanResend(false)
    // Resend logic here
  }

  return (
    <div className="space-y-6 max-w-sm">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-sm text-blue-600 hover:underline"
          >
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend code in {timeLeft}s
          </p>
        )}
      </div>
    </div>
  )
}
```

## Props

### InputOTP Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | - | Maximum number of characters |
| `value` | `string` | - | Current value (controlled) |
| `onChange` | `function` | - | Callback on value change |
| `pattern` | `string \| RegExp` | - | Input validation pattern |
| `disabled` | `boolean` | false | Disable input |
| `containerClassName` | `string` | - | CSS classes for container |
| `render` | `function` | - | Custom render function for slots |

### InputOTPSlot Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | Slot position |
| `className` | `string` | - | Additional CSS classes |

### InputOTPGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### InputOTPSeparator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## Common Patterns

### Numeric Only

```typescript
import { REGEXP_ONLY_DIGITS } from "input-otp"

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
  {/* slots */}
</InputOTP>
```

### Alphanumeric

```typescript
<InputOTP maxLength={6} pattern="[A-Za-z0-9]*">
  {/* slots */}
</InputOTP>
```

## Import Paths

- **Component**: `@/modules/cores/shadcn/components/ui/input-otp`
- **Pattern constants**: `input-otp` (external package)
- **Re-export**: Use barrel export at `@/modules/cores/shadcn/components/ui`

## Accessibility

- Keyboard navigation support
- Auto-focus to next slot on input
- Screen reader support
- ARIA attributes for verification

## Related Components

- [Label Component](./label.md) - Form label
- [Input Component](./input.md) - Single text input
