# Swift Code Validation

## SwiftLint Configuration (.swiftlint.yml)

```yaml
included: [Sources, Tests]
excluded: [Pods, .build, DerivedData]

disabled_rules: [trailing_whitespace, todo]
opt_in_rules: [empty_count, closure_spacing, modifier_order]

line_length:
  warning: 120
  error: 150
file_length:
  warning: 100
  error: 150
identifier_name:
  min_length: 2
  excluded: [id, x, y]

reporter: "xcode"
```

## Running SwiftLint

```bash
swiftlint                    # Lint all
swiftlint --fix              # Auto-fix
swiftlint --strict           # Warnings as errors
swiftlint analyze --compiler-log-path build.log  # Deep analysis
```

## swift-format Configuration (.swift-format)

```json
{
  "version": 1,
  "lineLength": 120,
  "indentation": { "spaces": 4 },
  "rules": {
    "AlwaysUseLowerCamelCase": true,
    "NeverForceUnwrap": true,
    "OrderedImports": true
  }
}
```

## Running swift-format

```bash
swift-format -i Sources/**/*.swift  # Format
swift-format lint --strict Sources/ # Check
```

## Xcode Build Validation

```bash
xcodebuild build -scheme MyApp \
  -destination "platform=iOS Simulator,name=iPhone 16" \
  CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```

## Pre-commit Hook

```bash
#!/bin/sh
swiftlint --strict && swift-format lint --strict Sources/
```

## Validation Checklist

- [ ] SwiftLint: zero warnings
- [ ] swift-format: passes
- [ ] No file > 150 lines
- [ ] All public APIs: /// docs
- [ ] No force unwraps
- [ ] All strings localized
- [ ] #Preview for all views
