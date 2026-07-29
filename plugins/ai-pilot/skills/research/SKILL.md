---
name: research
description: Use when researching documentation, best practices, or complex technical investigations -- Context7 + Exa + Sequential Thinking methodology.
argument-hint: "[topic] [--deep]"
context: fork
agent: fuse-ai-pilot:research-expert
user-invocable: false
---

<objective>
Research is the technical-research methodology behind the `research-expert` agent, covering three workflows depending on the question: a standard query (Sequential Thinking decomposition -> Context7 resolve + docs -> Exa supplement -> synthesized answer with sources), a complex investigation (multi-hypothesis Sequential Thinking -> Exa deep researcher -> cross-check against Context7 -> comprehensive report), and a technology-trends scan (Exa web scan + code patterns + company research -> Sequential Thinking analysis -> recommendations).

Source priority is always official docs (Context7) first, recent tutorials (Exa, <6 months) second, older content only with version verification. It runs in a forked context via the `research-expert` agent.
</objective>

**Session:** ${CLAUDE_SESSION_ID}

**Research Topic:** $ARGUMENTS

# Research Skill

## Research Workflows

### Standard Query
```
1. THINK → Sequential Thinking decomposition
2. RESOLVE → Context7 resolve-library-id
3. DOCUMENT → Context7 query-docs (5000-10000 tokens)
4. SUPPLEMENT → Exa code context search
5. SYNTHESIZE → Structured answer with sources
```

### Complex Investigation
```
1. DEEP THINK → Multi-hypothesis Sequential Thinking
2. DEEP RESEARCH → Exa deep researcher (45s-2min)
3. MONITOR → Check status until completed
4. VALIDATE → Cross-check Context7 official sources
5. REPORT → Comprehensive solution
```

### Technology Trends
```
1. WEB SCAN → Exa search latest developments
2. CODE PATTERNS → Exa code context for practices
3. ECOSYSTEM → Company research for key players
4. ANALYSIS → Sequential Thinking for implications
5. RECOMMENDATIONS → Actionable insights
```

---

## Multi-Source Synthesis

**Parallelization**:
- Run `resolve-library-id` + `web_search_exa` simultaneously
- Launch multiple Exa searches concurrently
- Execute Context7 docs + Exa code search in parallel

**Source Priority**:
1. Official documentation (Context7)
2. Recent tutorials (Exa, <6 months)
3. Older content (with version verification)

---

## Forbidden Behaviors

- ❌ Guess library IDs without `resolve-library-id`
- ❌ Start deep researcher without checking completion
- ❌ Mix opinions with facts without distinction
- ❌ Provide code without version verification
- ❌ Ignore WebFetch redirects
- ❌ Recommend without citing sources
- ❌ Skip Sequential Thinking for multi-step problems

---

## Detailed References (Load on Demand)

- `references/tool-usage.md` — Load when calling Context7, Exa, or Sequential Thinking (exact call patterns, models, and per-tool error handling)
- `references/response-format.md` — Load when writing the final research report
