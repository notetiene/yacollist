/* classify.js --- Functions operating on the class attribute of an element
 Commentary:
 Code:
 */

/**
 * Namespace for functions operating on the class attribute of an element.
 * @namespace
 */
var classify = {};

/**
 * Test that {@link el} is an {@linkcode HTMLElement} and that {@link htmlClass} is a {@linkcode String}. Used by class operation functions.
 * @private
 * @param {} el - An {@linkcode HTMLElement} (user is responsible for implementing the selector).
 * @param {} htmlClass - A string containing the class to operate on.
 * @throws {TypeError|NotStringError} - The argument are not valid for making operations.
 */
classify._isValidOperation = function(el, htmlClass) {
    // Verify that it point to an HTMLElement
    if(!(el instanceof HTMLElement)) {
        throw new TypeError('The el is argument not an HTMLElement. ##');
    }
    // Verify that htmlClass is a String
    if(!utils.isString(htmlClass)) {
        throw new NotStringError('The htmlClass argument is not a valid String. ##');
    }
};

/**
 * Verify that an {@linkcode HTMLElement} has a given class in its class attribute.
 * @private
 * @param {HTMLElement} _el - Element to verify the presence of class (user is responsible for implementing the selector).
 * @param {String} _htmlClass - A class to check the presence in the in the element.
 * @returns {int} Status of the function. The position if found (starting at 0) or -1 if not found.
 */
classify._hasClass = function(_el, _htmlClass) {
    var status;
    var classes = _el.getAttribute('class');

    // Verify the class attribute is not void
    if(classes === null) {
        return -1;
    }

    // Split classes into an array
    classes = classes.split(' ');

    // Go thru the array of classes
    for(var i=0, len=classes.length; i<len; i++) {
        // Check if the class equal htmlClass
        if(_htmlClass.localeCompare(classes[i]) === 0) {
            status = i;
            return status;
        }
    }
    // htmlClass wasn't found
    return -1;
};

/**
 * Verify that an {@linkcode HTMLElement} has a given class in its class attribute.
 * @public
 * @param {HTMLElement} el - Element to verify the presence of class (user is responsible for implementing the selector).
 * @param {String} htmlClass - A class to check the presence in the in the element.
 * @returns {int} Status of the function. The position if found (starting at 0) or -1 if not found.
 * @see classify.addClass
 * @see classify.removeClass
 */
classify.hasClass = function(el, htmlClass) {
    var status;

    try {
        this._isValidOperation(el, htmlClass);
    }
    catch(e) {
        console.log(e);
        return -1;
    }

    // Call the private method
    status = this._hasClass(el, htmlClass);

    return status;
};

/**
 * Remove a class from the class attribute of an {@linkcode HTMLElement}. It removes the class attribute if it becomes void.
 * @private
 * @param {HTMLElement} _el - The element to remove the class.
 * @param {String} _htmlClass - The class to remove from the element.
 * @returns {int} Status of the function. The position if found (starting at 0) or -1 if not found.
 */
classify._removeClass = function (_el, _htmlClass) {
    var classes = _el.getAttribute('class');
    var status = -1;

    // Verify that the class attribute exists
    if(classes === null) {
        return -1;
    }
    // Verify the class attribute is not void
    else if(classes === '') {
        _el.removeAttribute('class');
        return -1;
    }

    // Assign the status of method call
    status = this._hasClass(_el, _htmlClass);

    // If it failed to find the class
    if(status === -1) {
        return -1;
    }

    // Split the String into an Array of Strings to compare our class
    classes = classes.split(' ');
    // Remove the class at specified position
    classes[status] = '';
    // Join all the classes to set the class attribute
    classes = classes.join(' ');

    // If the class attribute is now void, remove it
    if(classes === '') {
        _el.removeAttribute('class');
        return status;
    }

    _el.setAttribute('class', classes);
    return status;
};

/**
 * Remove a class from the class attribute of an {@linkcode HTMLElement}. It removes the class attribute if it becomes void.
 * @public
 * @param {HTMLElement} el - The element to remove the class.
 * @param {String} htmlClass - The class to remove from the element.
 * @returns {int} The status of the function. The position of the class if removed or -1 if not found.
 * @throws {TypeError|NotStringError} - Errors from {@link classify.ValidOperation}.
 * @see classify.addClass
 * @see classify.hasClass
 */
classify.removeClass = function(el, htmlClass) {
    var status = -1;
    // Verify that arguments are valid
    try {
        this._isValidOperation(el, htmlClass);
    }
    catch(e) {
        throw e;
    }

    status = this._removeClass(el, htmlClass);

    return status;
};

/**
 * Add a class in the class attribute of an {@linkcode HTMLElement}.
 * @private
 * @param {HTMLElement} _el - The element to add the class to.
 * @param {String} _htmlClass - The class to add to the element.
 * Note: Can't call again isValidClassOperation if we call hasClass.
 */
classify._addClass = function(_el, _htmlClass) {
    var classes;
    var status = -1;

    if(this._hasClass(_el, _htmlClass) !== -1) {
        // The class is already present
        return -1;
    }

    classes = _el.getAttribute('class');
    classes += ' ' + _htmlClass;

    // Set the new class attribute
    _el.setAttribute('class', classes);
    return 0;
};

/**
 * Add a class in the class attribute of an {@linkcode HTMLElement}.
 * @public
 * @param {HTMLElement} el - The element to add the class to.
 * @param {String} htmlClass - The class to add to the element.
 * Note: Can't call again isValidClassOperation if we call hasClass.
 */
classify.addClass = function(el, htmlClass) {
    var status = -1;
    // Verify that arguments are valid
    try {
        this._isValidOperation(el, htmlClass);
    }
    catch(e) {
        throw e;
    }

    status = this._hasClass(el, htmlClass);
};

/*  classify.js ends here */
