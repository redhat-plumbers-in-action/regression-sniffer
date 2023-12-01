import { Filters } from './schema/config';
export declare class Git {
    readonly owner: string;
    readonly repo: string;
    readonly repoDir: string;
    readonly gitHubUrl = "https://github.com";
    readonly repoUrl: string;
    constructor(owner: string, repo: string, repoDir?: string);
    clone(): void;
    grepLog(sha: string, filter: Filters[keyof Filters]): string[];
}
