# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-05-24

### Changed
- Professional README rewrite with badges, TOC, quick start, command reference, and styled author section

## [0.1.1] - 2026-05-23

### Changed
- Updated package name to `@phpdocs/openmem` for npm publishing

## [0.1.0] - 2026-05-23

### Added
- Initial release of `openmem`
- Core CLI: `openmem read`, `write`, `merge`, `snapshot`, `status`
- Safe append-only context memory with file locking
- Support for both **project-level** (`.context/CONTEXT.md`) and **global-level** (`~/.config/context/CONTEXT.md`)
- Claude Code skill adapter
- opencode skill adapter
- Portable POSIX shell fallback script (`scripts/merge.sh`)
- Full documentation and installation guide

### Goals of this release
- Provide a single, portable, git-friendly memory format that works across Claude, opencode, Cursor, Windsurf, Codex, and future agents.

[0.1.0]: https://github.com/mafzal9/openmem/releases/tag/v0.1.0
