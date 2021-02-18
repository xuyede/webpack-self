const { join } = require('path');
const ConsoleLogOnBuildWebpackPlugin = require('./plugins/consolePlugin.js');

const root = join(__dirname, './');

module.exports = {
  mode: 'development',
  entry: join(root, 'src', 'index.js'),
  output: {
    path: join(root, 'dist'),
    filename: 'main.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.scss/g,
        use: [
          join(root, 'webpack', 'loaders', 'style-loader.js'),
          join(root, 'webpack', 'loaders', 'sass-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new ConsoleLogOnBuildWebpackPlugin(),
  ]
}