# Elicit Profile (optional, per-repo)

`.claude/apex/elicit-profile.md`, if present, tunes technique selection
(Step 2) for the current repo without editing the skill itself.

Not required. Absence means: use `SKILL.md`'s Auto-Detection Matrix and
`techniques-catalog.md` unmodified.

---

## Format

```markdown
# Elicit Profile

## Always Apply
- SEC-01
- ARCH-04

## Exclude
- UX-05   # this repo has no responsive UI surface
- OBS-06  # no alerting infra yet

## Add for Code Type
| Code Type | Extra Techniques |
|-----------|-------------------|
| Config/Docs/Plugin | DOC-04, MAINT-03 |
```

---

## Precedence (Step 2)

1. `Exclude` entries are removed from any auto-selected or manual-presented list, always.
2. `Always Apply` entries are added to every run's selection, regardless of code type.
3. `Add for Code Type` entries are merged into the matrix row for a matching
   detected type (SKILL.md's Auto-Detection Matrix, or step-01's categorization
   table).
4. If the profile conflicts with itself (a technique in both `Always Apply`
   and `Exclude`), `Exclude` wins -- state this explicitly in the Step 5 report
   so the conflict is visible, not silently resolved.

---

## When to Create One

Create `.claude/apex/elicit-profile.md` when a repo repeatedly surfaces
irrelevant findings (e.g. UX-05 on a CLI-only repo) or repeatedly misses a
category the default matrix does not cover for that stack. Do not create it
speculatively -- it is a corrective, not a default scaffold.
