import { z } from 'zod';
import type { autoWireitConfigSchema } from './autoWireitConfigSchema.js';

export type AutoWireitConfig = z.infer<typeof autoWireitConfigSchema>;
