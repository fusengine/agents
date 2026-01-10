---
description: Fast conventional commits with automatic git add and push. Creates semantic commit messages following Conventional Commits spec.
---

# Fast Commit Workflow

Create a conventional commit with the following workflow:

1. **Pre-flight: Clean .DS_Store** (MANDATORY):
   ```bash
   # Check if .gitignore exists and contains .DS_Store
   if ! grep -q "^\.DS_Store$" .gitignore 2>/dev/null; then
     echo ".DS_Store" >> .gitignore
   fi
   # Remove any tracked .DS_Store files
   find . -name ".DS_Store" -type f -exec git rm --cached {} \; 2>/dev/null
   ```

2. **Stage Changes**:
   ```bash
   git add .
   ```

3. **Analyze Changes**:
   - Run `git diff --cached --stat` to see what's being committed
   - Identify the type of change (feat/fix/docs/style/refactor/test/chore)

4. **Draft Commit Message - 50/72 RULE STRICT**:
   Format: `<type>(<scope>): <short description - MAX 50 chars>`

   **LENGTH REQUIREMENT**:
   - Subject: **50 characters MAXIMUM** (never exceed)
   - Message must be short, clear, self-sufficient
   - NO body (lists, details, etc.) except exceptional cases

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `style`: Formatting, missing semicolons, etc
   - `refactor`: Code change that neither fixes bug nor adds feature
   - `test`: Adding tests
   - `chore`: Updating build tasks, configs, etc

   **CORRECT EXAMPLES** (≤50 chars):
   - `fix(auth): fix JWT token validation` (35) ✅
   - `feat(api): add users endpoint` (30) ✅
   - `refactor(db): optimize SQL queries` (35) ✅

5. **MANDATORY: Ask User Validation**:
   - Present drafted commit message to user
   - Show list of files being committed
   - Wait for user confirmation before proceeding
   - Allow user to modify message if needed

6. **Commit** (WITHOUT Claude Code signatures):
   ```bash
   git commit -m "$(cat <<'EOF'
   [TYPE](scope): [DESCRIPTION - 50 chars max]
   EOF
   )"
   ```

   **ABSOLUTE PROHIBITIONS**:
   - ❌ NEVER add "🤖 Generated with Claude Code"
   - ❌ NEVER add "Co-Authored-By: Claude <noreply@anthropic.com>"
   - ❌ NEVER exceed 50 characters on subject line
   - ❌ NEVER add body with lists/exhaustive details

7. **Push Changes** (ONLY if requested):
   ```bash
   git push
   ```

**Arguments**:
- $ARGUMENTS will be used as commit scope or additional context

**Example Usage**:
- `/commit auth` → Commits auth-related changes
- `/commit` → Commits all changes with auto-detected scope
