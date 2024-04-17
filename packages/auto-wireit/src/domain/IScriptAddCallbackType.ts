import { IScriptAddCallback } from './IScriptAddCallback.js';

/**
 * Register a callback to invoke after a script has been added.
 *
 * Use this for plugin which modify the script(s) of other plugins.
 */
export type IScriptAddCallbackType = {
    type: 'script-add';
    /**
     * The names of scripts which the plugin would modify.
     */
    names: string[];
    /**
     * The callback invokes after the script is added.
     */
    callback: IScriptAddCallback;
};
