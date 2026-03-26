---
name: rag-patterns
description: RAG architecture patterns — chunking, context management, citation injection, hallucination prevention
when-to-use: Building retrieval-augmented generation systems, grounding LLM outputs in retrieved documents
keywords: RAG, retrieval, chunking, embedding, citation, hallucination, context-window
priority: high
---

# RAG Patterns

## Architecture Overview

`Query → Embedding → Vector Search → Reranking → Context Assembly → LLM → Answer`

1. **Embed** query → 2. **Retrieve** top-k chunks → 3. **Rerank** by relevance (cross-encoder)
4. **Assemble** context with citations → 5. **Generate** grounded answer

## Chunking Strategies

| Strategy | Best For | Chunk Size |
|----------|----------|------------|
| Fixed-size | Simple docs, logs | 512-1024 tokens with 10-20% overlap |
| Semantic | Articles, books | Split at paragraph/section boundaries |
| Recursive | Code, structured text | Split by headers → paragraphs → sentences |
| Parent-child | Complex docs | Small chunks for retrieval, return parent for context |

### Best Practices
- Overlap chunks by 10-20% to avoid losing context at boundaries
- Preserve metadata (source, page, section title) with each chunk
- Smaller chunks = more precise retrieval, larger = more context

## Context Window Management

```markdown
# System Prompt
You answer questions using ONLY the provided context.

# Retrieved Context (ordered by relevance)
<context>
<source id="1" file="auth.md" section="OAuth Flow">
[chunk content]
</source>
<source id="2" file="api.md" section="Endpoints">
[chunk content]
</source>
</context>

# User Question
{query}
```

- Place most relevant chunks first (LLMs attend more to early context)
- Tag each chunk with source metadata for citation
- Reserve 30-40% of context window for generation

## Citation Injection Patterns

```markdown
# Instructions
When answering, cite sources using [Source N] format.
If no source supports a claim, state "Not found in provided context."

# Example
Q: How does OAuth work?
A: The OAuth flow starts with a redirect to the provider [Source 1].
The callback endpoint exchanges the code for a token [Source 1].
```

## Hallucination Prevention

1. **Explicit grounding instruction**: "Answer ONLY from provided context"
2. **Confidence signal**: "If unsure, say 'The provided documents do not cover this'"
3. **Quote extraction**: Ask model to quote relevant passages before answering
4. **Verification step**: "First list which sources are relevant, then answer"
5. **Temperature 0**: Use low temperature for factual retrieval tasks

## Multi-Source Retrieval

| Source | Embedding Strategy |
|--------|-------------------|
| Documentation | Chunk by section, preserve hierarchy |
| Code | Chunk by function/class, include signatures |
| API specs | Chunk by endpoint, include params/responses |
| Chat/tickets | Chunk by thread, include resolution |

**Fusion Retrieval**: Query multiple indexes, merge with Reciprocal Rank Fusion, deduplicate before context assembly.
