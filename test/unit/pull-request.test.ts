import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest';

import { PullRequest } from '../../src/pull-request';

describe('test PullRequest class', () => {
  let pr: PullRequest;

  beforeEach(() => {
    vi.stubEnv('GITHUB_REPOSITORY', 'owner/repo');
    pr = new PullRequest(
      {
        number: 1,
        url: 'https://github.com/owner/repo/pull/1',
        commits: [
          {
            url: 'https://github.com/owner/repo/pull/1/commits/abc123',
            message: {
              title: 'title',
              cherryPick: [
                {
                  sha: 'def456',
                },
              ],
            },
            sha: 'abc123',
          },
        ],
        base: 'base',
      },
      {} as any
    );
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
  });

  test('new PullRequest()', () => {
    expect(pr).toBeInstanceOf(PullRequest);
    expect(pr.number).toEqual(1);
    expect(pr.owner).toEqual('owner');
    expect(pr.repo).toEqual('repo');
  });

  test.todo('isUpstreamCommitBackPorted()', () => {});
  test('isUpstreamCommitIncluded()', () => {
    expect(pr.isUpstreamCommitIncluded('def456')).toBe(true);
    expect(pr.isUpstreamCommitIncluded('abc123')).toBe(false);
    expect(pr.isUpstreamCommitIncluded('non-existent')).toBe(false);
  });
});
