import { writeFile } from 'node:fs/promises';
import { LogMethod } from '../decorators/LogMethod.js';
import { indent } from '../util/indent.js';

export class writePackageJson {
    #dryRun: boolean;

    constructor({ dryRun = false }: { dryRun?: boolean } = {}) {
        this.#dryRun = dryRun;
    }

    @LogMethod({ message: '${dryRun}Writing package.json...' })
    async execute(
        path: string,
        { contents, type, amount }: { contents: unknown; type: 'tab' | 'space'; amount: number },
    ) {
        const output = JSON.stringify(contents, null, indent(type, amount));
        if (!this.#dryRun) {
            await writeFile(path, output);
        }
    }
}
