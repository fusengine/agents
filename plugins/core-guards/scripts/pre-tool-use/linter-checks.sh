#!/bin/bash
# Linter checks helper for pre-commit guard

run_eslint() {
    if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
        if command -v bunx &>/dev/null; then
            bunx eslint . --max-warnings 0 2>&1 && return 0 || return 1
        fi
    fi
    return 0
}

run_typescript() {
    if [ -f "tsconfig.json" ]; then
        if command -v bunx &>/dev/null; then
            bunx tsc --noEmit 2>&1 && return 0 || return 1
        fi
    fi
    return 0
}

run_prettier() {
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
        if command -v bunx &>/dev/null; then
            if ! bunx prettier --check . 2>&1; then
                bunx prettier --write . >&2
            fi
        fi
    fi
    return 0
}

run_python_linters() {
    if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        if command -v ruff &>/dev/null; then
            ruff check . 2>&1 && return 0 || return 1
        fi
    fi
    return 0
}

run_tests() {
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        bun test 2>&1 && return 0 || return 1
    fi
    return 0
}
