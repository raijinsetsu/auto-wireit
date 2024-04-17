import { command, flag, number, oneOf, option, string, union } from 'cmd-ts';
import { ExitCodes } from '../domain/ExitCodes.js';

export const update = command({
    name: 'update',
    description: `load the configuration from auto-wireit.config.js, generate the wireit configuration, and then update package.json`,
    args: {
        checkChanges: flag({
            long: 'check-changes',
            description: `if set and the generated wireit configuration is different from what was already in package.json, then update package.json and exit with ${ExitCodes.ConfigurationChanged}`,
        }),
        indent: option({
            type: union([number, oneOf(['auto' as const])]),
            long: 'indent',
            defaultValue: () => 'auto' as const,
            description: `the number of spaces or tabs to use for indentation`,
        }),
        indentStyle: option({
            type: oneOf(['auto' as const, 'space' as const, 'tab' as const]),
            long: 'indent-style',
            defaultValue: () => 'auto' as const,
        }),
        dryRun: flag({
            long: 'dry-run',
            short: 'd',
            description: `if set, then the package.json file is not updated`,
        }),
        workingDir: option({
            type: string,
            long: 'working-dir',
            short: 'w',
            defaultValue: () => process.cwd(),
        }),
    },
    handler: async ({ checkChanges, dryRun, indent, indentStyle, workingDir }) => {
        try {
            const { handler } = await import('./update.handler.js');
            await handler({ checkChanges, dryRun, indent, indentStyle, workingDir });
        } catch (error) {
            console.error(error);
            process.exitCode = ExitCodes.CaughtException;
        }
    },
});
