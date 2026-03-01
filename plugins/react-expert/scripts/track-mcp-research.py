#!/usr/bin/env python3
"""track-mcp-research.py - Track MCP research calls for react-expert."""

import json
import os
import re
import sys
from datetime import datetime, timezone


_FRAMEWORK_MAP = [
    (["react"], "react"),
    (["next"], "nextjs"),
    (["tailwind"], "tailwind"),
    (["laravel", "php"], "laravel"),
    (["swift", "swiftui", "ios"], "swift"),
    (["design", "shadcn", " ui"], "design"),
]


def detect_framework(query: str) -> str:
    """Detect framework from query string."""
    q = query.lower()
    for keywords, framework in _FRAMEWORK_MAP:
        if any(kw in q for kw in keywords):
            return framework
    return "generic"


def track_mcp_research(source: str, tool: str, query: str, session_id: str) -> None:
    """Write tracking entry to TRACKING_DIR."""
    from tracking import TRACKING_DIR
    tracking_dir = TRACKING_DIR
    os.makedirs(tracking_dir, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    framework = detect_framework(query)
    entry = f"{timestamp} {source}:{tool} {query}\n"
    tracking_file = os.path.join(tracking_dir, f"{framework}-{session_id}")
    with open(tracking_file, "a", encoding="utf-8") as f:
        f.write(entry)
    if framework != "generic":
        generic = os.path.join(tracking_dir, f"generic-{session_id}")
        with open(generic, "a", encoding="utf-8") as f:
            f.write(entry)


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name", "")
    if not re.match(r"^mcp__", tool_name):
        sys.exit(0)

    tool_input = data.get("tool_input") or {}
    query = tool_input.get("query") or tool_input.get("topic") or ""
    if not query:
        sys.exit(0)

    session_id = data.get("session_id") or f"fallback-{os.getpid()}"
    source = "mcp"
    if "context7" in tool_name:
        source = "context7"
    elif "exa" in tool_name:
        source = "exa"

    track_mcp_research(source, tool_name, query, session_id)
    sys.exit(0)


if __name__ == "__main__":
    main()
