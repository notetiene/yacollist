/* yacollist.js --- Yet Another Expand/Collapse List
 Commentary:
   TODO: Add event queue to be processed after DOMContentLoaded (since it's a lib not playing with DOM)
   TODO: Add a polyfill for the DOMContentLoaded for IE
   TODO: Add a generic list "Yacollist"
 Code:
 */

/**
 * The toggleList object contains a list of {@linkcode String} and/or of {@link SubList}. SubLists will allow to expand itseld from a title.
 * @constructor
 * @param {Array} data - Array of {@linkcode String} and/or {@link SubList}.
 * @throws {NotArrayError} - Error in arguments.
 */
var ToggleList = function(data) {
    if(!typeok.isArray(data)) {
        throw new NotArrayError('Argument list is not a valid Array. #2');
    }

    /**
     * The list containing SubList and simple list items.
     * @property _list
     * @type Array
     * @private
     * @default []
     */
   this._list = [];

    /**
     * The number of subLists in {@linkcode ToggleList._list} to keep track of entry types.
     * @property _subListsNumber
     * @type int
     * @private
     * @default 0
     */
    this._subListsNumber = 0;

    /**
     * The number of items the {@linkcode ToggleList._list} member contains.
     * @property _itemsNumber
     * @type int
     * @private
     * @default 0
     */
    this._itemsNumber = 0;

    /**
     * The number of unique reference number assigned to SubList members.
     * @property _assignedReferenceNumber
     * @type int
     * @private
     * @default 0
     * @todo Make this variable static?
     */
    this._assignedReferenceNumber = 0;

    /**
     * A queue of events to register.
     * @property _eventsQueue
     * @type
     * @private
     */

    // Traverse the data array
    for(var i=0, len=data.length; i<len; i++) {
        // Always supposed to be String, because we increment i when next is subskill
        if(!typeok.isString(data[i])) {
            throw new NotStringError('First cell or cell after an Array must should be a String. #3');
        }

        // Verify that i+1 won't be out of bound
        if(i+1 >= len) {
            // Push the remaining String and continue the loop
            // Since it's String and doesn't have next cell
            this._list.push(data[i]);
            this._itemsNumber++;
            continue;
        }

        // Verify that next is just a String
        if(typeok.isString(data[i+1])) {
            // Push the String
            this._list.push(data[i]);
            this._itemsNumber++;
            continue;
        }

        // This is supposed to be a SubList
        try {
            SubList.isSubList(data[i], data[i+1]);

            this._list.push(new SubList(data[i], data[i+1]));
            this._itemsNumber++;
            this._subListsNumber++;
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
 * @property {String} expandClass - Class of a SubList container expanded.
 * @property {Object} idPrefixes - An object containing a {@linkcode String} title property and a {@linkcode String} container property. It's the prefixes used before {@link ToggleList.assignedReferenceNumber}.
 */
ToggleList.prototype.markup = {
    listContainer: '<ul class="toggle-list">%data%</ul>',
    simpleList: '<li>%data%</li>',
    subListTitle: '<a id="%id%" class="sublist-title" role="button">%data%</a>',
    subListContainer: '<li class="sublist">%title%' +
        '<div id="%id%" class="sublist-outer"><ul class="sublist-inner">%data%</ul></div>' +
        '</li>',
    subItem: '<li class="sublist-item">%data%</li>',
    expandClass: 'sublist-expanded',
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

ToggleList.prototype.setExpandedClass = function(className) {
    if(!typeok.isString(className)) {
        throw new NotStringError('Argument className should be a String. ##');
    }

    this.markup.expandClass = className || this.markup.expandClass;
};

/**
 * Add a simple item to the list.
 * @method
 * @param {String} item - Item added to the list.
 * @throws {NotStringError} - Error in arguments.
 */
ToggleList.prototype.add = function(item) {
    if(!typeok.isString(item)) {
        throw new NotStringError('The item argument is not a valid String. #7');
    }
    this._list.push(item);

    // Keep track of entries type
    this._itemsNumber++;
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
        this._list.push(mySubList);

        // Keep track of entries types
        this._itemsNumber++;
        this._subListsNumber++;

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
    var list = this._list;
    var currentItem = '';

    for(var i=0, len=list.length; i<len; i++) {
        currentItem = list[i];

        if(typeok.isString(currentItem)) {
            simpleItems.push(currentItem);
        }
        else {
            subLists.push(currentItem);
        }
    }

    // By default subLists comes before simpleItems
    if(!reverse) {
        this._list = subLists.concat(simpleItems);
    }
    else {
        this._list = simpleItems.concat(subLists);
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
    var list = this._list.slice();
    for (var currentCell = 1, len=list.length; currentCell < len; currentCell++) {
        var tmp = list[currentCell],         // This will not change in for
            cellComparePosition = currentCell,   // May change in While
            currentCellTitle = tmp,
            prevCellValue = '';                  // To compare Strings with Object Title

        // Handle different types of currentItem
        if(!typeok.isString(currentCellTitle)) {
            currentCellTitle = tmp.title;
            // TODO: Call function to sort subItems
        }

        // Note: prevCellValue actually means the next value to test
        prevCellValue = list[cellComparePosition - 1];
        if(!typeok.isString(prevCellValue)) {
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
            if(!typeok.isString(prevCellValue)) {
                prevCellValue = prevCellValue.title;
            }
        }
        list[cellComparePosition] = tmp;
    }
    this._list = list;
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
    if(!typeok.isString(item)) {
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
    if(!typeok.isString(item)) {
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

    var referenceId = this._assignedReferenceNumber;
    var formattedTitle = this.markup.subListTitle.replace('%data%', subList.title)
    // Add the id prefix to the SubList title
            .replace('%id%', this.markup.idPrefixes.title + '%id%')
    // Add a unique ID to the SubList title
            .replace('%id%', referenceId);

    var formattedContainer = this.markup.subListContainer
    // Add the title to the SubList container
            .replace('%title%', formattedTitle)
    // Add the id prefix to the SubList container
            .replace('%id%', this.markup.idPrefixes.container + '%id%')
    // Add a unique ID to the SubList container
            .replace('%id%', referenceId);

    var formattedList = '';

    // For each subItem entries
    for(var i=0; i<subList.subItemsNumber; i++) {
        // Use their own formatting
        formattedList += this.formatSubListItem(subList.subItems[i]);
    }
    formattedContainer = formattedContainer.replace('%data%', formattedList);

    this._assignedReferenceNumber++;

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
        for(var i=0, len=this._itemsNumber; i<len; i++) {
            currentObject = this._list[i];

            // Format according to the type
            if(currentObject instanceof SubList) {
                formattedList += this.formatSubList(currentObject);
            }
            else if(typeok.isString(currentObject)) {
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


/**
 * Expand the given SubList from the list and close the one open (if any).
 * @param {int} number - Nth SubList in the list.
 */
ToggleList.expandSubList = function(idTitle, idContainer, expandClass) {
    // The list item that toggle the SubList
    var titleEl = document.getElementById(idTitle);
    // The hidden container of the SubList
    var containerEl = document.getElementById(idContainer);
    // Actual height of the container children
    var height = containerEl.getElementsByClassName('sublist-inner')
            [0].offsetHeight;
    // Class to mark that a SubList is expanded
    var status = false;

    // Check that titleId and containerId exists (not null)
    if(titleEl === null || titleEl === undefined || containerEl === null || containerEl === undefined) {
        return status;
    }

    // Check if the current clicked element is already open
    if(classify.hasClass(containerEl, expandClass) !== -1) {
        // Close the current clicked element
        classify.removeClass(containerEl, expandClass);
        classify.setHeight(containerEl, 0);
        status = true;
        return status;
    }
    else {
        classify.addClass(containerEl, expandClass);
        classify.setHeight(containerEl, height);
        status = true;
        return true;
    }
};

/**
 * Add an onclick event on the given SubList identified with the ordering number.
 * @param {int} number - Number of the SubList.
 */
ToggleList.prototype.addEventToSubListTitle = function(number) {
    /* Convert number to string */
    number = number.toString();

    /* IDs for the SubList title and container */
    var ids = {
        title: this.markup.idPrefixes.title + number,
        container: this.markup.idPrefixes.container + number
    };
    var expandClass = this.markup.expandClass;

    // console.log('In function addEventToSubListTitle');

    document.getElementById(ids.title).addEventListener('click', function() {
        /* Call function expandSubList on SubList title click */
        ToggleList.expandSubList(ids.title, ids.container, expandClass);
        console.log('#' + ids.title + ' activated ' + ids.container);
    });
    console.log('Add click event listener to ' + ids.title);
};

/**
 * Add event to the queue from member SubLists
 * @method
 */
ToggleList.prototype.addEventToMembers = function() {
    for(var i=0, len=this._subListsNumber; i<len; i++) {
        this.addEventToSubListTitle(i);
    }
};


ToggleList.prototype.registerEvents = function() {

};

/* yacollist.js ends here */
