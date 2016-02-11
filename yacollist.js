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

/* ============================================================ */
/* SubList functions ends here                                  */
/* ============================================================ */

/**
 * The toggleList object contains a list of {@linkcode String} and/or of {@link SubList}. SubLists will allow to expand itseld from a title.
 * @constructor
 * @param {Array} data - Array of {@linkcode String} and/or {@link SubList}.
 * @throws {NotArrayError} - Error in arguments.
 */
var ToggleList = function(data) {
    if(!isArray(data)) {
        throw new NotArrayError('Argument list is not a valid Array.');
    }

    this.list = [];
    this.hasSubItems = false;

    // Traverse the data array
    for(var i=0, len=data.length; i<len; i++) {
        // Always supposed to be String, because we increment i when next is subskill
        if(!isString(data[i])) {
            return undefined;
        }
        // Verify that i+1 won't be out of bound
        else if(i+1 >= len) {
            // Push the remaining String
            this.list.push(data[i]);
        }
        // Verify that next is just a String
        else if(isString(data[i+1])) {
            // Push the String
            this.list.push(data[i]);
        }
        else if(SubList.isSubList(data[i], data[i+1])) {
            this.list.push(new SubList(data[i], data[i+1]));
            this.hasSubItems = this.hasSubItems || true;
            // Increment the counter since we already pushed the subskill
            i++;
        }
        else {
            return undefined;
        }
    }
};

/**
 * Add a simple item to the list.
 * @method
 * @param {String} skill - Item added to the list.
 */
ToggleList.prototype.add = function(item) {
    if(!isString(item)) {
        throw 'NotStringError';
    }
    this.list.push(item);
};


/**
 * Add a subList to the list.
 * @method
 * @param {String} title - Title of the object containing a {@link SubList}.
 * @param {String[]} subItems - {@link SubList} of the item to add.
 * @return {bool} Function status as a boolean.
 */
ToggleList.prototype.addSubList = function(title, subItems) {
    // SubList already checks if args make a valid SubList
    var mySubList = new SubList(title, subItems);

    // Verify that subList is valid
    if(mySubList !== undefined) {
        this.list.push(mySubList);
        return true;
    }
    return false;
};

/* yacollist.js ends here */
