# openmem

**Portable, shared memory for every coding agent.**

`openmem` provides a single, append-only Markdown memory file that works across Claude Code, opencode, Cursor, Windsurf, Codex, and any future agent. It lives in your project and travels with your code.

---

## Why openmem?

Most AI coding tools store memory in isolated locations:
- Claude → `~/.claude/projects/...`
- opencode → `~/.local/share/opencode/opencode.db`
- Cursor / Windsurf / Codex → their own private stores

This fragmentation means you lose context every time you switch tools.

`openmem` solves this with one portable, git-friendly file: `.context/CONTEXT.md`.

---

## Features

- **Single source of truth** — `.context/CONTEXT.md` per project
- **Global memory** — `~/.config/context/CONTEXT.md`
- **Safe concurrent writes** — file locking + merge system (30s timeout)
- **Human + machine readable** — clean Markdown format
- **Works everywhere** — CLI + skill/plugin adapters for major agents
- **Git friendly** — commit the memory, ignore the lock

---

## Installation

```bash
npm install -g @phpdocs/openmem
```

> **Note:** Due to an existing package name conflict on npm, the package is currently published as `@phpdocs/openmem`. The CLI command remains `openmem`.

---

## Usage

```bash
# Read current project context
openmem read

# Read global context
openmem read --global

# Append new memory
openmem write "We decided to use PostgreSQL instead of MySQL because..."

# Append under a specific section
openmem write "Rate limiting strategy" --section "Architecture"

# Create a timestamped backup
openmem snapshot

# Check status of project and global memory
openmem status
```

---

## How It Works With Agents

### Claude Code & opencode
Install the corresponding skill (see `skills/` folder). The skill automatically injects `.context/CONTEXT.md` on session start and writes new context when you say “save this” or “remember this”.

### Cursor, Windsurf, Codex & Others
Use the CLI directly inside hooks, rules, or custom commands:

```json
"onSaveContext": "openmem merge \"{{selectedText}}\""
```

---

## Project Structure

```
project/
├── .context/
│   ├── CONTEXT.md          # Shared memory (commit this)
│   └── .lock               # Lock file (gitignored)
└── ...

~/.config/
└── context/
    ├── CONTEXT.md          # Global memory
    └── .lock
```

---

## Philosophy

- **Append-only** — never overwrite history
- **One file** — simple and portable
- **Lock + merge** — safe multi-agent writes
- **Human first** — readable and editable Markdown

---

## License

MIT

---

## Author

**Muhammad Afzal**

- X: [https://x.com/AfzalBuilds](https://x.com/AfzalBuilds)
- YouTube: [https://www.youtube.com/@AfzalBuilds](https://www.youtube.com/@AfzalBuilds)
- LinkedIn: [https://www.linkedin.com/in/mafzal9/](https://www.linkedin.com/in/mafzal9/)
- GitHub: [https://github.com/mafzal9/](https://github.com/mafzal9/)
