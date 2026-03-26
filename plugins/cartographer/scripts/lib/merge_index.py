"""Merge index.md — preserve enriched descriptions via sidecar .enriched.json.

Uses a sidecar file to track enriched descriptions (set by the agent).
Enriched descriptions are always preserved. Fallback: length-based comparison.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

_ENTRY_RE = re.compile(
    r"^(.*?)\[([^\]]+)\]\(([^)]+)\)\s*(?:—|-{1,2})\s*(.*)$",
)


def _parse_entry(line: str) -> tuple[str, str, str, str] | None:
    """Extract (prefix, name, path, desc) from a tree line."""
    m = _ENTRY_RE.match(line)
    return (m.group(1), m.group(2), m.group(3), m.group(4)) if m else None


def _load_enriched(output_path: Path) -> dict[str, str]:
    """Load enriched descriptions from sidecar .enriched.json."""
    sidecar = output_path.parent / ".enriched.json"
    if not sidecar.exists():
        return {}
    try:
        data = json.loads(sidecar.read_text(encoding="utf-8"))
        return data.get("entries", {})
    except (json.JSONDecodeError, OSError):
        return {}


def save_enriched(output_path: Path, path: str, desc: str) -> None:
    """Save an enriched description to the sidecar .enriched.json."""
    sidecar = output_path.parent / ".enriched.json"
    data: dict = {"version": 1, "entries": {}}
    if sidecar.exists():
        try:
            data = json.loads(sidecar.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    data.setdefault("entries", {})[path] = desc
    sidecar.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def merge_lines(new_lines: list[str], output_path: Path) -> list[str]:
    """Merge new lines with existing, preserving enriched descriptions.

    Priority: sidecar .enriched.json > existing longer desc > new.
    """
    enriched = _load_enriched(output_path)
    existing_descs: dict[str, str] = {}
    if output_path.exists():
        for line in output_path.read_text(encoding="utf-8").splitlines():
            parsed = _parse_entry(line)
            if parsed:
                _, _, p, d = parsed
                existing_descs[p] = d

    merged = []
    for line in new_lines:
        parsed = _parse_entry(line)
        if parsed:
            prefix, name, path, new_desc = parsed
            if path in enriched:
                line = f"{prefix}[{name}]({path}) — {enriched[path]}"
            else:
                old = existing_descs.get(path, "")
                if len(old) > len(new_desc):
                    line = f"{prefix}[{name}]({path}) — {old}"
        merged.append(line)

    return merged
