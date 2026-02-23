#!/usr/bin/env python3
"""PostToolUse hook - Track Swift skill file reads via shared tracking."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
try:
    from tracking import track_skill_read
except ImportError:
    sys.exit(0)


def main():
    """Track Read tool calls on skill files."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")

    if tool_name != "Read":
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not re.search(r"skills/.*\.(md|txt)$", file_path):
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    track_skill_read("swift", "skill:Read", file_path, session_id)


if __name__ == "__main__":
    main()
