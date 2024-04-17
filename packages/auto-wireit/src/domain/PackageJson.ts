import { z } from 'zod';
import { packageJsonSchema } from './packageJsonSchema.js';

export type PackageJson = z.infer<typeof packageJsonSchema>;
