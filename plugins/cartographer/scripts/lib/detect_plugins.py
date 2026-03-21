"""Detect and resolve plugin directories."""

import json
from pathlib import Path


def find_marketplace_plugins() -> Path:
    """Auto-detect marketplace plugins dir containing cartographer."""
    mp = Path.home() / ".claude" / "plugins" / "marketplaces"
    if mp.is_dir():
        for marketplace in sorted(mp.iterdir()):
            plugins = marketplace / "plugins"
            if (plugins / "cartographer").is_dir():
                return plugins
        for marketplace in sorted(mp.iterdir()):
            plugins = marketplace / "plugins"
            if plugins.is_dir():
                return plugins
    return Path.cwd()


def read_plugin_meta(plugin_path: Path) -> tuple[str, str]:
    """Read version and name from .claude-plugin/plugin.json."""
    pj = plugin_path / ".claude-plugin" / "plugin.json"
    if not pj.is_file():
        return "", ""
    try:
        meta = json.loads(pj.read_text(encoding="utf-8"))
        return meta.get("version", ""), meta.get("name", "")
    except (json.JSONDecodeError, KeyError, OSError):
        return "", ""
