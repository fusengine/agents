"""playwright_helpers.py - Shared helpers for Playwright browsing checks."""

import json
import os
import sys

EXEMPT_DIRS = ("node_modules/", "dist/", "build/", ".claude/")


def deny_block(reason: str) -> None:
    """Emit deny block and exit."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


def is_exempt(fp: str) -> bool:
    """Return True if the file is exempt from screenshot checks."""
    if os.path.basename(fp) == "design-system.md":
        return False
    return fp.endswith(".md") or any(d in fp for d in EXEMPT_DIRS)


def find_design_system(file_path: str) -> bool:
    """Check up to 5 parent dirs for design-system.md."""
    check_dir = os.path.dirname(file_path)
    for _ in range(5):
        if os.path.isfile(os.path.join(check_dir, "design-system.md")):
            return True
        parent = os.path.dirname(check_dir)
        if parent == check_dir:
            break
        check_dir = parent
    return False
