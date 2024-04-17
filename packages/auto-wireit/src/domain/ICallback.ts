import { ICallbackBaseArgs } from './ICallbackBaseArgs.js';

export type ICallback<T extends ICallbackBaseArgs = ICallbackBaseArgs> = (args: T) => Promise<void>;
