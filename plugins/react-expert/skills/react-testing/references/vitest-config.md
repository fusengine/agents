---
name: vitest-config
description: Vitest configuration options for React testing
when-to-use: Configuring test runner, coverage, globals
keywords: vitest, config, coverage, globals, environment
priority: medium
related: installation.md, templates/basic-setup.md
---

# Vitest Configuration

## Why Vitest

| Feature | Benefit |
|---------|---------|
| Speed | 10-20x faster than Jest |
| ESM native | Full ES modules support |
| Vite compatible | Shared config |
| UI mode | Visual test runner |

---

## Key Options

| Option | Purpose |
|--------|---------|
| `globals` | No need to import test/expect |
| `environment` | jsdom for React |
| `setupFiles` | Run before each test file |
| `css` | Enable CSS processing |

---

## Coverage Options

| Option | Purpose |
|--------|---------|
| `provider` | v8 (fast) or istanbul |
| `reporter` | text, json, html |
| `thresholds` | Minimum coverage % |
| `exclude` | Files to skip |

---

## Test Filtering

| Command | Purpose |
|---------|---------|
| `vitest` | Watch mode |
| `vitest run` | Single run |
| `vitest --ui` | Visual UI |
| `vitest --coverage` | With coverage |

---

## TypeScript Config

Add to `tsconfig.json`:

```json
{
  "types": ["vitest/globals", "@testing-library/jest-dom"]
}
```

---

## Where to Find Code?

→ `templates/basic-setup.md` - Complete vitest.config.ts
