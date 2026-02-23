#!/usr/bin/env python3
"""shadcn-check.py - Centralized shadcn/ui verification.

Importable functions (no main).
"""

import os
import glob as globmod


def check_shadcn_installed(project_root: str = ".") -> bool:
    """Check if shadcn/ui is installed."""
    if os.path.isfile(os.path.join(project_root, "components.json")):
        return True
    ui_dir = os.path.join(project_root, "src", "components", "ui")
    pkg = os.path.join(project_root, "package.json")
    if os.path.isdir(ui_dir) and os.path.isfile(pkg):
        try:
            with open(pkg, encoding="utf-8") as f:
                if '"shadcn-ui"' in f.read():
                    return True
        except OSError:
            pass
    return False


def validate_shadcn_component(component: str,
                              project_root: str = ".") -> bool:
    """Validate a specific shadcn component exists."""
    if not check_shadcn_installed(project_root):
        return False
    for base in ["src/components/ui", "components/ui"]:
        for ext in [".tsx", ".jsx"]:
            path = os.path.join(project_root, base, component + ext)
            if os.path.isfile(path):
                return True
    return False


def get_shadcn_components_list(project_root: str = ".") -> list[str]:
    """List all installed shadcn components."""
    components_dir = ""
    for candidate in ["src/components/ui", "components/ui"]:
        full = os.path.join(project_root, candidate)
        if os.path.isdir(full):
            components_dir = full
    if not components_dir:
        return []
    results = []
    for ext in ["*.tsx", "*.jsx"]:
        for path in globmod.glob(os.path.join(components_dir, ext)):
            name = os.path.splitext(os.path.basename(path))[0]
            results.append(name)
    return sorted(set(results))
