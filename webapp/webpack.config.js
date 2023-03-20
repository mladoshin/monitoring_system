const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name][hash].bundle.js",
    publicPath: "/",
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: "Webpack App",
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed,
    }),
    // new MiniCssExtractPlugin({
    //     filename: "[name][hash].css"
    // })
  ],
  devServer: {
    port: 3000,
    hot: isDev,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              import: false,
              modules: {
                localIdentName: "[name]_[local]_[hash:base64:5]",
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(svg | png | jpg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf | oft | woff)$/,
        use: ["file-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
