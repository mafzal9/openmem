# Installation Guide for openmem

## 1. Install the CLI

```bash
npm install -g @phpdocs/openmem
```

Or with Bun:

```bash
bun link
```

Verify:

```bash
openmem --help
```

## 2. (Optional) Install Skills

### Claude Code

```bash
mkdir -p ~/.claude/skills/openmem
cp skills/claude/openmem-skill.md ~/.claude/skills/openmem/
```

### opencode

```bash
mkdir -p ~/.config/opencode/skills/openmem
cp skills/opencode/openmem-skill.md ~/.config/opencode/skills/openmem/
```

## 3. Start Using

In any project:

```bash
openmem write "We use pnpm workspaces and Turborepo"
openmem read
```

## 4. Recommended Git Setup

Add to your project's `.gitignore`:

```
.context/.lock
.context/snapshots/
```

Commit `.context/CONTEXT.md` so the whole team benefits.
