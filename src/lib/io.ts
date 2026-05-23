import fs from 'node:fs';
import { getContextPaths } from './paths.js';

export function ensureContextDirs(): void {
  const { projectDir, globalDir } = getContextPaths();
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
  if (!fs.existsSync(globalDir)) fs.mkdirSync(globalDir, { recursive: true });
}

export function getGitignoreContent(): string {
  return '.lock\nsnapshots/\n';
}
