import { Commit } from './commit';

import { SingleCommitMetadata } from './schema/input';

export type Relation<H extends string, T extends string> = {
  heading: H;
  tableHeader: T;
};
export type Mention = Relation<'Commit mentions', 'mention'>;
export type FollowUp = Relation<'Follow-ups', 'follow-up'>;
export type Revert = Relation<'Reverts', 'revert'>;

export type SupportedRelations = Mention | FollowUp | Revert;

export class UpstreamRelatedCommits<R extends SupportedRelations> {
  results: {
    commits: Commit[];
    downstreamCommit: SingleCommitMetadata;
  }[] = [];
  url: string;

  constructor(
    readonly relation: R,
    readonly owner: string,
    readonly repo: string
  ) {
    this.url = `https://github.com/${owner}/${repo}/commit`;
  }

  isRelatedCommitDetected(): boolean {
    return this.results.length > 0;
  }

  addResultEntry(
    upstreamCommits: string[],
    downstreamCommit: SingleCommitMetadata
  ) {
    this.results.push({
      commits: upstreamCommits.map(commit => new Commit(commit)),
      downstreamCommit,
    });
  }

  getTableHeader(
    header: ['commit', typeof this.relation.tableHeader] = [
      'commit',
      this.relation.tableHeader,
    ]
  ): string {
    return `| ${header.join(' | ')} |\n|---|---|`;
  }

  getTableEntry(singleCommitRelation: (typeof this.results)[number]): string {
    return `| ${singleCommitRelation.downstreamCommit.url} - _${singleCommitRelation.downstreamCommit.message.title}_ | ${singleCommitRelation.commits.map(commit => `${this.url}/${commit.sha}`).join('</br>')} |`;
  }

  getStatusMessage(): string {
    return (
      `#### ${this.relation.heading}` +
      '\n\n' +
      this.getTableHeader() +
      '\n' +
      this.results
        .map(singleResult => this.getTableEntry(singleResult))
        .join('\n')
    );
  }

  getMetadata(): string[] {
    return this.results
      .map(entry => entry.commits.map(commit => commit.sha))
      .flat();
  }
}
