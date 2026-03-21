#!/usr/bin/env python3
"""Generate project cartography — map the project's own files.

Scans the project directory, excludes common junk,
writes a navigable tree to .cartographer/project/
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.write_recursive import write_tree

_EXCLUDE = {
    "node_modules", ".git", ".next", ".nuxt", "dist", "build",
    ".output", "vendor", "__pycache__", ".venv", "venv",
    ".cartographer", ".claude", ".ruff_cache", ".DS_Store",
    "coverage", ".turbo", ".vercel", ".netlify",
    "Pods", "DerivedData", ".build", ".swiftpm",
}

_PROJECT_INDICATORS = {
    "package.json", "composer.json", "Cargo.toml", "go.mod",
    "pyproject.toml", "Gemfile", "Package.swift", "pubspec.yaml",
    "pom.xml", "build.gradle", "Makefile", "CMakeLists.txt",
    ".git",
}


def _is_project(path: Path) -> bool:
    """Check if directory is a real project (not home or root)."""
    home = Path("~").expanduser().resolve()
    resolved = path.resolve()
    if resolved == home or resolved == Path("/"):
        return False
    return any((resolved / f).exists() for f in _PROJECT_INDICATORS)


def main() -> None:
    """Generate project tree map only if real project detected."""
    project_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    output_dir = (
        Path(sys.argv[2]) if len(sys.argv) > 2  # noqa: PLR2004
        else project_dir / ".cartographer" / "project"
    )

    project_dir = project_dir.resolve()
    if not project_dir.is_dir():
        sys.exit(1)

    if not _is_project(project_dir):
        sys.exit(0)

    write_tree(project_dir, output_dir, exclude=_EXCLUDE)
    sys.stdout.write(f"Project map: {output_dir}/index.md\n")


if __name__ == "__main__":
    main()
