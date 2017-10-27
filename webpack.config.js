const path = require("path");
const webpack = require("webpack");

const setup = require("./src/lib/webpack-setup");
console.log("env", process.env.NODE_ENV);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/,
        use: setup.extractCss.extract({
          fallback: "style-loader",
          use: "css-loader?importLoaders=1!postcss-loader"
        })
      },
      {
        test: /\.scss$/,
        use: setup.extractCss.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader",
            options: {
              includePaths: setup.SASS_INCLUDE_PATHS
            }
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ]
  },
  entry: {
    "theme": "./js/theme.js"
  },
  context: path.join(__dirname, "src"),
  output: {
    path: path.join(__dirname, "static/assets/theme"),
    filename: setup.outputName,
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins: [
    setup.extractCss,
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(`${require("./package.json").version}`),
    }),
  ],
  devtool: setup.sourceMapType,
  devServer: {
    historyApiFallback: true,
    contentBase: "./"
  },
  watchOptions: {
    watch: true
  }
}
