#!/usr/bin/env python3
"""PreToolUse hook: short-circuit WebFetch calls when a fresh cached body exists.

Cache layout: ``~/.claude/fusengine-cache/webfetch/<sha256_16>.md`` where the
hash is computed from ``url + "\\n" + prompt[:500]``. Entries are considered
fresh for 24h based on file mtime; stale entries are ignored (let the call go
through so the store-side hook can refresh them).
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import time

CACHE_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache", "webfetch"
)
TTL_SECONDS = 24 * 3600
MAX_BODY = 8 * 1024
PROMPT_TRUNC = 500


def _cache_key(url: str, prompt: str) -> str:
    """Return 16-char sha256 hex digest of ``url + "\\n" + prompt[:500]``."""
    payload = f"{url}\n{prompt[:PROMPT_TRUNC]}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()[:16]


def _read_body(path: str) -> str:
    """Read up to MAX_BODY bytes from *path*; empty string on failure."""
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            return fh.read(MAX_BODY)
    except OSError:
        return ""


def _deny(reason: str) -> None:
    """Emit PreToolUse deny JSON and exit 0."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def main() -> None:
    """Entry point: parse stdin, lookup cache, deny on fresh hit."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError, ValueError):
        sys.exit(0)
    if data.get("tool_name") != "WebFetch":
        sys.exit(0)
    tool_input = data.get("tool_input") or {}
    url = tool_input.get("url")
    prompt = tool_input.get("prompt") or ""
    if not isinstance(url, str) or not url.strip():
        sys.exit(0)
    if not isinstance(prompt, str):
        prompt = ""
    path = os.path.join(CACHE_DIR, f"{_cache_key(url.strip(), prompt)}.md")
    if not os.path.isfile(path):
        sys.exit(0)
    try:
        age = time.time() - os.path.getmtime(path)
    except OSError:
        sys.exit(0)
    if age >= TTL_SECONDS:
        sys.exit(0)
    body = _read_body(path)
    if not body:
        sys.exit(0)
    reason = (
        f"CACHE HIT WebFetch (~{len(body) // 1024 + 1}KB economise, "
        f"cached il y a {int(age // 3600)}h):\n\n{body}\n\n"
        "Pour forcer un nouveau fetch, modifie l'URL ou la query."
    )
    _deny(reason)


if __name__ == "__main__":
    main()
