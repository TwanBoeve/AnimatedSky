export default class TooManyArgumentsError extends Error {
    constructor(expectedAmount, receivedAmount) {
        super();
        this.message = `Expected ${expectedAmount} arguments but got ${receivedAmount}`;
    }
}
