import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

export interface ContextPaths {
  projectDir: string;
  globalDir: string;
  projectContext: string;
  globalContext: string;
  projectLock: string;
  globalLock: string;
}

export function getContextPaths(cwd: string = process.cwd()): ContextPaths {
  const projectDir = path.join(cwd, '.context');
  const globalDir = path.join(os.homedir(), '.config', 'context');

  return {
    projectDir,
    globalDir,
    projectContext: path.join(projectDir, 'CONTEXT.md'),
    globalContext: path.join(globalDir, 'CONTEXT.md'),
    projectLock: path.join(projectDir, '.lock'),
    globalLock: path.join(globalDir, '.lock'),
  };
}

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
