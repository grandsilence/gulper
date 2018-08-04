"use strict";

const frontend = require("./frontend.config");
//const webpack = require("webpack");

module.exports = {
    /*
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            exclude: ["vendor.js"]
        }),
    ],
    
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            exclude: ['vendor.js']
        })
    ],*/
    // Woking debug
    devtool: "source-map", // "cheap-eval-source-map", //    ""source-map", //"source-map",
    
    module: {
        loaders: [
            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            {
                enforce: "pre",
                loader: "source-map-loader",
                exclude: /node_modules/,
                test: /\.js$/,
            },
        ],
    },
    
    /*
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            test: [/\.js$/],
            filename: "[file].map",
            //noSources: true,
            append: false, //"\n//# sourceMappingURL=[url]",
            moduleFilenameTemplate: '[resource-path]',
            fallbackModuleFilenameTemplate: '[resource-path]',
            
            //publicPath: frontend.public.root, // ??
            sourceRoot: "file:///" + __baseDir.replace(/\\/g, '/'),
        })
    ],*/
};
