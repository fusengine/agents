"""Extract descriptions from files and directories for cartography."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from .parse_frontmatter import parse_field

_SOURCE_SUFFIXES = (".ts", ".tsx", ".js", ".jsx", ".py", ".swift")


def get_file_desc(filepath: Path) -> str:
    """Extract description: frontmatter, heading, or first comment."""
    if filepath.suffix == ".md":
        desc = parse_field(str(filepath), "description")[:60]
        return desc or _first_heading(filepath)
    if filepath.suffix in _SOURCE_SUFFIXES:
        return _first_comment(filepath)
    return ""


def count_files(directory: Path, exclude: Optional[set] = None) -> int:
    """Count non-hidden files recursively in a directory."""
    skip = exclude or set()
    count = 0
    try:
        for item in directory.rglob("*"):
            if item.is_file() and not any(
                p.startswith((".", "_")) or p in skip
                for p in item.relative_to(directory).parts
            ):
                count += 1
    except (OSError, ValueError):
        pass
    return count


def _first_heading(filepath: Path) -> str:
    """Extract first # heading from a markdown file."""
    try:
        for line in filepath.read_text(
            encoding="utf-8", errors="replace",
        ).splitlines():
            if line.startswith("# "):
                return line.lstrip("# ").strip()[:60]
    except OSError:
        pass
    return ""


def _first_comment(filepath: Path) -> str:
    """Extract first comment or docstring from a source file."""
    try:
        lines = filepath.read_text(
            encoding="utf-8", errors="replace",
        ).splitlines()
    except OSError:
        return ""
    for line in lines[:10]:
        stripped = line.strip()
        if stripped.startswith(("//", "#")) and not stripped.startswith("#!"):
            return stripped.lstrip("/#! ").strip()[:60]
        if stripped.startswith(('"""', "'''")):
            return stripped.strip("\"' ")[:60]
    return ""
