const path = require("path");

module.exports = {
  entry: path.resolve("./src/index.jsx"),
  mode: "production",
  output: {
    filename: "index.js",
    path: path.resolve("./dist"),
    chunkFilename: "[name].js", ///< Used to specify custom chunk name
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, ///< using babel-loader for converting ES6 to browser supported javascript
        loader: "babel-loader",
        exclude: [/node_modules/],
      },
    ],
  },
};
