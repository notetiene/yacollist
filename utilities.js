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
 * Test that el is an HTMLElement and that htmlClass is a String. Used by class operation functions.
 * @param {} el - An HTMLElement (user is responsible to implement the selector).
 * @param {} htmlClass - A string containing the class to operate on.
 * @throws {TypeError|NotStringError} - The argument are not valid for making operations.
 */
utils.isValidClassOperation = function(el, htmlClass) {
    // Verify that it point to an HTMLElement
    if(!(el instanceof HTMLElement)) {
        throw new TypeError('The argument el is not an HTMLElement. ##');
    }
    // Verify that htmlClass is a String
    if(!utils.isString(htmlClass)) {
        throw new NotStringError('The htmlClass argument is not a valid String. ##');
    }
};

/**
 * Verify that a given property value is not void or null.
 * @param {String} property - The CSS property.
 * @param {String} value - The CSS property value.
 * @returns {bool} - True if valid.
 * @throws {CSSPropertySyntaxError} - CSS property value was malformed.
 * @todo Maybe we should include properties
 */
utils.isValidCSSSyntax = function(property, value) {
    // Check if value is not void
    if(value === undefined || value === '') {
        throw new CSSPropertySyntaxError('The CSS property ' + property + ' has a syntax error. ##');
    }
    // Check if value is just white characters (spaces)
    if(value.search(/\s+$/) !== -1) {
        throw new CSSPropertySyntaxError('The CSS property ' + property + ' doesn\'t have a value. ##');
    }
    else {
        return true;
    }
};

/* utilities.js ends here */
