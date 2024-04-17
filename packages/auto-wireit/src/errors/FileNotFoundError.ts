import { ExitCodes } from '../domain/ExitCodes.js';
import { BaseError } from './BaseError.js';

export class FileNotFoundError extends BaseError {
    constructor(public readonly file: string) {
        super(`could not locate ${file}`, ExitCodes.FileNotFound);
    }
}
