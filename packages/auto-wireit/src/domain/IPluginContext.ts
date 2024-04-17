import type { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { IFinalCallbackType } from './IFinalCallbackType.js';
import { ILogger } from './ILogger.js';
import { IScriptAddCallbackType } from './IScriptAddCallbackType.js';
import type { IWireitScript } from './IWireitScript.js';

export interface IPluginContext {
    /**
     * package.json object.
     */
    readonly pkg: JSONSchemaForNPMPackageJsonFiles;

    /**
     * Get the current working directory.
     */
    get workingDir(): string;

    /**
     * Add a script.
     */
    addScript(args: {
        name: string;
        script: IWireitScript;
        opts?: {
            /**
             * Set to `true` if this should appear in the NPM scripts themselves.
             */
            isPublic?: boolean;
        };
    }): this;

    addCallback(args: IFinalCallbackType | IScriptAddCallbackType): this;

    /**
     * The logger instance.
     */
    get logger(): ILogger;

    /**
     * Resloves relative, absolute, and local module paths.
     *
     * @returns `undefined` if the location could not be resolved
     * @example Resolves a relative path.
     * ```ts
     * context.resolvePath('../tsconfig.json');
     * ```
     *
     * @example Resolves a path relative to a local module in the mono-repository.
     * ```ts
     * context.resolvePath('@local/some-local-module/package.json');
     * ```
     */
    resolvePath(
        /**
         * The path.
         */
        path: string,
        opts?: {
            /**
             * The current working directory.
             */
            cwd?: string;
            /**
             * Whether or not to resolve module-relative paths to files in node_modules folders.
             * @default true
             */
            includeNodeModules?: boolean;
        },
    ): Promise<string | undefined>;
}
