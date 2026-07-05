# Tag Timing Rationale

Load when: you need the full explanation for why Step S2 (Standard Path) and Step M5 (Marketplace Path) never create a git tag.

## Standard Path (Step S2)

**No tag here** — under `/fuse-commit-pro:commit`'s GitHub Flow (squash merge), this commit lives on the feature branch and gets squashed into a new commit on `main`; tagging it now would orphan the tag. The tag (`vX.Y.Z`) is created POST-MERGE, on `main`'s squash commit, by Step 8 of the `commit` command.

Standalone use of this skill outside that flow (no PR/squash involved) may tag manually once the change is on its permanent branch.

## Marketplace Path (Step M5)

**No tag here.** With squash-merge GitHub Flow, this bump commit lives on the feature branch and gets squashed into a new commit on `main` — tagging it now would orphan the tag. The tag is created POST-MERGE, on `main`'s squash commit, by Step 8 of the `commit` command (`git tag vX.Y.Z && git push origin vX.Y.Z` after `gh pr merge --squash`).
