import fs from 'node:fs';
import { acquireLock, releaseLock } from './lock.js';
import { getContextPaths, ensureDir } from './paths.js';

export interface MergeOptions {
  global?: boolean;
  agent?: string;
  section?: string;
}

export function getContextFile(global = false): string {
  const paths = getContextPaths();
  return global ? paths.globalContext : paths.projectContext;
}

export function readContext(global = false): string {
  const file = getContextFile(global);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8');
}

export function writeContext(content: string, global = false): void {
  const file = getContextFile(global);
  const dir = global
    ? getContextPaths().globalDir
    : getContextPaths().projectDir;

  ensureDir(dir);
  fs.writeFileSync(file, content, 'utf8');
}

/**
 * Append content to the context file with proper formatting and locking.
 */
export function mergeContext(
  newContent: string,
  options: MergeOptions = {}
): { success: boolean; message: string; file: string } {
  const { global = false, agent = process.env.CTX_AGENT || 'unknown', section } = options;

  const paths = getContextPaths();
  const lockPath = global ? paths.globalLock : paths.projectLock;
  const contextPath = global ? paths.globalContext : paths.projectContext;

  // Acquire lock
  const lock = acquireLock(lockPath);
  if (!lock.acquired) {
    return {
      success: false,
      message: lock.reason || 'Failed to acquire lock',
      file: contextPath,
    };
  }

  try {
    ensureDir(global ? paths.globalDir : paths.projectDir);

    let existing = '';
    if (fs.existsSync(contextPath)) {
      existing = fs.readFileSync(contextPath, 'utf8');
    }

    const timestamp = new Date().toISOString();
    const header = `<!-- ctx: ${timestamp} | agent: ${agent}${section ? ` | section: ${section}` : ''} -->\n`;

    let toAppend = newContent.trim();
    if (section) {
      toAppend = `## ${section}\n\n${toAppend}`;
    }

    const finalContent = existing
      ? `${existing.trimEnd()}\n\n${header}${toAppend}\n`
      : `# Context Memory\n\n${header}${toAppend}\n`;

    fs.writeFileSync(contextPath, finalContent, 'utf8');

    return {
      success: true,
      message: `Merged successfully into ${global ? 'global' : 'project'} context`,
      file: contextPath,
    };
  } finally {
    releaseLock(lockPath);
  }
}
