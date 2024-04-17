import { subcommands } from 'cmd-ts';
import { update } from './update.command.js';

export const app = subcommands({
    name: 'auto-wireit',
    description: 'update the wireit configuration in package.json using the auto-wireit.config.ts/.js output',
    cmds: { update },
});
