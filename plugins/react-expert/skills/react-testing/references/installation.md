---
name: installation
description: Setup Vitest + React Testing Library + MSW for React 19
when-to-use: Setting up testing in a new React project
keywords: install, setup, vitest, msw, jsdom, configuration
priority: high
related: vitest-config.md, msw-setup.md, templates/basic-setup.md
---

# Installation & Setup

## Why This Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (10-20x faster than Jest) |
| @testing-library/react | User-centric component testing |
| @testing-library/user-event | Realistic user interactions |
| MSW | API mocking at network level |
| jsdom | Browser environment simulation |

---

## Package Versions (2026)

| Package | Version |
|---------|---------|
| `vitest` | 5.0.2+ |
| `@testing-library/react` | 16.3.3+ |
| `@testing-library/user-event` | 14.6.7+ |
| `msw` | 2.15.0+ |

**Vitest 5** requires Vite ≥ 6.4.0 and Node.js ≥ 22.12.0 (`vite` is now a peer dependency — Yarn users add it explicitly). `clearMocks` defaults to `true`, and `vi.mock` / `vi.hoisted` outside the module top level now throw.

---

## Project Structure

```
src/
├── components/__tests__/   # Component tests
├── hooks/__tests__/        # Hook tests
├── mocks/                  # MSW handlers
└── test/setup.ts           # Vitest setup
```

---

## Three Files Needed

1. `vitest.config.ts` - Test runner config
2. `src/test/setup.ts` - Environment setup
3. `src/mocks/server.ts` - MSW server (optional)

---

## npm Scripts

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

---

## Where to Find Code?

→ `templates/basic-setup.md` - Complete configuration files
→ `vitest-config.md` - Vitest options explained
→ `msw-setup.md` - MSW configuration
