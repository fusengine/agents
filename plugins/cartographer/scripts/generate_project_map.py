#!/usr/bin/env python3
"""Generate project cartography — map the project's own files.

Scans the project directory, excludes common junk,
writes a navigable tree to .cartographer/project/
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.project_indicators import EXCLUDE_DIRS, PROJECT_INDICATORS
from lib.write_recursive import write_tree


def _is_project(path: Path) -> bool:
    """Check if directory is a real project (not home or root)."""
    home = Path("~").expanduser().resolve()
    resolved = path.resolve()
    if resolved == home or resolved == Path("/"):
        return False
    return any((resolved / f).exists() for f in PROJECT_INDICATORS)


def main() -> None:
    """Generate project tree map only if real project detected."""
    project_dir = (
        Path(sys.argv[1]) if len(sys.argv) > 1
        else Path(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd())
    )
    output_dir = (
        Path(sys.argv[2]) if len(sys.argv) > 2  # noqa: PLR2004
        else project_dir / ".cartographer" / "project"
    )

    project_dir = project_dir.resolve()
    if not project_dir.is_dir():
        return

    if not _is_project(project_dir):
        return

    write_tree(project_dir, output_dir, exclude=EXCLUDE_DIRS)
    entries = sum(1 for _ in output_dir.rglob("index.md"))
    print(f"cart project: {entries} entries loaded", file=sys.stderr)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
