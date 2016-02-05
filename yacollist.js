/* yacollist.js --- Yet Another Collapse List
 Commentary:
 Code:
 */

/**
 * Test if the passed argument is a String.
 * @param {Object} s - A variable to test.
 * @returns {bool} True if a String.
 */
function isString(s) {
    return (s instanceof String || typeof s === 'string');
}

/**
 * Test if the passed argument is an Array and has values.
 * @param {Object} a - A variable to test.
 * @returns {bool} True if an Array.
 */
function isArray(a) {
    return (a instanceof Array && a.length > 0);
}

/**
 * Test if the passed argument is an Array of Strings.
 * @param {Object} a - A variable to test.
 * @see isString
 * @returns {bool} True if an Array of String.
 */
function isStringArray(a) {
    if(isArray(a)) {
        // Traverse the Array to verify they are all Strings.
        for(var i=0, l = a.length; i<l; i++) {
            if(!isString(a[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

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
    this.message = message || 'It’s not a valid String';
    this.stack = (new Error()).stack;
}
NotStringError.prototype = new TypeError;

/* yacollist.js ends here */
