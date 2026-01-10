# Agents

## Overview

Agents are specialized AI assistants that can be invoked via the `Task` tool. Each agent has specific tools and capabilities optimized for particular tasks.

## Available Agents

### fuse:ai-pilot

| Agent | Description |
|-------|-------------|
| `sniper` | Elite code error detection with 6-phase workflow |
| `sniper-faster` | Rapid code modification with minimal output |
| `explore-codebase` | Comprehensive codebase discovery specialist |
| `research-expert` | Technical research with Context7, Exa, Sequential Thinking |
| `websearch` | Quick web research using Exa |
| `seo-expert` | SEO/SEA/GEO 2025 optimization |

### fuse:commit-pro

| Agent | Description |
|-------|-------------|
| `commit-detector` | Smart commit type detection from git changes |

### fuse:laravel

| Agent | Description |
|-------|-------------|
| `laravel-expert` | Expert Laravel 12 development with Context7 docs |

### fuse:nextjs

| Agent | Description |
|-------|-------------|
| `nextjs-expert` | Expert Next.js 16+ with App Router, Prisma 7, Better Auth |

### fuse:swift-apple-expert

| Agent | Description |
|-------|-------------|
| `swift-expert` | Expert Swift and SwiftUI for all Apple platforms |

### fuse:solid

| Agent | Description |
|-------|-------------|
| `solid-orchestrator` | SOLID principles validation for multi-language projects |

## Usage

Agents are automatically available when their plugin is installed. They can be invoked through the `Task` tool with `subagent_type` parameter.
