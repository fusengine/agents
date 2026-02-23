#!/usr/bin/env python3
"""PreToolUse hook - Verifies security skill was read before code modifications."""
import json
import os
import sys
from datetime import date


def main():
    """Check if security skill was consulted before Write/Edit."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    file_path = data.get("tool_input", {}).get("file_path", "")

    if tool_name not in ("Write", "Edit"):
        sys.exit(0)

    import re
    if not re.search(r"\.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$", file_path):
        sys.exit(0)

    state_dir = os.path.join(os.path.expanduser("~"), ".claude", "logs", "00-security")
    today = date.today().isoformat()
    state_file = os.path.join(state_dir, f"{today}-state.json")

    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding="utf-8") as f:
                state = json.load(f)
            if state.get("skill_read") is True:
                sys.exit(0)
        except (json.JSONDecodeError, OSError):
            pass

    print("SECURITY: Read security skill references before modifying code.")
    print("Use: Read skills/security-scan/references/scan-patterns.md")
    sys.exit(0)


if __name__ == "__main__":
    main()
