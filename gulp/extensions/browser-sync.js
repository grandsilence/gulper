"use strict";

const config = require("../config/frontend.config").browserSync;
const browserSync = require("browser-sync").create(); // #dev_module

browserSync.initFromArgumentsAndConfig = function() {
    const extendedConfig = config;

    // Custom properties
    if (typeof extendedConfig.disableCache !== 'undefined' && extendedConfig.disableCache) {
        extendedConfig.proxy.proxyRes = [
            // Disable browser cache for stable live reload (useful for mobile devices).
            res => {
                if (typeof res.headers === "undefined")
                    res.headers = [];

                res.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
                res.headers["Pragma"] = "no-cache";
                res.headers["Expires"] = "0";
            },
        ];
    }

    browserSync.init(extendedConfig);
};

module.exports = browserSync;