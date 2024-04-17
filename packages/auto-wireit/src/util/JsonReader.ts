import { readFile } from 'node:fs/promises';
import * as z from 'zod';
import { LogMethod } from '../decorators/LogMethod.js';

export class JsonReader {
    @LogMethod({ message: 'Reading "$1" as JSON...', verbosity: 1 })
    async read<T extends z.ZodType = z.ZodUnknown>(path: string, schema?: z.ZodType<T>): Promise<z.infer<T>> {
        const contents = await readFile(path, 'utf-8');
        const obj: unknown = JSON.parse(contents);
        if (schema) {
            return schema.parseAsync(contents);
        }

        return obj;
    }
}
