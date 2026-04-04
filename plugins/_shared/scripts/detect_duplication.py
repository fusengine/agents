#!/usr/bin/env python3
"""detect_duplication.py - PreToolUse hook: DRY duplication blocker.

Extracts function/class names from new code, greps codebase for matches.
BLOCKS write if duplicates found — forces reuse over rewrite.
"""

import json
import os
import re
import sys

from check_skill_common import deny_block
from hook_output import allow_pass
from _duplication_patterns import (
    _KEYWORDS, _TS_PAT, _PHP_PAT, _TS_EXTENSIONS, _grep_dupes,
)


def _extract_names(content: str, ext: str) -> set:
    """Extract function/class names from content by extension."""
    pats = (_TS_PAT if ext in _TS_EXTENSIONS
            else _PHP_PAT if ext == ".php" else [])
    names = set()
    for pat in pats:
        for m in re.finditer(pat, content, re.MULTILINE):
            n = m.group(1)
            if n not in _KEYWORDS and len(n) > 12:
                names.add(n)
    return names


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)
    if data.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)
    ti = data.get("tool_input") or {}
    content = ti.get("content") or ti.get("new_string") or ""
    fp = ti.get("file_path", "")
    if not content or not fp:
        sys.exit(0)
    ext = os.path.splitext(fp)[1].lower()
    if ext not in (*_TS_EXTENSIONS, ".php"):
        sys.exit(0)
    cwd = data.get("cwd") or os.path.dirname(fp) or "."
    names = _extract_names(content, ext)
    dupes = _grep_dupes(names, cwd, ext, fp)
    if dupes:
        preview = ", ".join(sorted(names)[:5])
        files = ", ".join(dupes[:3])
        if len(dupes) > 3:
            files += f" (+{len(dupes) - 3} more)"
        if len(dupes) == 1:
            allow_pass(
                "detect_duplication",
                f"DRY WARNING: [{preview}] may exist in: {files}. "
                f"Check if you can reuse existing code.")
        else:
            deny_block(
                f"DRY BLOCKED: [{preview}] already exist in: {files}. "
                f"Import and reuse existing code instead of rewriting.")


if __name__ == "__main__":
    main()
