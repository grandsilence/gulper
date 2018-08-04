"use strict";

const gulp = require("gulp");

/**
 * Provider for gulp task descriptions.
 *
 * @param {string} description Task description.
 * @param {function} fn Task actions.
 * @returns {function} Function with gulp task description.
 * @private
 */
function _(description, fn) {
    fn.description = description;
    return fn;
}

// New declarations
gulp._ = _;

module.exports = gulp;
