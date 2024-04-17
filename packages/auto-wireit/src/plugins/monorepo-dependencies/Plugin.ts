import { chain } from 'lodash-es';
import { $ } from 'zx';
import { IFinalCallbackArgs } from '../../domain/IFinallCallback.js';
import { IPlugin } from '../../domain/IPlugin.js';
import { IPluginContext } from '../../domain/IPluginContext.js';
import { IScriptAddCallbackArgs } from '../../domain/IScriptAddCallback.js';
import { PackageJson } from '../../domain/PackageJson.js';
import { npmQueryWorkspaceSchema } from '../../domain/npmQueryWorkspaceSchema.js';
import { Config } from './Config.js';
import { configSchema } from './configSchema.js';

interface LocalPackage {
    name: string;
    path: string;
    pkg: PackageJson;
}

export class Plugin implements IPlugin {
    #config: Config;
    #foundScripts = [] as string[];

    constructor(config: Config) {
        configSchema.parse(config);
        this.#config = config;
    }

    get name() {
        return 'monorepo-dependencies';
    }

    run(context: IPluginContext) {
        context
            .addCallback({
                type: 'script-add',
                names: this.#config.names,
                callback: (args) => this.onScriptAdd(args),
            })
            .addCallback({ type: 'final', callback: (args) => Promise.resolve(this.onFinal(args)) });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async getPackageManager({
        context,
    }: {
        context: IPluginContext;
    }): Promise<Exclude<Config['packageManager'], 'auto'>> {
        const packageManager = this.#config.packageManager;

        switch (packageManager) {
            case 'auto':
                // TODO implement
                return 'npm';
            case 'lerna':
            case 'npm':
            case 'yarn':
                return packageManager;
            default:
                context.logger.error('internal error - unsupported package manager', {
                    details: { config: this.#config },
                });
                return 'npm';
        }
    }

    async findLocalModules({ context }: { context: IPluginContext }): Promise<LocalPackage[]> {
        const pkgManager = await this.getPackageManager({ context });
        switch (pkgManager) {
            case 'lerna':
                return this.findLocalLernaModules({ context });
            case 'npm':
                return this.findLocalNpmModules({ context });
            case 'yarn':
                return this.findLocalYarnModules({ context });
            default:
                context.logger.error('internal error - unsupported package manager', {
                    details: { pkgManager, config: this.#config },
                });
                return [];
        }
    }

    findLocalLernaModules({ context }: { context: IPluginContext }): Promise<LocalPackage[]> {
        throw new Error('not implemented');
    }

    async findLocalNpmModules({ context }: { context: IPluginContext }): Promise<LocalPackage[]> {
        const output = await $`npm query .workspace`;
        const workspace = npmQueryWorkspaceSchema.parse(JSON.parse(output.stdout));
        return workspace.map((pkg) => {
            return { name: pkg.name, path: pkg.location, pkg };
        });
    }

    findLocalYarnModules({ context }: { context: IPluginContext }): Promise<LocalPackage[]> {
        throw new Error('not implemented');
    }

    onFinal({ context }: IFinalCallbackArgs) {
        if (this.#foundScripts.length === 0) {
            context.logger.warn('no script was added that matches the provided `names` option,', {
                details: { names: this.#config.names },
            });
        }
    }

    /**
     * This is called after any of the scripts specified in this.#config.names are added.
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    async onScriptAdd({ name, script, context }: IScriptAddCallbackArgs) {
        this.#foundScripts.push(name);
        const deps = chain([
            ...Object.keys(context.pkg.dependencies ?? {}),
            ...Object.keys(context.pkg.devDependencies ?? {}),
        ])
            .uniq()
            .sort()
            .value();

        if (deps.length === 0) {
            return;
        }

        const scriptDeps = (script.dependencies = script.dependencies || []);
        const locals = await this.findLocalModules({ context });
        for (const { name, path, pkg } of locals) {
            // if the package is not a dependency, skip it
            if (!deps.includes(name)) {
                continue;
            }

            // the name(s) of the possible script in the target package that should
            //     be used in the dependency
            const scriptsNames = [this.#config.dependencyScriptMap[name]] ?? this.#config.names;
            if (pkg.scripts) {
                for (const scriptName of scriptsNames) {
                    if (pkg.scripts[scriptName]) {
                        scriptDeps.push(`${path}:${scriptName}`);
                        break;
                    }
                }
            }

            context.logger.warn(
                `package ${name} does not have any of the expected scripts: ${scriptsNames.join(', ')}`,
            );
        }
    }
}
