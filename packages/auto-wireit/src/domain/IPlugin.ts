import { IPluginContext } from './IPluginContext.js';

export interface IPlugin {
    get name(): string;
    run(context: IPluginContext): void | Promise<void>;
}
