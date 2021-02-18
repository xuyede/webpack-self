const sass = require('sass');

function loader(source) {
  const sassInfo = sass.renderSync({
    data: source
  })
  return sassInfo.css.toString();
}

module.exports = loader;