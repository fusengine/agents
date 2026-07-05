# CHANGELOG Entry Templates

Load when: writing the actual CHANGELOG.md entry in Step S1 (Standard Path) or Step M4 (Marketplace Path).

## Standard Path (Step S1)

If `CHANGELOG.md` does not exist, create it with `# Changelog` heading.

Add a new entry at the top (after the `# Changelog` heading):

```markdown
## [X.Y.Z] - DD-MM-YYYY

- commit message from Step 1
```

## Marketplace Path (Step M4)

Add a new entry at the top of `CHANGELOG.md` (after the `# Changelog` heading):

```markdown
## [X.Y.Z] - DD-MM-YYYY

- type(plugin-name): description from the code commit message
```

Where `X.Y.Z` is the new suite version from Step M3. Include `(plugin-name X.Y.Z)` in each line for bumped plugins.
