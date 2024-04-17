import { z } from 'zod';
import { configSchema } from './configSchema.js';

export type Config = z.infer<typeof configSchema>;
