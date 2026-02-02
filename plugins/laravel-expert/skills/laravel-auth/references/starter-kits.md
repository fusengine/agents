---
name: starter-kits
description: Laravel Starter Kits - scaffolded auth with React, Vue, Livewire
when-to-use: Consult when starting new Laravel app, choosing auth scaffolding
keywords: laravel, starter, kit, breeze, jetstream, react, vue, livewire
priority: medium
requires: fortify.md
related: authentication.md
---

# Starter Kits

## What are Starter Kits?

Starter kits provide complete authentication scaffolding:
- Registration, login, logout
- Password reset, email verification
- Profile management
- Two-factor authentication
- Ready-to-customize UI

**Key insight**: They use Fortify internally for backend logic.

---

## Available Kits

| Kit | Frontend | UI Components |
|-----|----------|--------------|
| **React** | Inertia + React 19 | shadcn/ui |
| **Vue** | Inertia + Vue 3 | shadcn-vue |
| **Livewire** | Livewire 3 | Flux UI |

All include TypeScript and Tailwind CSS.

---

## When to Use Starter Kits?

| Scenario | Recommendation |
|----------|---------------|
| New project | ✅ Use starter kit |
| Need quick auth | ✅ Use starter kit |
| Custom design | Use kit, then customize |
| API-only backend | Use Fortify directly |
| Existing project | Manual integration |

---

## Installation

```shell
laravel new my-app
# Installer prompts for kit selection

cd my-app
npm install && npm run build
composer run dev
```

---

## Directory Structure

**React/Vue (Inertia):**
```
resources/js/
├── components/    # Reusable UI components
├── layouts/       # Page layouts
├── pages/         # Route components
└── types/         # TypeScript types
```

**Livewire:**
```
resources/views/
├── components/    # Blade components
├── livewire/      # Livewire pages
└── partials/      # Shared partials
```

---

## Layout Variants

Each kit includes multiple layouts:

**App Layout:**
- Sidebar (default)
- Header

**Auth Layout:**
- Simple
- Card
- Split

Change by modifying layout imports.

---

## Two-Factor Authentication

Enabled by default in all kits:

```php
// config/fortify.php
Features::twoFactorAuthentication([
    'confirm' => true,
    'confirmPassword' => true,
]);
```

Uses TOTP (authenticator apps like Google Authenticator).

---

## WorkOS AuthKit Option

Alternative to built-in auth with:
- Social login (Google, Microsoft, GitHub, Apple)
- Passkeys
- Magic links
- SSO

Free up to 1M monthly users.

---

## Adding Components

```shell
# React
npx shadcn@latest add button

# Vue
npx shadcn-vue@latest add button
```

---

## Customization Philosophy

Starter kits give you **full ownership** of the code:
- All files are in your project
- Modify anything you need
- No package updates to worry about
