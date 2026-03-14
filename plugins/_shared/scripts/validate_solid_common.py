#!/usr/bin/env python3
"""validate_solid_common.py - Common SOLID validation functions.

Importable functions (no main).
"""

from __future__ import annotations

import json
import os
import sys


def count_code_lines(content: str, comment: str = "//") -> int:
    """Count non-empty, non-comment lines in content."""
    count = 0
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith(comment) or stripped.startswith("*"):
            continue
        count += 1
    return count


def read_file_from_disk(file_path: str) -> str | None:
    """Read full file content from disk, return None on failure."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except OSError:
        return None


def get_full_file_content(tool_name: str, file_path: str, content: str) -> str:
    """Get full file content: direct for Write, from disk for Edit."""
    if tool_name == "Edit" and os.path.isfile(file_path):
        return read_file_from_disk(file_path) or content
    return content


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
