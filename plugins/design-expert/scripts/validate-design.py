#!/usr/bin/env python3
"""validate-design.py - PostToolUse hook: validate design best practices."""

import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
from hook_output import post_pass

sys.path.insert(0, os.path.dirname(__file__))
from design_checks import run_all_checks


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    file_path = (data.get("tool_input") or {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)
    if not re.search(r"\.(tsx|jsx|css)$", file_path):
        sys.exit(0)

    if not os.path.isfile(file_path):
        sys.exit(0)

    try:
        with open(file_path, encoding="utf-8") as f:
            content = f.read()
    except OSError:
        sys.exit(0)

    warnings = run_all_checks(content)

    if warnings:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": " ".join(warnings),
            }
        }))

    post_pass("validate-design", "design ok")


if __name__ == "__main__":
    main()
