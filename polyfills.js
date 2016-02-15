/* polyfills.js --- Polofills for Yet Another Expand/Collapse List (yacollist)
 Commentary:
   Provide compatibility for some (not so) new JavaScript features
 Code:
 */

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

/* polyfills.js ends here */
