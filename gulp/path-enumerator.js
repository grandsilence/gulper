"use strict";

const
    afs = require("async-file"),
    path = require("path");

/**
 * Async version of filter
 *
 * @param {Array} arr Array for filter
 * @param {Function} callback Iterator
 * @returns {Promise.<Array.<*>>}
 */
async function filterAsync(arr, callback) {
    return (await Promise.all(arr.map(async item => {
        return (await callback(item)) ? item : undefined;
    }))).filter( i => i !== undefined);
}

module.exports = {
    /**
     * Convert folder paths to cross-platform all file paths, excluding git files for recursive mask.
     * Used for cleaning directories without removing them.
     *
     * @param {Array.<string>} folders
     * @param {string} ext Extension appended to each folder
     * @param {string} root Root directory
     * @param {boolean} checkExistion appended to each folder
     * @returns {object} Array of paths with extension.
     */
    enumFilesAsync : async function(folders, ext = "**/*", root = "", checkExistion = false) {
        let paths = [];
        for (let folder of folders) {
            let file = folder;
            if (root.length > 0)
                file = path.join(root, file);

            file = path.join(file, ext);
            if (checkExistion && !(await afs.exists(file)))
                continue;

            paths.push(file);
        }
        paths.push("!.gitignore");
        paths.push("!.gitkeep");

        return paths;
    },

    /**
     * Enumerate all folders inside the path.
     *
     * @param {string} directory Enumirate path
     * @param {string} containsInside Check file existion inside each directory
     * @returns {object} List of folders inside the path.
     */
    enumFoldersAsync: async function(directory, containsInside = "") {
        return await filterAsync(await afs.readdir(directory), async file => {
            const f = await afs.stat(path.join(directory, file));
            // Exclude files
            if (!f.isDirectory())
                return false;

            // Exclude missing files
            const checkExistion = containsInside.length > 0;
            if (checkExistion && !await afs.exists(path.join(directory, file, containsInside)))
                return false;

            return !file.startsWith("_");
        });
    },
};
