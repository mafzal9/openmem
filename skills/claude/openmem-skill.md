# Claude Code — openmem Skill

This skill lets Claude Code read from and write to the shared `openmem` memory system.

## Installation

1. Copy this folder to `~/.claude/skills/openmem/`

2. Make sure the `openmem` CLI is installed globally:
   ```bash
   openmem --version
   ```

## Behavior

### On Session Start
- Automatically read `.context/CONTEXT.md` (project)
- Optionally also read `~/.config/context/CONTEXT.md` (global)
- Inject the content into the conversation as system context

### When User Says "save to context" or "remember this"
- Extract the relevant information
- Call:
  ```bash
  openmem merge "<content>" --agent claude
  ```

## Example Skill Implementation (pseudo)

```markdown
You have access to a shared context system via the `openmem` CLI.

When the user asks you to remember something important, run:
openmem merge "the important thing" --agent claude --section "Project Knowledge"
```

## Recommended Commands to Teach Claude

- `openmem read`
- `openmem write "..." --section "Architecture"`
- `openmem snapshot`

## Notes

- Always prefer `openmem merge` over writing directly to the file.
- The merge system handles locking and timestamps automatically.
