<p align="center">
  <img src="https://img.shields.io/npm/v/%40phpdocs%2Fopenmem?style=flat-square&color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/l/%40phpdocs%2Fopenmem?style=flat-square" alt="license" />
  <img src="https://img.shields.io/node/v/%40phpdocs%2Fopenmem?style=flat-square" alt="node" />
  <img src="https://img.shields.io/github/stars/mafzal9/openmem?style=flat-square" alt="stars" />
</p>

<h1 align="center">openmem</h1>
<p align="center"><strong>One memory file. Every coding agent. Zero lock-in.</strong></p>

<p align="center">
  Claude Code &nbsp;·&nbsp; opencode &nbsp;·&nbsp; Cursor &nbsp;·&nbsp; Windsurf &nbsp;·&nbsp; Codex &nbsp;·&nbsp; more coming
</p>

---

## Table of Contents

- [Why openmem?](#why-openmem)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Command Reference](#command-reference)
- [Agent Integration](#agent-integration)
- [How It Works](#how-it-works)
- [Philosophy](#philosophy)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Why openmem?

Every AI coding tool stores its memory in a private silo:

| Tool | Storage Location | Portability |
|------|-----------------|-------------|
| Claude Code | `~/.claude/projects/…` | Locked to Claude |
| opencode | `~/.local/share/opencode/opencode.db` | SQLite, tool only |
| Cursor | Internal store | Not exportable |
| Windsurf / Codex | Private | No cross-tool access |

**The moment you switch tools, you lose everything your previous agent learned about your project.**

`openmem` gives you a single, portable `.context/CONTEXT.md` file—a project-level memory that every agent can read and write to. Commit it to Git and it travels with your codebase forever.

---

## Quick Start

```bash
# Install globally
npm install -g @phpdocs/openmem

# In any project, start writing memory
openmem write "This project uses pnpm workspaces and Turborepo"
openmem write "API rate limit is 100 req/min per user" --section "Constraints"

# Read what agents have recorded
openmem read

# Check which agents wrote when
openmem status
```

That's it. All agents that follow the openmem pattern will now see this context automatically.

---

## Installation

### npm (global)

```bash
npm install -g @phpdocs/openmem
```

> **Package naming:** Due to an existing `open-mem` package on npm, `openmem` is published under the scoped name `@phpdocs/openmem`. The CLI command is still `openmem` and the project name is `openmem`. This may change once the name conflict is resolved.

### Bun

```bash
bun install -g @phpdocs/openmem
```

### From source

```bash
git clone https://github.com/mafzal9/openmem.git
cd openmem
npm install && npm run build
npm link
```

---

## Command Reference

### `openmem read`

Read the current project context.

```bash
openmem read            # project context
openmem read --global   # global context (~/.config/context/CONTEXT.md)
```

### `openmem write`

Append new memory with optional section and agent attribution.

```bash
openmem write "Memory content"
openmem write "Memory content" --section "Architecture"
openmem write "Memory content" --agent claude
openmem write "Memory content" --section "Architecture" --agent cursor
```

### `openmem merge`

Identical to `write` — explicitly named for agent use.

```bash
openmem merge "Content" --agent opencode --section "Gotchas"
```

### `openmem snapshot`

Create a timestamped backup of the current context.

```bash
openmem snapshot           # project snapshot
openmem snapshot --global  # global snapshot
```

### `openmem status`

Show the state of both project and global context files.

```bash
openmem status
```

Example output:

```
Project:
  Path:       /path/to/project/.context/CONTEXT.md
  Size:       2.4 kB
  Modified:   2026-05-23T18:42:38.084Z
  Locked:     false

Global:
  Path:       /Users/you/.config/context/CONTEXT.md
  Size:       0 B
  Locked:     false
```

---

## Agent Integration

### Claude Code

Copy the skill to your Claude skills directory:

```bash
mkdir -p ~/.claude/skills/openmem
cp skills/claude/openmem-skill.md ~/.claude/skills/openmem/
```

The skill automatically injects `.context/CONTEXT.md` on session start. When you say **“save this to context”** or **“remember this”**, Claude calls `openmem merge`.

### opencode

Copy the skill to your opencode skills directory:

```bash
mkdir -p ~/.config/opencode/skills/openmem
cp skills/opencode/openmem-skill.md ~/.config/opencode/skills/openmem/
```

Same read-on-start, merge-on-save pattern.

### Cursor

Add to your `.cursorrules` file:

```json
{
  "hooks": {
    "onContextSave": "openmem merge \"{{selectedText}}\" --agent cursor"
  }
}
```

### Windsurf

Use the Windsurf automation tab to run `openmem merge` on save.

### Codex · Aider · Others

Any agent that can shell out can use openmem:

```bash
openmem merge "Your context here" --agent <agent-name>
```

**Pattern for adding a new agent:** Create a thin adapter that (1) reads `.context/CONTEXT.md` on session start, and (2) calls `openmem merge` on explicit save. That's it. The locking and merging is handled for you.

---

## How It Works

### Project-Level Memory

```
your-project/
├── .context/
│   ├── CONTEXT.md          ← Commit this (shared memory)
│   ├── .lock               ← Gitignored (concurrency guard)
│   └── snapshots/           ← Gitignored (timestamped backups)
├── src/
└── ...
```

### Global Memory

```
~/.config/
└── context/
    ├── CONTEXT.md          ← Cross-project memory
    ├── .lock
    └── snapshots/
```

### Write Protocol

1. Agent calls `openmem merge "content" --agent <name>`
2. openmem acquires `.context/.lock` (30s timeout)
3. Content is appended with timestamp and agent attribution
4. Lock is released
5. File is always valid Markdown — never corrupted mid-write

### Example CONTEXT.md after a few sessions

```markdown
# Context Memory

<!-- ctx: 2026-05-23T18:42:33.182Z | agent: claude -->
This project uses PostgreSQL with Prisma ORM.

<!-- ctx: 2026-05-23T18:45:11.001Z | agent: opencode | section: Architecture -->
## Architecture

Backend is a monorepo with pnpm workspaces. API is a single Express app. Frontend is Next.js 14 with App Router.

<!-- ctx: 2026-05-24T09:12:44.553Z | agent: cursor | section: Gotchas -->
## Gotchas

The .env.local file must have DATABASE_URL set before running migrations.
```

---

## Philosophy

| Principle | Meaning |
|-----------|---------|
| **Append-only** | Never delete or rewrite history — only add |
| **One file** | A single `CONTEXT.md` keeps it simple and portable |
| **Agent-agnostic** | Any tool can participate with two lines of code |
| **Human first** | Plain Markdown — readable, editable, diffable in Git |
| **Locked writes** | Safe for multiple agents writing concurrently |

---

## Contributing

Contributions are welcome. See the [GitHub repository](https://github.com/mafzal9/openmem) for source code, issues, and discussions.

```bash
git clone https://github.com/mafzal9/openmem.git
cd openmem
npm install
npm run build
```

---

## License

MIT — see [LICENSE](LICENSE)

---

## Author

<p>
  <strong>Muhammad Afzal</strong>
</p>

<p>
  <a href="https://x.com/AfzalBuilds"><img src="https://img.shields.io/badge/X-@AfzalBuilds-000?style=for-the-badge&logo=x" alt="X" /></a>
  <a href="https://www.youtube.com/@AfzalBuilds"><img src="https://img.shields.io/badge/YouTube-@AfzalBuilds-red?style=for-the-badge&logo=youtube" alt="YouTube" /></a>
  <a href="https://www.linkedin.com/in/mafzal9/"><img src="https://img.shields.io/badge/LinkedIn-mafzal9-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn" /></a>
  <a href="https://github.com/mafzal9/"><img src="https://img.shields.io/badge/GitHub-mafzal9-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
</p>
