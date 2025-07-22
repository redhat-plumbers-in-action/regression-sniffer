import { describe, expect, test } from 'vitest';

import {
  createMetadata,
  getFailedMessage,
  getSuccessMessage,
} from '../../src/util';

describe('test basic utility functions', () => {
  test('getFailedMessage()', () => {
    let errors: string[] = [];
    let message = getFailedMessage(errors);

    expect(message).toEqual('');

    errors = ['error1', 'error2'];
    message = getFailedMessage(errors);

    expect(message).toMatchInlineSnapshot(`
      "#### Failed

      error1
      error2"
    `);
  });

  test('getSuccessMessage()', () => {
    let success: string[] = [];
    let message = getSuccessMessage(success);

    expect(message).toEqual('');

    success = ['success1', 'success2'];
    message = getSuccessMessage(success);

    expect(message).toMatchInlineSnapshot(`
      "#### Success

      success1
      success2"
    `);
  });

  test('createMetadata()', () => {
    const metadata = createMetadata(['abc123', 'def456', 'ghi789']);
    expect(metadata).toMatchInlineSnapshot(
      `"<!-- regression-sniffer = ["abc123","def456","ghi789"] -->"`
    );
  });
});
