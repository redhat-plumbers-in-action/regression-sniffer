export class RegressionError extends Error {
  constructor(
    message: string,
    readonly code?: number
  ) {
    super(message);
  }
}

export function raise(error: string, code?: number): never {
  throw new RegressionError(error, code);
}
