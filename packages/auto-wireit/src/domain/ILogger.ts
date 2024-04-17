import { Verbosity } from '../logging/Verbosity.js';

export interface ILoggerMessageOptions {}

export interface ILogger {
    debug(message: string, opts?: ILoggerMessageOptions): this;
    error(message: string, opts?: ILoggerMessageOptions): this;
    info(message: string, opts?: ILoggerMessageOptions): this;
    log(verbosity: Verbosity, message: string, opts?: ILoggerMessageOptions): this;
    warn(message: string, opts?: ILoggerMessageOptions): this;
}
