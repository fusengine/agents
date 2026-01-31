---
title: "GDPR Compliance"
description: "GDPR compliance, data deletion, consent management, and privacy controls"
tags: ["gdpr", "compliance", "privacy", "data-deletion", "consent"]
---

# GDPR Compliance

Implement GDPR-compliant data management to ensure user privacy and legal compliance.

## Right to Erasure (Data Deletion)

### Complete Data Deletion

```typescript
/**
 * Delete all user data (Right to be Forgotten)
 */
async function deleteUserData(userId: number) {
  // Delete related records first
  await prisma.order.deleteMany({ where: { userId } });
  await prisma.comment.deleteMany({ where: { userId } });
  await prisma.auditLog.deleteMany({ where: { userId } });

  // Delete user
  await prisma.user.delete({ where: { id: userId } });

  console.log(`User ${userId} and all related data deleted`);
}
```

### Cascade Deletion

```prisma
// schema.prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  orders   Order[]   @relation(onDelete: Cascade)
  comments Comment[] @relation(onDelete: Cascade)
}

model Order {
  id     Int   @id @default(autoincrement())
  userId Int
  user   User  @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Data Anonymization

### Replace Sensitive Data

```typescript
/**
 * Anonymize user instead of complete deletion
 */
async function anonymizeUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${userId}@anonymized.local`,
      firstName: '[DELETED]',
      lastName: '[DELETED]',
      phone: null,
      address: null,
      dateOfBirth: null
    }
  });
}
```

## Consent Management

### Create Consent Table

```sql
CREATE TABLE user_consent (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  consent_type VARCHAR(100) NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMP,
  version INT DEFAULT 1,
  ip_address VARCHAR(50),
  user_agent TEXT
);
```

### Consent Tracking

```typescript
/**
 * Record user consent
 */
async function recordConsent(
  userId: number,
  consentType: 'marketing' | 'analytics' | 'profiling',
  granted: boolean,
  ipAddress: string
) {
  return prisma.userConsent.create({
    data: {
      userId,
      consentType,
      granted,
      grantedAt: new Date(),
      ipAddress,
      userAgent: process.env.USER_AGENT
    }
  });
}

/**
 * Check if user granted consent
 */
async function hasConsent(userId: number, type: string) {
  const consent = await prisma.userConsent.findFirst({
    where: { userId, consentType: type, granted: true },
    orderBy: { grantedAt: 'desc' }
  });
  return !!consent;
}
```

## Data Export (Right to Data Portability)

### Export User Data

```typescript
/**
 * Export all user data in machine-readable format
 */
async function exportUserData(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,
      comments: true,
      preferences: true
    }
  });

  return {
    user,
    exportedAt: new Date().toISOString(),
    format: 'json'
  };
}

/**
 * Generate GDPR export as JSON
 */
async function generateGDPRExport(userId: number): Promise<string> {
  const data = await exportUserData(userId);
  return JSON.stringify(data, null, 2);
}
```

## Data Retention Policy

```typescript
/**
 * Delete data older than retention period
 */
async function purgeOldData(retentionDays: number) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // Delete old logs
  await prisma.auditLog.deleteMany({
    where: { changedAt: { lt: cutoffDate } }
  });

  // Delete old inactive users
  await prisma.user.deleteMany({
    where: {
      lastLoginAt: { lt: cutoffDate },
      deleted: true
    }
  });

  console.log(`Purged data older than ${retentionDays} days`);
}
```

## Privacy by Design

### Minimal Data Collection

```prisma
// Only store necessary fields
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String?
  createdAt DateTime @default(now())
  // Don't store unnecessary fields
}
```

### Default Privacy Settings

```typescript
/**
 * Create user with privacy-first defaults
 */
async function createPrivacyFirstUser(email: string) {
  return prisma.user.create({
    data: {
      email,
      marketingConsent: false,
      analyticsConsent: false,
      profilingConsent: false,
      dataProcessing: 'minimal'
    }
  });
}
```

## Compliance Checklist

- ✅ Right to Erasure implemented
- ✅ Data anonymization option available
- ✅ Consent management system in place
- ✅ Right to Data Portability enabled
- ✅ Data retention policy defined
- ✅ Audit trails maintained
- ✅ Privacy policy accessible

## SOLID Architecture Integration

