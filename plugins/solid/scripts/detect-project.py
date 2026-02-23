#!/usr/bin/env python3
"""SessionStart hook - Detect project type and set SOLID rules accordingly."""
import os
import sys


def detect_project(project_dir):
    """Detect project type, file limit, and interface directory."""
    checks = [
        ("package.json", "next", "nextjs", 150, "modules/cores/interfaces"),
        ("composer.json", "laravel", "laravel", 100, "app/Contracts"),
        ("go.mod", None, "go", 100, "internal/interfaces"),
        ("Cargo.toml", None, "rust", 100, "src/traits"),
        ("pyproject.toml", None, "python", 100, "src/interfaces"),
        ("requirements.txt", None, "python", 100, "src/interfaces"),
    ]
    for filename, grep_str, ptype, limit, iface_dir in checks:
        fpath = os.path.join(project_dir, filename)
        if not os.path.isfile(fpath):
            continue
        if grep_str is not None:
            try:
                with open(fpath, encoding="utf-8") as f:
                    if grep_str not in f.read():
                        continue
            except OSError:
                continue
        return ptype, limit, iface_dir

    # Swift detection (Package.swift or *.xcodeproj or *.xcworkspace)
    if os.path.isfile(os.path.join(project_dir, "Package.swift")):
        return "swift", 150, "Protocols"
    for entry in os.listdir(project_dir):
        if entry.endswith((".xcodeproj", ".xcworkspace")):
            return "swift", 150, "Protocols"

    return "unknown", 100, ""


def main():
    """Detect project and export SOLID env vars."""
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")
    env_file = os.environ.get("CLAUDE_ENV_FILE", "")

    ptype, limit, iface_dir = detect_project(project_dir)

    if ptype != "unknown":
        print(f"SOLID: {ptype} project (max {limit} lines)")

    if env_file:
        try:
            with open(env_file, "a", encoding="utf-8") as f:
                f.write(f"export SOLID_PROJECT_TYPE={ptype}\n")
                f.write(f"export SOLID_FILE_LIMIT={limit}\n")
                f.write(f"export SOLID_INTERFACE_DIR={iface_dir}\n")
        except OSError:
            pass

    sys.exit(0)


if __name__ == "__main__":
    main()
