import { z } from 'zod';
export declare const configLabelsSchema: z.ZodObject<{
    'follow-up': z.ZodString;
    revert: z.ZodString;
    mention: z.ZodString;
    waive: z.ZodString;
}, "strip", z.ZodTypeAny, {
    'follow-up': string;
    revert: string;
    mention: string;
    waive: string;
}, {
    'follow-up': string;
    revert: string;
    mention: string;
    waive: string;
}>;
export type ConfigLabels = z.infer<typeof configLabelsSchema>;
export declare const filtersSchema: z.ZodObject<{
    'follow-up': z.ZodArray<z.ZodString, "many">;
    revert: z.ZodArray<z.ZodString, "many">;
    mention: z.ZodArray<z.ZodString, "many">;
    'cherry-pick': z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    'follow-up': string[];
    revert: string[];
    mention: string[];
    'cherry-pick': string[];
}, {
    'follow-up': string[];
    revert: string[];
    mention: string[];
    'cherry-pick': string[];
}>;
export type Filters = z.infer<typeof filtersSchema>;
export declare const configSchema: z.ZodObject<{
    upstream: z.ZodString;
    labels: z.ZodObject<{
        'follow-up': z.ZodString;
        revert: z.ZodString;
        mention: z.ZodString;
        waive: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        'follow-up': string;
        revert: string;
        mention: string;
        waive: string;
    }, {
        'follow-up': string;
        revert: string;
        mention: string;
        waive: string;
    }>;
    filters: z.ZodObject<{
        'follow-up': z.ZodArray<z.ZodString, "many">;
        revert: z.ZodArray<z.ZodString, "many">;
        mention: z.ZodArray<z.ZodString, "many">;
        'cherry-pick': z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        'follow-up': string[];
        revert: string[];
        mention: string[];
        'cherry-pick': string[];
    }, {
        'follow-up': string[];
        revert: string[];
        mention: string[];
        'cherry-pick': string[];
    }>;
}, "strip", z.ZodTypeAny, {
    upstream: string;
    labels: {
        'follow-up': string;
        revert: string;
        mention: string;
        waive: string;
    };
    filters: {
        'follow-up': string[];
        revert: string[];
        mention: string[];
        'cherry-pick': string[];
    };
}, {
    upstream: string;
    labels: {
        'follow-up': string;
        revert: string;
        mention: string;
        waive: string;
    };
    filters: {
        'follow-up': string[];
        revert: string[];
        mention: string[];
        'cherry-pick': string[];
    };
}>;
export type ConfigType = z.infer<typeof configSchema>;
