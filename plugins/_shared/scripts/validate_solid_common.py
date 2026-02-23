#!/usr/bin/env python3
"""validate-solid-common.py - Common SOLID validation functions.

Importable functions (no main).
"""

import json
import sys


def count_code_lines(content: str, comment: str = "//") -> int:
    """Count non-empty, non-comment lines in content."""
    count = 0
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith(comment):
            continue
        if stripped.startswith("*"):
            continue
        count += 1
    return count


def deny_solid_violation(file_path: str, violations: list[str]) -> None:
    """Output hookSpecificOutput deny for SOLID violation and exit."""
    reason = f"SOLID VIOLATION in {file_path}: " + " ".join(violations)
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)
