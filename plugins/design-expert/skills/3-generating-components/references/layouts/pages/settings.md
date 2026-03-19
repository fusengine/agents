---
name: settings
description: Settings page with sidebar navigation and auto-save pattern
when-to-use: Designing settings, preferences, account management pages
keywords: settings, preferences, account, sidebar, auto-save, profile
priority: high
related: profile.md, sidebar.md
---

# Settings Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Left | Settings nav sidebar (w-48) | Tabs on mobile |
| Right | Settings content area (flex-1) | Full width on mobile |
| Content sections | Grouped form fields | Card-based groups |

## Components (shadcn/ui)

- `Tabs` - Mobile navigation between sections
- `Card` - Section containers
- `Input` / `Textarea` - Text fields
- `Switch` - Toggle preferences
- `Select` - Dropdown choices
- `Button` - Save / danger actions
- `Separator` - Section dividers
- `Alert` - Danger zone warnings

## Sections

| Section | Content |
|---------|---------|
| Profile | Avatar, name, bio, email |
| Account | Password change, 2FA, sessions |
| Notifications | Email, push, in-app toggles |
| Billing | Plan, payment method, invoices |
| Security | Active sessions, API keys |
| Danger Zone | Delete account (red border card) |

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --settings-nav-width | 192px (w-48) | Left nav width |
| --settings-content-max | 640px | Content max-width |
| --section-gap | 32px | Between sections |
| --danger-border | var(--error) | Danger zone border |

## Auto-Save Pattern

- Toggle switches: save immediately on change
- Text fields: debounce 1.5s after last keystroke
- Show toast: "Settings saved" with checkmark icon
- Show inline indicator: "Saving..." then "Saved"

## Animation (Framer Motion)

- Section switch: crossfade (200ms)
- Save indicator: fade-in checkmark
- Toast: slide-up from bottom-right
- Danger modal: backdrop fade + scale

## Gemini Design Prompt

```
Create a settings page with left sidebar navigation (Profile, Account, Notifications,
Billing, Security) and right content area. Auto-save toggles with toast confirmation.
Danger zone section at bottom with red border. Use design-system.md tokens.
Mobile: convert sidebar nav to horizontal tabs.
```

## Multi-Stack Adaptation

| Stack | Pattern | Data |
|-------|---------|------|
| Next.js | Nested layout, parallel routes | Server Actions |
| React SPA | Outlet + nested routes | TanStack Query mutations |
| Laravel | Blade sections or Inertia tabs | Controller + validation |

## Validation Checklist

- [ ] Settings nav shows active section
- [ ] Mobile view uses tabs instead of sidebar
- [ ] Auto-save works on toggles (immediate)
- [ ] Text fields debounce save
- [ ] Toast confirms save success
- [ ] Danger zone is visually distinct (red border)
- [ ] Delete account requires confirmation dialog
- [ ] Password change requires current password
