---
name: errors
description: Handle authentication error codes with recovery flows and user-friendly messages
when-to-use: error handling, debugging auth failures, user feedback, recovery flows, error messages
keywords: error codes, INVALID_CREDENTIALS, 2FA_REQUIRED, rate limit, error handling, recovery
priority: medium
requires: basic-usage.md, client.md
related: rate-limiting.md, security.md
---

# Better Auth Error Codes

## When to Use

- Building user-friendly error messages
- Implementing error recovery flows
- Debugging authentication issues
- Handling 2FA and rate limit scenarios

## Why Handle Errors Properly

| Without | With |
|---------|------|
| Generic "error" | Specific "Wrong password" |
| User confusion | Clear next steps |
| Support tickets | Self-service recovery |
| Silent failures | Logged and monitored |

## Authentication Errors

| Code | Message | Solution |
|------|---------|----------|
| `INVALID_CREDENTIALS` | Email or password incorrect | Check credentials |
| `USER_NOT_FOUND` | No user with this email | Register first |
| `EMAIL_NOT_VERIFIED` | Email not verified | Send verification email |
| `ACCOUNT_LOCKED` | Too many failed attempts | Wait or contact admin |
| `SESSION_EXPIRED` | Session has expired | Sign in again |

## OAuth Errors

| Code | Message | Solution |
|------|---------|----------|
| `OAUTH_CALLBACK_ERROR` | OAuth callback failed | Check provider config |
| `OAUTH_STATE_MISMATCH` | State parameter mismatch | CSRF protection triggered |
| `PROVIDER_NOT_CONFIGURED` | Provider not set up | Add provider config |
| `ACCOUNT_ALREADY_LINKED` | Account already linked | Unlink first |

## Plugin Errors

| Code | Message | Solution |
|------|---------|----------|
| `2FA_REQUIRED` | Two-factor required | Provide 2FA code |
| `2FA_INVALID_CODE` | Invalid 2FA code | Check code |
| `PASSKEY_FAILED` | Passkey verification failed | Try again |
| `ORG_LIMIT_REACHED` | Organization limit reached | Upgrade plan |

## Rate Limit Errors

| Code | Message | Solution |
|------|---------|----------|
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |

## Handling Errors

```typescript
const { data, error } = await authClient.signIn.email({ email, password })

if (error) {
  switch (error.code) {
    case "INVALID_CREDENTIALS": showError("Wrong email or password"); break
    case "2FA_REQUIRED": show2FAInput(); break
    case "RATE_LIMIT_EXCEEDED": showError("Too many attempts"); break
    default: showError(error.message)
  }
}
```
