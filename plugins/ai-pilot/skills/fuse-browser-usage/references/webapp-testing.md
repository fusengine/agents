---
name: webapp-testing
description: "Webapp testing profile for agents that code — drive a running dev server, assert zero console errors, check network, then interact. COMPLEMENT to unit/E2E tests, never a replacement."
keywords: browser_open, navigate, console, network, browser_act, dev server, functional check
related: research-docs, visual-design
---

# Profile: Webapp Testing (live session)

For agents that just wrote code and must prove it runs. This is **functional verification**, a COMPLEMENT to unit/integration/E2E suites — it never replaces them. Run the automated tests first; use this to observe the app actually working in a browser.

## The loop (one session, always closed)

```
1. browser_open                     → get sessionId (once)
2. browser_navigate { sessionId, url: "http://localhost:3000/..." }
3. browser_console { sessionId }    → assert ZERO errors
4. browser_network { sessionId }    → check failed requests / 4xx-5xx
5. browser_screenshot { sessionId } → eyeball the rendered state
6. browser_act { sessionId, ... }   → interactions (click, fill, submit)
   → repeat 3-5 after each interaction that changes state
7. browser_close { sessionId }      → ALWAYS, even on failure
```

## Concrete calls

Open once, point at the local dev server:
```
browser_open { }
browser_navigate { sessionId, url: "http://localhost:5173/login" }
```

Assert no runtime errors after render and after each interaction:
```
browser_console { sessionId }   // fail the check if any error entry
browser_network { sessionId }   // fail on unexpected non-2xx
```

Interact (form fill + submit) via natural-language act:
```
browser_act { sessionId, action: "fill the email field with test@ex.com and submit the form" }
```

Then re-check console + network + screenshot to confirm the new state.

## Rules

- **Zero console errors** is the pass bar. A clean screenshot with console errors is a FAIL.
- Point at the **dev server** (localhost), not production.
- Reuse the single `sessionId` for every step; never `browser_open` twice.
- `browser_close` in all exit paths — success, assertion failure, or exception.
- Security/runtime cross-checks: add `browser_cookies` for auth/session flags when relevant.
- This proves behaviour end-to-end; it does not certify coverage. Keep the unit/E2E tests.
