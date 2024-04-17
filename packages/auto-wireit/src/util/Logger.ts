import { ILogger, ILoggerMessageOptions } from '../domain/ILogger.js';
import { Verbosity } from '../logging/Verbosity.js';

let singleton: Logger;

export class Logger implements ILogger {
    static get singleton() {
        if (!singleton) {
            singleton = new Logger();
        }
        return singleton;
    }

    private constructor() {}

    debug(_message: string, _opts?: ILoggerMessageOptions): this {
        throw new Error('Method not implemented.');
    }

    error(_message: string, _opts?: ILoggerMessageOptions): this {
        throw new Error('Method not implemented.');
    }

    info(_message: string, _opts?: ILoggerMessageOptions): this {
        throw new Error('Method not implemented.');
    }

    log(_verbosity: Verbosity, _message: string, _opts?: ILoggerMessageOptions): this {
        throw new Error('Method not implemented.');
    }

    warn(_message: string, _opts?: ILoggerMessageOptions): this {
        throw new Error('Method not implemented.');
    }
}
