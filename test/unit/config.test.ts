import { describe, expect, it, test } from 'vitest';

import { Config } from '../../src/config';

describe('test Config class', () => {
  test('Config.defaults', () =>
    expect(Config.defaults).toMatchInlineSnapshot(`
      {
        "filters": {
          "cherry-pick": [
            "\\n\\(cherry picked from commit (%{sha}%)\\) *\\n?",
          ],
          "follow-up": [],
          "mention": [],
          "revert": [],
        },
        "labels": {
          "follow-up": "pr/follow-up",
          "mention": "pr/mention",
          "revert": "pr/revert",
          "waive": "follow-up-waived",
        },
      }
    `));

  it('can be instantiated', () => {
    const config = new Config({ ...Config.defaults, upstream: 'upstream' });

    expect(config).toBeInstanceOf(Config);
    expect(config.upstream).toEqual('upstream');
    expect(config.labels).toMatchInlineSnapshot(`
      {
        "follow-up": "pr/follow-up",
        "mention": "pr/mention",
        "revert": "pr/revert",
        "waive": "follow-up-waived",
      }
    `);
    expect(config.filters).toMatchInlineSnapshot(`
      {
        "cherry-pick": [
          "\\n\\(cherry picked from commit (%{sha}%)\\) *\\n?",
        ],
        "follow-up": [
          "follow-?up *(|:|-|for|to) *(https:\\/\\/github\\.com\\/upstream\\/undefined\\/commit\\/)?(%{sha}%)",
        ],
        "mention": [
          "(https:\\/\\/github\\.com\\/upstream\\/undefined\\/commit\\/)?(%{sha}%)",
        ],
        "revert": [
          "(This)? *reverts? *(commit)? *(|:|-) *(https:\\/\\/github\\.com\\/upstream\\/undefined\\/commit\\/)?(%{sha}%)",
        ],
      }
    `);
  });

  test('isConfigEmpty()', () => {
    expect(Config.isConfigEmpty(undefined)).toBe(true);
    expect(Config.isConfigEmpty(null)).toBe(true);
    expect(Config.isConfigEmpty({})).toBe(false);
  });
});
