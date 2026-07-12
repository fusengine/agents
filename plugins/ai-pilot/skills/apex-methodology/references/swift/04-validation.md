---
name: 04-validation
description: Verify Swift code with SwiftLint and build validation
prev_step: references/swift/03.5-elicit.md
next_step: references/swift/05-review.md
---

# Swift Code Validation

## Gate — Required Proof Artefacts

**Validation does NOT start** unless both proof files exist on disk for the current task. A claim made in context is not proof — only the file on disk is:

```bash
TASK_SLUG=$(jq -r '.current_task' .claude/apex/task.json)
if [ ! -f ".claude/apex/docs/elicit-${TASK_SLUG}.json" ]; then
  echo "❌ Missing .claude/apex/docs/elicit-${TASK_SLUG}.json — go back to references/swift/03.5-elicit.md first."
  exit 1
fi
if [ ! -f ".claude/apex/docs/verify-${TASK_SLUG}.md" ]; then
  echo "❌ Missing .claude/apex/docs/verify-${TASK_SLUG}.md — go back to the verification skill (runs between eLicit and eXamine) first."
  exit 1
fi
```

Only once both checks pass does this phase proceed.

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

## Fix Discipline (Hypothesis-Driven)

**Fix discipline (hypothesis-driven).** One candidate cause documented before any edit → one atomic change → retest immediately. If it still fails, the hypothesis was wrong: the same fix is FORBIDDEN — run a fresh research round (Context7/apple-docs → Exa) for a new hypothesis. Cap: 3 cycles per error; at the 3rd failure STOP and escalate (`status: fail` + root-cause: what was tried, sources, why each failed). Never stack two unverified corrections. Canonical implementation: sniper's Fix Retry Loop.

## Validation Checklist

- [ ] SwiftLint: zero warnings
- [ ] swift-format: passes
- [ ] No file > 150 lines
- [ ] All public APIs: /// docs
- [ ] No force unwraps
- [ ] All strings localized
- [ ] #Preview for all views

## Update Task Phase

At the **start** of this phase, record it in `.claude/apex/task.json`:

```bash
jq --arg p "validation" '.tasks[.current_task].phase = $p' .claude/apex/task.json \
  > .claude/apex/task.json.tmp && mv .claude/apex/task.json.tmp .claude/apex/task.json
```

## Next Phase

→ Proceed to `05-review.md`
