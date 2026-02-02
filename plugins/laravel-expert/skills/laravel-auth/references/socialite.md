---
name: socialite
description: Laravel Socialite - OAuth social authentication
when-to-use: Consult when implementing social login (Google, GitHub, etc.)
keywords: laravel, socialite, oauth, social, login, github, google
priority: medium
requires: authentication.md
related: fortify.md
---

# Laravel Socialite

## What is Socialite?

Socialite handles OAuth authentication with social providers - letting users "Sign in with Google/GitHub/etc." instead of creating passwords.

**Built-in providers:** Facebook, X (Twitter), LinkedIn, Google, GitHub, GitLab, Bitbucket, Slack

**100+ more via:** [socialiteproviders.com](https://socialiteproviders.com/)

→ See [templates/SocialiteController.php.md](templates/SocialiteController.php.md) for code

---

## How OAuth Social Login Works

1. **User clicks** "Sign in with GitHub"
2. **Your app redirects** to GitHub's OAuth page
3. **User approves** access on GitHub
4. **GitHub redirects** back with authorization code
5. **Your app exchanges** code for user data
6. **You create/login** user in your database

Socialite handles steps 2-5; you handle 1 and 6.

---

## Two Routes Required

Every social provider needs two routes:

1. **Redirect route** - Sends user to provider
2. **Callback route** - Handles return from provider

```php
// Redirect to provider
Route::get('/auth/{provider}/redirect', ...);

// Handle callback
Route::get('/auth/{provider}/callback', ...);
```

---

## User Data Available

After callback, you get user info:

| Method | Returns |
|--------|---------|
| `$user->getId()` | Provider's user ID |
| `$user->getName()` | Full name |
| `$user->getEmail()` | Email (may be null!) |
| `$user->getAvatar()` | Profile picture URL |
| `$user->getNickname()` | Username |

**Important**: Some providers don't share email. Handle this case!

---

## Linking Social to Local Users

Common pattern:

1. Check if user exists by `provider` + `provider_id`
2. If exists: login
3. If not: create user, then login

Store both the provider name and provider's user ID to link accounts.

---

## Requesting Additional Permissions

By default, Socialite requests minimal permissions. Request more with scopes:

```php
Socialite::driver('github')
    ->scopes(['read:user', 'repo'])
    ->redirect();
```

Each provider has different available scopes.

---

## Stateless Mode (For APIs)

For API-only apps without sessions:

```php
$user = Socialite::driver('github')
    ->stateless()
    ->user();
```

Required when your app doesn't use sessions.

---

## Common Issues

1. **Missing email**: Some providers require explicit scope
2. **Callback URL mismatch**: Must match exactly in provider settings
3. **HTTPS required**: Most providers require HTTPS in production

→ Full implementation: [templates/SocialiteController.php.md](templates/SocialiteController.php.md)
