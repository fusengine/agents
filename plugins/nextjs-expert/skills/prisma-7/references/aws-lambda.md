---
name: AWS Lambda Deployment
description: Deploy Prisma on AWS Lambda with RDS for serverless functions
when-to-use: AWS ecosystem, serverless functions, auto-scaling, cost optimization
keywords: [aws-lambda, rds, serverless, cold-starts, vpc-configuration]
priority: high
requires: [basic-usage, database]
related: [vercel, netlify, cloudflare-workers]
---

# AWS Lambda Deployment with Prisma

## Setup

```bash
npm install -D serverless serverless-offline
npm install @prisma/client
```

## Serverless Configuration

`serverless.yml`:

```yaml
service: prisma-app

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  memorySize: 512
  timeout: 30
  vpc:
    securityGroupIds:
      - sg-xxxxxxxx
    subnetIds:
      - subnet-xxxxxxxx
      - subnet-yyyyyyyy
  environment:
    DATABASE_URL: ${ssm:/prisma-app/database-url}
    NODE_ENV: production

functions:
  users:
    handler: src/handlers/users.handler
    events:
      - http:
          path: /users
          method: GET
          cors: true

  createUser:
    handler: src/handlers/create-user.handler
    events:
      - http:
          path: /users
          method: POST
          cors: true

plugins:
  - serverless-offline
```

## Handler Function

```typescript
// src/handlers/users.ts
/**
 * AWS Lambda handler for retrieving users.
 * Manages Prisma Client connection reuse.
 * @see /src/lib/prisma-lambda.ts
 */
import type { APIGatewayProxyHandler } from 'aws-lambda'
import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Get or create Prisma Client instance.
 * Reuses connection across warm invocations.
 *
 * @returns {PrismaClient} Reusable Prisma instance
 * @see /src/lib/prisma-lambda.ts
 */
function getPrismaClient(): PrismaClient {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }
  return globalThis.prisma
}

/**
 * Lambda handler for users endpoint.
 *
 * @param {APIGatewayEvent} event - Lambda event
 * @returns {Promise<APIGatewayProxyResult>}
 * @see /src/repositories/user-repository.ts
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  const client = getPrismaClient()

  try {
    const users = await client.user.findMany()
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) })
    }
  }
}
```

## Connection Pooling

Use PgBouncer or RDS Proxy:

```typescript
// src/lib/prisma-lambda.ts
/**
 * Prisma Client factory for Lambda with RDS Proxy.
 * @see /src/interfaces/lambda-config.ts
 */
import { PrismaClient } from '@prisma/client'

/**
 * Create Prisma Client instance with RDS Proxy connection string.
 * RDS Proxy handles connection pooling for Lambda.
 *
 * @returns {PrismaClient} Configured Prisma Client
 * @see /src/handlers/users.ts
 */
export function getPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL

  return new PrismaClient({
    datasources: {
      db: { url }
    }
  })
}

/**
 * Get singleton Prisma Client for warm Lambda invocations.
 *
 * @returns {PrismaClient} Reusable instance
 * @see /src/handlers/users.ts
 */
export function getPrismaSingleton(): PrismaClient {
  if (!globalThis.prisma) {
    globalThis.prisma = getPrismaClient()
  }
  return globalThis.prisma
}
```

## Environment Variables

Use AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name prisma-app/database-url \
  --secret-string "postgresql://user:pass@host:5432/db"
```

Reference in serverless.yml:

```yaml
environment:
  DATABASE_URL: ${ssm:/prisma-app/database-url}
```

## VPC Configuration

Lambda needs RDS access:

1. EC2 → Security Groups → Create SG for Lambda
2. RDS → Modify → Security Groups → Add Lambda SG
3. Deploy with subnet/security group config

## Cold Start Optimization

```typescript
// src/handlers/base.ts
/**
 * Base handler utilities for cold start optimization.
 * @see /src/lib/prisma-lambda.ts
 */
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Get or create Prisma Client singleton.
 * Reuse across warm Lambda invocations.
 *
 * @returns {PrismaClient} Reusable Prisma instance
 * @see /src/handlers/users.ts
 */
export function getPrisma(): PrismaClient {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }
  return globalThis.prisma
}
```

## Migrations

Add custom resource in CloudFormation:

```yaml
resources:
  Resources:
    MigrateDB:
      Type: AWS::Lambda::Function
      Properties:
        FunctionName: prisma-migrate
        Runtime: nodejs20.x
        Handler: migrate.handler
        Code:
          ZipFile: |
            import { execSync } from 'child_process'
            export function handler() {
              execSync('npx prisma migrate deploy')
            }
```

## Deployment

```bash
serverless deploy
```

## Monitor

```bash
serverless logs -f users
serverless logs -f createUser --tail
```

## Cost Analysis

- Compute: $0.20 per 1M requests
- Duration: $0.0000166667 per GB-second
- Always cheaper with higher request volume

Use CloudWatch for monitoring costs.
