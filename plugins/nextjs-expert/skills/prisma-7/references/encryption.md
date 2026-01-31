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

### Using Prisma Hooks

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Encrypt before create
prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'create') {
    params.args.data.ssn = encryptField(
      params.args.data.ssn,
      process.env.ENCRYPTION_KEY!
    );
  }
  return next(params);
});

// Decrypt after read
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === 'User' && ['findUnique', 'findMany'].includes(params.action)) {
    const users = Array.isArray(result) ? result : [result];
    users.forEach(user => {
      if (user.ssn) {
        user.ssn = decryptField(user.ssn, process.env.ENCRYPTION_KEY!);
      }
    });
  }
  return result;
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
 * Prisma middleware for automatic encryption/decryption
 * @module app/lib/database/encryption-middleware
 */

/**
 * Encrypts sensitive fields before database write
 * @param sensitiveFields - Field names to encrypt
 * @returns {Function} Prisma middleware
 */
export function createEncryptionMiddleware(
  sensitiveFields: string[]
) {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable required');
  }

  return async (
    params: any,
    next: (params: any) => Promise<any>
  ) => {
    if (params.action === 'create' || params.action === 'update') {
      for (const field of sensitiveFields) {
        if (params.args.data[field]) {
          params.args.data[field] = encryptField(
            params.args.data[field],
            key
          ).encrypted;
        }
      }
    }

    const result = await next(params);
    return result;
  };
}
```
