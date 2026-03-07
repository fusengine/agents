---
name: page-layouts
description: Use when designing complete pages, navigation systems, or complex UI patterns. Covers dashboards, auth flows, settings, onboarding, and navigation.
versions:
  tailwindcss: "4.1"
  framer-motion: "11"
  shadcn-ui: "2.x"
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Task, mcp__gemini-design__create_frontend, mcp__gemini-design__modify_frontend
references: references/page-architecture.md, references/pages/dashboard.md, references/pages/auth-login.md, references/pages/auth-register.md, references/pages/settings.md, references/pages/onboarding.md, references/pages/error-pages.md, references/pages/profile.md, references/navigation/sidebar.md, references/navigation/navbar.md, references/navigation/footer.md, references/navigation/mobile-nav.md, references/patterns/data-table.md, references/patterns/command-palette.md, references/patterns/modal-dialog.md, references/patterns/toast-notifications.md, references/patterns/empty-state.md, references/handoff-swift.md, references/handoff-livewire.md
related-skills: identity-system, generating-components, motion-system
---

# Page Layouts

## Agent Workflow (MANDATORY)

Before ANY page design, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Find existing layout patterns, navigation, design tokens
2. **fuse-ai-pilot:research-expert** - Verify latest UX research for the page type
3. **design-expert:identity-system** - Ensure design-system.md exists

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Category | Pages/Patterns |
|----------|---------------|
| **Pages** | Dashboard, Auth (login/register), Settings, Onboarding, Error, Profile |
| **Navigation** | Sidebar, Navbar, Footer, Mobile Nav |
| **Patterns** | Data Table, Command Palette, Modal, Toast, Empty State |

---

## Critical Rules

1. **Read design-system.md first** - Never design without identity tokens
2. **Mobile-first** - Every page must be responsive
3. **No dead-ends** - Every error page has a CTA
4. **Never blank** - Use empty states with illustration + CTA
5. **Skeleton loading** - Never show blank content areas
6. **Accessibility** - Focus management, ARIA labels, keyboard nav

---

## Reference Guide

### Pages

| Page | Reference | When to Consult |
|------|-----------|-----------------|
| **Dashboard** | [dashboard.md](references/pages/dashboard.md) | F-pattern, KPIs, charts |
| **Login** | [auth-login.md](references/pages/auth-login.md) | Social login, magic link |
| **Register** | [auth-register.md](references/pages/auth-register.md) | Delayed signup, progressive |
| **Settings** | [settings.md](references/pages/settings.md) | Sidebar nav, auto-save |
| **Onboarding** | [onboarding.md](references/pages/onboarding.md) | Progress bar, steps |
| **Errors** | [error-pages.md](references/pages/error-pages.md) | 404, 500, 403 |
| **Profile** | [profile.md](references/pages/profile.md) | Avatar, inline edit |

### Navigation

| Pattern | Reference | When to Consult |
|---------|-----------|-----------------|
| **Sidebar** | [sidebar.md](references/navigation/sidebar.md) | 3-state sidebar |
| **Navbar** | [navbar.md](references/navigation/navbar.md) | Sticky header |
| **Footer** | [footer.md](references/navigation/footer.md) | 4-col responsive |
| **Mobile Nav** | [mobile-nav.md](references/navigation/mobile-nav.md) | Bottom tabs |

### Patterns

| Pattern | Reference | When to Consult |
|---------|-----------|-----------------|
| **Data Table** | [data-table.md](references/patterns/data-table.md) | TanStack Table |
| **Command Palette** | [command-palette.md](references/patterns/command-palette.md) | Cmd+K |
| **Modal** | [modal-dialog.md](references/patterns/modal-dialog.md) | Dialogs, sheets |
| **Toast** | [toast-notifications.md](references/patterns/toast-notifications.md) | Sonner |
| **Empty State** | [empty-state.md](references/patterns/empty-state.md) | No-data views |

---

## Quick Reference

### Page Architecture

```
Shell (sidebar + navbar)
  -> Page Container (max-width + padding)
    -> Page Header (title + actions)
    -> Page Content (grid / stack)
    -> Page Footer (optional)
```

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| mobile | < 640px | Single column, bottom nav |
| tablet | 640-1024px | Collapsed sidebar |
| desktop | > 1024px | Full sidebar + content |

---

## Best Practices

### DO
- Read design-system.md before any page design
- Use skeleton loading for async content
- Provide empty states for all data views
- Test with keyboard-only navigation
- Use Gemini Design for page generation

### DON'T
- Leave blank/dead-end pages
- Skip mobile responsive design
- Use spinners instead of skeletons
- Nest modals inside modals
- Forget focus management on navigation
