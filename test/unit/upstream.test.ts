import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest';

import { UpstreamRelatedCommits, Relation } from '../../src/upstream';

describe('test UpstreamRelatedCommits class', () => {
  let mentions: UpstreamRelatedCommits<Relation<'Commit mentions', 'mention'>>;
  let followUps: UpstreamRelatedCommits<Relation<'Follow-ups', 'follow-up'>>;
  let reverts: UpstreamRelatedCommits<Relation<'Reverts', 'revert'>>;

  beforeEach(() => {
    mentions = new UpstreamRelatedCommits(
      { heading: 'Commit mentions', tableHeader: 'mention' },
      'owner',
      'repo'
    );
    followUps = new UpstreamRelatedCommits(
      { heading: 'Follow-ups', tableHeader: 'follow-up' },
      'owner',
      'repo'
    );
    reverts = new UpstreamRelatedCommits(
      { heading: 'Reverts', tableHeader: 'revert' },
      'owner',
      'repo'
    );
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
  });

  test('new UpstreamRelatedCommits() - mentions', () => {
    expect(mentions).toBeInstanceOf(UpstreamRelatedCommits);
    expect(mentions.relation).toEqual({
      heading: 'Commit mentions',
      tableHeader: 'mention',
    });
    expect(mentions.owner).toEqual('owner');
    expect(mentions.repo).toEqual('repo');
  });

  test('new UpstreamRelatedCommits() - follow-ups', () => {
    expect(followUps).toBeInstanceOf(UpstreamRelatedCommits);
    expect(followUps.relation).toEqual({
      heading: 'Follow-ups',
      tableHeader: 'follow-up',
    });
    expect(followUps.owner).toEqual('owner');
    expect(followUps.repo).toEqual('repo');
  });

  test('new UpstreamRelatedCommits() - reverts', () => {
    expect(reverts).toBeInstanceOf(UpstreamRelatedCommits);
    expect(reverts.relation).toEqual({
      heading: 'Reverts',
      tableHeader: 'revert',
    });
    expect(reverts.owner).toEqual('owner');
    expect(reverts.repo).toEqual('repo');
  });

  test('addResultEntry()', () => {
    mentions.addResultEntry(['abc123'], {
      sha: 'abc123',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });

    expect(mentions.results).toMatchInlineSnapshot(`
      [
        {
          "commits": [
            Commit {
              "sha": "abc123",
            },
          ],
          "downstreamCommit": {
            "message": {
              "cherryPick": [
                {
                  "sha": "def456",
                },
              ],
              "title": "title",
            },
            "sha": "abc123",
            "url": "https://github/owner/repo/commit/abc123",
          },
        },
      ]
    `);
  });

  test('isRelatedCommitDetected()', () => {
    expect(mentions.isRelatedCommitDetected()).toBe(false);

    mentions.addResultEntry(['abc123'], {
      sha: 'abc123',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });

    expect(mentions.isRelatedCommitDetected()).toBe(true);
  });

  test('getTableHeader()', () => {
    expect(mentions.getTableHeader()).toMatchInlineSnapshot(`
      "| commit | mention |
      |---|---|"
    `);
    expect(followUps.getTableHeader()).toMatchInlineSnapshot(`
      "| commit | follow-up |
      |---|---|"
    `);
    expect(reverts.getTableHeader()).toMatchInlineSnapshot(`
      "| commit | revert |
      |---|---|"
    `);
  });

  test('getTableEntry()', () => {
    mentions.addResultEntry(['abc123'], {
      sha: 'abc123',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });

    expect(mentions.getTableEntry(mentions.results[0])).toMatchInlineSnapshot(
      `"| https://github/owner/repo/commit/abc123 - _title_ | https://github.com/owner/repo/commit/abc123 |"`
    );
  });

  test('getStatusMessage()', () => {
    expect(mentions.getStatusMessage()).toMatchInlineSnapshot(`
      "#### Commit mentions

      | commit | mention |
      |---|---|
      "
    `);

    mentions.addResultEntry(['abc123', 'abc456'], {
      sha: 'abc123',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });
    mentions.addResultEntry(['abc789'], {
      sha: 'abc789',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });

    expect(mentions.getStatusMessage()).toMatchInlineSnapshot(`
      "#### Commit mentions

      | commit | mention |
      |---|---|
      | https://github/owner/repo/commit/abc123 - _title_ | https://github.com/owner/repo/commit/abc123</br>https://github.com/owner/repo/commit/abc456 |
      | https://github/owner/repo/commit/abc123 - _title_ | https://github.com/owner/repo/commit/abc789 |"
    `);
  });

  test('getMetadata()', () => {
    expect(mentions.getMetadata()).toMatchInlineSnapshot(`[]`);

    mentions.addResultEntry(['abc123', 'abc456'], {
      sha: 'abc123',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });
    mentions.addResultEntry(['abc789'], {
      sha: 'abc789',
      url: 'https://github/owner/repo/commit/abc123',
      message: {
        title: 'title',
        cherryPick: [
          {
            sha: 'def456',
          },
        ],
      },
    });

    expect(mentions.getMetadata()).toMatchInlineSnapshot(`
      [
        "abc123",
        "abc456",
        "abc789",
      ]
    `);
  });
});
