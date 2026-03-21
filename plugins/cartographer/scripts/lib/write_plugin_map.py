"""Write multi-level plugin map with dynamic recursive depth."""

from pathlib import Path

from .build_tree import build_tree
from .write_recursive import write_tree


def write_plugin_map(
    output_dir: Path,
    plugin_name: str,
    version: str,
    items: list[tuple[str, str, str]],
    plugin_path: Path,
) -> None:
    """Write level 2 index (indented tree) + recurse into all sections."""
    plugin_dir = output_dir / plugin_name
    plugin_dir.mkdir(parents=True, exist_ok=True)
    ver = f" (v{version})" if version else ""

    tree = build_tree(items, linked=True) if items else "└── (empty)"
    (plugin_dir / "index.md").write_text(
        f"# {plugin_name}{ver}\n\n{tree}\n",
        encoding="utf-8",
    )

    # Recursively generate all levels dynamically
    for section in ("agents", "skills", "commands"):
        src = plugin_path / section
        if src.is_dir():
            write_tree(src, plugin_dir / section, "../index.md")
