import { z } from 'zod';
export const configLabelsSchema = z.object({
    'follow-up': z.string().min(1),
    revert: z.string().min(1),
    mention: z.string().min(1),
    waive: z.string().min(1),
});
export const filtersSchema = z.object({
    'follow-up': z.array(z.string().min(1)),
    revert: z.array(z.string().min(1)),
    mention: z.array(z.string().min(1)),
    'cherry-pick': z.array(z.string().min(1)),
});
export const configSchema = z.object({
    upstream: z.string().min(1),
    labels: configLabelsSchema,
    filters: filtersSchema,
});
//# sourceMappingURL=config.js.map