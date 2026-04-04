#!/usr/bin/env python3
"""_duplication_patterns.py - Constants, regex patterns and grep logic for DRY detection."""

import os
import re
import subprocess

_KEYWORDS = frozenset([
    "if", "for", "while", "switch", "catch", "return", "async",
    "new", "get", "set", "map", "run", "use", "test", "main",
])

_TS_PAT = [
    r"(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*[(<]",
    r"(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(",
    r"class\s+(\w+)\b",
]

_PHP_PAT = [
    r"(?:public|protected|private|static\s+)*function\s+(\w+)\s*\(",
    r"(?:class|interface|trait)\s+(\w+)\b",
]

_TS_EXTENSIONS = frozenset([".ts", ".tsx", ".js", ".jsx", ".astro"])

_GREP_EXCLUDE_DIRS = [
    "--exclude-dir=vendor", "--exclude-dir=node_modules",
    "--exclude-dir=.next", "--exclude-dir=.git",
    "--exclude-dir=dist", "--exclude-dir=build",
    "--exclude-dir=coverage", "--exclude-dir=.turbo",
]

_TS_DECL = r"(function|const|let|class|interface)\s+"
_PHP_DECL = r"(function|class|interface|trait)\s+"


def _get_module(filepath: str) -> str:
    """Extract module name from path (modules/X/... -> X, else '')."""
    parts = os.path.normpath(filepath).split(os.sep)
    for i, part in enumerate(parts):
        if part == "modules" and i + 1 < len(parts):
            return parts[i + 1]
    return ""


def _grep_dupes(names: set, cwd: str, ext: str, exclude: str) -> list:
    """Grep codebase for DECLARATIONS, respecting module boundaries.

    Same-module matches block; cross-module matches emit a hint only.
    """
    if not names:
        return []
    inc = (["--include=*.ts", "--include=*.tsx", "--include=*.js", "--include=*.jsx"]
           if ext in _TS_EXTENSIONS else ["--include=*.php"])
    decl = _TS_DECL if ext in _TS_EXTENSIONS else _PHP_DECL
    pat = decl + r"(" + "|".join(re.escape(n) for n in names) + r")\b"
    try:
        result = subprocess.run(
            ["grep", "-rEl", *_GREP_EXCLUDE_DIRS, *inc, "--", pat, cwd],
            capture_output=True, text=True, timeout=1.5, check=False)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return []
    ex = os.path.abspath(exclude)
    target_mod = _get_module(exclude)
    matches = []
    for f in result.stdout.splitlines():
        f = f.strip()
        if not f or os.path.abspath(f) == ex:
            continue
        dupe_mod = _get_module(f)
        if target_mod and dupe_mod and dupe_mod != target_mod:
            continue
        matches.append(f)
    return matches
