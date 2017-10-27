var ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractCss = new ExtractTextPlugin({
  filename: process.env.NODE_ENV === "unminified" ? "[name].css" : "[name].min.css",
  // disable: process.env.NODE_ENV === "development" // not using the devServer :P
});

const outputName = process.env.NODE_ENV === "unminified" ? "[name].js" : "[name].min.js";

let sourceMapType = process.env.NODE_ENV === "development" ? "inline-source-map" : "source-map";
if (process.env.NODE_ENV === "production") sourceMapType = ""; // no Creation of map

const SASS_INCLUDE_PATHS = [ "node_modules/", ];

module.exports = {extractCss, outputName, sourceMapType, SASS_INCLUDE_PATHS};
