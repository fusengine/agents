---
name: hashing
description: Laravel Hashing - secure password hashing with Bcrypt/Argon2
when-to-use: Consult when storing passwords, verifying credentials
keywords: laravel, hash, password, bcrypt, argon2, verify, security
priority: high
related: authentication.md, encryption.md
---

# Hashing

## What is Password Hashing?

Hashing converts passwords into irreversible strings. Unlike encryption, you **cannot** recover the original password from a hash - you can only verify if a given password matches.

**Use hashing for:** Passwords, security answers
**Use encryption for:** Data you need to read back (see [encryption.md](encryption.md))

---

## How It Works

1. User creates password: `"MyP@ssw0rd"`
2. `Hash::make()` generates hash with random salt
3. Hash stored in database (60+ characters)
4. On login, `Hash::check()` compares password to hash
5. Match → authenticated

The salt ensures identical passwords produce different hashes.

---

## Supported Algorithms

| Algorithm | Pros | Default |
|-----------|------|---------|
| **Bcrypt** | Battle-tested, adjustable work factor | ✅ Yes |
| **Argon2i** | Memory-hard, resists GPU attacks | No |
| **Argon2id** | Hybrid, best protection | No |

Configure in `.env`:
```env
HASH_DRIVER=bcrypt
```

---

## Key Methods

```php
use Illuminate\Support\Facades\Hash;

// Hash a password
$hashed = Hash::make('password');

// Verify password matches hash
if (Hash::check('password', $hashed)) {
    // Passwords match
}

// Check if rehash needed (algorithm changed)
if (Hash::needsRehash($hashed)) {
    $hashed = Hash::make('password');
}
```

---

## Automatic Hashing

Laravel 11+ supports automatic hashing via cast:

```php
protected function casts(): array
{
    return [
        'password' => 'hashed',
    ];
}
```

With this cast, assigning to `password` automatically hashes it.

---

## Work Factor

Higher work factor = slower hashing = more secure (brute force protection).

**Bcrypt:**
```php
Hash::make('password', ['rounds' => 12]); // Default: 10
```

**Argon2:**
```php
Hash::make('password', [
    'memory' => 1024,
    'time' => 2,
    'threads' => 2,
]);
```

Increase as hardware improves.

---

## Security Best Practices

1. **Never store plain passwords** - Always hash
2. **Use `Hash::check()`** - Don't compare hashes directly
3. **Enable rehashing** - Check `needsRehash()` on login
4. **Bcrypt is fine** - Don't overthink algorithm choice
5. **Min password length** - Enforce 8+ characters

---

## Common Mistakes

| Mistake | Correct Approach |
|---------|-----------------|
| MD5/SHA1 for passwords | Use Hash::make() |
| Encrypting passwords | Hash, don't encrypt |
| Same hash for same password | Normal - bcrypt adds salt |
| Comparing hashes with `===` | Use Hash::check() |
