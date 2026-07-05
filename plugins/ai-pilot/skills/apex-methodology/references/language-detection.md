---
name: language-detection
description: Auto-detection rules and per-framework reference directory structure for APEX
---

# Language-Specific References

Framework-specific APEX methodology guides:

| Framework | Directory | Tools |
| --- | --- | --- |
| **Laravel** | `references/laravel/` | Pest, Larastan, Pint |
| **Next.js** | `references/nextjs/` | Vitest, Playwright, ESLint |
| **React** | `references/react/` | Vitest, Testing Library, Biome |
| **Swift** | `references/swift/` | XCTest, SwiftLint, swift-format |

## Auto-Detection

```text
Project Type        → References Used
─────────────────────────────────────
composer.json       → references/laravel/
next.config.*       → references/nextjs/
vite.config.*       → references/react/
Package.swift       → references/swift/
Default             → references/ (generic)
```

## Structure (Each Framework)

```text
references/[framework]/
├── 00-init-branch.md     # Framework-specific branching
├── 01-analyze-code.md    # Framework exploration tools
├── 02-features-plan.md   # Planning patterns
├── 03-execution.md       # SOLID implementation
├── 04-validation.md      # Linters and formatters
├── 05-review.md          # Framework checklist
├── 06-fix-issue.md       # Common fixes
├── 07-add-test.md        # Testing patterns
├── 08-check-test.md      # Test commands
└── 09-create-pr.md       # PR template
```

## Generic Reference Files

All detailed guides in `references/` directory:

```text
references/
├── 00-init-branch.md     # Branch creation
├── 01-analyze-code.md    # Code analysis
├── 02-features-plan.md   # Planning
├── 03-execution.md       # Implementation
├── 04-validation.md      # Validation
├── 05-review.md          # Self-review
├── 06-fix-issue.md       # Issue fixes
├── 07-add-test.md        # Test writing
├── 08-check-test.md      # Test running
└── 09-create-pr.md       # PR creation
```
