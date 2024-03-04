import { describe, expect, test } from 'vitest';

import { commitFilter, gitHubUrlFilter, shaFilter } from '../../src/filter';

describe('test filter values and functions', () => {
  test('gitHubUrlFilter()', () => {
    const owner = 'owner';
    const repo = 'repo';

    expect(gitHubUrlFilter(owner, repo)).toEqual(
      'https:\\/\\/github\\.com\\/owner\\/repo\\/commit\\/'
    );
  });

  test('shaFilter', () => expect(shaFilter).toEqual('%{sha}%'));

  test('commitFilter()', () => {
    const owner = 'owner';
    const repo = 'repo';

    expect(commitFilter(owner, repo)).toEqual(
      '(https:\\/\\/github\\.com\\/owner\\/repo\\/commit\\/)?(%{sha}%)'
    );
  });
});
