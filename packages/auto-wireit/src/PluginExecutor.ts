import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { IPlugin } from './domain/IPlugin.js';
import { IPluginContext } from './domain/IPluginContext.js';
import { IWireitScript } from './domain/IWireitScript.js';
import { Logger } from './util/Logger.js';
import { WorkingDir } from './util/WorkingDir.js';

type PluginScript = Omit<Parameters<IPluginContext['addScript']>[0], 'name'>;

/**
 * Executes plugins.
 */
export class PluginExecutor {
    #contexts = new WeakMap<IPlugin, IPluginContext>();

    /**
     * The list of all callback.
     */
    #pluginCallbacks = [] as (Parameters<IPluginContext['addCallback']>[0] & { plugin: IPlugin })[];

    #plugins = new Set<string>();

    /**
     * The current phase of execution.
     */
    #phase: 'running' | 'add-script callbacks' | 'final callbacks' | 'generating output' | 'done' = 'running';

    /**
     * Map the NPM script name to 1 or more wireit scripts.
     */
    #scripts = new Map<string, (PluginScript & { plugin: IPlugin })[]>();

    constructor(private readonly pkg: JSONSchemaForNPMPackageJsonFiles) {}

    async run(plugin: IPlugin) {
        if (this.#phase !== 'running') {
            throw new Error('cannot call `run` after `finalize`');
        }

        try {
            await plugin.run(this.#createContext(plugin));
        } catch (error) {
            // TODO re-throw
        }
    }

    /**
     * Returns the wireit configuration.
     */
    async finalize(): Promise<{ wireit: Record<string, IWireitScript>; scripts: Record<string, string> }> {
        if (this.#phase !== 'running') {
            throw new Error('cannot call `finalize` multiple times');
        }

        const wireit: Record<string, IWireitScript> = {};
        const scripts: Record<string, string> = {};

        // ===== Call the 'script-add' callbacks
        this.#phase = 'add-script callbacks';
        for (const { plugin, ...cb } of this.#pluginCallbacks) {
            if (cb.type !== 'script-add') {
                continue;
            }

            const context = this.#contexts.get(plugin) as IPluginContext;

            for (const [name, scripts] of this.#scripts.entries()) {
                for (const { plugin, script } of scripts) {
                    await cb.callback({ context, name, script, source: plugin.name });
                }
            }
        }

        // ===== Call the 'final' scripts
        this.#phase = 'final callbacks';
        for (const { plugin, ...cb } of this.#pluginCallbacks) {
            if (cb.type !== 'final') {
                continue;
            }

            const context = this.#contexts.get(plugin) as IPluginContext;

            await cb.callback({ context });
        }

        // ===== Generate output
        this.#phase = 'generating output';
        for (const [name, wscripts] of this.#scripts.entries()) {
            let isPublic = false;
            if (wscripts.length === 1) {
                wireit[name] = wscripts[0].script;
                isPublic = !!wscripts[0].opts?.isPublic;
            } else {
                wireit[name] = {
                    dependencies: wscripts.map((script) => {
                        const joined = `${script.plugin.name}:${name}`;
                        wireit[joined] = script.script;
                        isPublic = isPublic || !!script.opts?.isPublic;
                        return joined;
                    }),
                };
            }

            if (isPublic) {
                scripts[name] = 'wireit';
            }
        }

        // ===== Check depdendencies

        this.#phase = 'done';
        return { wireit, scripts };
    }

    #createContext(plugin: IPlugin): IPluginContext {
        if (this.#plugins.has(plugin.name)) {
            throw new Error(`cannot have two plugins named "${plugin.name}"`);
        }
        this.#plugins.add(plugin.name);

        const context: IPluginContext = {
            addCallback: (args) => {
                if (this.#phase !== 'running') {
                    throw new Error(
                        `addCallback cannot be called after the plugin is run; currently performing ${this.#phase}`,
                    );
                }

                this.#pluginCallbacks.push({ ...args, plugin });
                return context;
            },
            addScript: ({ name, ...data }) => {
                if (this.#phase !== 'running') {
                    throw new Error(
                        `addScript cannot be called after the plugin is run; currently performing ${this.#phase}`,
                    );
                }

                const scripts = this.#scripts.get(name) ?? [];
                scripts.push({ plugin, ...data });
                this.#scripts.set(name, scripts);
                return context;
            },
            logger: Logger.singleton,
            pkg: this.pkg,
            resolvePath: (_path, _opts) => {
                return Promise.resolve('');
            },
            get workingDir() {
                return WorkingDir.singleton.get();
            },
        };

        this.#contexts.set(plugin, context);
        return context;
    }
}
