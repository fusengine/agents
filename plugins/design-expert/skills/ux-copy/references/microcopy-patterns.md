---
name: microcopy-patterns
description: CTA patterns, conversion words, form labels, validation, toasts, and button states for UI copy
when-to-use: Writing button labels, form labels, validation messages, toast notifications, and inline microcopy
keywords: microcopy, cta, conversion, form-labels, validation, toast, button-states
priority: high
related: voice-tone-sectors.md, empty-states-copy.md, cta-guidelines.md
---

# Microcopy Patterns

## CTA Patterns

| Context | Examples | Research note |
|---------|----------|---------------|
| **Primary** | "Get started", "Create project", "Start free trial" | Action verb + noun; +28% conversion vs generic |
| **Secondary** | "Learn more", "View details", "See pricing" | Exploratory, lower urgency |
| **Destructive** | "Delete account", "Cancel subscription", "Remove data" | Explicit + irreversible warning required |
| **Link** | "Forgot password?", "Need help?", "View all" | Minimal styling, no urgency |

---

## Conversion Words

### DO use

| Verb | Use case |
|------|----------|
| **Get** | "Get my free trial", "Get access" — personal ownership |
| **Start** | "Start for free", "Start building" — low barrier |
| **Create** | "Create project", "Create account" — specific action |
| **Download** | "Download now", "Download report" — clear deliverable |
| **Try** | "Try for free", "Try it now" — low commitment |
| **Join** | "Join free", "Join 10k teams" — community |
| **Discover** | "Discover features" — exploratory, curiosity |

### DON'T use

| Avoid | Replace with |
|-------|-------------|
| **Submit** | "Save", "Send message", "Create account" |
| **Click here** | Describe destination: "View documentation" |
| **Next** | Name the step: "Add your details", "Set up billing" |
| **Continue** | "Save and continue", "Keep going" |
| **Send** | "Send message", "Send invite" (OK) or "Submit form" (avoid) |
| **Yes / No** | Name the action: "Delete project" / "Keep project" |

---

## Form Labels

| Rule | Do | Don't |
|------|-----|-------|
| Always visible label | `<label>` above input | Placeholder-only |
| Helper text = WHY | "Used to send password resets" | "Enter email" |
| Helper text position | Above input, before typing | Shown only on error |
| Validation trigger | On blur (field exit) | On submit only |
| Success format | Green check + "Looks good!" | Silent |
| Error format | Red + specific fix | "Invalid input" |

---

## Validation Messages

| Type | Format | Example |
|------|--------|---------|
| Error | What's wrong + how to fix | "Email already in use. Try signing in instead." |
| Error | What's wrong + specific rule | "Password must be 8+ characters with one number." |
| Success | Confirm + reassure | "Email verified. You're all set!" |
| Warning | What will happen + action | "Unsaved changes. Save before leaving?" |

---

## Toast / Notification Templates

| Type | Title | Body (optional) | Duration |
|------|-------|-----------------|----------|
| **Success** | "Changes saved" | "Your profile has been updated" | 5s |
| **Error** | "Payment failed" | "Card declined. Update payment method." | 10s + action |
| **Warning** | "Trial ends in 3 days" | "Upgrade to keep your data" | 8s |
| **Info** | "New feature available" | "Try our updated dashboard" | 5s |

---

## Button States

| State | Pattern | Example |
|-------|---------|---------|
| **Default** | Action verb + noun | "Save settings" |
| **Loading** | Verb + "-ing..." | "Saving...", "Deploying...", "Uploading..." |
| **Disabled** | Tooltip explains why | `title="Complete profile to continue"` |
| **Success** | Momentary confirmation | "Saved!" (revert after 2s) |
| **Destructive** | Explicit + irreversible | "Delete permanently" |

---

→ See [voice-tone-sectors.md](voice-tone-sectors.md) for sector-specific CTA personality
→ See [empty-states-copy.md](empty-states-copy.md) for full empty state copy formulas
