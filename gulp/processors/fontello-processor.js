"use strict";

const frontend = require("../config/frontend.config");

const gulp = require("gulp");
const path = require("path");
const tap = require("gulp-tap");
const fs = require("fs");
const gulpIgnore = require("gulp-ignore");
const changed = require("gulp-changed");
const gulpIf = require("gulp-if");
const fontello = require("gulp-fontello");
const reporter = require("../reporter");

module.exports = function (debug) {
  // TODO: fix reporter when error, may be https://gist.github.com/just-boris/89ee7c1829e87e2db04c

  // Process each style folder excluding names starts with _
  return gulp.src([path.join(frontend.sources.styles, "*"), "!" + path.join(frontend.sources.styles, "_*")])
      // For each style folder
      .pipe(tap(styleDir => {
        if (!styleDir.stat.isDirectory())
          return;

        const styleDirName = styleDir.relative; // name only
        const styleDirPath = path.join(frontend.sources.styles, styleDirName); // full path

        return gulp.src([
          path.join(styleDirPath, "*.fontello.json"),
          "!" + path.join(frontend.sources.styles, styleDirName, "_*.*"),
        ]).pipe(tap(configFile => {
          const configName = configFile.relative;
          const configPath = path.join(styleDirPath, configName);
          const vendorPath = path.join(styleDirPath, "vendor/fontello");

          // Async await version module "afs" is not working with gulp-tap.
          // I don't know how to fix this, May be fs.exists ?
          // REMARK: using gulp module 'cache' is a bad idea. Module 'changed' is faster for watch tasks.
          const cacheExists = fs.existsSync(path.join(vendorPath, configName));

          return gulp.src(configPath)
              // If cache exists and cache is invalidated then update fonts
              .pipe(gulpIf(cacheExists, changed(vendorPath)))
              // Cache json config due optimization
              .pipe(gulp.dest(vendorPath))
              .pipe(fontello({font: "fonts"})) //.on("error", reporter.notifyError))
              // Release fonts and styles to assets
              .pipe(gulp.dest(vendorPath))
              // Release fonts only to public directory
              .pipe(gulpIgnore.include("fonts/**/*"))
              .pipe(gulp.dest(debug ? frontend.public.styles : frontend.production.styles));
        }));
      }));
};
