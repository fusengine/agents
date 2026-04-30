"""I/O helpers for MCP cache: atomic write + index load."""
from __future__ import annotations

import json
import os
import tempfile


def atomic_write(path: str, data: str) -> None:
    """Atomically write *data* to *path* with 0o600 permissions.

    :param path: Target file path (parent dirs created at 0o700).
    :param data: UTF-8 string content.
    """
    parent = os.path.dirname(path)
    os.makedirs(parent, mode=0o700, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=parent, prefix=".cache_", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(data)
            fh.flush()
            os.fsync(fh.fileno())
        os.chmod(tmp, 0o600)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def load_index(path: str) -> list:
    """Read JSON list from *path*, return [] on missing/corrupt.

    :param path: Index file path.
    :return: Parsed list or empty list.
    """
    if not os.path.isfile(path):
        return []
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def summarize_index(index: list) -> dict:
    """Summarize an index list of cache entries.

    :param index: List of dict entries; each may contain ``tool`` and ``ts``.
    :return: Dict with ``total``, ``by_tool``, ``oldest_ts``, ``newest_ts``.
    """
    by_tool: dict[str, int] = {}
    timestamps: list[str] = []
    for entry in index:
        if not isinstance(entry, dict):
            continue
        tool = entry.get("tool")
        if isinstance(tool, str):
            by_tool[tool] = by_tool.get(tool, 0) + 1
        ts = entry.get("ts")
        if isinstance(ts, str):
            timestamps.append(ts)
    return {
        "total": len(index),
        "by_tool": by_tool,
        "oldest_ts": min(timestamps) if timestamps else None,
        "newest_ts": max(timestamps) if timestamps else None,
    }
