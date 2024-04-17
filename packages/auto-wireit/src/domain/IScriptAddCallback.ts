import { ICallback } from './ICallback.js';
import { ICallbackBaseArgs } from './ICallbackBaseArgs.js';
import { IWireitScript } from './IWireitScript.js';

export interface IScriptAddCallbackArgs extends ICallbackBaseArgs {
    /**
     * The name of the script.
     */
    name: string;

    /**
     * The script definition.
     */
    script: IWireitScript;

    /**
     * The name of the plugin that generated the script.
     */
    source: string;
}

export type IScriptAddCallback = ICallback<IScriptAddCallbackArgs>;
