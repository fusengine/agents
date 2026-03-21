"""Project indicator files for auto-detection.

Used by generate_project_map.py to determine if a directory
is a real project (not home or root).
"""

PROJECT_INDICATORS = {
    # JS/TS
    "package.json", "deno.json", "bun.lockb", "bun.lock", "tsconfig.json",
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "pnpm-workspace.yaml",
    # PHP
    "composer.json", "artisan",
    # Rust
    "Cargo.toml", "rust-toolchain.toml",
    # Go
    "go.mod",
    # Python
    "pyproject.toml", "setup.py", "setup.cfg", "Pipfile",
    "requirements.txt", "environment.yml",
    # Ruby
    "Gemfile",
    # Swift/Apple
    "Package.swift", "Podfile",
    # Dart/Flutter
    "pubspec.yaml",
    # Java/Kotlin/Scala
    "pom.xml", "build.gradle", "build.gradle.kts",
    "settings.gradle", "build.sbt",
    # C/C++
    "Makefile", "CMakeLists.txt", "meson.build", "configure.ac",
    # .NET
    "Directory.Build.props", "global.json",
    # Elixir/Erlang
    "mix.exs", "rebar.config",
    # Clojure
    "project.clj", "deps.edn",
    # Haskell
    "stack.yaml", "cabal.project",
    # OCaml
    "dune-project",
    # Zig
    "build.zig",
    # Gleam
    "gleam.toml",
    # V
    "v.mod",
    # Julia
    "Project.toml",
    # R
    "DESCRIPTION",
    # Perl
    "cpanfile", "Makefile.PL",
    # Lua
    ".luacheckrc",
    # Frameworks
    "astro.config.mjs", "next.config.js", "next.config.mjs",
    "nuxt.config.ts", "vite.config.ts", "next.config.ts", "angular.json",
    "svelte.config.js", "svelte.config.ts",
    # IaC
    "main.tf", "ansible.cfg", "pulumi.yaml",
    "cdk.json", "Chart.yaml",
    # Cloud
    "wrangler.toml", "fly.toml",
    # Monorepo
    "turbo.json", "nx.json",
    # Build/Task runners
    "BUILD", "WORKSPACE", "Justfile", "Taskfile.yml",
    # Docker
    "docker-compose.yml", "docker-compose.yaml",
    "compose.yml", "compose.yaml", "Dockerfile",
    # Git
    ".git",
}

EXCLUDE_DIRS = {
    "node_modules", ".git", ".next", ".nuxt", "dist", "build",
    ".output", "vendor", "__pycache__", ".venv", "venv",
    ".cartographer", ".claude", ".ruff_cache", ".DS_Store",
    "coverage", ".turbo", ".vercel", ".netlify",
    "Pods", "DerivedData", ".build", ".swiftpm",
}
