import { CustomOctokit } from './octokit';
import { PullRequest } from './pull-request';
declare function action(octokit: CustomOctokit, pr: PullRequest): Promise<string | void>;
export default action;
