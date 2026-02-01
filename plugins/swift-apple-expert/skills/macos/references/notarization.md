---
name: notarization
description: macOS code signing, notarization, and distribution outside App Store
when-to-use: distributing Mac apps, signing for Gatekeeper, creating DMG, notarizing apps
keywords: notarization, code signing, Gatekeeper, DMG, stapler, notarytool
priority: high
requires: build-tools.md
related: app-structure.md
---

# macOS Notarization

## When to Use

- Distributing outside Mac App Store
- Creating signed DMG installers
- Ensuring Gatekeeper approval
- Enterprise distribution

## Key Concepts

### Code Signing
Cryptographically sign app to verify identity.

**Requirements:**
- Developer ID certificate
- Valid Apple Developer account
- Hardened Runtime enabled

### Notarization
Apple scans and approves app for Gatekeeper.

**Process:**
1. Sign app with Developer ID
2. Upload to Apple's notary service
3. Apple scans for malware
4. Receive notarization ticket
5. Staple ticket to app

### Stapling
Attach notarization ticket to app bundle.

**Benefits:**
- Works offline after stapling
- Faster Gatekeeper check
- DMG can be stapled too

---

## Notarization Workflow

### 1. Store Credentials
```bash
xcrun notarytool store-credentials "notary-profile" \
  --apple-id "dev@company.com" \
  --team-id "XXXXXXXXXX" \
  --password "@keychain:AC_PASSWORD"
```

### 2. Submit for Notarization
```bash
xcrun notarytool submit ./MyApp.dmg \
  --keychain-profile "notary-profile" \
  --wait
```

### 3. Staple Ticket
```bash
xcrun stapler staple ./MyApp.dmg
```

---

## DMG Creation

```bash
# Create DMG from app
hdiutil create -volname "MyApp" \
  -srcfolder ./MyApp.app \
  -ov -format UDZO \
  ./MyApp.dmg

# Sign DMG
codesign --sign "Developer ID Application: ..." \
  ./MyApp.dmg
```

---

## Verification

```bash
# Check code signing
codesign -dvvv MyApp.app

# Check notarization
spctl -a -vvv MyApp.app

# Check stapling
stapler validate MyApp.dmg
```

---

## Best Practices

- ✅ Enable Hardened Runtime
- ✅ Sign all executables and frameworks
- ✅ Notarize before distribution
- ✅ Staple for offline verification
- ✅ Test on clean Mac
- ❌ Don't skip notarization
- ❌ Don't distribute unsigned apps
- ❌ Don't ignore Gatekeeper warnings
