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
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new ExtractTextPlugin("a11ykat.css"),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      inlineSource: ".(js|css)$",
      template: "index.html",
      title: "A11y Kat"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    open: true,
    port: 8080
  }
};
