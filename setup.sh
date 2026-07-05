#!/bin/bash
# Fusengine Plugins - Quick Setup
# Bootstraps Bun if missing (the installer itself runs on Bun), then installs.
set -e

if ! command -v bun >/dev/null 2>&1; then
    echo "⚠️  Bun not found — the Fusengine installer runs on Bun."
    if command -v brew >/dev/null 2>&1; then
        # Homebrew present: official tap only (brew upgrade keeps bun fresh)
        read -r -p "Install Bun via Homebrew (oven-sh/bun tap)? [Y/n] " answer
        case "${answer:-Y}" in
            [Yy]*) brew install oven-sh/bun/bun ;;
            *)
                echo "❌ Bun is required. Install it (brew install oven-sh/bun/bun) then re-run ./setup.sh"
                exit 1
                ;;
        esac
    else
        read -r -p "Install Bun now via the official installer (bun.sh)? [Y/n] " answer
        case "${answer:-Y}" in
            [Yy]*)
                curl -fsSL https://bun.sh/install | bash
                # Make bun available for the rest of this script (new shells get it via rc file)
                export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
                export PATH="$BUN_INSTALL/bin:$PATH"
                ;;
            *)
                echo "❌ Bun is required. Install it from https://bun.sh then re-run ./setup.sh"
                exit 1
                ;;
        esac
    fi
    if ! command -v bun >/dev/null 2>&1; then
        echo "❌ Bun install did not complete. Install from https://bun.sh then re-run ./setup.sh"
        exit 1
    fi
fi

(cd "$(dirname "$0")/scripts" && bun install && bun install-hooks.ts)
