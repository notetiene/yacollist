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
 * @todo Test if the String is empty
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
 * Test that {@link el} is an {@linkcode HTMLElement} and that {@link htmlClass} is a {@linkcode String}. Used by class operation functions.
 * @param {} el - An {@linkcode HTMLElement} (user is responsible for implementing the selector).
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
 * @see CSSPropertySyntaxError
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


/**
 * Verify that an {@linkcode HTMLElement} has a given class in its class attribute.
 * @param {HTMLElement} el - Element to verify the presence of class (user is responsible for implementing the selector).
 * @param {String} htmlClass - A class to check the presence in the in the element.
 * @returns {bool} Status of the function.
 * @see utils.addClass
 * @see utils.removeClass
 */
utils.hasClass = function(el, htmlClass) {
    var status = false;

    try {
        this.isValidClassOperation(el, htmlClass);
    }
    catch(e) {
        console.log(e);
        return status;
    }

    var classes = el.getAttribute('class');

    // Verify the class attribute is not void
    if(classes === null) {
        return status;
    }

    // Split classes into an array
    classes = classes.split(' ');

    // Go thru the array of classes
    for(var i=0, len=classes.length; i<len; i++) {
        if(htmlClass.localeCompare(classes[i]) === 0) {
            status
            return status;
        }
    }
    // htmlClass wasn't found
    return status;
};

/**
 * Remove a class from the class attribute of an {@linkcode HTMLElement}. It removes the class attribute if it becomes void.
 * @param {HTMLElement} el - The element to remove the class.
 * @param {String} htmlClass - The class to remove from the element.
 * @returns {bool} The status of the function (if the class was found and removed).
 * @throws {TypeError|NotStringError} - Errors from {@link utils.isValidClassOperation}.
 * @see utils.addClass
 * @see utils.hasClass
 */
utils.removeClass = function (el, htmlClass) {
    // Verify that arguments are valid
    try {
        this.isValidClassOperation(el, htmlClass);
    }
    catch(e) {
        throw e;
    }

    var classes = el.getAttribute('class');
    var isFound = false;

    // Verify the class attribute is not void
    if(classes === null || classes === '') {
        return isFound;
    }

    // Split the String into an Array of Strings to compare our class
    classes = classes.split(' ');

    for(var i=0, len=classes.length; i<len; i++) {
        if(classes[i].localeCompare(htmlClass) === 0) {
            classes[i] = '';
            isFound = true;
            break;
        }
    }

    // Join all the classes to set the class attribute
    classes = classes.join(' ');

    // If the class attribute is now void, remove it
    if(classes === '') {
        el.removeAttribute('class');
        return isFound;
    }

    el.setAttribute('class', classes);
    return isFound;
};

/* utilities.js ends here */
