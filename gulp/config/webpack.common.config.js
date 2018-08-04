"use strict";

const frontend = require("./frontend.config");
const webpack = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: frontend.public.scripts,
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
    }),

    // new webpack.IgnorePlugin(/codemirror/),
  ],

  target: "web",

  // Нужно если файл не следует компилировать в сборку, когда он подключается вручную

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  /*externals: {
      "jquery": 'jQuery',
      //"react": "React",
      //"react-dom": "ReactDOM",
  },*/
};
