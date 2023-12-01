import { warning, info } from '@actions/core';
import { execSync } from 'node:child_process';

import { Filters } from './schema/config';

export class Git {
  readonly gitHubUrl = 'https://github.com';
  readonly repoUrl: string;

  constructor(
    readonly owner: string,
    readonly repo: string,
    readonly repoDir = 'abc_Repo_cba'
  ) {
    this.repoUrl = `${this.gitHubUrl}/${this.owner}/${this.repo}.git`;
  }

  clone() {
    const gitClone = `git clone ${this.repoUrl} ${this.repoDir}`;
    info(gitClone);

    // https://stackoverflow.com/a/57669219/10221282
    execSync(gitClone, {
      stdio: [0, 1, 2], // we need this so node will print the command output
    });
  }

  grepLog(sha: string, filter: Filters[keyof Filters]): string[] {
    const regex = filter.join('|').replace('%{sha}%', sha);

    // Get all commit SHAs that matches provided regex
    const gitLog = `git -C ${this.repoDir} --no-pager log --pretty=format:"%H" --regexp-ignore-case --extended-regexp --grep "${regex}"`;
    info(`${gitLog}`);

    let stdout = '';
    try {
      stdout = execSync(gitLog).toString();
    } catch (error) {
      warning(`Unable to grep git log - stderr: '${error}'`);
    }

    const commits = stdout.split('\n');

    // When no commits are found, stdout will be an empty string. We want to return an empty array in this case
    return commits.length === 1 && commits[0] === '' ? [] : commits;
  }
}
