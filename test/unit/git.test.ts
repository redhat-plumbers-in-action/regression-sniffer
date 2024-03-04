import { describe, expect, test } from 'vitest';

import { Git } from '../../src/git';

describe('test Git class', () => {
  test('new Git()', () => {
    const git = new Git('owner', 'repo');

    expect(git).toBeInstanceOf(Git);
    expect(git.gitHubUrl).toEqual('https://github.com');
    expect(git.owner).toEqual('owner');
    expect(git.repo).toEqual('repo');
    expect(git.repoDir).toEqual('abc_Repo_cba');
    expect(git.repoUrl).toEqual('https://github.com/owner/repo.git');

    const gitCustomDir = new Git('owner', 'repo', 'customDir');

    expect(gitCustomDir).toBeInstanceOf(Git);
    expect(gitCustomDir.repoDir).toEqual('customDir');
  });

  test.todo('clone()', () => {});

  test.todo('grepLog()', () => {});
});
