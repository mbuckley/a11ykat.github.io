const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: "./src/index.js",
  output: {
    filename: "a11ykat.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: "css-loader" }
          ]
        })
      },
      { test: /\.jade$/, loader: "jade-loader" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      inject: false,
      cache: false,
      template: "src/index.jade",
      filename: "index.html",
      title: "A11y Kat"
    }),
    new ExtractTextPlugin("test.css"),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    open: true,
    port: 8080
  }
};
