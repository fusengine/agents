#!/usr/bin/env python3
"""SessionStart hook: purge stale fusengine-cache entries.

Only directories in :data:`PURGEABLE_DIRS` are walked and trimmed
against their TTL. Everything else under ``~/.claude/fusengine-cache``
(``skill-tracking/``, ``lessons/``, ``analytics/``, ``tests/``, root
files such as ``subagent-debug.log`` or ``.design-state-*.json``,
plus any future top-level dir we have not opted in) is preserved.

Empty subdirectories within purgeable trees are pruned bottom-up.
Best-effort: every filesystem error is swallowed and the hook always
exits 0 to avoid blocking SessionStart.
"""
from __future__ import annotations

import os
import sys
import time

CACHE_BASE = os.path.join(os.path.expanduser("~"), ".claude", "fusengine-cache")

PURGEABLE_DIRS = {
    "sessions": 48 * 3600,
    "webfetch": 24 * 3600,
    "doc": 48 * 3600,
    "explore": 48 * 3600,
}


def _ttl_for(rel_path: str) -> int | None:
    """Return TTL (seconds) for *rel_path* or ``None`` if not purgeable."""
    head = rel_path.split(os.sep, 1)[0]
    return PURGEABLE_DIRS.get(head)


def _purge(root: str, now: float) -> int:
    """Remove files under whitelisted subtrees older than their TTL.

    Root-level files (``rel_dir`` empty) are always skipped.
    Returns the number of files successfully removed.
    """
    if not os.path.isdir(root):
        return 0
    removed = 0
    for dirpath, _dirs, files in os.walk(root):
        rel_dir = os.path.relpath(dirpath, root)
        if rel_dir in ("", "."):
            continue
        max_age = _ttl_for(rel_dir)
        if max_age is None:
            continue
        for name in files:
            path = os.path.join(dirpath, name)
            try:
                if now - os.path.getmtime(path) > max_age:
                    os.remove(path)
                    removed += 1
            except OSError:
                pass
    return removed


def _prune_empty_dirs(root: str) -> None:
    """Best-effort removal of empty subdirs within purgeable trees only."""
    for top in PURGEABLE_DIRS:
        sub_root = os.path.join(root, top)
        if not os.path.isdir(sub_root):
            continue
        for dirpath, _dirs, _files in os.walk(sub_root, topdown=False):
            if dirpath == sub_root:
                continue
            try:
                os.rmdir(dirpath)
            except OSError:
                pass


def main() -> None:
    """Entry: purge stale cache files, then prune empty dirs."""
    now = time.time()
    try:
        _purge(CACHE_BASE, now)
        _prune_empty_dirs(CACHE_BASE)
    except Exception:
        pass
    sys.exit(0)


if __name__ == "__main__":
    main()
