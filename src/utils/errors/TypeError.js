export default class TypeError extends Error {
    constructor(expectedType, actualType, variable) {
        super();
        this.name = 'TypeError';
        this.message = `Expected ${variable} to be ${expectedType} but got ${actualType}`;
    }
}
