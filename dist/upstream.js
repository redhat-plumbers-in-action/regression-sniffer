import { Commit } from './commit';
export class UpstreamRelatedCommits {
    constructor(relation, owner, repo) {
        this.relation = relation;
        this.owner = owner;
        this.repo = repo;
        this.results = [];
        this.url = `https://github.com/${owner}/${repo}/commit`;
    }
    isRelatedCommitDetected() {
        return this.results.length > 0;
    }
    addResultEntry(upstreamCommits, downstreamCommit) {
        this.results.push({
            commits: upstreamCommits.map(commit => new Commit(commit)),
            downstreamCommit,
        });
    }
    getTableHeader(header = [
        'commit',
        this.relation.tableHeader,
    ]) {
        return `| ${header.join(' | ')} |\n|---|---|`;
    }
    getTableEntry(singleCommitRelation) {
        return `| ${singleCommitRelation.downstreamCommit.url} - _${singleCommitRelation.downstreamCommit.message.title}_ | ${singleCommitRelation.commits.map(commit => `${this.url}/${commit.sha}`).join('</br>')} |`;
    }
    getStatusMessage() {
        return (`#### ${this.relation.heading}` +
            '\n\n' +
            this.getTableHeader() +
            '\n' +
            this.results
                .map(singleResult => this.getTableEntry(singleResult))
                .join('\n'));
    }
    getMetadata() {
        return this.results
            .map(entry => entry.commits.map(commit => commit.sha))
            .flat();
    }
}
//# sourceMappingURL=upstream.js.map