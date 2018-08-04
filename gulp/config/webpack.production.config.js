"use strict";

const webpack = require("webpack");

module.exports = {
  bail: true, // stop build on error (for disable owerwrite manifest)

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      //safari10: true,
      sourceMap: false,
      mangle: false,
      beautify: false,
      comments: false,
      compress: {
        booleans: true,
        loops: true,
        sequences: true,
        unused: true,
        // warnings    : false,
        // drop_console: true,
        // unsafe      : true
      },
    }),
  ],
};
