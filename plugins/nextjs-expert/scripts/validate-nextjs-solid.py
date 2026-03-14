#!/usr/bin/env python3
"""validate-nextjs-solid.py - PreToolUse hook: SOLID validation for Next.js."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
# pylint: disable=wrong-import-position
from check_skill_common import find_project_root
from hook_output import allow_pass
from validate_solid_common import (
    count_code_lines, deny_solid_violation, get_full_file_content)

NEXT_CONFIG_FILES = ("next.config.js", "next.config.ts", "next.config.mjs")


def _is_nextjs_project(file_path: str) -> bool:
    """Check if file belongs to a Next.js project."""
    root = find_project_root(os.path.dirname(file_path), "package.json", ".git")
    return any(os.path.isfile(os.path.join(root, f)) for f in NEXT_CONFIG_FILES)


def _check_violations(fp: str, content: str, full_file: str) -> list[str]:
    """Return list of SOLID violations for a Next.js file."""
    violations = []
    max_lines = 150 if re.search(
        r"(page|layout|loading|error|not-found)\.(tsx|ts)$", fp) else 100
    line_count = count_code_lines(full_file)
    if line_count > max_lines:
        violations.append(
            f"File has {line_count} lines (limit: {max_lines}). "
            "Split to lib/, hooks/, or components/.")
    if re.search(r"/(app|components|modules)/", fp):
        if not re.search(r"/interfaces/", fp):
            if re.search(r"^(export )?(interface|type) [A-Z]", content, re.MULTILINE):
                violations.append("Interface/type in component. "
                    "Move to modules/[feature]/src/interfaces/.")
    if re.search(r"(useState|useEffect|useRef|onClick|onChange)", content):
        first_lines = "\n".join(full_file.splitlines()[:5])
        if "'use client'" not in first_lines and '"use client"' not in first_lines:
            violations.append(
                "Client hooks detected but 'use client' directive missing at top.")
    return violations


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
    if not _is_nextjs_project(file_path):
        sys.exit(0)
    content = tool_input.get("content") or tool_input.get("new_string") or ""
    if not content:
        sys.exit(0)
    full_file = get_full_file_content(tool_name, file_path, content)
    violations = _check_violations(file_path, content, full_file)
    if violations:
        deny_solid_violation(file_path, violations)
    allow_pass("validate-nextjs-solid", "SOLID ok")


if __name__ == "__main__":
    main()
