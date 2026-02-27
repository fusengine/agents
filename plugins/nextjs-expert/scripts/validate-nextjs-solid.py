#!/usr/bin/env python3
"""validate-nextjs-solid.py - PostToolUse hook: SOLID validation for Next.js/TypeScript."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import allow_pass


def count_code_lines(content: str) -> int:
    """Count non-empty, non-comment lines."""
    count = 0
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("//") or stripped.startswith("*"):
            continue
        count += 1
    return count


def deny_solid_violation(file_path: str, violations: list[str]) -> None:
    """Output deny decision for SOLID violation and exit."""
    reason = f"SOLID VIOLATION in {file_path}: " + " ".join(violations)
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|ts|jsx|js)$", file_path):
        sys.exit(0)
    if re.search(r"/(node_modules|dist|build|\.next)/", file_path):
        sys.exit(0)

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if not content:
        sys.exit(0)

    line_count = count_code_lines(content)
    max_lines = 100
    if re.search(r"(page|layout|loading|error|not-found)\.(tsx|ts)$", file_path):
        max_lines = 150

    violations = []

    if line_count > max_lines:
        violations.append(
            f"File has {line_count} lines (limit: {max_lines}). "
            "Split to lib/, hooks/, or components/."
        )

    if re.search(r"/(app|components|modules)/", file_path):
        if re.search(r"^(export )?(interface|type) [A-Z]", content, re.MULTILINE):
            violations.append(
                "Interface/type in component. Move to modules/cores/interfaces/ or src/types/."
            )

    if re.search(r"(useState|useEffect|useRef|onClick|onChange)", content):
        first_lines = "\n".join(content.splitlines()[:5])
        if "'use client'" not in first_lines and '"use client"' not in first_lines:
            violations.append(
                "Client hooks detected but 'use client' directive missing at top."
            )

    if violations:
        deny_solid_violation(file_path, violations)
    allow_pass("validate-nextjs-solid", "SOLID ok")


if __name__ == "__main__":
    main()
