#!/bin/bash
# Install Guard patterns - Extracted for SOLID compliance

# System-level installs: ALWAYS ask
SYSTEM_INSTALL_PATTERNS=(
  "brew install"
  "brew upgrade"
  "brew cask"
  "apt install"
  "apt-get install"
)

# Project-level installs: auto-approve in Ralph mode
PROJECT_INSTALL_PATTERNS=(
  "npm install"
  "npm i "
  "yarn add"
  "pnpm add"
  "pip install"
  "pip3 install"
  "composer require"
  "bun add"
  "bun install"
  "cargo install"
  "go install"
  "gem install"
  "pipx install"
)
