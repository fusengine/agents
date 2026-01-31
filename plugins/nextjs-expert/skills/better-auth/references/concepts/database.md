# Better Auth Database Concept

## Core Tables

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

-- Accounts table (OAuth)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  UNIQUE(provider, provider_account_id)
);

-- Verification tokens
CREATE TABLE verification_tokens (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
```

## Adapter Pattern

```typescript
interface Adapter {
  create: (model, data) => Promise<any>
  findOne: (model, where) => Promise<any>
  findMany: (model, where) => Promise<any[]>
  update: (model, where, data) => Promise<any>
  delete: (model, where) => Promise<void>
}
```

## Auto Migration

```bash
bunx @better-auth/cli generate  # Generate SQL
bunx @better-auth/cli migrate   # Apply to DB
```

## Plugin Tables

Plugins add their own tables:
- `two_factors` - 2FA secrets
- `organizations` - Org data
- `members` - Org membership
- `passkeys` - WebAuthn credentials
