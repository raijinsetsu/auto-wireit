import { ExitCodes } from '../domain/ExitCodes.js';

export class BaseError extends Error {
    constructor(
        message: string,
        public readonly exitCode: ExitCodes = ExitCodes.Unspecified,
    ) {
        super(message);
    }
}
