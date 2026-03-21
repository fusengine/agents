"""Generate Unicode indented tree from structured plugin data."""


def _print_items(
    prefix: str,
    items: list[tuple[str, str]],
    folder: str = "",
    *,
    as_dirs: bool = False,
) -> list[str]:
    """Format items with tree connectors and optional links."""
    lines: list[str] = []
    for i, (name, desc) in enumerate(items):
        connector = "└──" if i == len(items) - 1 else "├──"
        safe = name.lstrip("/")
        if folder and as_dirs:
            label = f"[{name}](./{folder}/{safe}/index.md)"
        elif folder:
            label = f"[{name}](./{folder}/{safe}.md)"
        else:
            label = name
        short = f" — {desc[:80]}" if desc and desc != "(no description)" else ""
        lines.append(f"{prefix}{connector} {label}{short}")
    return lines


def build_tree(
    items: list[tuple[str, str, str]],
    *,
    linked: bool = False,
) -> str:
    """Build indented tree. If linked=True, items become markdown links."""
    groups: dict[str, list[tuple[str, str]]] = {}
    hooks_line = ""
    for typ, name, desc in items:
        if typ == "hooks":
            hooks_line = name
        else:
            groups.setdefault(typ, []).append((name, desc))

    section_order = ["agent", "skill", "command"]
    sections = [s for s in section_order if s in groups]
    if hooks_line:
        sections.append("hooks")

    lines: list[str] = []
    total = len(sections)

    for idx, section in enumerate(sections):
        is_last = idx == total - 1
        if section == "hooks":
            lines.append(f"└── hooks: {hooks_line}")
            continue

        folder = f"{section}s"
        prefix = "└──" if is_last else "├──"
        sub_prefix = "    " if is_last else "│   "
        lines.append(f"{prefix} {folder}/")
        link_folder = folder if linked else ""
        is_dir_section = section == "skill"
        lines.extend(
            _print_items(
                sub_prefix, groups[section], link_folder,
                as_dirs=linked and is_dir_section,
            ),
        )

    return "\n".join(lines)
