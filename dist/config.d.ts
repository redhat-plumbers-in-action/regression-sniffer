import { CustomOctokit } from './octokit';
import { ConfigLabels, ConfigType, Filters } from './schema/config';
export declare class Config {
    static readonly defaults: Partial<ConfigType>;
    upstream: ConfigType['upstream'];
    labels: ConfigLabels;
    filters: Filters;
    constructor(config: unknown);
    static getConfig(octokit: CustomOctokit): Promise<Config>;
    static isConfigEmpty(config: unknown): config is null | undefined;
}
