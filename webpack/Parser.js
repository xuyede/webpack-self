const babylon = require('babylon');
const traverse = require('@babel/traverse').default;

class Parser{
  constructor(compilation) {

  }
  parse(source) {
    const ast = this.ast(source);
    this.getDependency(ast);
  }
  ast(source) {
    return babylon.parse(source, {
      sourceType: 'module'
    })
  }
  getDependency(ast) {
    let dependencies = [];
    traverse(ast, {
      CallExpression(p) {
        console.log('🍊', p.node)
      },
      ImportDeclaration(p) {
        console.log('🤓️', p.node)
      }
    })
  }
}

module.exports = Parser;