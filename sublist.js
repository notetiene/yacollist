/* sublist.js --- SubList object for yacollist
 Commentary:
 Code:
 */

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
    // Only one argument passed means an Object was passed
    if(arguments.length === 1) {
        if(arguments[0].title !== undefined && arguments[0].subItems !== undefined) {
            // We return the value of the call to itself not to execute rest
            return SubList.isSubList(arguments[0].title, arguments[0].subItems);
        }
        return false;
    }
    // One arguments ends here

    if(!typeok.isString(title)) {
        throw new NotStringError('Argument title is not a valid String. #0');
    }
    if(!typeok.isStringArray(subItems)) {
        throw new NotArrayStringsError('Argument subList is not a valid Array of Strings. #1');
    }
    return true;
};
// For creating a static method
SubList.prototype.isSubList = SubList.isSubList;

/*  sublist.js ends here */
