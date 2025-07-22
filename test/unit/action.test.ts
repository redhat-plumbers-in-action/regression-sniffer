import { describe, expect, test, vi, beforeEach } from 'vitest';
import action from '../../src/action';

// Mock all external dependencies
vi.mock('@actions/core', () => ({
  getBooleanInput: vi.fn(),
  warning: vi.fn(),
}));

vi.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
  },
}));

vi.mock('cli-progress', () => ({
  SingleBar: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    update: vi.fn(),
    stop: vi.fn(),
  })),
  Presets: {
    shades_classic: {},
  },
}));

vi.mock('../../src/error', () => ({
  raise: vi.fn().mockImplementation((message: string) => {
    throw new Error(message);
  }),
}));

vi.mock('../../src/config', () => ({
  Config: {
    getConfig: vi.fn(),
  },
}));

vi.mock('../../src/git', () => ({
  Git: vi.fn(),
}));

vi.mock('../../src/pull-request', () => ({
  PullRequest: vi.fn(),
}));

vi.mock('../../src/upstream', () => ({
  UpstreamRelatedCommits: vi.fn(),
}));

describe('test action function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('creates and uses progress bar for commit processing', async () => {
    const { getBooleanInput } = await import('@actions/core');
    const { Config } = await import('../../src/config');
    const { Git } = await import('../../src/git');
    const { UpstreamRelatedCommits } = await import('../../src/upstream');

    // Setup mocks
    vi.mocked(getBooleanInput).mockReturnValue(true);

    vi.mocked(Config.getConfig).mockResolvedValue({
      upstream: 'upstream-owner/upstream-repo',
      labels: {
        waive: 'waive-label',
        revert: 'revert-label',
        'follow-up': 'follow-up-label',
        mention: 'mention-label',
      },
      filters: {
        revert: ['revert-pattern'],
        'follow-up': ['follow-up-pattern'],
        mention: ['mention-pattern'],
        'cherry-pick': ['cherry-pick-pattern'],
      },
    });

    const mockUpstreamGit = {
      clone: vi.fn(),
      grepLog: vi.fn().mockReturnValue([]),
    };

    const mockDownstreamGit = {
      clone: vi.fn(),
    };

    vi.mocked(Git).mockImplementation((owner, repo, repoDir) => {
      if (repoDir === 'abc_UpstreamRepo_cba') return mockUpstreamGit as any;
      return mockDownstreamGit as any;
    });

    const mockDetectedInstance = {
      addResultEntry: vi.fn(),
      isRelatedCommitDetected: vi.fn().mockReturnValue(false),
      getStatusMessage: vi.fn().mockReturnValue(''),
      getMetadata: vi.fn().mockReturnValue([]),
      results: [],
    };

    vi.mocked(UpstreamRelatedCommits).mockReturnValue(
      mockDetectedInstance as any
    );

    const mockPullRequest = {
      commits: [
        {
          message: {
            title: 'feat: commit 1',
            cherryPick: [{ sha: 'abc123' }],
          },
          url: 'http://downstream/commit/1',
        },
        {
          message: {
            title: 'feat: commit 2',
            cherryPick: [{ sha: 'def456' }],
          },
          url: 'http://downstream/commit/2',
        },
      ],
      currentLabels: [],
      isUpstreamCommitIncluded: vi.fn().mockReturnValue(false),
      isUpstreamCommitBackPorted: vi.fn().mockResolvedValue(false),
      removeLabel: vi.fn(),
      setLabels: vi.fn(),
    };

    // Run the action
    await action({} as any, mockPullRequest as any);

    // Verify Git repositories were cloned
    expect(mockUpstreamGit.clone).toHaveBeenCalledOnce();
    expect(mockDownstreamGit.clone).toHaveBeenCalledOnce();

    // Verify grepLog was called for commit processing
    expect(mockUpstreamGit.grepLog).toHaveBeenCalled();
  });

  test('handles error detection and raises appropriate errors', async () => {
    const { getBooleanInput } = await import('@actions/core');
    const { Config } = await import('../../src/config');
    const { Git } = await import('../../src/git');
    const { UpstreamRelatedCommits } = await import('../../src/upstream');
    const { raise } = await import('../../src/error');

    // Setup mocks for error scenario
    vi.mocked(getBooleanInput).mockReturnValue(true);

    vi.mocked(Config.getConfig).mockResolvedValue({
      upstream: 'upstream-owner/upstream-repo',
      labels: {
        waive: 'waive-label',
        revert: 'revert-label',
        'follow-up': 'follow-up-label',
        mention: 'mention-label',
      },
      filters: {
        revert: ['revert-pattern'],
        'follow-up': ['follow-up-pattern'],
        mention: ['mention-pattern'],
        'cherry-pick': ['cherry-pick-pattern'],
      },
    });

    const mockUpstreamGit = {
      clone: vi.fn(),
      grepLog: vi.fn().mockReturnValue(['found-revert-commit']),
    };

    vi.mocked(Git).mockImplementation((owner, repo, repoDir) => {
      if (repoDir === 'abc_UpstreamRepo_cba') return mockUpstreamGit as any;
      return { clone: vi.fn() } as any;
    });

    const mockDetectedReverts = {
      addResultEntry: vi.fn(),
      isRelatedCommitDetected: vi.fn().mockReturnValue(true),
      getStatusMessage: vi.fn().mockReturnValue('Reverts detected'),
      getMetadata: vi.fn().mockReturnValue(['revert-sha']),
      results: [],
    };

    const mockDetectedOthers = {
      addResultEntry: vi.fn(),
      isRelatedCommitDetected: vi.fn().mockReturnValue(false),
      getStatusMessage: vi.fn().mockReturnValue(''),
      getMetadata: vi.fn().mockReturnValue([]),
      results: [],
    };

    vi.mocked(UpstreamRelatedCommits)
      .mockReturnValueOnce(mockDetectedReverts as any)
      .mockReturnValueOnce(mockDetectedOthers as any)
      .mockReturnValue(mockDetectedOthers as any);

    const mockPullRequest = {
      commits: [
        {
          message: {
            title: 'fix: a bug',
            cherryPick: [{ sha: 'abc123' }],
          },
          url: 'http://downstream/commit/3',
        },
      ],
      currentLabels: [],
      isUpstreamCommitIncluded: vi.fn().mockReturnValue(false),
      isUpstreamCommitBackPorted: vi.fn().mockResolvedValue(false),
      removeLabel: vi.fn(),
      setLabels: vi.fn(),
    };

    // Should throw an error when issues are detected
    await expect(action({} as any, mockPullRequest as any)).rejects.toThrow();

    // Verify raise was called
    expect(raise).toHaveBeenCalled();
  });

  test('handles waived pull requests correctly', async () => {
    const { getBooleanInput } = await import('@actions/core');
    const { Config } = await import('../../src/config');
    const { Git } = await import('../../src/git');
    const { UpstreamRelatedCommits } = await import('../../src/upstream');

    // Setup mocks
    vi.mocked(getBooleanInput).mockReturnValue(true);

    vi.mocked(Config.getConfig).mockResolvedValue({
      upstream: 'upstream-owner/upstream-repo',
      labels: {
        waive: 'waive-label',
        revert: 'revert-label',
        'follow-up': 'follow-up-label',
        mention: 'mention-label',
      },
      filters: {
        revert: ['revert-pattern'],
        'follow-up': ['follow-up-pattern'],
        mention: ['mention-pattern'],
        'cherry-pick': ['cherry-pick-pattern'],
      },
    });

    vi.mocked(Git).mockReturnValue({
      clone: vi.fn(),
      grepLog: vi.fn().mockReturnValue([]),
    } as any);

    vi.mocked(UpstreamRelatedCommits).mockReturnValue({
      addResultEntry: vi.fn(),
      isRelatedCommitDetected: vi.fn().mockReturnValue(false),
      getStatusMessage: vi.fn().mockReturnValue(''),
      getMetadata: vi
        .fn()
        .mockReturnValueOnce(['revert-sha'])
        .mockReturnValueOnce(['revert-sha2', 'follow-up-sha2', 'mention-sha2'])
        .mockReturnValueOnce(['follow-up-sha3', 'mention-sha3']),
      results: [],
    } as any);

    const mockPullRequest = {
      commits: [
        {
          message: {
            title: 'test: a test',
            cherryPick: [{ sha: 'abc123' }],
          },
          url: 'http://downstream/commit/4',
        },
      ],
      currentLabels: ['waive-label'], // PR is waived
      isUpstreamCommitIncluded: vi.fn().mockReturnValue(false),
      isUpstreamCommitBackPorted: vi.fn().mockResolvedValue(false),
      removeLabel: vi.fn(),
      setLabels: vi.fn(),
    };

    // Run the action
    const result = await action({} as any, mockPullRequest as any);

    // Should return success message for waived PRs
    expect(result).toMatchInlineSnapshot(
      `
      "<!-- regression-sniffer = ["revert-sha","revert-sha2","follow-up-sha2","mention-sha2","follow-up-sha3","mention-sha3"] -->
      #### Success

      🟠 Mentions, Follow-ups and Revert commits - Waived"
    `
    );

    // Verify waive label is preserved
    expect(mockPullRequest.setLabels).toHaveBeenCalledWith(['waive-label']);
  });
});
