---
description: Monitor CI/CD pipeline and automatically fix failures. Watches GitHub Actions runs and applies fixes when tests fail.
disable-model-invocation: true
---

# Watch CI/CD

Monitor and auto-fix CI failures:

1. **Get Latest CI Run**:
   ```bash
   gh run list --limit 1
   gh run view [RUN_ID]
   ```

2. **Check Status**:
   - ✅ Success → Done
   - 🔄 In Progress → Wait (sleep 30s, check again)
   - ❌ Failed → Proceed to fix

3. **Analyze Failures**:
   ```bash
   gh run view [RUN_ID] --log-failed
   ```

   Extract:
   - Which jobs failed
   - Error messages
   - Stack traces
   - File locations

4. **Categorize Failures**:
   - **Linter Errors**: Run linters locally, fix with sniper
   - **Test Failures**: Identify failing tests, fix logic
   - **Build Errors**: Resolve compilation/build issues
   - **Dependency Issues**: Update/fix package conflicts

5. **Apply Fixes**:
   Based on failure type:
   - > Use sniper for linter errors
   - > Use research-expert for framework-specific issues
   - Fix code logic for test failures
   - Update dependencies for build issues

6. **Verify Locally**:
   ```bash
   bun run lint
   bun test
   bun run build
   ```

7. **Commit and Push**:
   ```bash
   git commit -m "$(cat <<'EOF'
   fix(ci): Resolve CI pipeline failures

   - [Fix 1]
   - [Fix 2]


   EOF
   )"
   git push
   ```

8. **Monitor New Run**:
   Wait for new CI run and repeat if needed.

**Arguments**:
- $ARGUMENTS can specify specific job to watch

**Example Usage**:
- `/watch-ci` → Monitor latest CI run
- `/watch-ci test` → Watch only test jobs
