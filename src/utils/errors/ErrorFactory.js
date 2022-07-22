import TypeError from './TypeError.js';
import MissingArgumentError from './MissingArgumentError.js';
import ArgumentError from './ArgumentError.js';
import TooManyArgumentsError from './TooManyArgumentsError.js';

export default class ErrorFactory {
    /**
     * Creates an error indicating the type of parameter mismatches the
     * expected type
     * @param {"undefined"|"object"|"boolean"|
     *         "number"|"string"|"function"|
     *         "symbol"|"bigint"} expectedType, the expected type of the variable
     * @param {"undefined"|"object"|"boolean"|
     *         "number"|"string"|"function"|
     *         "symbol"|"bigint"} actualType, the actual type of the variable
     * @param {String} variable, the mistyped variable
     */
    static typeError(expectedType, actualType, variable) {
        return new TypeError(expectedType, actualType, variable);
    }

    /**
     * Creates an error indicating arguments are missing
     * @param {number} expectedAmount, the amount of arguments expected
     * @param {number} receivedAmount, the amount of arguments received
     */
    static missingArgumentError(expectedAmount, receivedAmount) {
        return new MissingArgumentError(expectedAmount, receivedAmount);
    }

    /**
     * Creates an error indicating something is wrong with the provided arguments
     * @param {String} message, the provided custom message
     */
    static argumentError(message) {
        return new ArgumentError(message);
    }

    /**
     * Creates an error indicating that too many arguments were given
     * @param {number} expectedAmount, expected amount of arguments
     * @param {number} receivedAmount, received amount of arguments
     */
    static tooManyArgumentsError(expectedAmount, receivedAmount) {
        return new TooManyArgumentsError(receivedAmount);
    }
}
