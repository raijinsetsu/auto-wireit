import type { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import detectIndent from 'detect-indent';
import { readFile, stat } from 'node:fs/promises';
import { LogMethod } from '../decorators/LogMethod.js';
import { FileNotFoundError } from '../errors/FileNotFoundError.js';

export class LoadPackageJson {
    /**
     * Load the package.json file given by `path`, parse it, and detect the indentation.
     */
    @LogMethod({ message: 'Loading package.json...' })
    async execute(path: string) {
        const stats = await stat(path);
        if (!stats.isFile()) {
            throw new FileNotFoundError(path);
        }

        const contents = await readFile(path, { encoding: 'utf-8' });
        const { type, amount } = detectIndent(contents);
        return {
            contents: JSON.parse(contents) as JSONSchemaForNPMPackageJsonFiles,
            indentStyle: type,
            indent: amount,
        };
    }
}
