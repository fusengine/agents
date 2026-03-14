#!/usr/bin/env python3
"""_duplication_patterns.py - Constants and regex patterns for DRY detection."""

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

_TS_EXTENSIONS = frozenset([".ts", ".tsx", ".js", ".jsx"])

_GREP_EXCLUDE_DIRS = [
    "--exclude-dir=vendor", "--exclude-dir=node_modules",
    "--exclude-dir=.next", "--exclude-dir=.git",
    "--exclude-dir=dist", "--exclude-dir=build",
    "--exclude-dir=coverage", "--exclude-dir=.turbo",
]

_TS_DECL = r"(function|const|let|class|interface)\s+"
_PHP_DECL = r"(function|class|interface|trait)\s+"
