"""Scan a plugin directory and output structured data."""

import json
from pathlib import Path

from .parse_frontmatter import parse_body_desc, parse_field

_Row = tuple[str, str, str]


def _scan_agents(root: Path) -> list[_Row]:
    """Scan agents/ subdirectory. Returns list of (type, name, desc)."""
    agents_dir = root / "agents"
    if not agents_dir.is_dir():
        return []
    rows: list[_Row] = []
    for f in sorted(agents_dir.glob("*.md")):
        name = parse_field(str(f), "name") or f.stem
        desc = parse_field(str(f), "description")[:50]
        rows.append(("agent", name, desc))
    return rows


def _scan_skills(root: Path) -> list[_Row]:
    """Scan skills/ subdirectory. Returns list of (type, name, desc)."""
    skills_dir = root / "skills"
    if not skills_dir.is_dir():
        return []
    rows: list[_Row] = []
    for d in sorted(skills_dir.iterdir()):
        if not d.is_dir():
            continue
        skill_md = d / "SKILL.md"
        desc = ""
        if skill_md.is_file():
            desc = (
                parse_field(str(skill_md), "description")
                or parse_body_desc(str(skill_md))
            )
        rows.append(("skill", d.name, desc or "(no description)"))
    return rows


def _scan_commands(root: Path) -> list[_Row]:
    """Scan commands/ subdirectory. Returns list of (type, name, desc)."""
    cmds_dir = root / "commands"
    if not cmds_dir.is_dir():
        return []
    return [
        ("command", f"/{f.stem}", parse_field(str(f), "description")[:50])
        for f in sorted(cmds_dir.glob("*.md"))
    ]


def _scan_hooks(root: Path) -> list[_Row]:
    """Scan hooks/hooks.json and return hook events as a single row."""
    hooks_file = root / "hooks" / "hooks.json"
    if not hooks_file.is_file():
        return []
    try:
        data = json.loads(hooks_file.read_text(encoding="utf-8"))
        hooks_data = data.get("hooks", data) if isinstance(data, dict) else {}
        if isinstance(hooks_data, dict):
            events = sorted(k for k in hooks_data if not k.startswith("_"))
        else:
            events = sorted(
                {h.get("event", "") for h in hooks_data if h.get("event")},
            )
        if events:
            return [("hooks", ", ".join(events), "")]
    except (json.JSONDecodeError, KeyError):
        pass
    return []


def scan_plugin(plugin_dir: str) -> list[_Row]:
    """Scan a single plugin directory. Returns list of (type, name, desc)."""
    root = Path(plugin_dir)
    return (
        _scan_agents(root)
        + _scan_skills(root)
        + _scan_commands(root)
        + _scan_hooks(root)
    )
