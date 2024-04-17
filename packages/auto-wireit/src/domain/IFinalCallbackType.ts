import { IFinalCallback } from './IFinallCallback.js';

/**
 * Register a callback to invoke after all plugin and other callbacks have run.
 */
export type IFinalCallbackType = {
    type: 'final';
    /**
     * The callback to invoke.
     */
    callback: IFinalCallback;
};
