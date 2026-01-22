---
description: Create or optimize prompts using best practices
---

# /prompt Command

Command for creating or optimizing prompts using the prompt-engineer agent.

## Usage

```bash
/prompt [action] [description]
```

## Actions

| Action | Description |
|--------|-------------|
| `create` | Create a new prompt |
| `optimize` | Improve an existing prompt |
| `agent` | Design a complete agent |
| `review` | Analyze an existing prompt |

## Workflow

### 1. Action Detection

```text
IF $ARGUMENTS contains "create" or "new":
  → Action: CREATE
IF $ARGUMENTS contains "optimize" or "improve":
  → Action: OPTIMIZE
IF $ARGUMENTS contains "agent" or "assistant":
  → Action: AGENT_DESIGN
IF $ARGUMENTS contains "review" or "analyze":
  → Action: REVIEW
ELSE:
  → Ask for clarification
```

### 2. Agent Launch

```text
Launch prompt-engineer agent with:
- Appropriate skill loaded
- User context
- Identified constraints
```

### 3. Workflow Execution

**For CREATE:**
1. Identify prompt type (system, task, few-shot, meta)
2. Identify constraints (model, format, domain)
3. Apply the 9-element Anthropic structure
4. Generate prompt with appropriate techniques
5. Validate with quality checklist

**For OPTIMIZE:**
1. Analyze current prompt
2. Identify issues (clarity, structure, completeness, guardrails)
3. Apply corrections
4. Generate before/after report
5. Propose optimized prompt

**For AGENT_DESIGN:**
1. Define identity and purpose
2. Choose architecture pattern
3. Define workflow
4. Configure tools and skills
5. Implement guardrails
6. Generate complete agent.md file

**For REVIEW:**
1. Analyze according to checklist
2. Score each criterion (clarity, structure, completeness, guardrails)
3. Identify strengths and weaknesses
4. Propose recommendations

## Examples

### Create a system prompt

```bash
/prompt create a technical support assistant for a mobile app
```

### Optimize an existing prompt

```bash
/prompt optimize [paste the prompt to improve]
```

### Design an agent

```bash
/prompt agent a Python-specialized code reviewer
```

### Analyze a prompt

```bash
/prompt review [paste the prompt to analyze]
```

## Output Format

### For CREATE/OPTIMIZE

```markdown
# [Prompt Name]

## Objective
[Description]

## Prompt

---
[THE COMPLETE PROMPT]
---

## Techniques Used
- [Technique 1]: [Why]
- [Technique 2]: [Why]

## Usage Notes
- [Note 1]
- [Note 2]
```

### For AGENT_DESIGN

```markdown
# Agent: [Name]

## Generated File

---
[CONTENT OF agent.md FILE]
---

## Architecture
- Pattern: [pattern used]
- Tools: [list of tools]
- Skills: [associated skills]

## Installation Instructions
1. [Step 1]
2. [Step 2]
```

### For REVIEW

```markdown
# Prompt Analysis

## Scores
| Criterion | Score | Comment |
|-----------|-------|---------|
| Clarity | X/10 | [...] |
| Structure | X/10 | [...] |
| Completeness | X/10 | [...] |
| Guardrails | X/10 | [...] |

## Strengths
- [Point 1]
- [Point 2]

## Areas for Improvement
1. [Area 1]: [Recommendation]
2. [Area 2]: [Recommendation]
```
