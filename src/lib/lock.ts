import fs from 'node:fs';
import path from 'node:path';

const LOCK_TIMEOUT_MS = 30_000; // 30 seconds

export interface LockResult {
  acquired: boolean;
  lockPath: string;
  reason?: string;
}

export function acquireLock(lockPath: string, timeoutMs = LOCK_TIMEOUT_MS): LockResult {
  const dir = path.dirname(lockPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const now = Date.now();

  // Check existing lock
  if (fs.existsSync(lockPath)) {
    try {
      const stat = fs.statSync(lockPath);
      const age = now - stat.mtimeMs;

      if (age > timeoutMs) {
        // Stale lock — remove it
        fs.unlinkSync(lockPath);
      } else {
        return {
          acquired: false,
          lockPath,
          reason: `Lock held by another process (age: ${Math.round(age / 1000)}s)`,
        };
      }
    } catch {
      // File disappeared between check and stat — proceed
    }
  }

  // Create lock file with current PID + timestamp
  const content = JSON.stringify({
    pid: process.pid,
    timestamp: new Date().toISOString(),
    tool: process.env.CTX_AGENT || 'unknown',
  });

  try {
    fs.writeFileSync(lockPath, content, { flag: 'wx' }); // exclusive write
    return { acquired: true, lockPath };
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      return {
        acquired: false,
        lockPath,
        reason: 'Lock was just acquired by another process',
      };
    }
    throw err;
  }
}

export function releaseLock(lockPath: string): void {
  try {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
    }
  } catch {
    // Best effort — ignore errors on release
  }
}
