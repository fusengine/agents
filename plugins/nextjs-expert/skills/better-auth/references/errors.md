# Better Auth Error Codes

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
