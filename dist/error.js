export class RegressionError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
export function raise(error, code) {
    throw new RegressionError(error, code);
}
//# sourceMappingURL=error.js.map