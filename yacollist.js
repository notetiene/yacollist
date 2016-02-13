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

        /**
         * @property {int} subItemsNumber - Number of items in {@link subItems}.
         * @private
         */
        this.subItemsNumber = subItems.length;

    } catch(e) {
        throw e;
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
    this.subItemsNumber = 0;

    // Traverse the data array
    for(var i=0, len=data.length; i<len; i++) {
        // Always supposed to be String, because we increment i when next is subskill
        if(!isString(data[i])) {
            throw new NotStringError('First cell or cell after an Array must should be a String.');
        }

        // Verify that i+1 won't be out of bound
        if(i+1 >= len) {
            // Push the remaining String and continue the loop
            // Since it's String and doesn't have next cell
            this.list.push(data[i]);
            continue;
        }

        // Verify that next is just a String
        if(isString(data[i+1])) {
            // Push the String
            this.list.push(data[i]);
            continue;
        }

        // This is supposed to be a SubList
        try {
            SubList.isSubList(data[i], data[i+1]);

            this.list.push(new SubList(data[i], data[i+1]));
            this.subItemsNumber++;
            // Increment the counter since we already pushed the next cell
            i++;
        }
        catch(e) {
            // Note: we already tested if data[i] was a String
            if(e instanceof NotArrayStringsError) {
                e.message = 'A items of a SubList must be an Array of Strings.';
                throw e;
            }
            throw e;
        }
    }
};

/**
 * Add a simple item to the list.
 * @method
 * @param {String} item - Item added to the list.
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

/**
 * Group SubLists and simple {@linkcode String} items in the list property. By default, subLists are before simple String items.
 * @method
 * @param {bool} reverse - Simple {@linkcode String} items are before SubLists.
 */
ToggleList.prototype.sortByType = function(reverse) {
    var simpleItems = [], subLists = [];
    var list = this.list;
    var currentItem = '';

    for(var i=0, len=list.length; i<len; i++) {
        currentItem = list[i];

        if(isString(currentItem)) {
            simpleItems.push(currentItem);
        }
        else {
            subLists.push(currentItem);
        }
    }

    // By default subLists comes before simpleItems
    if(!reverse) {
        this.list = subLists.concat(simpleItems);
    }
    else {
        this.list = simpleItems.concat(subLists);
    }
};

/**
 * Sorts the list alphabetically no matter the type of item. It's case non-sensitive for simplicity.
 * @method
 * @param {bool} reverse - Allows to to sort from greater to smaller.
 * @todo Could probably be converted from "while" to "do while" loop
 * @todo Implement reverse feature
 */
ToggleList.prototype.sortByChar = function(reverse) {
    var list = this.list.slice();
    for (var currentCell = 1, len=list.length; currentCell < len; currentCell++) {
        var tmp = list[currentCell],         // This will not change in for
        cellComparePosition = currentCell,   // May change in While
        currentCellTitle = tmp,
        prevCellValue = '';                  // To compare Strings with Object Title

        // Handle different types of currentItem
        if(!isString(currentCellTitle)) {
            currentCellTitle = tmp.title;
            // TODO: Call function to sort subItems
        }

        // Note: prevCellValue actually means the next value to test
        prevCellValue = list[cellComparePosition - 1];
        if(!isString(prevCellValue)) {
            prevCellValue = prevCellValue.title;
        }
        while (prevCellValue.toLocaleLowerCase() > currentCellTitle.toLocaleLowerCase()) {
            list[cellComparePosition] = list[cellComparePosition-1];

            --cellComparePosition;

            // Check that it's not out of bound (-1)
            if(cellComparePosition === 0) {
                break;
            }

            // Set the next prevValue when while condition is called again
            prevCellValue = list[cellComparePosition - 1];
            if(!isString(prevCellValue)) {
                prevCellValue = prevCellValue.title;
            }
        }
        list[cellComparePosition] = tmp;
    }
    this.list = list;
};

/**
 * @method
 */
ToggleList.prototype.sort = function() {
    this.sortByChar();
    this.sortByType();
};

ToggleList.prototype.setMarkupFormat = function(args) {
    if(args.listContainer === undefined && args.subItems === undefined && args.subListContainer === undefined &&
      args.subListTitle === undefined && args.simpleList === undefined) {
        throw new TypeError('Argument should be an Object.');
    }

    this.markup = {
        listContainer: args.listContainer,
        subItems: args.subItems,
        subListContainer: args.subListContainer,
        subListTitle: args.subListTitle,
        simpleList: args.simpleList
    };
};



/* yacollist.js ends here */
