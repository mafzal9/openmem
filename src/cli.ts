import { cac } from 'cac';
import { readCommand } from './commands/read.js';
import { writeCommand } from './commands/write.js';
import { mergeCommand } from './commands/merge.js';
import { snapshotCommand } from './commands/snapshot.js';
import { statusCommand } from './commands/status.js';

const cli = cac('openmem');

cli
  .command('read', 'Read the current context (project by default)')
  .option('--global', 'Read from global context instead of project')
  .action((options) => {
    const content = readCommand(options.global);
    console.log(content);
  });

cli
  .command('write <content>', 'Append content to context')
  .option('--global', 'Write to global context')
  .option('--section <name>', 'Put content under a specific section')
  .option('--agent <name>', 'Record which agent/tool is writing')
  .action((content, options) => {
    const result = writeCommand(content, {
      global: options.global,
      section: options.section,
      agent: options.agent,
    });
    console.log(result.message);
    if (!result.success) process.exit(1);
  });

cli
  .command('merge <content>', 'Merge/append content (alias for write with locking)')
  .option('--global', 'Merge into global context')
  .option('--section <name>', 'Section name')
  .option('--agent <name>', 'Agent identifier')
  .action((content, options) => {
    const result = mergeCommand(content, {
      global: options.global,
      section: options.section,
      agent: options.agent,
    });
    console.log(result.message);
    if (!result.success) process.exit(1);
  });

cli
  .command('snapshot', 'Create a timestamped backup of current context')
  .option('--global', 'Snapshot the global context')
  .action((options) => {
    const result = snapshotCommand(options.global);
    console.log(result.message);
    if (!result.success) process.exit(1);
  });

cli
  .command('status', 'Show status of project and global context files')
  .action(() => {
    const status = statusCommand();
    console.log(JSON.stringify(status, null, 2));
  });

cli.help();
cli.version('0.1.0');

cli.parse();
