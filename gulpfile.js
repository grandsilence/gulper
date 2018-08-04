"use strict";

// Shared
require('./gulp/shared/globals');

// Gulp helper modules
const gulp = require('./gulp/extensions/gulp');
const pathEnumerator = require("./gulp/path-enumerator");

// TODO: Sprites, svg sprites -/ http://glivera-team.github.io/svg/2016/06/13/svg-sprites-2.html ; https://habrahabr.ru/post/272505/

// Development
const watch = require("gulp-watch"); // Build in watch doesn't trigger delete or create files
const browserSync = require("./gulp/extensions/browser-sync"); // require("browser-sync").create(); // #dev_module
// const gdebug = require("gulp-debug-streams"); // #dev_module

// File utilities
const changed = require("gulp-changed");
const del = require("del");
const path = require("path");

// Front-end configuration
const frontend = require("./gulp/config/frontend.config");

const processors = require("./gulp/processors-loader")
('fontello', 'styles', 'scriptsAsync', 'copypaster');

/// ===========================
/// ===== Shared tasks ========
/// ===========================

gulp.task("clean", gulp._("Clean all compiled production and debug builds.", async done => {
  const folders = [frontend.public.scripts, frontend.public.styles, frontend.public.fonts, frontend.public.images, frontend.caches.fontello,
    frontend.production.root];
  del(await pathEnumerator.enumFilesAsync(folders), done);
}));

// gulp.task("images",  gulp._("Copy asset images to public directory.", () => {
//     // Copy all excluding sprites and git files
//     return gulp.src([path.join(frontend.sources.images, "**/*.{" + frontend.imageExtensions + "}"),
//         "!" + path.join(frontend.sources.images, "sprites")])
//         .pipe(changed(frontend.public.images))
//         .pipe(gulp.dest(frontend.public.images));
// }));

/// ===========================
/// ==== Debug environment ====
/// ===========================

gulp.task("d@clean", gulp._("Debug. Clean all compiled debug builds.", async done => {
  const folders = [frontend.public.scripts, frontend.public.styles, frontend.public.fonts, frontend.public.images, frontend.caches.fontello];
  del(await pathEnumerator.enumFilesAsync(folders), done);
}));

gulp.task("d@fontello", gulp._("Debug. Download fontello icons declared in fontello.json.", () => {
  return processors.fontello(true);
}));

gulp.task("d@styles", gulp._("Debug. Compile styles.", () => {
  return processors.styles(true); // build styles with sourcemaps and comments
}));

gulp.task("d@stylesBs", gulp._("Debug. Compile styles with stream to BrowserSync.", () => {
  return processors.styles(true, browserSync); // build styles with sourcemaps and comments and stream to BrowserSync.
}));
gulp.task("d@fontello_styles", gulp._("Debug. Compile fontello and styles.", gulp.series("d@fontello", "d@styles")));

gulp.task("d@copypaster", gulp._("Debug. Copy files via CopyPaster", () => {
  return processors.copypaster(true);
}));

// Scripts
gulp.task("d@scripts", gulp._("Debug. Compile scripts.", async () => {
  return await processors.scriptsAsync(true); // build scripts with sourcemaps
}));
gulp.task("d@scriptsBs", gulp._("Debug. Compile scripts with stream to BrowserSync.", async () => {
  return await processors.scriptsAsync(true, browserSync); // build scripts with sourcemaps and stream to BrowserSync.
}));

gulp.task("d@build", gulp._("Debug. Build all without watching.", gulp.parallel(
    "d@fontello_styles", "d@scripts", "d@copypaster",
)));
gulp.task("d@clean_build", gulp._("Debug. Remove and makes new.", gulp.series("clean", "d@build")));

/// ================================
/// ==== Production environment ====
/// ================================
gulp.task("p@fontello", gulp._("Production. Download fontello icons declared in fontello.json.", () => {
  return processors.fontello(false);
}));

gulp.task("p@scripts", gulp._("Production. Compile scripts.", async () => {
  return await processors.scriptsAsync(false);
}));

gulp.task("p@styles", gulp._("Production. Compile styles.", () => {
  return processors.styles(false);
}));

gulp.task("p@fontello_styles", gulp._("Production. Compile fontello and styles.", gulp.series("p@fontello", "p@styles")));

gulp.task("p@copypaster", gulp._("Production. Copy files via CopyPaster", () => {
  return processors.copypaster(false);
}));

gulp.task("p@build", gulp._("Production. Build all without watching.", gulp.parallel(
    "p@fontello_styles", "p@scripts", "p@copypaster"
)));
gulp.task("p@clean_build", gulp._("Production. Remove all builds and makes new.", gulp.series("clean", "p@build")));

/// ================================
/// ==== Default ==================
/// ================================

gulp.task("watch", gulp._("Debug. Build and live edit project using BrowserSync.", gulp.series(
    //gulp.series("d@clean"),
    gulp.task("clean"), //, "d@copypaster"),
    // Build without scripts because it will be done in d@scriptsWatch
    // Don't use anonymous functions for gulp tasks.
    gulp.parallel("d@fontello_styles", "d@scripts"),
    gulp.task("d@copypaster"),
    gulp.parallel(function listenChanges() {
      // Fontello
      // => watch inside each style folder '.fontello.json', excluding style folder names begins with '_'.
      watch([path.join(frontend.sources.styles, "*/*.fontello.json"), "!" + path.join(frontend.sources.styles, "_*")],
          gulp.series("d@fontello_styles", function bsFontelloHardRefresh(done) {
            browserSync.reload({stream: false}); // Hard reload browser, for load fonts
            if (typeof done === "function")
              done();
          }),
      );

      // Styles. Wait for SASS Styles changes
      // => watch inside each style folder for '.sass' and '.scss', excluding Fontello cache.
      watch([path.join(frontend.sources.styles, "**/*.{sass,scss}"),
            "!" + path.join(frontend.sources.styles, "*/vendor/fontello")],
          gulp.series("d@stylesBs"),
      );

      // Scripts. Wait for TypeScript compilation and plugin. When is done => broadcast browserSync.
      // => watch inside each script folder for '.js'.

      // DISCLAIMER: I know about webpack watch option. It used in the past.
      // But it has an issue - watch isn't track create or delete file.
      watch(path.join(frontend.sources.scripts, "**/*.(js|vue)"), gulp.series("d@scriptsBs"));

      watch(Object.values(frontend.copyPaster), //path.join(frontend.sources.images, "**/*.{" + frontend.imageExtensions + "}")
          gulp.series("d@copypaster", function bsRefreshStaticFiles(done) {
            browserSync.reload({stream: false}); // Hard reload browser, for load new images
            if (typeof done === "function")
              done();
          }),
      );

      // Templates
      // => watch blade templates
      if (frontend.sources.templates) {
        watch(frontend.sources.templates, function bsTemplatesHardRefresh(done) {
              //setTimeout(function() {
              browserSync.reload({stream: false}); // Hard reload browser, for load html
              if (typeof done === "function")
                done();
              //}, 50);
            },
        );
      }

      browserSync.initFromArgumentsAndConfig();
    }))));

gulp.task("default", gulp._("Starts debug watch by default.", gulp.series("watch")));
