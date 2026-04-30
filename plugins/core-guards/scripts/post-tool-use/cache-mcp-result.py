#!/usr/bin/env python3
"""PostToolUse: Cache MCP results into per-session context store."""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.cache_compactor import compact_markdown, jaccard_similar, query_hash
from _shared.cache_io import atomic_write, load_index
from _shared.mcp_response import extract_text as _extract_text
from _shared.state_manager import sanitize_session_id

CACHED_TOOLS = {
    "mcp__context7__query-docs": ("query", "topic", "libraryName"),
    "mcp__exa__web_search_exa": ("query",),
    "mcp__exa__get_code_context_exa": ("query", "libraryName"),
}
BASE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache", "sessions")


def _short_name(tool_name: str) -> str:
    """Return short slug for a MCP tool id."""
    return tool_name.replace("mcp__", "").replace("__", "-")


def _extract_query(tool_input: dict, keys: tuple) -> str:
    """Extract first non-empty query field from tool_input."""
    for key in keys:
        val = tool_input.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return ""


def _is_duplicate(index: list, tool_name: str, query: str) -> bool:
    """Return True if a Jaccard-similar query already exists for tool_name."""
    return any(
        e.get("tool") == tool_name and jaccard_similar(e.get("query", ""), query)
        for e in index
    )


def main() -> None:
    """Entry: read stdin event, dedup, compact, persist cache + index."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    tool_name = data.get("tool_name", "")
    if tool_name not in CACHED_TOOLS:
        sys.exit(0)
    query = _extract_query(data.get("tool_input") or {}, CACHED_TOOLS[tool_name])
    if not query:
        sys.exit(0)
    try:
        sid = sanitize_session_id(data.get("session_id", "") or "unknown")
    except ValueError:
        sys.exit(0)

    qhash = query_hash(tool_name, query)
    ctx_root = os.path.join(BASE_DIR, sid, "context")
    file_path = os.path.join(ctx_root, "mcp", f"{_short_name(tool_name)}-{qhash}.md")
    index_path = os.path.join(ctx_root, "index.json")

    if os.path.isfile(file_path):
        sys.exit(0)
    index = load_index(index_path)
    if _is_duplicate(index, tool_name, query):
        sys.exit(0)

    body = compact_markdown(_extract_text(data.get("tool_response")))
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    front = f"---\ntool: {tool_name}\nquery: {json.dumps(query)}\nts: {ts}\nhash: {qhash}\n---\n\n"
    atomic_write(file_path, front + body)
    index.append({"tool": tool_name, "query": query, "hash": qhash, "ts": ts, "file": os.path.basename(file_path)})
    atomic_write(index_path, json.dumps(index, indent=2))
    sys.exit(0)


if __name__ == "__main__":
    main()
