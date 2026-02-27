## APEX Auto-Trigger

**USE APEX:** create, implement, add, build, refactor, migrate, new component, multi-file, architecture changes
**SKIP APEX:** questions, trivial fix (1-3 lines), read-only, simple git

**Shortcuts:** `--quick` (skip Brainstorm+Analyze) | `--skip-elicit` (skip eLicit) | `--no-sniper` (skip eXamine)

## Full APEX Flow

```
Brainstorm → Analyze → Plan → Execute (TDD) → eLicit → Verify → eXamine
```

| Phase | Skill | When |
|-------|-------|------|
| **Brainstorm** | `brainstorming` | New features, major changes. Skip for trivial fixes, bug fixes with clear repro |
| **Analyze** | explore-codebase + research-expert | Always (parallel agents) |
| **Plan** | TaskCreate | Always (files < 100 lines) |
| **Execute** | Domain expert + `tdd` | Write test FIRST (RED), then code (GREEN), then refactor |
| **eLicit** | Elicitation techniques | Expert self-review |
| **Verify** | `verification` | Check functional resolution before quality check |
| **eXamine** | sniper | Code quality validation (ZERO errors) |

## sniper 6 Phases
explore-codebase -> research-expert -> grep usages -> run linters -> apply fixes -> **ZERO errors**

## eLicit Modes
- `--auto`: Auto-detect code type -> select elicitation techniques
- `--manual`: Expert proposes 5 techniques, user chooses
