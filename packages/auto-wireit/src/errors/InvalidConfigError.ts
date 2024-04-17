import { ExitCodes } from '../domain/ExitCodes.js';
import { BaseError } from './BaseError.js';

export class InvalidConfigError extends BaseError {
    constructor(
        public readonly file: string,
        message: string,
    ) {
        super(`invalid configuration in "${file}": ${message}`, ExitCodes.InvalidConfig);
    }
}
