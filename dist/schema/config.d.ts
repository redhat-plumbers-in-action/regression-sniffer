import { z } from 'zod';
export declare const configLabelsSchema: z.ZodObject<{
    'follow-up': z.ZodString;
    revert: z.ZodString;
    mention: z.ZodString;
    waive: z.ZodString;
}, z.core.$strip>;
export type ConfigLabels = z.infer<typeof configLabelsSchema>;
export declare const filtersSchema: z.ZodObject<{
    'follow-up': z.ZodArray<z.ZodString>;
    revert: z.ZodArray<z.ZodString>;
    mention: z.ZodArray<z.ZodString>;
    'cherry-pick': z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type Filters = z.infer<typeof filtersSchema>;
export declare const configSchema: z.ZodObject<{
    upstream: z.ZodString;
    labels: z.ZodObject<{
        'follow-up': z.ZodString;
        revert: z.ZodString;
        mention: z.ZodString;
        waive: z.ZodString;
    }, z.core.$strip>;
    filters: z.ZodObject<{
        'follow-up': z.ZodArray<z.ZodString>;
        revert: z.ZodArray<z.ZodString>;
        mention: z.ZodArray<z.ZodString>;
        'cherry-pick': z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ConfigType = z.infer<typeof configSchema>;
