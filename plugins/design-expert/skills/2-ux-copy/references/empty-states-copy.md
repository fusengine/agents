---
name: empty-states-copy
description: Copy formulas for all empty state types (first-time, no-results, error recovery, permission, onboarding, loading) with per-sector examples
when-to-use: Writing text for empty states, no-data views, error recovery states, permission denied screens
keywords: empty-state, first-time, no-results, error-recovery, permission, onboarding, loading, microcopy
priority: high
related: empty-state.md (page-layouts), voice-tone-sectors.md, microcopy-patterns.md
---

# Empty States Copy

> **Scope**: This file covers text only. For UI layout and component specs, see `page-layouts/references/patterns/empty-state.md`.

---

## First-Time User

**Formula**: `[Welcome title]` + `[Value prop 1 sentence]` + `[Primary CTA]`

| Element | Rule | Example |
|---------|------|---------|
| Title | Acknowledge the blank slate | "No projects yet" |
| Value prop | What they'll get by acting | "Create your first project to start collaborating" |
| CTA | Specific action verb + noun | "Create project" |

**Per-sector examples**:

| Sector | Title | Body | CTA |
|--------|-------|------|-----|
| Fintech | "No accounts yet" | "Set up your first account to start managing finances" | "Create account" |
| Health | "Nothing tracked yet" | "Start logging to see your progress over time" | "Log first entry" |
| E-commerce | "Your cart is empty" | "Explore our collection and find something you love" | "Browse products" |
| Dev Tools | "No deployments yet" | "Push your first commit to get started" | "Deploy" |
| Creative | "Blank canvas." | "Create your first design or start from a template" | "Start designing" |
| Enterprise | "No teams configured yet" | "Add your first team to begin managing access" | "Add team" |
| Education | "No courses started yet" | "Choose a course and begin learning today" | "Browse courses" |

---

## No Results (Filtered / Search)

**Formula**: `[Acknowledge what was searched]` + `[Suggestion]` + `[Alternative CTA]`

| Element | Rule | Example |
|---------|------|---------|
| Title | Reference the search | "No results for \"dashboard\"" |
| Suggestion | Concrete next step | "Try different keywords or browse all templates" |
| CTA | Clear filter / alternative | "Clear filters" |

**Per-sector examples**:

| Sector | Title | Body | CTA |
|--------|-------|------|-----|
| E-commerce | "No products match your filters" | "Try removing a filter or search more broadly" | "Clear filters" |
| Dev Tools | "No matching logs" | "Adjust your time range or filter criteria" | "Reset filters" |
| Education | "No courses match your search" | "Try a different keyword or explore all categories" | "Browse all courses" |

---

## Error Recovery

**Formula**: `[What happened]` + `[Why it happened]` + `[How to fix]` + `[CTA]`

| Element | Rule | Example |
|---------|------|---------|
| Title | Describe what failed | "Couldn't load your projects" |
| Why | Specific cause if known | "Your connection appears to be offline" |
| Fix | Concrete step | "Check your connection and try again" |
| CTA | Retry action | "Try again" |

**Per-sector examples**:

| Sector | Title | Body | CTA |
|--------|-------|------|-----|
| Fintech | "Balance unavailable" | "We couldn't reach your bank. Try again in a moment." | "Retry" |
| Dev Tools | "Build logs unavailable" | "Log service unreachable. Check status page." | "Check status" |
| Health | "Data sync failed" | "Connection lost. Continue offline or try again." | "Retry sync" |
| Enterprise | "Unable to load report" | "Server error. If this persists, contact support." | "Try again" |

---

## Permission Denied

**Formula**: `[What's blocked]` + `[Why blocked]` + `[How to get access]`

| Element | Rule | Example |
|---------|------|---------|
| Title | What they can't access | "Access restricted" |
| Why | Plan level or role | "This feature requires a Pro plan" |
| CTA | Path to access | "Upgrade to Pro" or "Request access" |

**Examples**:

| Cause | Title | Body | CTA |
|-------|-------|------|-----|
| Role | "Admins only" | "You need admin rights to manage billing" | "Request admin access" |
| Plan | "Pro feature" | "Unlock advanced analytics with a Pro plan" | "Upgrade to Pro" |
| Invite | "Private workspace" | "Ask a team member to invite you" | "Request invite" |

---

## Onboarding Progress

**Formula**: `[Step X of Y]` + `[Context]` + `[Encouragement]`

| Step position | Title pattern | Body |
|--------------|--------------|------|
| Start | "Let's get you set up" | "It only takes 3 minutes" |
| Middle | "Step 2 of 4 — Almost there!" | "Just a few more details" |
| End | "You're all set!" | "Your account is ready. Start exploring." |

---

## Success Confirmations

**Rule**: Celebrate briefly, then move forward. No over-celebration.

| Context | Good | Avoid |
|---------|------|-------|
| Project created | "Project created successfully" | "AMAZING! Your project is LIVE!" |
| Settings saved | "Changes saved" | "Wow, great job saving your settings!" |
| Account setup | "You're all set! Head to your dashboard." | "Congratulations on completing setup!" |

---

## Loading States

**Rule**: Context-aware messages. Never just "Please wait."

| Context | Message |
|---------|---------|
| Dashboard | "Loading your dashboard..." |
| Reports | "Fetching your latest data..." |
| File upload | "Uploading file (42%)..." |
| Long operation | "This may take a moment. Hang tight." |
| Fintech | "Securely connecting to your bank..." |
| Dev Tools | "Pulling build logs..." |

---

→ See [voice-tone-sectors.md](voice-tone-sectors.md) for sector personality adjustments
→ See [page-layouts/references/patterns/empty-state.md] for UI layout specs
