---
description: Optimize Prisma queries with automated analysis, N+1 detection, index recommendations, and performance patterns based on official documentation
---

# 🚀 Prisma Query Optimization

Automatically analyzes and optimizes your Prisma queries by detecting performance issues, N+1 queries, missing indexes, and proposing solutions based on official Prisma documentation 2024-2025.

---

## Phase 1: ANALYZE 🔍

### Step 1.1: Fetch Official Documentation

> Use research-expert to fetch official Prisma documentation

**Goals**:

- Obtain latest Prisma optimization documentation
- Verify recommended patterns for Prisma Optimize
- Identify best practices 2024-2025

**Actions**:

- Search for Prisma Optimize, Query Optimization, Performance documentation
- Verify `@prisma/extension-optimize` extension APIs
- Confirm patterns to avoid N+1 queries

**Query Focus**:

```text
"Prisma Optimize best practices, N+1 detection, query optimization patterns,
index recommendations, select vs include, relationLoadStrategy"
```

**Deliverable**: Prisma optimization guide with verified methods

---

### Step 1.2: Explore Prisma Codebase

> Use explore-codebase to analyze existing Prisma setup

**Goals**:

- Locate Prisma files (schema.prisma, client queries)
- Identify existing query patterns
- Detect potential performance issues

**Actions**:

- Search for `schema.prisma`, `*.prisma` files
- Analyze files containing `prisma.` to find queries
- Map relations and data access patterns

**Deliverable**: Map of Prisma queries and potential issues

---

## Phase 2: DETECT ISSUES 🎯

### Automated Problem Detection

After exploration, systematically analyze:

#### 🚨 Issue 1: N+1 Queries

**Detected Pattern**:

```typescript
// ❌ Anti-pattern detected
const users = await prisma.user.findMany()
users.forEach(async (user) => {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } })
})
```

**Recommended Solutions**:

1. **`include`** (Simple):

   ```typescript
   const users = await prisma.user.findMany({ include: { posts: true } })
   ```

2. **`relationLoadStrategy: "join"`** (Performant):

   ```typescript
   const users = await prisma.user.findMany({
     relationLoadStrategy: "join",
     include: { posts: true }
   })
   ```

---

#### 🚨 Issue 2: Missing Indexes

**Detected Pattern**:

```typescript
// ❌ Queries on unindexed columns
await prisma.user.findFirst({ where: { name: "Marc" } })
```

**Solution**:

```prisma
model User {
  id    Int    @id
  name  String

  @@index([name]) // ✅ Add index
}
```

---

#### 🚨 Issue 3: Overfetching

**Detected Pattern**:

```typescript
// ❌ Fetches all fields unnecessarily
await prisma.user.findMany({ include: { posts: true } })
```

**Solution**:

```typescript
// ✅ Select only necessary fields
await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    posts: { select: { title: true } }
  }
})
```

---

## Phase 3: EXECUTE 🛠️

### Step 3.1: Install Prisma Optimize (Optional)

**If desired, install official extension**:

```bash
npm install @prisma/extension-optimize
```

**Configuration**:

```typescript
import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'

const prisma = new PrismaClient().$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
)
```

---

### Step 3.2: Apply Optimizations

For each detected issue, propose and implement solutions:

1. **Refactor N+1 queries** → Use `include` or `relationLoadStrategy`
2. **Add missing indexes** → Modify `schema.prisma` with `@@index`
3. **Optimize selects** → Replace with targeted `select`
4. **Limit results** → Add `take`/`skip`

---

## Phase 4: VERIFY 🔍

> Use sniper to ensure zero linter errors

**Goals**:

- Validate TypeScript syntax
- Verify Prisma types
- Ensure SOLID principles compliance

**Actions**:

```bash
npx prisma validate
npx prisma format
npm run lint
npm run type-check
```

**Deliverable**: Optimized code with zero errors

---

## 📊 Final Report

Generate structured report with:

```markdown
# Prisma Optimization Report

## 🔍 Detected Issues
- [X] N+1 Queries: 3 occurrences
- [X] Missing Indexes: 5 columns
- [X] Overfetching: 2 queries

## ✅ Applied Solutions
1. Refactored users.service.ts with `include`
2. Added indexes on User.name, Post.title
3. Optimized queries with targeted `select`

## 📈 Estimated Performance Gains
- Reduced 15 → 3 SQL queries
- Queries ~70% faster (estimated)
- Network load reduced by ~40%

## 🎯 Additional Recommendations
- Enable Prisma Optimize for monitoring
- Add performance logs in development
- Consider caching with Accelerate
```

---

## Usage

**Arguments**: No arguments required

**Example Usage**:

- `/prisma-optimize` → Complete analysis and automatic optimization

**Notes**:

- Command analyzes ALL Prisma files in the project
- Recommendations based on official 2024-2025 documentation
- Installing `@prisma/extension-optimize` is optional but recommended
