# Agent Teams (Delegation)

Coordinate multiple Claude Code agents working in true parallel with separate context windows.

## Enable

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or via the installer: `setup.sh` prompts to enable automatically.

## Architecture

```
┌─────────────────────────────────────────────┐
│              LEAD (Coordinator)              │
│  TeamCreate → TaskCreate → SendMessage      │
│  mode: "delegate" (NEVER writes code)       │
├──────────┬──────────┬───────────────────────┤
│ Agent A  │ Agent B  │ Agent C               │
│ Own ctx  │ Own ctx  │ Own ctx               │
│ Own files│ Own files│ Own files             │
└──────────┴──────────┴───────────────────────┘
```

Each agent runs in its own context window with isolated memory.

## Delegation Rules

### 1. Lead = Coordinator ONLY

The lead agent orchestrates but **NEVER implements**. Use `mode: "delegate"` to restrict the lead to coordination-only tools (TeamCreate, TaskCreate, SendMessage).

### 2. File Ownership

Each teammate owns distinct files. **Two agents editing the same file leads to overwrites.**

```
Agent A → src/components/Header.tsx, src/hooks/useHeader.ts
Agent B → src/components/Footer.tsx, src/hooks/useFooter.ts
Agent C → src/services/api.ts, src/utils/helpers.ts
```

### 3. Well-Scoped Tasks

Every `TaskCreate` must specify:
- **Target files** - Which files to create/modify
- **Expected output** - What the result should look like
- **Acceptance criteria** - How to validate success
- **Dependencies** - `addBlockedBy` for task ordering

### 4. Mandatory TaskUpdate

Teammates MUST call `TaskUpdate` with `status: "completed"` when done. Forgetting this blocks dependent tasks indefinitely.

### 5. Max 4 Teammates

Beyond 4 agents, coordination overhead exceeds parallelism gains.

## APEX Integration

Agent Teams power the **Analyze** phase of APEX:

```
TeamCreate → spawn 3 teammates:
├── explore-codebase  (architecture mapping)
├── research-expert   (documentation lookup)
└── [domain-expert]   (framework-specific analysis)
```

Results are synthesized by the lead before the **Plan** phase.

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Lead implements code | Defeats delegation purpose | Use `mode: "delegate"` |
| Shared file edits | Overwrites between agents | Assign exclusive file ownership |
| Vague tasks | Agents waste tokens guessing | Specify files + criteria |
| Missing TaskUpdate | Dependent tasks blocked forever | Always mark `completed` |
| 5+ teammates | Overhead > gains | Cap at 4 agents max |

## Known Limitations

- `/resume` does not restore in-process teammates
- One team per session (no nested teams)
- Teammates cannot spawn their own teams
- High token usage (~4x single agent for 4 teammates)

## Example Workflow

```
1. TeamCreate("feature-auth")
2. TaskCreate("Implement login form")
   → files: src/components/LoginForm.tsx
   → criteria: Zod validation, shadcn/ui
3. TaskCreate("Implement auth API")
   → files: src/services/auth.ts
   → criteria: Better Auth integration
4. TaskCreate("Add auth tests")
   → files: src/__tests__/auth.test.ts
   → blockedBy: [task-1, task-2]
5. Spawn teammates → assign tasks → TaskUpdate on completion
6. Lead runs sniper for final validation
```
