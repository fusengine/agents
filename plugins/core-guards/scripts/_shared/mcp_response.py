"""Helpers for normalizing MCP tool_response payloads into markdown text."""
from __future__ import annotations

import json

_MAX_DEPTH = 5


def extract_text(tool_response, _depth: int = 0) -> str:
    """Extract usable markdown from an MCP tool_response.

    Accepts a string, a list of content blocks (mixed text/image: non-text
    blocks are skipped silently), or any other JSON-serializable structure
    (encoded as a fallback). Recurses up to depth 5 to guard against
    pathological or cyclic structures.
    """
    if _depth >= _MAX_DEPTH:
        return ""
    if isinstance(tool_response, str):
        return tool_response
    if isinstance(tool_response, list):
        parts = [
            b.get("text", "")
            for b in tool_response
            if isinstance(b, dict) and b.get("type") == "text"
        ]
        if parts:
            return "\n\n".join(parts)
        nested = [
            extract_text(b, _depth + 1)
            for b in tool_response
            if isinstance(b, (list, dict))
        ]
        joined = "\n\n".join(p for p in nested if p)
        if joined:
            return joined
    if not tool_response:
        return ""
    try:
        return json.dumps(tool_response, sort_keys=True, ensure_ascii=False, default=str)
    except (TypeError, ValueError):
        return ""
