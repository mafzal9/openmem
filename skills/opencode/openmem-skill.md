# opencode — openmem Skill

This skill connects opencode to the unified `openmem` context memory.

## Installation

Copy to:
```
~/.config/opencode/skills/openmem/
```

Make sure `openmem` CLI is available in PATH.

## How It Works

### Startup
- Read project `.context/CONTEXT.md`
- Read global `~/.config/context/CONTEXT.md`
- Add both to the system prompt / memory

### Saving Context
When the user says "remember this" or "save context", the skill should run:

```bash
openmem merge "..." --agent opencode
```

## Recommended Pattern

In your opencode skill, expose these commands to the agent:

- `openmem read --global`
- `openmem write "text" --section "Decisions"`
- `openmem snapshot`

## Why This Matters

opencode stores its own memory in SQLite. This skill makes sure the important long-term knowledge is also saved in the portable `.context/CONTEXT.md` that Claude, Cursor, and others can read.
