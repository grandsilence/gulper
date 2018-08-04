"use strict";

const frontend = require("../config/frontend.config");
const resources = frontend.copyPaster;

const gulp = require("gulp");
const changed = require("gulp-changed");
const path = require("path");


module.exports = function(debug) {
    let promises = [];

    const envDestonation = debug || !frontend.bundleImages ? frontend.public.root : frontend.production.root;

    for (let [relativeDestonation, sources] of Object.entries(resources)) {
        const destonation = path.join(envDestonation, relativeDestonation);

        const promise = gulp.src(sources)
            .pipe(changed(destonation))
            .pipe(gulp.dest(destonation));

        promises.push(promise);
    }

    return Promise.all(promises);
};
