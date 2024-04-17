import { findUp } from 'find-up';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { quote } from 'zx';
import { IPluginContext } from '../../domain/IPluginContext.js';
import { IWireitScript } from '../../domain/IWireitScript.js';
import { Config } from './Config.js';
import { configSchema } from './configSchema.js';
import { Logger } from '../../util/Logger.js';

export class Plugin {
    #config: Config;

    constructor(config: Config) {
        configSchema.parse(config);
        this.#config = config;
    }

    get name() {
        return 'typescript';
    }

    async run(context: IPluginContext): Promise<void> {
        const build = {
            command: `tsc ${this.#config.tscOptions.map(quote).join(' ')}`,
            clean: 'if-file-deleted' as const,
            dependencies: [...this.#config.dependencies],
            files: [] as string[],
            output: [] as string[],
        } satisfies IWireitScript;

        const prepare = {
            dependencies: ['build'],
        } satisfies IWireitScript;

        const clean = {} satisfies IWireitScript;

        // 1. resolve tsconfig.json file(s)
        const firstTsConfig = await findUp('tsconfig.json', { cwd: context.workingDir, type: 'file' });
        if (!firstTsConfig) {
            throw new Error('Cannot find tsconfig.json file...');
        }

        let file = firstTsConfig;
        while (file) {
            // add the file to
            build.files.push(relative(context.workingDir, file));
            const obj: unknown = JSON.parse(await readFile(file, 'utf8'));

            if (typeof obj !== 'object' || obj === null || !('extends' in obj)) {
                break; // exit loop
            }

            const extendsProp: unknown = obj.extends;
            if (Array.isArray(extendsProp)) {
                Logger.singleton.warn(
                    'tsconfig.json extends property is an array, skipping this as it is not currently supported...',
                );
                break; // exit loop
            }

            if (typeof extendsProp !== 'string') {
                break; // exit loop
            }

            const extendedConfigFile = await context.resolvePath(extendsProp, { cwd: file, includeNodeModules: true });
            if (!extendedConfigFile) {
                break; // exit loop
            }

            file = extendedConfigFile;
        }

        context
            .addScript({ name: 'build', script: build, opts: { isPublic: true } })
            .addScript({ name: 'clean', script: clean, opts: { isPublic: true } })
            .addScript({ name: 'prepare', script: prepare, opts: { isPublic: true } });
    }
}
