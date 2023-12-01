import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import deepmerge from 'deepmerge';
import { commitFilter } from './filter';
import { configSchema, } from './schema/config';
export class Config {
    constructor(config) {
        const parsedConfig = configSchema.parse(config);
        this.upstream = parsedConfig.upstream;
        this.labels = parsedConfig.labels;
        this.filters = parsedConfig.filters;
        const [upstreamOwner, upstreamRepo] = parsedConfig.upstream.split('/');
        const filter = commitFilter(upstreamOwner, upstreamRepo);
        this.filters['follow-up'].push(`follow-?up *(|:|-|for|to) *${filter}`);
        this.filters['revert'].push(`(This)? *reverts? *(commit)? *(|:|-) *${filter}`);
        this.filters['mention'].push(filter);
    }
    static async getConfig(octokit) {
        const path = getInput('config-path', { required: true });
        const retrievedConfig = (await octokit.config.get(Object.assign(Object.assign({}, context.repo), { path, defaults: configs => deepmerge.all([this.defaults, ...configs]) }))).config;
        debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);
        if (Config.isConfigEmpty(retrievedConfig)) {
            throw new Error(`Missing configuration. Please setup 'Tracker Validator' Action using 'tracker-validator.yml' file.`);
        }
        return new this(retrievedConfig);
    }
    static isConfigEmpty(config) {
        return config === null || config === undefined;
    }
}
Config.defaults = {
    labels: {
        'follow-up': 'pr/follow-up',
        revert: 'pr/revert',
        mention: 'pr/mention',
        waive: 'follow-up-waived',
    },
    filters: {
        'follow-up': [],
        revert: [],
        mention: [],
        'cherry-pick': [`\\n\\(cherry picked from commit (%{sha}%)\\) *\\n?`],
    },
};
//# sourceMappingURL=config.js.map