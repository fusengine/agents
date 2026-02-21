---
description: "Step 2/6 - APEX: Analyze (TeamCreate 3 agents), Plan (TaskCreate with deps), Execute (domain expert, SOLID), eLicit (auto-review), eXamine (sniper NEVER skip). Auto-trigger on create/implement/refactor."
next_step: "03-agent-teams"
---

## APEX Workflow (MANDATORY)

**A**nalyze -> **P**lan -> **E**xecute -> e**L**icit -> e**X**amine

### A - Analyze (ALWAYS via TeamCreate)

`TeamCreate` -> spawn 3 teammates in parallel using Task tool:
1. `subagent_type: "fuse-ai-pilot:explore-codebase"` (architecture)
2. `subagent_type: "fuse-ai-pilot:research-expert"` (docs)
3. `subagent_type: "[DETECTED from Step 2]"` (domain expert)

**NEVER** use `general-purpose` if a domain agent was detected in Step 2.

### P - Plan

- `TaskCreate` task breakdown with dependencies (`addBlockedBy`)
- Estimate files < 100 lines, identify all modifications
- `TaskUpdate` tracks status: pending -> in_progress -> completed

### E - Execute

- Use domain `expert-agent`, follow SOLID rules
- Split files at 90 lines, interfaces separated
- Each teammate owns exclusive files (no shared edits)

### L - eLicit (Expert Auto-Review)

Expert auto-review with elicitation techniques before sniper:
- `--auto` (default): Auto-detect code type -> select techniques
- `--manual`: Expert proposes 5 techniques, user chooses
- `--skip-elicit`: Skip directly to eXamine

### X - eXamine (MANDATORY - NEVER SKIP)

**ALWAYS `sniper`** after ANY modification -> 6-phase validation, zero errors.

**sniper 6 Phases:** explore-codebase -> research-expert -> grep usages -> run linters -> apply fixes -> **ZERO errors**

## APEX Auto-Trigger

### ALWAYS use APEX when:
- **Action verbs**: create, implement, add, develop, build, refactor, migrate
- **New component/file** requested
- **Multi-file**: task touching >2 files
- **Architecture**: modifying existing structure

### SKIP APEX when:
- **Question**: exploration, explanation, "how does it work?"
- **Trivial fix**: typo, 1-3 lines, obvious correction
- **Read-only**: search, debug, inspection
- **Simple git**: status, log, diff (without commit)

### Shortcuts:
- `--quick`: Skip Analyze, direct Execute
- `--skip-elicit`: Skip eLicit, direct eXamine
- `--no-sniper`: Skip eXamine (not recommended)

**Next -> Step 3: Agent Teams** (`03-agent-teams.md`)
