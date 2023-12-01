import { Git } from './git';
import { CustomOctokit } from './octokit';
import { CommitMetadata, PullRequestMetadata } from './schema/input';
import { Filters } from './schema/config';
export declare class PullRequest {
    readonly octokit: CustomOctokit;
    readonly owner: string;
    readonly repo: string;
    readonly number: number;
    commits: CommitMetadata;
    currentLabels: string[];
    constructor(metadata: PullRequestMetadata, octokit: CustomOctokit);
    /**
     * Check if the given upstream commit is already backported to downstream
     */
    isUpstreamCommitBackPorted(git: Git, filter: Filters['cherry-pick'], upstreamSha: string): Promise<boolean>;
    /**
     * Check if the given upstream commit is included in the pull request
     */
    isUpstreamCommitIncluded(commit: string): boolean;
    getLabels(): Promise<void>;
    setLabels(labels: string[]): Promise<void>;
    removeLabel(label: string): Promise<void>;
}
