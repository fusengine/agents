#!/usr/bin/env python3
"""PostToolUse: persist WebFetch responses to the global webfetch cache.

Mirrors ``webfetch-cache-lookup.py`` (PreToolUse): same hash
``sha256(url.strip() + "\\n" + prompt[:500])[:16]`` and same layout
``~/.claude/fusengine-cache/webfetch/<hash>.md``. The lookup hook treats
files older than 24h as stale, so re-running this store hook refreshes
the entry via mtime update.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from _shared.cache_compactor import compact_markdown
from _shared.cache_io import atomic_write
from _shared.mcp_response import extract_text as _extract_text

TOOL_NAME = "WebFetch"
PROMPT_TRUNC = 500
CACHE_DIR = os.path.join(
    os.path.expanduser("~"), ".claude", "fusengine-cache", "webfetch"
)


def _cache_key(url: str, prompt: str) -> str:
    """Return 16-char sha256 of ``url + "\\n" + prompt[:500]`` (lookup-aligned).

    :param url: WebFetch target URL (already stripped).
    :param prompt: WebFetch prompt (truncated to 500 chars).
    :return: First 16 hex chars of the sha256 digest.
    """
    payload = f"{url}\n{prompt[:PROMPT_TRUNC]}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()[:16]


def _normalize_response(tool_response) -> str:
    """Extract markdown text from WebFetch tool_response (str | dict | list)."""
    if isinstance(tool_response, dict):
        text = tool_response.get("text")
        if isinstance(text, str):
            return text
    if isinstance(tool_response, (str, list)):
        return _extract_text(tool_response)
    if not tool_response:
        return ""
    return str(tool_response)


def main() -> None:
    """Entry: read stdin event, write compacted body to global cache file."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError, ValueError):
        sys.exit(0)
    if data.get("tool_name") != TOOL_NAME:
        sys.exit(0)
    tool_input = data.get("tool_input") or {}
    url = tool_input.get("url")
    prompt = tool_input.get("prompt") or ""
    if not isinstance(url, str) or not url.strip():
        sys.exit(0)
    if not isinstance(prompt, str):
        prompt = ""
    url_clean = url.strip()

    body = compact_markdown(_normalize_response(data.get("tool_response")))
    if not body:
        sys.exit(0)

    qhash = _cache_key(url_clean, prompt)
    path = os.path.join(CACHE_DIR, f"{qhash}.md")
    # Always overwrite: atomic_write (os.replace) refreshes mtime so stale
    # entries (>TTL) get renewed on the next WebFetch. See lookup TTL_SECONDS.

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    front = (
        f"---\ntool: {TOOL_NAME}\nurl: {json.dumps(url_clean)}\n"
        f"prompt: {json.dumps(prompt[:PROMPT_TRUNC])}\nts: {ts}\nhash: {qhash}\n---\n\n"
    )
    atomic_write(path, front + body)
    sys.exit(0)


if __name__ == "__main__":
    main()
