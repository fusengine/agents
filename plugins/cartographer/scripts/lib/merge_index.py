"""Merge index.md — preserve enriched descriptions, add new entries.

When the script regenerates index.md, it compares with existing content.
If an existing entry has a longer description (enriched by agent), it is kept.
New entries not in the existing file are added with auto-generated descriptions.
"""

from __future__ import annotations

import re
from pathlib import Path

_ENTRY_RE = re.compile(
    r"^(.*?)\[([^\]]+)\]\(([^)]+)\)\s*(?:—|-{1,2})\s*(.*)$",
)


def _parse_entry(line: str) -> tuple[str, str, str, str] | None:
    """Extract (prefix, name, path, desc) from a tree line."""
    m = _ENTRY_RE.match(line)
    return (m.group(1), m.group(2), m.group(3), m.group(4)) if m else None


def merge_lines(new_lines: list[str], output_path: Path) -> list[str]:
    """Merge new lines with existing index.md, preserving enriched descriptions.

    Returns the merged lines ready to write.
    """
    if not output_path.exists():
        return new_lines

    existing = output_path.read_text(encoding="utf-8").splitlines()

    # Build lookup: path -> description from existing file
    existing_descs: dict[str, str] = {}
    for line in existing:
        parsed = _parse_entry(line)
        if parsed:
            _, _, path, desc = parsed
            existing_descs[path] = desc

    # Merge: keep longer description from existing
    merged = []
    for line in new_lines:
        parsed = _parse_entry(line)
        if parsed:
            prefix, name, path, new_desc = parsed
            old_desc = existing_descs.get(path, "")
            if len(old_desc) > len(new_desc):
                line = f"{prefix}[{name}]({path}) — {old_desc}"
        merged.append(line)

    return merged
