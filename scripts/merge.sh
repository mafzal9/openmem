#!/usr/bin/env sh
# ctx-merge.sh — Portable POSIX merge script for ctx
# Usage: ./ctx-merge.sh "content to append" [--global] [--section Name]

set -e

CONTENT="$1"
GLOBAL=0
SECTION=""

shift || true

while [ $# -gt 0 ]; do
  case "$1" in
    --global) GLOBAL=1 ;;
    --section) SECTION="$2"; shift ;;
  esac
  shift || true
done

if [ -z "$CONTENT" ]; then
  echo "Usage: $0 'content' [--global] [--section Name]"
  exit 1
fi

if [ "$GLOBAL" = "1" ]; then
  CONTEXT_DIR="$HOME/.config/context"
else
  CONTEXT_DIR="$(pwd)/.context"
fi

LOCK_FILE="$CONTEXT_DIR/.lock"
CONTEXT_FILE="$CONTEXT_DIR/CONTEXT.md"

mkdir -p "$CONTEXT_DIR"

# Simple lock with timeout
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -f %m "$LOCK_FILE" 2>/dev/null || stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0) ))
  if [ "$LOCK_AGE" -gt 30 ]; then
    rm -f "$LOCK_FILE"
  else
    echo "Lock held. Try again later."
    exit 1
  fi
fi

echo "{\"pid\":$$,\"ts\":\"$(date -Iseconds)\"}" > "$LOCK_FILE"

# Append
TS=$(date -Iseconds)
AGENT="${CTX_AGENT:-shell}"

{
  echo ""
  echo "<!-- ctx: $TS | agent: $AGENT${SECTION:+ | section: $SECTION} -->"
  if [ -n "$SECTION" ]; then
    echo "## $SECTION"
    echo ""
  fi
  echo "$CONTENT"
} >> "$CONTEXT_FILE"

rm -f "$LOCK_FILE"

echo "Merged into $CONTEXT_FILE"
