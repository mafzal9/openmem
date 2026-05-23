import { mergeContext } from '../lib/merge.js';

export interface WriteOptions {
  global?: boolean;
  section?: string;
  agent?: string;
}

export function writeCommand(content: string, options: WriteOptions = {}) {
  if (!content || content.trim().length === 0) {
    return { success: false, message: 'No content provided' };
  }

  const result = mergeContext(content, {
    global: options.global,
    section: options.section,
    agent: options.agent,
  });

  return result;
}
