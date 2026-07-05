---
name: agent-design
description: Design AI agents with recommended patterns and architectures. Use when: choosing between workflow vs agent patterns, structuring orchestrator/subagent pipelines, or writing a Claude Code agent template.
allowed-tools: Read, Write
---

# Agent Design

Skill for designing high-performance AI agents following 2025 patterns.

## References

- [patterns.md](references/patterns.md) - Load when: choosing an agent architecture (Single Agent, Agent+Tools, Orchestrator, Pipeline, Network, Supervisor, Hierarchical, Meta-Prompting) or comparing their trade-offs
- [workflows.md](references/workflows.md) - Load when: implementing APEX, TDD, Explore-Plan-Code, Code Review, or Debugging workflows for an agent
- [templates.md](references/templates.md) - Load when: writing a full agent definition (production frontmatter + sections) or a Claude Code agent template
- [anti-patterns.md](references/anti-patterns.md) - Load when: reviewing an agent design for common mistakes (omniscient agent, implicit instructions, missing error handling)

## Fundamental Distinction

### Workflows vs Agents

| Type | Control | When to use |
|------|---------|-------------|
| **Workflow** | Code orchestrates LLM | Predictable tasks, need for control |
| **Agent** | LLM directs its actions | Flexibility, adaptive decisions |

**Golden rule:** Start simple, add complexity if necessary.

## Minimal Agent Structure

```yaml
Agent:
  identity: Who am I?
  capabilities: What can I do?
  tools: What tools do I have?
  constraints: What are my limits?
  workflow: How should I proceed?
```

For the complete production structure and the Claude Code agent template, see [templates.md](references/templates.md).

## Fresh Eyes Principle

**Key 2025 concept:** Each sub-agent must have a "fresh" context.

```
❌ Bad: Pass entire history to each sub-agent
✅ Good: Give only necessary information

Orchestrator:
  - Keeps complete history
  - Extracts relevant context for each sub-agent
  - Synthesizes results
```

## Design Checklist

### Before creating an agent

- [ ] Is the objective clear?
- [ ] Would a simple workflow suffice?
- [ ] What tools are needed?
- [ ] What guardrails are required?

### During design

- [ ] Is identity well defined?
- [ ] Is workflow explicit?
- [ ] Are error cases handled?
- [ ] Are examples relevant?

### After creation

- [ ] Standard case tests?
- [ ] Edge case tests?
- [ ] Security tests (jailbreak)?
- [ ] Acceptable performance?

For anti-patterns to avoid during design, see [anti-patterns.md](references/anti-patterns.md).

## Forbidden

- Never create an agent without explicit workflow
- Never give access to all tools without necessity
- Never ignore the principle of least privilege
- Never forget security guardrails
