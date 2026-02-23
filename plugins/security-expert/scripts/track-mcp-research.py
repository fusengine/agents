#!/usr/bin/env python3
"""PostToolUse hook - Tracks MCP research consultations (context7, exa)."""
import json
import os
import sys
from datetime import datetime, timezone


def main():
    """Track MCP tool calls for research logging."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")

    if "context7" not in tool_name and "exa" not in tool_name:
        sys.exit(0)

    query = (
        data.get("tool_input", {}).get("query")
        or data.get("tool_input", {}).get("libraryId")
        or data.get("tool_input", {}).get("libraryName")
        or ""
    )

    state_dir = os.path.join(os.path.expanduser("~"), ".claude", "logs", "00-security")
    os.makedirs(state_dir, exist_ok=True)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    state_file = os.path.join(state_dir, f"{today}-state.json")
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    state = {"skill_read": False, "reads": [], "research": []}
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding="utf-8") as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            pass

    state.setdefault("research", []).append(
        {"timestamp": timestamp, "tool": tool_name, "query": query}
    )

    with open(state_file, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)
    sys.exit(0)


if __name__ == "__main__":
    main()
