#!/bin/bash
# Claude Code - Load API keys from ~/.claude/.env
# Add to ~/.bashrc: source /path/to/claude-env.bash

if [ -f ~/.claude/.env ]; then
    source ~/.claude/.env
fi
