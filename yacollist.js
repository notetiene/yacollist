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

/**
 * Error that a value is not of type {@linkcode String[]}.
 * @constructor
 * @param {String} message - Message to display.
 * @augments TypeError
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
    this.message = message || 'It’s not a valid Array of Strings';
    this.stack = (new Error()).stack;
}
NotArrayStringsError.prototype = new TypeError;

/* ============================================================ */
/* Utility functions ends here                                  */
/* ============================================================ */


/**
 * Contains a title and a list representing a sublist.
 * @Constructor
 * @param {String} title - The title of the subList.
 * @param {String[]} subItems - An array of {@linkcode String} containing list items.
 */
var SubList = function(title, subItems) {
    try {
        this.isSubList(title, subItems);

        /**
         * @property {String} title - The title that expands the subList.
         * @private
         */
        this.title = title;

        /**
         * @property {String[]} subItems - Items of the subList.
         * @private
         */
        this.subItems = subItems;
    } catch(e) {
        console.log(e.message);
        return undefined;
    }
    // Args are valid
};

/**
 * Checks if arguments can be valid as a {@linkcode SubList}
 * @param {String} title - The title of the subList.
 * @param {String[]} subItems - Array of Strings containing subItems.
 * @throws {NotStringError|NotArrayStringsError} - Error in arguments.
 * @static
 * @returns {?bool} True if it’s a valid SubString
 */
SubList.isSubList = function(title, subItems) {
    if(!isString(title)) {
        throw new NotStringError('Argument title is not a valid String.');
    }
    if(!isStringArray(subItems)) {
        throw new NotArrayStringsError('Argument subList is not a valid Array of Strings.');
    }
    return true;
};
// For creating a static method
SubList.prototype.isSubList = SubList.isSubList;

/* yacollist.js ends here */