### Module Path
`app/lib/gdpr/compliance-manager.ts`

### Type Definition
```typescript
/**
 * GDPR compliance types
 * @module app/lib/gdpr/types
 */

/**
 * User consent record
 */
export type UserConsent = {
  /** Unique identifier */
  id: number;
  /** User ID */
  userId: number;
  /** Consent type */
  consentType: 'marketing' | 'analytics' | 'profiling';
  /** Whether consent was granted */
  granted: boolean;
  /** When consent was recorded */
  grantedAt: Date;
  /** IP address of consent action */
  ipAddress: string;
};

/**
 * GDPR data export
 */
export type GDPRDataExport = {
  /** User personal data */
  user: Record<string, any>;
  /** Related user records */
  relations: Record<string, any[]>;
  /** Export timestamp */
  exportedAt: Date;
  /** Data format */
  format: 'json';
};

/**
 * Data deletion result
 */
export type DeletionResult = {
  success: boolean;
  deletedRecords: number;
  timestamp: Date;
  error?: string;
};
```

### Safe Implementation
```typescript
/**
 * GDPR compliance operations
 * @module app/lib/gdpr/gdpr-service
 */

import type { UserConsent, GDPRDataExport, DeletionResult } from './types';

/**
 * Right to Erasure - Delete all user data
 * @param userId - User ID to delete
 * @returns {Promise} Deletion result with affected records count
 */
export async function deleteUserData(
  userId: number
): Promise<DeletionResult> {
  try {
    let deletedCount = 0;

    // Delete related records first
    const orders = await prisma.order.deleteMany({
      where: { userId }
    });
    deletedCount += orders.count;

    const comments = await prisma.comment.deleteMany({
      where: { userId }
    });
    deletedCount += comments.count;

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });
    deletedCount += 1;

    return {
      success: true,
      deletedRecords: deletedCount,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      success: false,
      deletedRecords: 0,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Deletion failed'
    };
  }
}

/**
 * Data anonymization (alternative to deletion)
 * @module app/lib/gdpr/anonymization
 */

/**
 * Anonymizes user data instead of deletion
 * @param userId - User ID to anonymize
 * @returns {Promise} Anonymized user record
 */
export async function anonymizeUser(userId: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted-${userId}@anonymized.local`,
      firstName: '[DELETED]',
      lastName: '[DELETED]',
      phone: null,
      address: null,
      dateOfBirth: null
    }
  });
}

/**
 * Consent management
 * @module app/lib/gdpr/consent-service
 */

/**
 * Records user consent with metadata
 * @param userId - User ID granting consent
 * @param consentType - Type of consent
 * @param granted - Whether consent was granted
 * @param ipAddress - Client IP address
 * @returns {Promise} Recorded consent
 */
export async function recordConsent(
  userId: number,
  consentType: UserConsent['consentType'],
  granted: boolean,
  ipAddress: string
): Promise<UserConsent> {
  return prisma.userConsent.create({
    data: {
      userId,
      consentType,
      granted,
      grantedAt: new Date(),
      ipAddress
    }
  });
}

/**
 * Checks if user granted specific consent
 * @param userId - User ID to check
 * @param consentType - Type of consent to verify
 * @returns {Promise} Whether consent was granted
 */
export async function hasConsent(
  userId: number,
  consentType: UserConsent['consentType']
): Promise<boolean> {
  const consent = await prisma.userConsent.findFirst({
    where: {
      userId,
      consentType,
      granted: true
    },
    orderBy: { grantedAt: 'desc' }
  });

  return !!consent;
}

/**
 * Right to Data Portability
 * @module app/lib/gdpr/data-export
 */

/**
 * Exports all user data in machine-readable format
 * @param userId - User ID to export
 * @returns {Promise} Complete user data export
 */
export async function exportUserData(
  userId: number
): Promise<GDPRDataExport> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,
      comments: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    user,
    relations: {
      orders: user.orders,
      comments: user.comments
    },
    exportedAt: new Date(),
    format: 'json'
  };
}

/**
 * Generates GDPR export as JSON string
 * @param userId - User ID to export
 * @returns {Promise} JSON export string
 */
export async function generateGDPRExport(userId: number): Promise<string> {
  const data = await exportUserData(userId);
  return JSON.stringify(data, null, 2);
}
```
