"use strict";

const fs = require("fs");
const reporter = require("./reporter");

const path = require("path");
let processors = {};

module.exports = function() {
    const requiredProcessors = Object.values(arguments);
    if (typeof requiredProcessors === 'undefined' || typeof requiredProcessors.length === 'undefined' || requiredProcessors.length === 0) {
        reporter.log("Gulp processor loaders is empty or undefined on load call!");
        return null;
    }

    for (let processorName of requiredProcessors) {
        const processorPath = path.join(__dirname, `processors/${processorName}-processor.js`);

        if (fs.existsSync(processorPath))
            processors[processorName] = require(processorPath);
        else
            reporter.log(`Gulp processor \"${processorName}\" not found: ${processorPath}`);
    }

    return processors;
};
