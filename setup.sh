#!/bin/bash
# Fusengine Plugins - Quick Setup
(cd "$(dirname "$0")/scripts" && bun install && bun install-hooks.ts)
