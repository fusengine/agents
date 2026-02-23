#!/usr/bin/env python3
"""track-watch-research.py - PostToolUse hook for tracking research."""

import json
import os
import sys
from datetime import datetime, timezone


def main() -> None:
    """Track research tool usage (exa, WebFetch, WebSearch)."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool = data.get("tool_name", "")
    if not any(k in tool for k in ("exa", "WebFetch", "WebSearch")):
        sys.exit(0)

    query = (data.get("tool_input", {}).get("query")
             or data.get("tool_input", {}).get("url")
             or data.get("tool_input", {}).get("prompt", ""))

    state_dir = os.path.join(os.path.expanduser("~"),
                             ".claude", "logs", "00-changelog")
    os.makedirs(state_dir, exist_ok=True)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    state_file = os.path.join(state_dir, f"{today}-research.json")
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    state = {"queries": []}
    if os.path.isfile(state_file):
        try:
            with open(state_file, encoding="utf-8") as f:
                state = json.load(f)
        except (json.JSONDecodeError, OSError):
            state = {"queries": []}

    state["queries"].append({
        "timestamp": ts, "tool": tool, "query": query,
    })

    try:
        with open(state_file, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, ensure_ascii=False)
    except OSError:
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
