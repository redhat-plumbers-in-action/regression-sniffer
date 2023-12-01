import { debug, info } from '@actions/core';
import { context } from '@actions/github';
import { z } from 'zod';

import { Git } from './git';
import { CustomOctokit } from './octokit';

import { CommitMetadata, PullRequestMetadata } from './schema/input';
import { Filters } from './schema/config';

export class PullRequest {
  readonly owner = context.repo.owner;
  readonly repo = context.repo.repo;
  readonly number: number;
  commits: CommitMetadata;
  currentLabels: string[] = [];

  constructor(
    metadata: PullRequestMetadata,
    readonly octokit: CustomOctokit
  ) {
    this.number = metadata.number;
    this.commits = metadata.commits;
  }

  /**
   * Check if the given upstream commit is already backported to downstream
   */
  async isUpstreamCommitBackPorted(
    git: Git,
    filter: Filters['cherry-pick'],
    upstreamSha: string
  ): Promise<boolean> {
    const downstreamBackport = git.grepLog(upstreamSha, filter);

    if (downstreamBackport.length > 0) {
      info(
        `${this.owner}/${this.repo}@${upstreamSha} is already backported to downstream: ${downstreamBackport[0]}`
      );
    }

    return downstreamBackport.length > 0;
  }

  /**
   * Check if the given upstream commit is included in the pull request
   */
  isUpstreamCommitIncluded(commit: string): boolean {
    return this.commits.some(({ message }) =>
      message.cherryPick.some(({ sha }) => sha === commit)
    );
  }

  async getLabels(): Promise<void> {
    this.currentLabels = z
      .array(z.object({ name: z.string() }).transform(label => label.name))
      .parse(
        (
          await this.octokit.request(
            'GET /repos/{owner}/{repo}/issues/{issue_number}/labels',
            {
              owner: this.owner,
              repo: this.repo,
              issue_number: this.number,
            }
          )
        ).data
      );
  }

  async setLabels(labels: string[]) {
    if (labels.length === 0) {
      debug('No labels to set');
      return;
    }

    await this.octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/labels',
      {
        owner: this.owner,
        repo: this.repo,
        issue_number: this.number,
        labels,
      }
    );
  }

  async removeLabel(label: string) {
    await this.octokit.request(
      'DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}',
      {
        owner: this.owner,
        repo: this.repo,
        issue_number: this.number,
        name: label,
      }
    );
  }
}
