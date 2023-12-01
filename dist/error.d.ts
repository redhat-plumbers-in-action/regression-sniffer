export declare class RegressionError extends Error {
    readonly code?: number | undefined;
    constructor(message: string, code?: number | undefined);
}
export declare function raise(error: string, code?: number): never;
