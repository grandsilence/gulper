"use strict";

const gutil = require("gulp-util");
const notify = require("gulp-notify");

/**
 * Report error with notification.
 *
 * @param error Error object contains details.
 */
function notifyError(error) {
    let report = "\n";
    let chalk = gutil.colors.white.bgRed;

    if (error.plugin)
        report += chalk("PLUGIN:") + " [" + error.plugin + "]\n";
    if (error.message)
        report += chalk("ERROR:\x28") + " " + error.message + "\n";

    gutil.log(report);
    let notifyMessage = (error.line && error.column)
        ? "LINE " + error.line + ":" + error.column + " -- "
        : "";

    notify({
        title: "FAIL: " + error.plugin,
        message: notifyMessage + "See console.",
        sound: "Sosumi", // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    // Prevent the 'watch' task from stopping
    // TODO: check working
    if (typeof this.emit === 'function')
        this.emit("end");
    else
        gutil.log("Error while reporter.notifyError: this.emit is not function, undefined?");
}

module.exports = {
    notifyError: notifyError,
    log: gutil.log,
};