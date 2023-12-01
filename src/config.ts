import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import deepmerge from 'deepmerge';

import { CustomOctokit } from './octokit';
import { commitFilter } from './filter';

import {
  configSchema,
  ConfigLabels,
  ConfigType,
  Filters,
} from './schema/config';

export class Config {
  static readonly defaults: Partial<ConfigType> = {
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
  upstream: ConfigType['upstream'];
  labels: ConfigLabels;
  filters: Filters;

  constructor(config: unknown) {
    const parsedConfig = configSchema.parse(config);
    this.upstream = parsedConfig.upstream;
    this.labels = parsedConfig.labels;
    this.filters = parsedConfig.filters;

    const [upstreamOwner, upstreamRepo] = parsedConfig.upstream.split('/');
    const filter = commitFilter(upstreamOwner, upstreamRepo);
    this.filters['follow-up'].push(`follow-?up *(|:|-|for|to) *${filter}`);
    this.filters['revert'].push(
      `(This)? *reverts? *(commit)? *(|:|-) *${filter}`
    );
    this.filters['mention'].push(filter);
  }

  static async getConfig(octokit: CustomOctokit): Promise<Config> {
    const path = getInput('config-path', { required: true });

    const retrievedConfig = (
      await octokit.config.get({
        ...context.repo,
        path,
        defaults: configs =>
          deepmerge.all([this.defaults, ...configs]) as Partial<Config>,
      })
    ).config;

    debug(`Configuration '${path}': ${JSON.stringify(retrievedConfig)}`);

    if (Config.isConfigEmpty(retrievedConfig)) {
      throw new Error(
        `Missing configuration. Please setup 'Tracker Validator' Action using 'tracker-validator.yml' file.`
      );
    }

    return new this(retrievedConfig);
  }

  static isConfigEmpty(config: unknown) {
    return config === null || config === undefined;
  }
}
