# Verification Artifact Template

Write this file to `.claude/apex/docs/verify-{task-slug}.md` in Step 6. It is the
disk-persisted proof a gate (hook, sniper, next elicitation pass) can check --
a context-only "it works" declaration does not survive a session boundary.

`{task-slug}`: derive per `apex-methodology/references/init-tracking.md`'s
"Task Slug" section (canonical: `TaskCreate` id, else git branch stripped of
its `type/` prefix and slugified, else `task-<unix-timestamp>`). Do not
improvise another derivation: a branch like `feat/use-harness` slugifies to
`use-harness`, not `feat-use-harness` -- a mismatched slug means gates never
find the artifact.

---

## Template

```markdown
# Verification: {task-slug}

**Date**: {ISO-8601 UTC}
**Original request**: {one-line summary}

## Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | {criterion} | ✅/❌ | {command output, log excerpt, screenshot path, or diff} |
| 2 | {criterion} | ✅/❌ | {evidence} |

## Regression Check

- [ ] Full test suite passed -- {command + result summary}
- [ ] No new lint/type errors -- {evidence}
- [ ] No unrelated files modified -- {file list reviewed}

## Side Effects

- [ ] All modified files reviewed individually
- [ ] No debug code / secrets left behind

## Verdict

**FUNCTIONALLY RESOLVED** -- summary of evidence
or
**UNRESOLVED** -- {remaining items, blocking reason}
```

---

## Rules

- One evidence entry per criterion. "It works" is not evidence -- paste the
  actual command output or excerpt.
- If a criterion cannot be verified (no test harness, no way to reproduce),
  say so explicitly under Verdict instead of marking it ✅.
- This file is the artifact eXamine (sniper) and any later elicitation pass
  read to avoid re-deriving verification state from scratch.
