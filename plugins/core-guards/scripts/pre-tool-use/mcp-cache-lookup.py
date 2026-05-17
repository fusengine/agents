#!/usr/bin/env python3
"""PreToolUse hook: short-circuit MCP calls when a cached answer exists."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.state_manager import sanitize_session_id

CACHED_TOOLS = {
    "mcp__context7__query-docs": ("query", "topic", "libraryName"),
    "mcp__exa__web_search_exa": ("query",),
    "mcp__exa__get_code_context_exa": ("query", "libraryName"),
}
BASE_DIR = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache", "sessions")
MAX_BODY = 8 * 1024
RG_TIMEOUT = 2
TTL_SECONDS = 48 * 3600


def _extract_query(tool_input: dict, keys: tuple) -> str:
    """Return first non-empty string field from *tool_input* among *keys*."""
    for key in keys:
        val = tool_input.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return ""


def _rg_find(query: str, cache_dir: str) -> str:
    """Run ripgrep; return matched file path or empty on miss/error."""
    needle = query.replace("\n", " ").replace("\r", " ")[:80]
    try:
        proc = subprocess.run(
            ["rg", "-l", "-i", "-F", "--max-count=1", needle, cache_dir],
            timeout=RG_TIMEOUT, capture_output=True, text=True, check=False)
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        return ""
    if proc.returncode != 0 or not proc.stdout:
        return ""
    return proc.stdout.splitlines()[0].strip()


def _read_body(path: str) -> str:
    """Read up to MAX_BODY bytes; empty string on failure."""
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            return fh.read(MAX_BODY)
    except OSError:
        return ""


def _deny(reason: str) -> None:
    """Emit PreToolUse deny JSON and exit."""
    print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse",
        "permissionDecision": "deny", "permissionDecisionReason": reason}}))
    sys.exit(0)


def main() -> None:
    """Parse stdin, look up cache, deny with cached body on fresh hit."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)
    tool_name = data.get("tool_name", "")
    if tool_name not in CACHED_TOOLS:
        sys.exit(0)
    query = _extract_query(data.get("tool_input") or {}, CACHED_TOOLS[tool_name])
    try:
        sid = sanitize_session_id(data.get("session_id", "") or "unknown")
    except ValueError:
        sys.exit(0)
    cache_dir = os.path.join(BASE_DIR, sid, "context", "mcp")
    if not query or not os.path.isdir(cache_dir):
        sys.exit(0)
    match = _rg_find(query, cache_dir)
    if not match:
        sys.exit(0)
    try:
        age = time.time() - os.path.getmtime(match)
    except OSError:
        sys.exit(0)
    if age >= TTL_SECONDS:
        sys.exit(0)
    body = _read_body(match)
    if not body:
        sys.exit(0)
    _deny(f"CACHE HIT (~{len(body) // 1024 + 1}KB economise, cached il y a "
          f"{int(age // 3600)}h): {body}\n\nReformule pour forcer un re-call.")


if __name__ == "__main__":
    main()
