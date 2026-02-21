---
description: "Step 3/6 - Lead=coordinator only (never codes). Exclusive file ownership, well-scoped TaskCreate, max 4 teammates, 80% planning 20% execution. FORBIDDEN: shared edits, vague tasks, missing TaskUpdate."
next_step: "04-solid-dry-rules"
---

## Agent Teams - Delegation (MANDATORY)

**Lead = Coordinator ONLY.** The lead NEVER codes, only orchestrates.

### Rules:
1. **Exclusive file ownership** - Each teammate owns their files, NEVER shared edits
2. **Well-scoped tasks** - Each `TaskCreate` specifies: target files, expected output, criteria
3. **`mode: "delegate"`** - Always for the lead (restricted to coordination tools)
4. **`TaskUpdate` mandatory** - Each teammate MUST mark `completed` before idle
5. **Max 4 teammates** - Beyond that, coordination overhead > parallelism gains
6. **80% planning, 20% execution** - Detailed specs = better agent results

### Task specification template:
```
TaskCreate:
  subject: "Implement [feature] in [file]"
  description: |
    Target files: src/components/Button.tsx
    Expected output: React component with props X, Y, Z
    Acceptance criteria: Tests pass, < 50 lines, JSDoc
    Dependencies: blockedBy task #1
```

### Anti-patterns (FORBIDDEN):
- Lead implementing instead of delegating
- 2 agents editing the same file simultaneously
- Vague tasks ("build this feature") without file specs
- Forgetting `TaskUpdate` -> tasks blocked indefinitely
- Spawning > 4 teammates for a single task

**Next -> Step 4: SOLID & DRY** (`04-solid-dry-rules.md`)
