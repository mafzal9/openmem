import { readContext } from '../lib/merge.js';

export function readCommand(global = false): string {
  const content = readContext(global);
  if (!content) {
    return global
      ? 'No global context found at ~/.config/context/CONTEXT.md'
      : 'No project context found at .context/CONTEXT.md';
  }
  return content;
}
