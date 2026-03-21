"""Parse YAML frontmatter fields from .md files."""

import re
from pathlib import Path


def parse_field(file_path: str, field: str) -> str:
    """Extract a single field value from YAML frontmatter."""
    path = Path(file_path)
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8", errors="replace")
    match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not match:
        return ""
    for line in match.group(1).splitlines():
        m = re.match(rf"^{re.escape(field)}\s*:\s*(.+)$", line)
        if m:
            val = m.group(1).strip().strip("\"'")
            if val in ("|", ">", "|+", "|-", ">+", ">-"):
                continue
            return val
    return ""


def parse_body_desc(file_path: str, max_len: int = 60) -> str:
    """Extract description from first non-empty line after frontmatter."""
    path = Path(file_path)
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8", errors="replace")
    match = re.match(r"^---\s*\n.*?\n---\s*\n(.*)", text, re.DOTALL)
    if not match:
        return ""
    for line in match.group(1).splitlines():
        stripped = line.strip()
        if stripped:
            return stripped[:max_len]
    return ""
