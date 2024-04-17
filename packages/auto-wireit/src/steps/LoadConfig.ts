import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { reduce } from 'bluebird';
import { findUp } from 'find-up';
import { uniq } from 'lodash-es';
import { PluginExecutor } from '../PluginExecutor.js';
import { LogMethod } from '../decorators/LogMethod.js';
import { AutoWireitConfig } from '../domain/AutoWireitConfig.js';
import { IPlugin } from '../domain/IPlugin.js';
import { autoWireitConfigSchema } from '../domain/autoWireitConfigSchema.js';
import { FileNotFoundError } from '../errors/FileNotFoundError.js';
import { InvalidConfigError } from '../errors/InvalidConfigError.js';
import { WorkingDir } from '../util/WorkingDir.js';

export class LoadConfig {
    @LogMethod({ message: 'Loading auto-wireit configuraiton...' })
    async execute(pkg: JSONSchemaForNPMPackageJsonFiles) {
        const rc = await findUp(
            ['auto-wireit.rc.js', 'auto-wireit.rc.ts', 'auto-wireit.rc.mjs', 'auto-wireit.rc.mts'],
            { cwd: WorkingDir.singleton.get() },
        );

        if (!rc) {
            throw new FileNotFoundError('auto-wireit.rc.{ts,mts,mjs,js}');
        }

        const config = await this.#loadFile(rc);
        const plugins = config.plugins as IPlugin[];
        const root = new PluginExecutor(pkg);

        for (const plugin of plugins) {
            await root.run(plugin);
        }

        return root.finalize();
    }

    async #loadFile(file: string): Promise<Omit<AutoWireitConfig, 'extends'>> {
        const mod: unknown = await import(file);

        if (typeof mod !== 'object' || mod === null || !('config' in mod) || typeof mod.config !== 'function') {
            throw new InvalidConfigError(file, 'expected the module to export a function with the name "config"');
        }

        const response = autoWireitConfigSchema.safeParse(await mod.config());
        if (!response.success) {
            throw new InvalidConfigError(file, response.error.toString());
        }

        const { extends: ex, ...config } = response.data;

        if (Array.isArray(ex)) {
            return await reduce(
                ex,
                async (total, otherConfig) => this.#mergeConfigs(total, await this.#loadFile(otherConfig)),
                config,
            );
        } else if (ex) {
            return this.#mergeConfigs(config, await this.#loadFile(ex));
        }

        return config;
    }

    #mergeConfigs(a: AutoWireitConfig, b: AutoWireitConfig): Omit<AutoWireitConfig, 'extends'> {
        const plugins = uniq([...a.plugins, ...b.plugins]);
        return { plugins };
    }
}
