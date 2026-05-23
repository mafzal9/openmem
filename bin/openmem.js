#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(__dirname, '..', 'dist', 'index.js');

try {
  execSync(`node "${cliPath}" ${process.argv.slice(2).join(' ')}`, { stdio: 'inherit' });
} catch (err) {
  process.exit(1);
}
