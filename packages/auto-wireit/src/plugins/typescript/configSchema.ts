import { z } from 'zod';

export const configSchema = z.object({
    dependencies: z.array(z.string()).default([]),
    script: z.string().default('build'),
    tscOptions: z.array(z.string()).default(['--build', '.']),
});
