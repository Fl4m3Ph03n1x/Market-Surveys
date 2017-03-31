"use strict";

/**
 *  Module with camel case utils functions.
 */
const camelCaseFactory = function() {

    /**
     *   Regex for a word in camel case.
     */
    const camelCaseRegEx = /([a-z](?=[A-Z]))/g;

    /**
     *  Check if the given string is camel case or not.
     * 
     * @param   {string}    string  The string to be tested
     * @returns {boolean}   True if the given string is camel case, 
     *                      false otherwise.
     */
    const isCamelCase = function(string) {
        return string.match(camelCaseRegEx) !== null;
    };

    /**
     *  Splits a camel case word with the given separator.
     * 
     *  @param {string} string      The camel case string to be splitten.
     *  @param {string} separator   The string, usually a character, to be used 
     *                              to separate the camel case string. 
     */
    const splitCamelCalse = function(string, separator) {
        return string.replace(camelCaseRegEx, "$1" + separator).toLowerCase();
    };

    return Object.freeze({
        isCamelCase,
        splitCamelCalse
    });
};

module.exports = camelCaseFactory;