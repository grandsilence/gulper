"use strict";

const frontend = require("../config/frontend.config");

const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackMerge = require("webpack-merge");

const path = require("path");
const afs = require("async-file");
const pathEnumerator = require("../path-enumerator");

const gulp = require("gulp");
const gulpIf = require("gulp-if");
const rename = require("gulp-rename");
const reporter = require("../reporter");
const buildRev = require("../rev-pipe");

/**
 * Factory of name specific ChunkPlugins.
 *
 * @param {string} folder
 * @param {string} chunkName
 * @returns {CommonsChunkPlugin}
 */
function buildVendorChunkPlugin(folder, chunkName) {
    return new webpack.optimize.CommonsChunkPlugin({
        name: `${folder}/vendor`,
        chunks: [chunkName],
        minChunks: function(module) {
            // this assumes your vendor imports exist in the node_modules directory
            return module.context && module.context.indexOf("node_modules") !== -1;
        },
    });
}

/**
 * Process scripts using webpack depend on debug flag. Watch supported.
 *
 * @param {boolean} [debug] If this is true then include source maps and keep commentaries, without minification out files.
 * @param {BrowserSyncInstance} [browserSync] BrowserSync, set to null if no sync
 * @returns {Promise.<*>}
 */
module.exports = async function (debug, browserSync = null) {
    // Module requires here for live reload
    const configName = debug ? "development" : "production";
    let webpackConfig = webpackMerge(require("../config/webpack.common.config"), require("../config/webpack." + configName + ".config"));

    // Append entry
    let entries = { entry: {} };
    let scripts = [];

    // For appending name specific chunk plugins
    let plugins = typeof webpackConfig.plugins !== "undefined" ? webpackConfig.plugins : [];

    // Get all script folders with "main.js" inside
    const mainModuleName = "main";
    const mainModuleFile = mainModuleName + ".js"; //"main.ts";
    const folders = await pathEnumerator.enumFoldersAsync(frontend.sources.scripts, mainModuleFile); // mainModuleFile - manual checking in the bottom

    for (let folder of folders) {
        // Existion already checked in pathEnumerator.enumFoldersAsync
        const scriptPath = path.join(frontend.sources.scripts, folder, mainModuleFile);
        scripts.push(scriptPath);
        
        const entryName = `${folder}/${mainModuleName}`;
        if (!await afs.exists(scriptPath + '.vendorless'))
            plugins.push(buildVendorChunkPlugin(folder, entryName));

        entries.entry[entryName] = scriptPath; // [folder]
    }

    webpackConfig = webpackMerge(entries, webpackConfig);
    webpackConfig = webpackMerge(webpackConfig, { plugins: plugins });

    // Fix undefined browser sync
    const hasBrowserSync = typeof browserSync !== 'undefined' && browserSync !== null && typeof browserSync.reload === 'function';
    const browserSyncWrapper = hasBrowserSync ? browserSync.reload : () => { return true; };

    // Promise for waiting webpack
    return new Promise(resolve => {
        // for correct task completing
        gulp.src(scripts, { base: frontend.sources.root })
            .pipe(webpackStream(webpackConfig).on("end", resolve)).on("error", reporter.notifyError)
            // Remove @ name prefix for vendorless scripts
            .pipe(rename(filePath => {
                filePath.dirname = 'scripts/' + filePath.dirname;
            }))
            
            // If debug - release debugable scripts with maps. Else build revision.
            .pipe(gulpIf(debug, gulp.dest(frontend.public.root), buildRev()))
            .pipe(gulpIf(hasBrowserSync, browserSyncWrapper( { stream: frontend.browserSync.useStream }))) // || true fixes undefined reload
    });
}
