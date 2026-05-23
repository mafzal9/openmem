import fs from 'node:fs';
import path from 'node:path';
import { getContextPaths, ensureDir } from '../lib/paths.js';
import { readContext } from '../lib/merge.js';

export function snapshotCommand(global = false): { success: boolean; path?: string; message: string } {
  const content = readContext(global);
  if (!content) {
    return { success: false, message: 'Nothing to snapshot — context file is empty' };
  }

  const paths = getContextPaths();
  const snapshotDir = global
    ? path.join(paths.globalDir, 'snapshots')
    : path.join(paths.projectDir, 'snapshots');

  ensureDir(snapshotDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `CONTEXT-${timestamp}.md`;
  const filePath = path.join(snapshotDir, filename);

  fs.writeFileSync(filePath, content, 'utf8');

  return {
    success: true,
    path: filePath,
    message: `Snapshot created: ${filePath}`,
  };
}
