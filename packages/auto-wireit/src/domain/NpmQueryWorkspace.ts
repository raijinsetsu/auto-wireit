import { z } from 'zod';
import { npmQueryWorkspaceSchema } from './npmQueryWorkspaceSchema.js';

export type npmQueryWorkspace = z.infer<typeof npmQueryWorkspaceSchema>;
