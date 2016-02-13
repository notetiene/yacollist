/* yacollist.js --- Yet Another Expand/Collapse List
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
    // Only one argument passed means an Object was passed
    if(arguments.length === 1) {
        if(arguments[0].title !== undefined && arguments[0].subItems !== undefined) {
            // We return the value of the call to itself not to execute rest
            return SubList.isSubList(arguments[0].title, arguments[0].subItems);
        }
        return false;
    }
    // One arguments ends here

    if(!isString(title)) {
        throw new NotStringError('Argument title is not a valid String. #0');
    }
    if(!isStringArray(subItems)) {
        throw new NotArrayStringsError('Argument subList is not a valid Array of Strings. #1');
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
        throw new NotArrayError('Argument list is not a valid Array. #2');
    }

    this.list = [];

    // Keep track of entries type
    this.subListsNumber = 0;
    this.itemsNumber = 0;

    // This is for assigning unique ID
    // TODO: Make this variable static?
    this.assignedReferenceNumber = 0;

    // Traverse the data array
    for(var i=0, len=data.length; i<len; i++) {
        // Always supposed to be String, because we increment i when next is subskill
        if(!isString(data[i])) {
            throw new NotStringError('First cell or cell after an Array must should be a String. #3');
        }

        // Verify that i+1 won't be out of bound
        if(i+1 >= len) {
            // Push the remaining String and continue the loop
            // Since it's String and doesn't have next cell
            this.list.push(data[i]);
            this.itemsNumber++;
            continue;
        }

        // Verify that next is just a String
        if(isString(data[i+1])) {
            // Push the String
            this.list.push(data[i]);
            this.itemsNumber++;
            continue;
        }

        // This is supposed to be a SubList
        try {
            SubList.isSubList(data[i], data[i+1]);

            this.list.push(new SubList(data[i], data[i+1]));
            this.itemsNumber++;
            this.subListNumber++;
            // Increment the counter since we already pushed the next cell
            i++;
        }
        catch(e) {
            // Note: we already tested if data[i] was a String
            if(e instanceof NotArrayStringsError) {
                e.message = 'A items of a SubList must be an Array of Strings. #4';
                throw e;
            }
            throw e;
        }
    }
};

/**
 *
 * @property {String} listContainer - The root list container. It will contain a list of simple list items and {@link SubList} objects. It must contain the {@linkcode %data%} placeholder.
 * @property {String} simpleList - A simple list item that doesn't contain children. It must contain the {@linkcode %data%} placeholder.
 * @property {String} subListTitle - The title of a {@link SubList} objects. It should be a link with href attribute. It must contain the id attribute and a prefix before the {@linkcode %id%} placeholder. It must contain the {@linkcode %data%} placeholder.
 * @property {String} subListContainer - The container of a {@link SubList} list AND a parent list item for the root list container. It must contain the {@linkcode %title%} placeholder before openning the new (un)ordered list conttainer for the {@link SubList.subItems}. It must contain an id attribute on the (un)ordered list container, an id prefix and the {@linkcode %id%} placeholder. The id prefix must be different than {@link subListTitle}. It must contain the {@linkcode %data%} placeholder.
 * @property {String} subItem - A list item for a {@link SubList.subItems} item.
 * @property {Object} idPrefixes - An object containing a {@linkcode String} title property and a {@linkcode String} container property. It's the prefixes used before {@link ToggleList.assignedReferenceNumber}.
*/
ToggleList.prototype.markup = {
    listContainer: '<ul class="toggle-list">%data%</ul>',
    simpleList: '<li>%data%</li>',
    subListTitle: '<a id="%id%" class="sublist-title" role="button">%data%</a>',
    subListContainer: '<li class="sublist">%title%' +
        '<ul id="%id%" class="sublist-inner">%data%</ul>' +
        '</li>',
    subItem: '<li class="sublist-item">%data%</li>',
    idPrefixes: {
        title: 'sublist-title-',
        container: 'sublist-'
    }
};

ToggleList.prototype.setMarkupFormat = function(args) {
    if(args.listContainer === undefined && args.subItem === undefined && args.subListContainer === undefined &&
       args.subListTitle === undefined && args.simpleList === undefined) {
        throw new TypeError('Argument should be an Object. #5');
    }

    this.markup = {
        listContainer: args.listContainer || this.markup.listContainer,
        subItem: args.subItem || this.markup.subItem,
        subListContainer: args.subListContainer || this.markup.subListContainer,
        subListTitle: args.subListTitle || this.markup.subListTitle,
        simpleList: args.simpleList || this.markupl.simpleList
    };
};

