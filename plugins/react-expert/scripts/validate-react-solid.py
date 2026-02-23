#!/usr/bin/env python3
"""validate-react-solid.py - PostToolUse hook: SOLID validation for React."""

import json
import re
import sys


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
    if re.search(r"/(node_modules|dist|build)/", file_path):
        sys.exit(0)

    content = tool_input.get("content") or tool_input.get("new_string") or ""
    # Skip Next.js code (handled by nextjs-expert)
    if re.search(r"(use client|use server|NextRequest|NextResponse|from ['\"]next)", content):
        sys.exit(0)
    if not content:
        sys.exit(0)

    line_count = count_code_lines(content)
    violations = []

    if line_count > 100:
        violations.append(
            f"File has {line_count} lines (limit: 100). "
            "Split to hooks/, components/, or utils/."
        )

    if "/components/" in file_path:
        if re.search(r"^(export )?(interface|type) [A-Z]", content, re.MULTILINE):
            violations.append(
                "Interface/type in component. Move to src/interfaces/ or src/types/."
            )

    if re.search(r"^export (function|const) use[A-Z]", content, re.MULTILINE):
        if "/hooks/" not in file_path:
            violations.append(
                "Custom hook defined outside hooks/ directory. Move to hooks/."
            )

    if violations:
        deny_solid_violation(file_path, violations)
    sys.exit(0)


if __name__ == "__main__":
    main()
