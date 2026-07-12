# Artifact Contract

Step 5 does not stop at an in-context markdown report -- it writes
`.claude/apex/docs/elicit-{task-slug}.json`: a list of `{technique_id,
verdict, correction_applied, evidence}` per technique applied. A later
elicitation pass on the same task loads this file first (Step 0) and
**diffs against it** instead of re-deriving technique selection from
scratch -- only re-apply techniques that were `fail`/`deferred` or are
newly relevant. See `steps/step-05-report.md` for the exact JSON schema and
`steps/step-00-init.md` for the load/diff logic.

`{task-slug}`: derive per `apex-methodology/references/init-tracking.md`'s
"Task Slug" section (canonical: `TaskCreate` id, else git branch stripped of
its `type/` prefix and slugified, else `task-<unix-timestamp>`) -- same
pattern used by the `verification` skill's `verify-{task-slug}.md`. Do not
improvise another derivation: a branch like `feat/use-harness` slugifies to
`use-harness`, not `feat-use-harness` -- a mismatched slug means gates never
find the artifact.

Optional per-repo tuning of which techniques apply: `references/elicit-profile.md`.
