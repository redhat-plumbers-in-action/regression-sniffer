import { Commit } from './commit';
import { SingleCommitMetadata } from './schema/input';
type Relation<H extends string, T extends string> = {
    heading: H;
    tableHeader: T;
};
type Mention = Relation<'Commit mentions', 'mention'>;
type FollowUp = Relation<'Follow-ups', 'follow-up'>;
type Revert = Relation<'Reverts', 'revert'>;
type SupportedRelations = Mention | FollowUp | Revert;
export declare class UpstreamRelatedCommits<R extends SupportedRelations> {
    readonly relation: R;
    readonly owner: string;
    readonly repo: string;
    results: {
        commits: Commit[];
        downstreamCommit: SingleCommitMetadata;
    }[];
    url: string;
    constructor(relation: R, owner: string, repo: string);
    isRelatedCommitDetected(): boolean;
    addResultEntry(upstreamCommits: string[], downstreamCommit: SingleCommitMetadata): void;
    getTableHeader(header?: ['commit', typeof this.relation.tableHeader]): string;
    getTableEntry(singleCommitRelation: (typeof this.results)[number]): string;
    getStatusMessage(): string;
}
export {};
