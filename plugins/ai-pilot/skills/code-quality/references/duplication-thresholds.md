---
name: duplication-thresholds
description: Per-language duplication thresholds and jscpd configuration for DRY detection
when-to-use: Running Phase 3.5 DRY detection, configuring jscpd thresholds
keywords: duplication, DRY, jscpd, threshold, copy-paste
priority: high
related: linter-commands.md
---

# Duplication Thresholds by Language

## Tool: jscpd (150+ languages)

```bash
# Install
npm install -g jscpd

# Or use without install
npx jscpd ./src
```

---

## Per-Language Thresholds

| Language | threshold% | min-tokens | min-lines | Rationale |
|----------|-----------|------------|-----------|-----------|
| TypeScript | 3 | 50 | 5 | Low structural boilerplate |
| JavaScript | 3 | 50 | 5 | Same as TypeScript |
| Python | 3 | 50 | 5 | Concise syntax |
| Go | 5 | 70 | 6 | Verbose error handling idioms |
| PHP | 5 | 50 | 5 | Framework patterns allowed |
| Rust | 3 | 50 | 5 | Compiler enforces uniqueness |
| Java | 10 | 100 | 10 | Getters/setters boilerplate |
| Ruby | 5 | 50 | 5 | Metaprogramming reduces duplication |
| C/C++ | 10 | 100 | 10 | Header guards, macros |
| Swift | 5 | 50 | 5 | Extensions and protocols |

---

## Industry Standards

| Level | Duplication % | Grade | Action |
|-------|--------------|-------|--------|
| 🟢 Excellent | < 3% | A | No action |
| 🟡 Good | 3-5% | B | Document, fix if time |
| 🟠 Acceptable | 5-10% | C | Extract shared logic |
| 🔴 Critical | > 10% | D | Mandatory refactoring |
| 🔴 Severe | > 20% | E | Architecture review needed |

---

## Recommended .jscpd.json Config

```json
{
  "$schema": "https://json.schemastore.org/jscpd.json",
  "threshold": 5,
  "minLines": 5,
  "minTokens": 50,
  "maxLines": 1000,
  "maxSize": "100kb",
  "mode": "mild",
  "reporters": ["console", "json"],
  "output": "/tmp/jscpd/",
  "ignore": [
    "**/node_modules/**",
    "**/.git/**",
    "**/vendor/**",
    "**/dist/**",
    "**/build/**",
    "**/target/**",
    "**/*.min.js",
    "**/__snapshots__/**",
    "**/*.lock"
  ],
  "gitignore": true
}
```

---

## DRY Extraction Patterns

### When to extract
- Same logic block appears in 2+ files
- Similar function signatures with same body
- Copy-pasted validation rules
- Repeated API call patterns

### How to extract
```
❌ BEFORE (duplicated in auth.ts + profile.ts):
  validateEmail(email) { ... same 10 lines ... }

✅ AFTER (shared utility):
  validators/email.validator.ts → validateEmail()
  auth.ts → import { validateEmail }
  profile.ts → import { validateEmail }
```

### What NOT to extract
- Structural similarity (imports, exports, class shells)
- Test setup/teardown boilerplate
- Framework-required patterns (Go error handling, Java getters)
- Config files with similar structures
