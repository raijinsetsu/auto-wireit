import { z } from 'zod';
import { packageJsonSchema } from './packageJsonSchema.js';

export const npmQueryWorkspaceSchema = z.array(
    packageJsonSchema
        .extend({
            location: z.string(),
        })
        .passthrough(),
);
