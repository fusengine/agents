## APEX Auto-Trigger

**USE APEX:** create, implement, add, build, refactor, migrate, new component, multi-file, architecture changes
**SKIP APEX:** questions, trivial fix (1-3 lines), read-only, simple git
**Debug/Investigation:** "why", "not working", "bug", "crash", "doesn't load" → ALWAYS use Analyze (explore-codebase + research-expert + domain-expert)

**Shortcuts:** `/apex-quick` command (single-expert fast path — skips Brainstorm+Analyze+team split, linter-only verify) | `--skip-elicit` (skip eLicit, straight to eXamine) — eXamine/sniper itself is NEVER skippable (00-critical-rules)

## Full APEX Flow

```
Brainstorm → Analyze → Plan → Execute (TDD) → eLicit → Verify → eXamine
```

| Phase | Skill | When |
|-------|-------|------|
| **Brainstorm** | `brainstorming` | New features, major changes. Skip for trivial fixes, bug fixes with clear repro |
| **Analyze** | explore-codebase + research-expert | Always (parallel agents) |
| **Plan** | Written mandate per agent (exclusive files, expected output, criteria) | Always. Split by exclusive file ownership from 3 files; file size is governed by the hook's `FUSE_SOLID_MAX_LINES`, never by a self-set cap |
| **Execute** | Domain expert + `tdd` | Write test FIRST (RED), then code (GREEN), then refactor |
| **eLicit** | Elicitation techniques | Expert self-review |
| **Verify** | `verification` | Run the actual build/tests — a Verify without execution is a guess |
| **eXamine** | sniper | Code quality validation (ZERO errors) |

## sniper 7 Phases (aligned with `ai-pilot/agents/sniper.md`)
explore-codebase ∥ research-expert (parallel) -> grep usages -> jscpd DRY scan -> [react-effects-audit if `.tsx`/`.jsx`] -> run linters -> apply fixes -> re-run ALL checks = **ZERO errors**

## eLicit Modes
- `--auto`: Auto-detect code type -> select elicitation techniques
- `--manual`: Expert proposes 5 techniques, user chooses
