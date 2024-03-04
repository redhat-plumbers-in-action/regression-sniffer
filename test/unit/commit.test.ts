import { describe, expect, test } from 'vitest';

import { Commit } from '../../src/commit';

describe('test Commit class', () => {
  test('new Commit()', () => {
    const commit = new Commit('sha');

    expect(commit).toBeInstanceOf(Commit);
    expect(commit.sha).toEqual('sha');
  });
});