ToggleList.prototype.setIdPrefixes = function(prefixes) {
    if(prefixes.title === undefined && prefixes.container) {
        throw new TypeError('Argument should be an Object. #6');
    }

    this.markup.idPrefixes= {
        title: prefixes.title || this.markup.idPrefixes.title,
        container: prefixes.container || this.markup.idPrefixes.container
    };
};

/**
 * Add a simple item to the list.
 * @method
 * @param {String} item - Item added to the list.
 * @throws {NotStringError} - Error in arguments.
 */
ToggleList.prototype.add = function(item) {
    if(!isString(item)) {
        throw new NotStringError('The item argument is not a valid String. #7');
    }
    this.list.push(item);

    // Keep track of entries type
    this.itemsNumber++;
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

        // Keep track of entries types
        this.itemsNumber++;
        this.subListsNumber++;

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

/**
 * Format a single item. Called from the {@link format} method.
 * @param {String} item - A simple list item (not member of a @link SubList).
 * @returns {String} A formatted HTML list item.
 * @throws {NotStringError} - Error in arguments.
 */
ToggleList.prototype.formatSingleItem = function(item) {
    if(!isString(item)) {
        throw new NotStringError('The passed item: ' + item + ' is not a valid String. #8');
    }
    return this.markup.simpleList.replace('%data%', item);
};

/**
 * Format a single item part of a Sublist.
 * @param {} item - A simple list item part of a {SubList} object.
 * @returns {} A formatted HTML list item to be embedded in a SubList container.
 * @throws {NotStringError} - Error in arguments.
 */
ToggleList.prototype.formatSubListItem = function(item) {
    if(!isString(item)) {
        throw new NotStringError('The passed item ' + item + ' is not a valid String. #9');
    }
    return this.markup.subItem.replace('%data%', item);
};

/**
 * Format a {@link SubList.title} and a {@link SubList.subItems} according to the {@link ToggleList.markup} member Object.
 * @see ToggleList.markup
 * @param {} subList
 * @returns {} A SubList formatted as li for the title and a ul containing subItem in li.
 * @throws {TypeError} Error in arguments.
 */
ToggleList.prototype.formatSubList = function(subList) {
    if(!SubList.isSubList(subList)) {
        throw new TypeError('The argument ' + subList + ' is not a valid subList. #10');
    }

    var referenceId = this.assignedReferenceNumber;
    var formattedTitle = this.markup.subListTitle.replace('%data%', subList.title)
    // Add the id prefix to the SubList title
            .replace('%id%', this.markup.idPrefix.title + '%id%')
    // Add a unique ID to the SubList title
            .replace('%id%', referenceId);

    var formattedContainer = this.markup.subListContainer
    // Add the title to the SubList container
            .replace('%title%', formattedTitle)
    // Add the id prefix to the SubList container
            .replace('%id%', this.markup.idPrefix.container + '%id%')
    // Add a unique ID to the SubList container
            .replace('%id%', referenceId);

    var formattedList = '';

    // For each subItem entries
    for(var i=0; i<subList.subItemsNumber; i++) {
        // Use their own formatting
        formattedList += this.formatSubListItem(subList.subItems[i]);
    }
    formattedContainer = formattedContainer.replace('%data%', formattedList);

    this.assignedReferenceNumber++;

    return formattedContainer;
};

/**
 * Format a whole ToggleList object according to {@link ToggleList.markup} object.
 * @returns {String} - Formatted ToggleList object as an HTML list.
 * @throws {TypeError} - The ToggleList is corrupted or invalid.
 */
ToggleList.prototype.format = function() {
    var formattedContainer = this.markup.listContainer;
    var formattedList = '',
        // This is for readabiliy
        currentObject = '';

    try {
        for(var i=0, len=this.itemsNumber; i<len; i++) {
            currentObject = this.list[i];

            // Format according to the type
            if(currentObject instanceof SubList) {
                formattedList += this.formatSubList(currentObject);
            }
            else if(isString(currentObject)) {
                formattedList += this.formatSingleItem(currentObject);
            }
            // There are only two options, but someone may use the library badly
            else {
                throw new TypeError('The ToggleList contains invalid values. #11');
            }
        }
        formattedContainer = formattedContainer.replace('%data%', formattedList);
    }
    catch(e) {
        console.log(e.message);
        throw e;
    }

    // All operations passed
    return formattedContainer;
};


/* yacollist.js ends here */
