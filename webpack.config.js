module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devServer: {
    port: 3000,
    contentBase: './public',
    hot: true,
    hotOnly: true,
    open: false,
    publicPath: 'http://localhost:3000/',
    compress: true,
  }
}
