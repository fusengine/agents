#!/usr/bin/env python3
"""check-shadcn-install.py - Check if shadcn/ui is installed in project."""

import json
import os
import sys


def find_project_root(file_path: str) -> str:
    """Find project root by walking up to find package.json."""
    directory = os.path.dirname(file_path)
    while directory and directory != "/":
        if os.path.isfile(os.path.join(directory, "package.json")):
            return directory
        directory = os.path.dirname(directory)
    return "."


def check_shadcn_installed(project_root: str) -> bool:
    """Check if shadcn/ui is installed in the project."""
    if os.path.isfile(os.path.join(project_root, "components.json")):
        return True
    pkg_path = os.path.join(project_root, "package.json")
    ui_dir = os.path.join(project_root, "src", "components", "ui")
    if os.path.isdir(ui_dir) and os.path.isfile(pkg_path):
        try:
            with open(pkg_path, encoding="utf-8") as f:
                if '"shadcn-ui"' in f.read():
                    return True
        except OSError:
            pass
    return False


def main() -> None:
    """Main entry point."""
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    file_path = (data.get("tool_input") or {}).get("file_path", "")
    if not file_path:
        sys.exit(0)

    project_root = find_project_root(file_path)
    check_shadcn_installed(project_root)
    sys.exit(0)


if __name__ == "__main__":
    main()
