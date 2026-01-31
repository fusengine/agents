# Better Auth Telemetry

## Overview

Better Auth collects anonymous usage data to improve the library.

## What's Collected

- Better Auth version
- Node.js version
- Operating system
- Plugins used (names only)
- Adapter type

## What's NOT Collected

- User data
- Credentials
- Session tokens
- IP addresses
- Personal information

## Disable Telemetry

```typescript
// Method 1: Environment variable
BETTER_AUTH_TELEMETRY_DISABLED=1

// Method 2: Config option
export const auth = betterAuth({
  advanced: {
    disableTelemetry: true
  }
})
```

## Why Telemetry?

- Understand which features are most used
- Prioritize bug fixes
- Guide development roadmap
- Ensure compatibility

## Privacy

- Data is anonymized
- No personal identifiers
- Open source, auditable
- Compliant with GDPR

## CI/CD

Telemetry is automatically disabled in CI environments:
- `CI=true`
- `CONTINUOUS_INTEGRATION=true`
- GitHub Actions, GitLab CI, etc.
