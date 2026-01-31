---
name: testing
description: Testing i18n components - mocking, test utilities, multi-language tests
when-to-use: unit tests, integration tests, testing translated components
keywords: testing, mock, vitest, jest, testing-library
priority: medium
related: templates/testing-i18n.md
---

# Testing i18n

## Mock i18n Setup

**Create test-specific i18n instance.**

### Purpose
- Isolated test environment
- Predictable translations
- Fast test execution

### When to Use
- All component tests
- Integration tests
- Snapshot testing

### Key Points
- Minimal mock resources
- Sync initialization
- No HTTP backend
- No language detection

---

## Test Utilities

**Custom render with i18n provider.**

### Purpose
- Wrap components with providers
- Consistent test setup
- Language switching in tests

### When to Use
- All component tests
- Testing translated output
- Multi-language verification

### Key Points
- Custom render function
- I18nextProvider wrapper
- Suspense wrapper
- Locale parameter option

---

## Testing Patterns

| Pattern | Purpose |
|---------|---------|
| Translated text | Verify correct translation displayed |
| Interpolation | Test dynamic values in translations |
| Pluralization | Test count-based messages |
| Language switch | Verify UI updates on language change |
| Missing keys | Test fallback behavior |

---

## Multi-Language Tests

**Verify translations in multiple languages.**

### Purpose
- Catch missing translations
- Verify all locales work
- Regression prevention

### When to Use
- Critical user flows
- Smoke tests
- CI/CD pipeline

### Key Points
- Parameterized tests
- Same assertions, different locales
- Snapshot per language
- Separate test runs optional

---

## Snapshot Testing

**Capture translated component output.**

### Purpose
- Detect unintended changes
- Document expected output
- Quick regression detection

### When to Use
- Stable components
- Visual regression
- Translation changes

### Key Points
- Snapshot per locale
- Clear file naming
- Update intentionally
- Review changes carefully

---

→ See `templates/testing-i18n.md` for complete test setup
