---
name: graphql-security
description: GraphQL security patterns - introspection, depth limiting, complexity analysis, batching, authorization
when-to-use: When scanning or securing GraphQL APIs, reviewing schema config, or auditing query handling
keywords: graphql, introspection, depth, complexity, batching, authorization, persisted queries
priority: high
related: scan-patterns.md, owasp-top10.md
---

# GraphQL Security Patterns

## Introspection Control
- **Risk**: Schema exposure reveals types, fields, relationships
- **Severity**: HIGH | **OWASP**: A05
- **Grep**: `introspection:\s*true`, `__schema`, `__type`
- **Fix**: Set `introspection: false` in production

## Query Depth Limiting
- **Risk**: Deeply nested queries cause N+1 and resource exhaustion
- **Severity**: HIGH | **OWASP**: A04
- **Grep**: Missing `depthLimit`, `maxDepth`, `validationRules`
- **Fix**: Use `graphql-depth-limit`, max depth = 10

## Query Complexity Analysis
- **Risk**: Flat but expensive queries (large lists, computed fields)
- **Severity**: HIGH | **OWASP**: A04
- **Grep**: Missing `costAnalysis`, `complexityLimit`, `fieldCost`
- **Fix**: Assign cost per field, enforce max complexity (1000)

## Batching Attack Prevention
- **Risk**: Multiple operations in one request bypass rate limiting
- **Severity**: MEDIUM | **OWASP**: A04
- **Grep**: `allowBatchedHttpRequests:\s*true`, missing batch limits
- **Fix**: Set `maxBatchSize: 5` or disable batching

## Field-Level Authorization
- **Risk**: Schema-level auth misses field-level access control
- **Severity**: CRITICAL | **OWASP**: A01
- **Grep**: Resolvers without `@auth`, `authorize()`, permission checks
- **Fix**: Directive-based auth (`@auth(requires: ADMIN)`) or middleware

## Persisted Queries
- **Risk**: Arbitrary query execution enables attack surface exploration
- **Severity**: MEDIUM | **OWASP**: A04
- **Grep**: Missing `persistedQueries`, `allowedOperations`
- **Fix**: Whitelist known queries, reject unknown query strings

## Input Validation
- **Risk**: Injection via GraphQL arguments (SQL, NoSQL, LDAP)
- **Severity**: CRITICAL | **OWASP**: A03
- **Grep**: `${args.` in resolvers, raw SQL in resolvers
- **Fix**: Parameterized queries, validate input types and length

## Rate Limiting
- **Risk**: Query flood causes denial of service
- **Severity**: HIGH | **OWASP**: A04
- **Grep**: Missing rate limit middleware on `/graphql` endpoint
- **Fix**: Combine request-based and cost-based rate limiting

## Scan Patterns Summary

| Pattern | Severity | OWASP |
|---------|----------|-------|
| `introspection:\s*true` | HIGH | A05 |
| Missing `depthLimit` / `maxDepth` | HIGH | A04 |
| Missing `complexityLimit` / `costAnalysis` | HIGH | A04 |
| `allowBatchedHttpRequests:\s*true` | MEDIUM | A04 |
| Resolvers without auth checks | CRITICAL | A01 |
| Missing `persistedQueries` config | MEDIUM | A04 |
| `\$\{args\.` in SQL/query strings | CRITICAL | A03 |
| No rate limit on `/graphql` endpoint | HIGH | A04 |
