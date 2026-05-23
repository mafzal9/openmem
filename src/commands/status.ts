import fs from 'node:fs';
import { getContextPaths } from '../lib/paths.js';

export interface StatusResult {
  project: {
    exists: boolean;
    path: string;
    size: number;
    lastModified?: string;
    locked: boolean;
  };
  global: {
    exists: boolean;
    path: string;
    size: number;
    lastModified?: string;
    locked: boolean;
  };
}

export function statusCommand(): StatusResult {
  const paths = getContextPaths();

  const getFileInfo = (filePath: string, lockPath: string) => {
    const exists = fs.existsSync(filePath);
    let size = 0;
    let lastModified: string | undefined;

    if (exists) {
      const stat = fs.statSync(filePath);
      size = stat.size;
      lastModified = stat.mtime.toISOString();
    }

    const locked = fs.existsSync(lockPath);

    return { exists, path: filePath, size, lastModified, locked };
  };

  return {
    project: getFileInfo(paths.projectContext, paths.projectLock),
    global: getFileInfo(paths.globalContext, paths.globalLock),
  };
}
