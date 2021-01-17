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
  plugins: [
    new ConsoleLogOnBuildWebpackPlugin(),
  ]
}