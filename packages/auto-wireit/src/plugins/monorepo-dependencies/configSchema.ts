import { z } from 'zod';

export const configSchema = z.object({
    /**
     * If the package does not use the same scripts as the `names` above, provide this value
     * to let the plugin know which script to invoke in the dependency.
     */
    dependencyScriptMap: z.record(z.string()).default({}),
    /**
     * The names of the scripts to modify.
     */
    names: z.array(z.string()).default(['build', 'compile']),
    packageManager: z.enum(['auto' as const, 'npm' as const, 'yarn' as const, 'lerna' as const]).default('auto'),
});
