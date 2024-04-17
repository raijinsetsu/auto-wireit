import { join } from 'node:path';
import { ExitCodes } from '../domain/ExitCodes.js';
import { LoadConfig } from '../steps/LoadConfig.js';
import { LoadPackageJson } from '../steps/LoadPackageJson.js';
import { writePackageJson } from '../steps/WritePackageJson.js';
import { Logger } from '../util/Logger.js';
import { WorkingDir } from '../util/WorkingDir.js';
import { hash } from '../util/hash.js';

export async function handler(args: {
    checkChanges: boolean;
    dryRun: boolean;
    indent: number | 'auto';
    indentStyle: 'tab' | 'space' | 'auto';
    workingDir: string;
}) {
    const logger = Logger.singleton;
    WorkingDir.singleton.set(args.workingDir);
    const pkgPath = join(WorkingDir.singleton.get(), 'package.json');
    const pkg = await new LoadPackageJson().execute(pkgPath);
    const indentStyle = args.indentStyle === 'auto' ? pkg.indentStyle ?? ('space' as const) : args.indentStyle;
    const indent = args.indent === 'auto' ? pkg.indent ?? 4 : args.indent;
    const oldHash = hash(JSON.stringify(pkg.contents));
    const output = { ...pkg.contents };
    const { scripts, wireit } = await new LoadConfig().execute(pkg.contents);
    output.scripts = scripts;
    output.wireit = wireit;
    const newHash = hash(JSON.stringify(output));

    if (oldHash !== newHash) {
        logger.info('Configuration has changed, writing package.json...');
        await new writePackageJson({ dryRun: args.dryRun }).execute(pkgPath, {
            contents: output,
            type: indentStyle,
            amount: indent,
        });
        logger.info('Done.');

        if (args.checkChanges) {
            process.exitCode = ExitCodes.ConfigurationChanged;
        }
    } else {
        logger.info('Configuration is unchanged...');
    }
}
