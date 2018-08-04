"use strict";

const combine = require("stream-combiner2").obj;

const gulp = require("gulp");
const rev = require("gulp-rev");
const frontend = require("./config/frontend.config");

/**
 * Build new revision of files and merge it to manifest file.
 */
module.exports = function() {
    return combine(
        rev(),
        gulp.dest(frontend.production.root),
        rev.manifest(frontend.production.root + '/rev-manifest.json', { merge: true, base: frontend.production.root }),
        gulp.dest(frontend.production.root),
    );
}
