#!/bin/zsh
# Claude Code - Load API keys from ~/.claude/.env
# Add to ~/.zshrc: source /path/to/claude-env.zsh

if [[ -f ~/.claude/.env ]]; then
    source ~/.claude/.env
fi
