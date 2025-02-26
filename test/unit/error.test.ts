import { describe, expect, test } from 'vitest';

import { raise, RegressionError } from '../../src/error';

describe('test error related functionality', () => {
  test('RegressionError()', () => {
    const error = new RegressionError('new error');

    expect(error).toBeInstanceOf(RegressionError);
    expect(error.message).toEqual('new error');

    const errorCode = new RegressionError('new error', 1);

    expect(errorCode).toBeInstanceOf(RegressionError);
    expect(errorCode.message).toEqual('new error');
    expect(errorCode.code).toEqual(1);
  });

  test('raise()', () =>
    expect(() => raise('new error')).toThrowError(RegressionError));
});
