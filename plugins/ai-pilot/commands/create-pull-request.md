---
description: Auto-generate Pull Request with comprehensive description, test plan, and changelog. Uses gh CLI for creation.
disable-model-invocation: true
---

# Create Pull Request

Generate and create a comprehensive Pull Request:

1. **Analyze Branch Changes**:
   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```

2. **Extract Commit Information**:
   - Parse all commit messages since branch diverged from main
   - Identify key features/fixes/changes
   - Categorize changes (Features, Bug Fixes, Documentation, etc.)

3. **Generate PR Description**:
   ```markdown
   ## Summary
   [Concise overview of changes]

   ## Changes
   - ✨ Feature: [Description]
   - 🐛 Fix: [Description]
   - 📚 Docs: [Description]

   ## Test Plan
   - [ ] Unit tests pass (`bun test`)
   - [ ] Linters pass (`bun run lint`)
   - [ ] Manual testing completed
   - [ ] [Specific test scenario]

   ## Breaking Changes
   [None / List any breaking changes]

   ## Screenshots
   [If applicable]

   ```

4. **Create PR**:
   ```bash
   gh pr create --title "[TITLE]" --body "$(cat <<'EOF'
   [GENERATED DESCRIPTION]
   EOF
   )"
   ```

5. **Output PR URL**

**Arguments**:
- $ARGUMENTS will be used as PR title or additional context

**Example Usage**:
- `/create-pull-request Add authentication` → Creates PR with title
- `/create-pull-request` → Auto-generates title from commits
