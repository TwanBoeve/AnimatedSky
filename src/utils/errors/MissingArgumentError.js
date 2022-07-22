export default class MissingArgumentError extends Error {
    constructor(expectedAmount, actualAmount) {
        super();
        this.name = 'MissingArgumentError';
        this.message = `Expected ${expectedAmount} arguments, but got ${actualAmount}`;
    }
}
