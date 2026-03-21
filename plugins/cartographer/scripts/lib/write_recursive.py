"""Generate index.md at each level — branches and leaves like Git.

Branches = subdirectories → link to ./subdir/index.md
Leaves   = files → link to the REAL source file (no copy)
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from .describe import count_files, get_file_desc
from .merge_index import merge_lines


def _list_children(
    source: Path,
    exclude: Optional[set] = None,
) -> tuple[list, list]:
    """Return (dirs, files) from source, excluding hidden/private entries."""
    skip = exclude or set()
    children = sorted(
        e for e in source.iterdir()
        if not e.name.startswith((".", "_")) and e.name not in skip
    )
    dirs = [c for c in children if c.is_dir()]
    files = [c for c in children if c.is_file()]
    return dirs, files


def write_tree(
    source: Path,
    output: Path,
    back: str = "",
    exclude: Optional[set] = None,
) -> None:
    """Write one index.md per directory. Recurse into subdirs."""
    output.mkdir(parents=True, exist_ok=True)
    dirs, files = _list_children(source, exclude)

    lines = [f"# {source.name}\n"]
    if back:
        lines.append(f"> [← back]({back})\n")

    total = len(dirs) + len(files)
    idx = 0

    for d in dirs:
        idx += 1
        conn = "└──" if idx == total else "├──"
        count = count_files(d, exclude)
        hint = f" — {count} files" if count else ""
        lines.append(f"{conn} [{d.name}/](./{d.name}/index.md){hint}")
        write_tree(d, output / d.name, "../index.md", exclude)

    for f in files:
        idx += 1
        conn = "└──" if idx == total else "├──"
        desc = get_file_desc(f)
        suffix = f" — {desc}" if desc else ""
        lines.append(f"{conn} [{f.name}]({f}){suffix}")

    index_path = output / "index.md"
    merged = merge_lines(lines, index_path)
    index_path.write_text(
        "\n".join(merged) + "\n",
        encoding="utf-8",
    )
