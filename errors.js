/* errors.js --- Custom errors for Yet Another Expand/Collapse List (yacollist)
 Commentary:
 Code:
 */


/**
 * Error that a value is not of type {@linkcode String}.
 * @constructor
 * @param {String} message - Message to display.
 * @augments TypeError
 */
function NotStringError(message) {
    /**
     * @property {String} name - Name for the type of error.
     * @constant
     * @public
     */
    this.name = 'NotStringError';

    /**
     * @property {String} message - Human-readable description of the error.
     * @constant
     * @public
     */
    this.message = message || 'It’s not a valid String.';
    this.stack = (new Error()).stack;
}
NotStringError.prototype = new TypeError;

/**
 * Error that a value is not of type {@linkcode Array}.
 * @constructor
 * @param {String} message - Message to display.
 * @augments TypeError
 */
function NotArrayError(message) {
    /**
     * @property {String} name - Name for the type of error.
     * @constant
     * @public
     */
    this.name = 'NotArrayStringsError';

    /**
     * @property {String} message - Human-readable description of the error.
     * @constant
     * @public
     */
    this.message = message || 'It’s not a valid Array.';
    this.stack = (new Error()).stack;
}
NotArrayError.prototype = new TypeError;

/**
 * Error that a value is not of type {@linkcode String[]}.
 * @constructor
 * @param {String} message - Message to display.
 * @augments NotArrayError
 */
function NotArrayStringsError(message) {
    /**
     * @property {String} name - Name for the type of error.
     * @constant
     * @public
     */
    this.name = 'NotArrayStringsError';

    /**
     * @property {String} message - Human-readable description of the error.
     * @constant
     * @public
     */
    this.message = message || 'It’s not a valid Array of Strings.';
    this.stack = (new Error()).stack;
}
NotArrayStringsError.prototype = new NotArrayError;

function CSSPropertySyntaxError(message) {
    /**
     * @property {String} name - Name for the type of error.
     * @constant
     * @public
     */
    this.name = 'CSSPropertySyntaxError';

    /**
     * @property {String} message - Human-readable description of the error.
     * @constant
     * @public
     */
    this.message = message || 'The CSS property doesn\'t have a valid syntax.';
    this.stack = (new Error()).stack;
}
CSSPropertySyntaxError.prototype = new Error;

/* errors.js ends here */
