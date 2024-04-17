import { z } from 'zod';

export const packageJsonSchema = z
    .object({
        name: z.string(),
        scripts: z.record(z.string()).optional(),
    })
    .passthrough();
