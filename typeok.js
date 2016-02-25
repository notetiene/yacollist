/* typeok.js --- Functions verifying JavaScript data types
 Commentary:
 Code:
 */

/**
 * Namespace for functions verifying JavaScript data types.
 * @namespace
 */
var typeok = typeok || {};

/**
 * Test if the passed argument is a String.
 * @param {Object} s - A variable to test.
 * @returns {bool} True if a String.
 */
typeok.isString = function (s) {
    return (s instanceof String || typeof s === 'string');
};

/**
 * Test if the passed argument is an Array and has values.
 * @param {Object} a - A variable to test.
 * @returns {bool} True if an Array.
 */
typeok.isArray = function (a) {
    return (a instanceof Array && a.length > 0);
};

/**
 * Test if the passed argument is an Array of Strings.
 * @param {Object} a - A variable to test.
 * @see isString
 * @returns {bool} True if an Array of String.
 * @todo Test if the String is empty
 */
typeok.isStringArray = function (a) {
    if(this.isArray(a)) {
        // Traverse the Array to verify they are all Strings.
        for(var i=0, l = a.length; i<l; i++) {
            if(!this.isString(a[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
};

/* typeok.js ends here */
