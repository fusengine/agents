#!/usr/bin/env python3
"""PostToolUse hook - Track MCP research calls via shared tracking."""
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.expanduser("~"),
    ".claude", "plugins", "marketplaces", "fusengine-plugins",
    "plugins", "_shared", "scripts"))
try:
    from tracking import track_mcp_research
except ImportError:
    sys.exit(0)


def main():
    """Track MCP tool calls for research logging."""
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")

    if not re.match(r"^mcp__", tool_name):
        sys.exit(0)

    query = data.get("tool_input", {}).get("query") or \
            data.get("tool_input", {}).get("topic") or ""
    if not query:
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"

    source = "mcp"
    if "context7" in tool_name:
        source = "context7"
    elif "exa" in tool_name:
        source = "exa"

    track_mcp_research(source, tool_name, query, session_id)


if __name__ == "__main__":
    main()
