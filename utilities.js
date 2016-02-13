/* utilities.js --- Utilities for Yet Another Expand/Collapse List (yacollist)
 Commentary:
 Code:
 */

var utils = {};

/**
 * Test if the passed argument is a String.
 * @param {Object} s - A variable to test.
 * @returns {bool} True if a String.
 */
utils.isString = function (s) {
    return (s instanceof String || typeof s === 'string');
};

/**
 * Test if the passed argument is an Array and has values.
 * @param {Object} a - A variable to test.
 * @returns {bool} True if an Array.
 */
utils.isArray = function (a) {
    return (a instanceof Array && a.length > 0);
};

/**
 * Test if the passed argument is an Array of Strings.
 * @param {Object} a - A variable to test.
 * @see isString
 * @returns {bool} True if an Array of String.
 */
utils.isStringArray = function (a) {
    if(utils.isArray(a)) {
        // Traverse the Array to verify they are all Strings.
        for(var i=0, l = a.length; i<l; i++) {
            if(!utils.isString(a[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
};

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

/* utilities.js ends here */
