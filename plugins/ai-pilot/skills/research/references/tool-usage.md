---
name: tool-usage
description: Detailed Context7, Exa, and Sequential Thinking call patterns plus per-tool error handling
---

# Tool Usage

## Context7 Usage

```typescript
// Step 1: Resolve library ID
mcp__context7__resolve-library-id({
  libraryName: "next.js",
  query: "App Router server actions"
})

// Step 2: Query docs
mcp__context7__query-docs({
  libraryId: "/vercel/next.js",
  query: "server actions authentication"
})
```

**Best Practices**:
- Always `resolve-library-id` BEFORE `query-docs`
- Specify `topic` parameter to focus retrieval
- Start with 5000 tokens, increase to 10000 if needed
- Handle variations: "nextjs" vs "/vercel/next.js"

## Exa Search Types

| Type | Use Case | Time | numResults |
|------|----------|------|------------|
| `fast` | Quick lookups | <5s | 3-5 |
| `auto` | Balanced | 5-15s | 5-8 |
| `deep` | Comprehensive | 15-45s | 8+ |

```typescript
// Code context search
mcp__exa__get_code_context_exa({
  query: "Next.js 16 server actions authentication",
  tokensNum: 5000
})

// Web search
mcp__exa__web_search_exa({
  query: "React 2025 best practices",
  type: "auto",
  numResults: 5
})
```

## Exa Deep Research

**Reserve for** investigations requiring >30min manual effort.

```typescript
// Start research
const { taskId } = await mcp__exa__deep_researcher_start({
  instructions: "Compare authentication solutions for Node.js",
  model: "exa-research-pro" // or "exa-research" for faster
})

// Poll until complete
mcp__exa__deep_researcher_check({ taskId })
```

**Models**:
- `exa-research`: Standard depth (15-45s)
- `exa-research-pro`: Complex topics (45s-2min)

## Sequential Thinking

```typescript
mcp__sequential-thinking__sequentialthinking({
  thought: "Analyzing authentication approaches",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  // Optional for revisions:
  isRevision: false,
  revisesThought: null,
  branchId: null,
  branchFromThought: null,
  needsMoreThoughts: false
})
```

**Best Practices**:
- Start with realistic `totalThoughts`, adjust dynamically
- Use `isRevision: true` to reconsider hypotheses
- Create branches (`branchId`) for alternatives
- Set `needsMoreThoughts: true` if incomplete

## Error Handling

**Context7 Failures**:
- Verify library name spelling
- Try different formats ("/org/project" vs "project-name")
- Fallback to Exa code context

**Exa Timeouts**:
- Reduce `numResults`
- Simplify query
- Switch `type: "deep"` → `type: "fast"`

**Sequential Thinking Blocks**:
- Revise with `isRevision: true`
- Increase `totalThoughts`
- Create new branch
