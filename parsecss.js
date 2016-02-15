/*global CSSPropertySyntaxError, utils, NotStringError */

/* parsecss.js --- parseCSS for Yet Another Expand/Collapse List (yacollist)
 Commentary:
 Code:
 */

/**
 * Parse a CSS String to get/set the properties/values.
 * @constructor
 * @param {String} thecss - Styles in CSS format.
 * @throws {}
 */
var CSSParser = function(thecss) {
    try {
        /**
         * @property {Array.<String[]>} styles - Array of pair of {@linkcode String} containing the CSS properties/values.
         * @private
         */
        this.styles = this.makePropertyList(thecss);
    }
    catch(e) {
        throw e;
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
CSSParser.prototype.isValidSyntax = function(property, value) {
    // Check if value is not void
    if(value === undefined || value === '') {
        throw new CSSPropertySyntaxError('The CSS property ' + property + ' has a syntax error. ##');
    }
    // Check that there's no illegal chars
    if(property.search(':|;') !== -1 || value.search(':|;') !== -1) {
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
 * Parse CSS properties as an {@linkcode Array} and return their pair property/value.
 * @param {String[]} properties - CSS properties from a style attribute.
 * @returns {String[]} A pair of of property/value.
 * @throws {NotStringError|CSSPropertySyntaxError} - Argument passed is not valid.
 */
CSSParser.prototype.makePairs = function(properties) {
    if(!utils.isStringArray(properties)) {
        throw new NotStringError('Argument styles is not a valid String. ##');
    }

    // Separate properties from their values like : [['prop', 'value], ['prop2', 'value2'], ...]
    for(var i=0, len=properties.length; i<len; i++) {
        // Separate property from value
        properties[i] = properties[i].split(':');

        // Check that the property has a value & verify that it's a valid pair
        try {
            this.isValidSyntax(properties[i][0], properties[i][1]);
        }
        catch(e) {
            throw e;
        }

        // Trim spaces in front and bottom of Strings
        properties[i][0] = properties[i][0].trim();
    }
    return properties;
};

/**
 * From a CSS styles {@linkcode String} make an array of pairs property/value
 * @param {String} styles - CSS styles from a file, inlined in HTML or from the style attribute.
 * @return {Array.<String[]>} - A list of property/value array.
 * @throws {Error}
 * @see CSSParser.MakePairs
 */
CSSParser.prototype.makePropertyList = function(css) {
    // Split CSS properties into an Array. Form: ['prop: value', 'prop2: value2', ...]
    var styles = css.split(';');

    try {
        styles = this.makePairs(styles);
    }
    catch(e) {
        // FIXME: Should we throw?
        console.log(e.message);
    }
    return styles;
};

/**
 * Find the index of a CSS property in {@link CSSParser.styles}.
 * @param {String} property - Property to find.
 * @param {String} [value=blank] - Value to check the Syntax.
 * @returns {int} The index of the property or {@linkcode -1} if not found.
 * @throws {CSSPropertySyntaxError} The given property or value is not valid.
 */
CSSParser.prototype.findPropertyIndex = function(property, value) {
    try {
        this.isValidSyntax(property, value || 'blank');
        for(var i=0, len=this.styles.length; i<len; i++) {
            if(this.styles[i][0] === property) {
                // Return the index of the property
                return i;
            }
        }
    }
    catch(e) {
        throw e;
    }
    return -1;
};

/**
 * Set a CSS property with a value in {@link CSSParser.styles}. If the property is not found, it appends it.
 * @param {String} property - The property to change the value.
 * @param {String} value - The value to assign to the property.
 * @throws {CSSPropertySyntaxError} The given property or value is not valid.
 */
CSSParser.prototype.setProperty = function(property, value) {
    var index;
    // Make sure we can search the value if number
    value = value.toString();

    try {
        index = this.findPropertyIndex(property, value);
        if(index === -1) {
            // Add the property at the end
            this.styles.push([property, value]);
        }
        else {
            this.styles[index][1] = value;
        }
    }
    catch(e) {
        throw e;
    }
};

/**
 * Return a CSS property value from {@link CSSParser.styles}. If not found, it returns -1.
 * @param {} property - The property to find the value.
 * @returns {} The value of the property or -1 if not found.
 * @throws {CSSPropertySyntaxError} The given property is not valid.
 */
CSSParser.prototype.getProperty = function(property) {
    var index, value;
    try {
        index = this.findPropertyIndex(property);
        if(index === -1) {
            // Property wasn't found
            return index;
        }
        value = this.styles[index][1];
    }
    catch(e) {
        throw e;
    }
    return value;
};

CSSParser.prototype.toString = function() {
    var styles = this.styles,
    thecss = '';
    for(var i=0, len=styles.length; i<len; i++) {
        thecss += styles[i][0] + ':' + styles[i][1] + ';';
    }
    console.log(this.styles);
    return thecss;
};
