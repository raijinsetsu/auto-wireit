import { z } from 'zod';
import { IPluginContext } from './IPluginContext.js';

export const autoWireitConfigSchema = z.object({
    extends: z.union([z.array(z.string()), z.string()]).optional(),
    plugins: z
        .array(
            z.object({
                name: z.string(),
                run: z
                    .function()
                    .args(z.custom<IPluginContext>())
                    .returns(z.union([z.void(), z.promise(z.void())])),
            }),
        )
        .min(1),
});
