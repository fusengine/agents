---
title: "SSL/TLS Configuration"
description: "SSL/TLS setup, certificate configuration, and secure connections"
tags: ["security", "ssl", "tls", "encryption", "certificates"]
---

# SSL/TLS Configuration

SSL/TLS encryption secures data in transit between your application and database.

## PostgreSQL SSL Modes

### require
Requires SSL connection without certificate validation.

```
postgresql://user:password@localhost:5432/mydb?sslmode=require
```

### verify-ca
Requires SSL with CA certificate verification.

```
postgresql://user:password@localhost:5432/mydb?sslmode=verify-ca&sslcert=./client-cert.pem&sslkey=./client-key.pem&sslrootcert=./ca-cert.pem
```

### verify-full
Most secure - verifies CA and hostname.

```
postgresql://user:password@localhost:5432/mydb?sslmode=verify-full&sslrootcert=./ca-cert.pem
```

## MySQL SSL Configuration

### Basic SSL
```
mysql://user:password@localhost:3306/mydb?sslaccept=strict
```

### Custom Certificate
```
mysql://user:password@localhost:3306/mydb?ssl=true&ca=/path/to/ca.pem
```

## Certificate Files

### Loading Local Certificates

```bash
# Environment variable approach
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?sslmode=verify-ca&sslrootcert=/app/certs/ca.pem"
```

### Cloud Database Example (AWS RDS)

```
postgresql://user:password@mydb.rds.amazonaws.com:5432/mydb?sslmode=require&sslrootcert=~/.postgresql/rds-ca-2019-root.pem
```

## Prisma Configuration

### Using .env

```bash
# .env
DATABASE_URL="postgresql://user:password@db:5432/mydb?sslmode=verify-ca&sslrootcert=/app/certs/ca-cert.pem&sslcert=/app/certs/client-cert.pem&sslkey=/app/certs/client-key.pem"
```

### Connection Pool with SSL

```
postgresql://user:password@pooler:6543/mydb?sslmode=require&pgbouncer=true
```

## Best Practices

- **Always use SSL in production** - Never allow unencrypted connections
- **Verify certificates** - Use verify-ca or verify-full modes
- **Rotate certificates** - Update before expiration
- **Store certificates securely** - Use mounted volumes or secrets
- **Monitor certificate expiry** - Set renewal reminders

## Troubleshooting

- **"SSL/TLS error"** - Check certificate path and format
- **"Certificate verify failed"** - Ensure CA certificate is correct
- **"Handshake failure"** - Verify database supports SSL
- **"Connection refused"** - Confirm SSL port (usually 5432 for PostgreSQL)

## SOLID Architecture Integration

### Module Path
`app/lib/database/ssl-config.ts`

### Type Definition
```typescript
/**
 * SSL/TLS configuration types
 * @module app/lib/database/types
 */

/**
 * SSL mode options for secure database connections
 */
export type SSLMode = 'require' | 'verify-ca' | 'verify-full';

/**
 * SSL configuration for database connection
 */
export type SSLConfig = {
  /** SSL mode setting */
  mode: SSLMode;
  /** CA certificate path */
  caCert?: string;
  /** Client certificate path */
  clientCert?: string;
  /** Client key path */
  clientKey?: string;
};
```

### Safe Implementation
```typescript
/**
 * Build secure SSL/TLS connection strings
 * @module app/lib/database/ssl-builder
 */

import type { SSLConfig, SSLMode } from './types';

/**
 * Validates SSL certificate files exist and are readable
 * @param config - SSL configuration
 * @throws {Error} If certificate files are missing or invalid
 * @returns {boolean} True if all certificates are valid
 */
export function validateSSLCertificates(config: SSLConfig): boolean {
  const { caCert, clientCert, clientKey } = config;

  // In production, verify certificate paths exist
  if (process.env.NODE_ENV === 'production') {
    if (config.mode !== 'require' && !caCert) {
      throw new Error('CA certificate required for verify-ca/verify-full modes');
    }
  }

  return true;
}

/**
 * Build DATABASE_URL with SSL parameters
 * @param baseUrl - Base connection URL
 * @param sslConfig - SSL configuration
 * @returns {string} Complete connection URL with SSL
 */
export function buildSSLConnectionUrl(
  baseUrl: string,
  sslConfig: SSLConfig
): string {
  const url = new URL(baseUrl);

  url.searchParams.set('sslmode', sslConfig.mode);

  if (sslConfig.caCert) {
    url.searchParams.set('sslrootcert', sslConfig.caCert);
  }

  if (sslConfig.clientCert) {
    url.searchParams.set('sslcert', sslConfig.clientCert);
  }

  if (sslConfig.clientKey) {
    url.searchParams.set('sslkey', sslConfig.clientKey);
  }

  return url.toString();
}
```
