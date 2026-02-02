---
name: encryption
description: Laravel Encryption - encrypting/decrypting sensitive data with AES-256
when-to-use: Consult when storing sensitive data (API keys, tokens, PII)
keywords: laravel, encryption, crypt, decrypt, aes, sensitive, data
priority: medium
related: hashing.md, session.md
---

# Encryption

## What is Laravel Encryption?

Laravel provides symmetric encryption using AES-256-CBC with OpenSSL. Unlike hashing (one-way), encryption is **reversible** - you can decrypt data back to its original form.

**Use encryption for:** Data you need to read back (API keys, tokens, sensitive user data)
**Use hashing for:** Data you only need to verify (passwords)

---

## How It Works

1. **APP_KEY** in `.env` is your encryption key
2. `Crypt::encryptString()` encrypts data
3. Data is signed with MAC (Message Authentication Code)
4. `Crypt::decryptString()` decrypts and verifies MAC
5. Tampered data throws `DecryptException`

The MAC prevents attackers from modifying encrypted data.

---

## When to Use Encryption

| Data Type | Encryption | Hashing |
|-----------|-----------|---------|
| Passwords | ❌ | ✅ Hash::make() |
| API keys | ✅ | ❌ |
| OAuth tokens | ✅ | ❌ |
| Credit card tokens | ✅ | ❌ |
| User PII (optional) | ✅ | ❌ |

---

## Key Methods

```php
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString($apiKey);

// Decrypt
$decrypted = Crypt::decryptString($encrypted);
```

Always wrap decryption in try/catch:
```php
try {
    $value = Crypt::decryptString($encrypted);
} catch (DecryptException $e) {
    // Data tampered or wrong key
}
```

---

## Key Rotation

When rotating `APP_KEY`, old encrypted data becomes unreadable. Use `APP_PREVIOUS_KEYS` for graceful rotation:

```env
APP_KEY="base64:newkey..."
APP_PREVIOUS_KEYS="base64:oldkey..."
```

Laravel tries current key first, then previous keys.

---

## Automatic Encryption

Laravel automatically encrypts:
- Session data (when using cookie driver)
- Cookies
- XSRF tokens

No manual encryption needed for these.

---

## Security Considerations

1. **Never expose APP_KEY** - Treat like a password
2. **Generate with artisan** - `php artisan key:generate`
3. **Different keys per environment** - Dev ≠ Production
4. **Backup keys** - Lost key = lost data
5. **Use for reversible data only** - Hash passwords instead
