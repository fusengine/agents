---
title: "Field Encryption"
description: "Encrypt sensitive fields at rest, encryption strategies, and implementation"
tags: ["security", "encryption", "sensitive-data", "at-rest"]
---

# Field Encryption

Encrypt sensitive data at rest in the database to protect against unauthorized access.

## Encryption Approaches

### Application-Level Encryption

Encrypt in your application before storing in database:

```typescript
import crypto from 'crypto';

/**
 * Encrypt sensitive field
 */
function encryptField(value: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    iv
  );

  const encrypted = cipher.update(value, 'utf8', 'hex');
  return iv.toString('hex') + ':' + encrypted + cipher.final('hex');
}

/**
 * Decrypt sensitive field
 */
function decryptField(encrypted: string, key: string): string {
  const [iv, data] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex')
  );

  return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
}
```

### Using Prisma Client Extensions

`$use` middleware was removed in Prisma 7 — use a `query` extension:

```typescript
import { PrismaClient } from './generated/prisma/client'; // v7: generated path
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const key = process.env.ENCRYPTION_KEY!;

export const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      // Encrypt before create
      async create({ args, query }) {
        if (args.data.ssn) {
          args.data.ssn = encryptField(args.data.ssn, key);
        }
        return query(args);
      },
      // Decrypt after read
      async findUnique({ args, query }) {
        const user = await query(args);
        if (user?.ssn) user.ssn = decryptField(user.ssn, key);
        return user;
      },
      async findMany({ args, query }) {
        const users = await query(args);
        for (const user of users) {
          if (user.ssn) user.ssn = decryptField(user.ssn, key);
        }
        return users;
      },
    },
  },
});
```

## Database-Level Encryption

### PostgreSQL pgcrypto Extension

```sql
-- Install extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table with encryption
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  ssn TEXT
);

-- Encrypt on insert
INSERT INTO users (email, ssn)
VALUES ('user@example.com', pgp_sym_encrypt('123-45-6789', 'secret_key'));

-- Decrypt on read
SELECT email, pgp_sym_decrypt(ssn, 'secret_key') FROM users;
```

### Using pgcrypto with Prisma

```typescript
const user = await prisma.$queryRaw`
  SELECT
    id,
    email,
    pgp_sym_decrypt(ssn, ${encryptionKey})::text as ssn
  FROM users
  WHERE id = ${userId}
`;
```

## Encryption Keys

### Environment Variable Management

```bash
# .env
ENCRYPTION_KEY="your-256-bit-hex-key-here"
```

### Generate Secure Key

```typescript
import crypto from 'crypto';

// Generate 256-bit key
const key = crypto.randomBytes(32).toString('hex');
console.log(key);
// Save to environment variable
```

## Sensitive Fields Pattern

```prisma
// schema.prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  ssn       String  @db.Text  // Store encrypted
  apiKey    String  @db.Text  // Store encrypted
  password  String            // Hash, not encrypt
}
```

## Best Practices

- **Encrypt sensitive data** - SSN, API keys, payment info
- **Never encrypt passwords** - Use hashing instead
- **Secure key storage** - Use secrets management service
- **Rotate encryption keys** - Plan key rotation strategy
- **Use strong algorithms** - AES-256 minimum
- **Generate random IVs** - For each encrypted value

## SOLID Architecture Integration

### Module Path
`app/lib/security/encryption.ts`

### Type Definition
```typescript
/**
 * Encryption operation types
 * @module app/lib/security/types
 */

/**
 * Encrypted data with IV and metadata
 */
export type EncryptedData = {
  /** IV prepended to cipher text */
  encrypted: string;
  /** Algorithm used */
  algorithm: 'aes-256-cbc';
  /** When data was encrypted */
  encryptedAt: Date;
};

/**
 * Encryption/decryption result
 */
export type CryptoResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Safe Implementation
```typescript
/**
 * Secure field encryption/decryption
 * @module app/lib/security/crypto-service
 */

import crypto from 'crypto';
import { Prisma } from '@/lib/generated/prisma/client'; // v7: generated path
import type { EncryptedData, CryptoResult } from './types';

/**
 * Encrypts sensitive data with AES-256-CBC
 * @param value - Plain text to encrypt
 * @param encryptionKey - 256-bit encryption key from environment
 * @returns {EncryptedData} Encrypted data with IV
 * @throws {Error} If encryption fails
 */
export function encryptField(
  value: string,
  encryptionKey: string
): EncryptedData {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv
  );

  const encrypted = cipher.update(value, 'utf8', 'hex');
  const final = cipher.final('hex');

  return {
    encrypted: iv.toString('hex') + ':' + encrypted + final,
    algorithm: 'aes-256-cbc',
    encryptedAt: new Date()
  };
}

/**
 * Decrypts AES-256-CBC encrypted data
 * @param encryptedData - Encrypted string with IV
 * @param encryptionKey - 256-bit encryption key
 * @returns {CryptoResult} Decryption result
 */
export function decryptField(
  encryptedData: string,
  encryptionKey: string
): CryptoResult<string> {
  try {
    const [iv, data] = encryptedData.split(':');

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      Buffer.from(iv, 'hex')
    );

    const decrypted = decipher.update(data, 'hex', 'utf8');
    const final = decipher.final('utf8');

    return {
      success: true,
      data: decrypted + final
    };
  } catch (error) {
    return {
      success: false,
      error: 'Decryption failed'
    };
  }
}

/**
 * Prisma Client extension for automatic encryption
 * (v7: `$use` middleware removed — use `$extends` query extensions)
 * @module app/lib/database/encryption-extension
 */

/**
 * Encrypts sensitive fields before database write
 * @param sensitiveFields - Field names to encrypt
 * @returns Prisma Client extension, apply with `prisma.$extends(createEncryptionExtension([...]))`
 */
export function createEncryptionExtension(
  sensitiveFields: string[]
) {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable required');
  }

  return Prisma.defineExtension({
    name: 'field-encryption',
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          if (operation === 'create' || operation === 'update') {
            const data = (args as { data?: Record<string, unknown> }).data;
            for (const field of sensitiveFields) {
              if (data && typeof data[field] === 'string') {
                data[field] = encryptField(data[field] as string, key).encrypted;
              }
            }
          }

          return query(args);
        }
      }
    }
  });
}
```
