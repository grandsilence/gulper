"use strict";

const gulp = require("../extensions/gulp");
const path = require("path");
const frontend = require("../config/frontend.config");
const rename = require("gulp-rename");
const tap = require("gulp-tap");
const gulpIf = require("gulp-if");
const reporter = require('../reporter');

// Styles
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps"); // #dev_module
const buildRev = require("../rev-pipe");

/**
 * Compile styles depend on debug flag.
 *
 * @param {boolean} [debug] Set true for generation sourcemaps.
 * @param {BrowserSyncInstance} [browserSync] BrowserSync, set to null if no sync
 * @returns {Promise.<*>}
 */
module.exports = function (debug, browserSync = null) {
    // Fix undefined browser sync
    const hasBrowserSync = typeof browserSync !== 'undefined' && browserSync !== null && typeof browserSync.reload === 'function';
    const browserSyncWrapper = hasBrowserSync ? browserSync.reload : () => { return true; };

    // Process each style folder excluding names starts with _
    return gulp.src([path.join(frontend.sources.styles, "/*"), "!" + path.join(frontend.sources.styles, "/_*")])
        // For each style folder
        .pipe(tap(function(styleDir) {
            if (!styleDir.stat.isDirectory())
                return;

            const styleDirName = styleDir.relative; // name only, without full path
            
            return gulp.src([
                path.join(frontend.sources.styles, styleDirName, "*.{sass,scss}"),
                "!" + path.join(frontend.sources.styles, styleDirName, "_*.*"),
            ], { base: frontend.sources.root })                
                // #DEBUG_ONLY: Append source maps
                .pipe(gulpIf(debug, sourcemaps.init()))

                // Process SASS and AutoPrefix it
                .pipe(sass({ outputStyle: debug ? "nested" : "compressed"}).on("error", reporter.notifyError))
                .pipe(autoprefixer(frontend.autoPrefixer).on("error", reporter.notifyError))
                
                // #DEBUG_ONLY: Release sourcemaps to public directory
                .pipe(gulpIf(debug, sourcemaps.write(".", {
                    includeContent: false,
                    sourceRoot: frontend.sources.rootFileUrl,
                })))

                // If debug - Release styles with sourcemaps to public directory, else - build with rev
                .pipe(gulpIf(debug, gulp.dest(frontend.public.root), buildRev()))
                .pipe(gulpIf(hasBrowserSync, browserSyncWrapper( { stream: frontend.browserSync.useStream } )));
        }));
};