---
name: testflight
description: TestFlight beta testing with internal and external testers
when-to-use: beta testing apps, distributing to testers, collecting feedback
keywords: TestFlight, beta, testing, internal tester, external tester, App Store Connect
priority: high
requires: code-signing.md
related: app-store.md
---

# TestFlight Beta Testing

## When to Use

- Beta testing before release
- Internal team testing
- External user testing
- Collecting crash reports
- Gathering feedback

## Key Concepts

### Internal Testers
App Store Connect users (up to 100).

**Key Points:**
- No review required
- Immediate access
- All builds available
- Must have App Store Connect role

### External Testers
Public beta (up to 10,000).

**Key Points:**
- Beta App Review required (first build)
- Public link option
- Groups for organization
- 90-day expiration

### Build Distribution

| Channel | Review | Limit | Speed |
|---------|--------|-------|-------|
| Internal | None | 100 | Immediate |
| External | First build | 10,000 | 24-48h first |

---

## Upload Process

### Via Xcode

1. Archive (Product → Archive)
2. Distribute App → App Store Connect
3. Select Upload
4. Wait for processing

### Via CLI

```bash
# Upload via altool
xcrun altool --upload-app \
  -f MyApp.ipa \
  -t ios \
  -u "dev@company.com" \
  -p "@keychain:AC_PASSWORD"

# Or via xcrun
xcrun notarytool submit MyApp.ipa \
  --keychain-profile "profile"
```

### Via fastlane

```ruby
lane :beta do
  build_app(scheme: "MyApp")
  upload_to_testflight(groups: ["Beta Testers"])
end
```

---

## Build Processing

**Timeline:**
- Upload: Few minutes
- Processing: 15-30 minutes
- Internal: Immediate after processing
- External review: 24-48 hours (first build)

---

## Feedback Collection

**Built-in:**
- Crash reports
- Screenshots with feedback
- TestFlight feedback form

**Best Practices:**
- Include feedback instructions
- Monitor crash reports
- Respond to feedback

---

## Best Practices

- ✅ Test internally first
- ✅ Use groups to organize testers
- ✅ Increment build number each upload
- ✅ Write clear "What to Test" notes
- ✅ Monitor feedback and crashes
- ❌ Don't skip beta testing
- ❌ Don't ignore crash reports
- ❌ Don't distribute untested builds
