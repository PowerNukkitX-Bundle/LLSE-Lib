export class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgumentError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IllegalArgumentError);
        }
    }
}