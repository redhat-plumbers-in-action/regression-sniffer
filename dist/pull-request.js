import { debug, info } from '@actions/core';
import { context } from '@actions/github';
import { z } from 'zod';
export class PullRequest {
    constructor(metadata, octokit) {
        this.octokit = octokit;
        this.owner = context.repo.owner;
        this.repo = context.repo.repo;
        this.currentLabels = [];
        this.number = metadata.number;
        this.commits = metadata.commits;
    }
    /**
     * Check if the given upstream commit is already backported to downstream
     */
    async isUpstreamCommitBackPorted(git, filter, upstreamSha) {
        const downstreamBackport = git.grepLog(upstreamSha, filter);
        if (downstreamBackport.length > 0) {
            info(`${this.owner}/${this.repo}@${upstreamSha} is already backported to downstream: ${downstreamBackport[0]}`);
        }
        return downstreamBackport.length > 0;
    }
    /**
     * Check if the given upstream commit is included in the pull request
     */
    isUpstreamCommitIncluded(commit) {
        return this.commits.some(({ message }) => message.cherryPick.some(({ sha }) => sha === commit));
    }
    async getLabels() {
        this.currentLabels = z
            .array(z.object({ name: z.string() }).transform(label => label.name))
            .parse((await this.octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
            owner: this.owner,
            repo: this.repo,
            issue_number: this.number,
        })).data);
    }
    async setLabels(labels) {
        if (labels.length === 0) {
            debug('No labels to set');
            return;
        }
        await this.octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/labels', {
            owner: this.owner,
            repo: this.repo,
            issue_number: this.number,
            labels,
        });
    }
    async removeLabel(label) {
        await this.octokit.request('DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}', {
            owner: this.owner,
            repo: this.repo,
            issue_number: this.number,
            name: label,
        });
    }
}
//# sourceMappingURL=pull-request.js.map