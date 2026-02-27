"""Shared project detection helpers for hook scripts.

Walks up from a file path to find project root and detect frameworks.
"""
import json
import os

TAILWIND_CONFIGS = (
    'tailwind.config.js', 'tailwind.config.ts',
    'tailwind.config.mjs', 'tailwind.config.cjs',
)


def find_project_root(file_path: str) -> str:
    """Walk up from file_path to find nearest package.json or config."""
    d = os.path.dirname(os.path.abspath(file_path))
    for _ in range(20):
        if os.path.isfile(os.path.join(d, 'package.json')):
            return d
        for cfg in TAILWIND_CONFIGS:
            if os.path.isfile(os.path.join(d, cfg)):
                return d
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    return ""


def is_tailwind_project(file_path: str) -> bool:
    """Check if file belongs to a Tailwind CSS project (v3 or v4)."""
    root = find_project_root(file_path)
    if not root:
        return False
    for cfg in TAILWIND_CONFIGS:
        if os.path.isfile(os.path.join(root, cfg)):
            return True
    pkg_path = os.path.join(root, 'package.json')
    if os.path.isfile(pkg_path):
        try:
            with open(pkg_path, encoding='utf-8') as f:
                pkg = json.loads(f.read())
            deps = {**pkg.get('dependencies', {}),
                    **pkg.get('devDependencies', {})}
            return 'tailwindcss' in deps
        except (OSError, json.JSONDecodeError, ValueError):
            pass
    return False
