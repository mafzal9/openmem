import { mergeContext } from '../lib/merge.js';

export interface MergeOptions {
  global?: boolean;
  section?: string;
  agent?: string;
}

export function mergeCommand(content: string, options: MergeOptions = {}) {
  return mergeContext(content, options);
}
