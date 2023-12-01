import { z } from 'zod';

export const configLabelsSchema = z.object({
  'follow-up': z.string().min(1),
  revert: z.string().min(1),
  mention: z.string().min(1),
  waive: z.string().min(1),
});
export type ConfigLabels = z.infer<typeof configLabelsSchema>;

export const filtersSchema = z.object({
  'follow-up': z.array(z.string().min(1)),
  revert: z.array(z.string().min(1)),
  mention: z.array(z.string().min(1)),
  'cherry-pick': z.array(z.string().min(1)),
});
export type Filters = z.infer<typeof filtersSchema>;

export const configSchema = z.object({
  upstream: z.string().min(1),
  labels: configLabelsSchema,
  filters: filtersSchema,
});

export type ConfigType = z.infer<typeof configSchema>;
