var webpack = require('webpack');

module.exports = {
  entry: './src/main.jsx',
  output: {
    path: './lib',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  externals: {
    'react': 'React' 
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};

process.env.BABEL_ENV='start';
