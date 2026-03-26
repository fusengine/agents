#!/usr/bin/env python3
"""PostToolUse: Track enriched descriptions in .enriched.json sidecar.

When an Edit/Write targets a .cartographer/**/index.md file,
extract all descriptions and save them to .enriched.json.
This ensures enriched descriptions survive regeneration.
"""

import json
import re
import sys
from pathlib import Path

_ENTRY_RE = re.compile(
    r"^(?:.*?)\[([^\]]+)\]\(([^)]+)\)\s*(?:—|-{1,2})\s*(.+)$",
)


def main() -> None:
    """Track enrichment if the edited file is a cartographer index.md."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        return

    fp = data.get("tool_input", {}).get("file_path", "")
    if not fp or ".cartographer" not in fp or not fp.endswith("index.md"):
        return

    index_path = Path(fp)
    if not index_path.exists():
        return

    sidecar = index_path.parent / ".enriched.json"
    existing: dict = {"version": 1, "entries": {}}
    if sidecar.exists():
        try:
            existing = json.loads(sidecar.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass

    entries = existing.setdefault("entries", {})
    for line in index_path.read_text(encoding="utf-8").splitlines():
        m = _ENTRY_RE.match(line)
        if m:
            path, desc = m.group(2), m.group(3).strip()
            if desc:
                entries[path] = desc

    sidecar.write_text(
        json.dumps(existing, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
