const path = require('path');

const APP_DIR = path.resolve(__dirname, '/js/src');
const PHASER_DIR = path.join(__dirname, '/node_modules/phaser');

module.exports = {
  devtool: 'source-map',
  entry: './js/src/app.js',
  output: {
    publicPath: '/js/dist',
    path: path.resolve(__dirname, './js/dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [APP_DIR, 'node_modules'],
    alias: {
      // https://github.com/webpack/webpack/issues/4666
      phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
      pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
      p2: path.join(PHASER_DIR, 'build/custom/p2.js'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel', 
      }
    ],
    rules: [
      // https://github.com/photonstorm/phaser/issues/2762
      {
        test: /pixi\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'PIXI',
        }],
      },
      {
        test: /phaser-split\.js$/,
        use: [{
          loader: 'expose-loader',
          options: 'Phaser',
        }],
      },
      {
        test: /p2\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'p2',
        }],
      },
    ],
  },
};
