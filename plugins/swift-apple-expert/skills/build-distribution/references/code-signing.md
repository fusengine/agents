---
name: code-signing
description: Code signing with certificates, provisioning profiles, and automatic signing
when-to-use: configuring signing, creating certificates, managing provisioning profiles
keywords: code signing, certificate, provisioning profile, automatic signing, Developer ID
priority: high
related: testflight.md, app-store.md
---

# Code Signing

## When to Use

- Setting up new project signing
- Troubleshooting signing issues
- Manual certificate management
- Enterprise distribution
- CI/CD configuration

## Key Concepts

### Automatic Signing (Recommended)
Let Xcode manage certificates and profiles.

**Key Points:**
- Enable in Target → Signing & Capabilities
- Select Development Team
- Xcode creates/updates profiles
- Works for most use cases

### Certificates

| Type | Purpose |
|------|---------|
| Development | Testing on device |
| Distribution | App Store/TestFlight |
| Developer ID | macOS outside App Store |

### Provisioning Profiles
Link app, team, certificates, and devices.

**Types:**
- Development (device testing)
- App Store (distribution)
- Ad Hoc (limited distribution)
- Enterprise (in-house)

### Entitlements
App capabilities and permissions.

**Common:**
- Push Notifications
- iCloud
- App Groups
- HealthKit

---

## Troubleshooting

### "No signing certificate"
1. Open Keychain Access
2. Check for expired certificates
3. Revoke and recreate in Developer Portal
4. Download new certificate

### "Profile doesn't match"
1. Clean build folder
2. Delete derived data
3. Refresh provisioning profiles
4. Re-select team

### Verification Commands

```bash
# List certificates
security find-identity -v -p codesigning

# Check provisioning profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/

# Verify app signature
codesign -dvvv MyApp.app
```

---

## CI/CD Signing

### Environment Variables
- `APPLE_TEAM_ID` - Team identifier
- `CERTIFICATE_P12` - Base64 certificate
- `PROVISIONING_PROFILE` - Base64 profile

### fastlane match
Centralized certificate management.

**Benefits:**
- Shared across team
- Git storage
- Automatic renewal

---

## Best Practices

- ✅ Use automatic signing when possible
- ✅ Let Xcode manage profiles
- ✅ Use fastlane match for teams
- ✅ Store CI secrets securely
- ❌ Don't share certificates insecurely
- ❌ Don't commit profiles to git
- ❌ Don't ignore expiration dates
