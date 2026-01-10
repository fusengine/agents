# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-01-09

### Changed

- Structured output format now integrated directly in commands (auto-applied)
- Removed separate output-style file (no longer needed)
- Format is automatically applied when using any command

## [1.2.0] - 2025-01-09

### Added

- Visual indicators (📊 📝 ✅ ⚠️ 🔒) for quick scanning
- Structured output format with separators

### Changed

- Updated agent and commands to use structured output format
- Improved visual presentation of analysis and proposals

## [1.1.0] - 2025-01-09

### Added

- Smart auto-detection agent (`commit-detector`)
- Commit detection skill for intelligent type analysis
- Automatic commit type selection based on file patterns
- Model set to `sonnet` for optimal performance

### Changed

- All commands now enforce "No AI Signature" rule
- Improved descriptions with trigger terms for auto-invocation
- Added `allowed-tools` restrictions for security
- Added `argument-hint` for better UX
- Added dynamic context with `!git status` pre-execution

## [1.0.0] - 2025-01-09

### Added

- Initial release
- Smart commit command with auto-detection
- Quick commit commands: feat, fix, docs, refactor, test, chore
- WIP (work in progress) command
- Amend command with push safety check
- Undo command with soft reset
- Security validation for secrets and credentials
- Scope detection from directory structure
- Conventional Commits format enforcement
