const babylon = require('babylon');
const traverse = require('@babel/traverse').default;

class Parser{
  constructor(compilation) {
    const { config } = compilation;
    this.config = config;
  }
  parse(source, hasModule, isCommonJs) {
    // 获取代码的ast
    const ast = this.ast(source);
    // 获取代码的依赖，如果有的话
    const dependencies = hasModule 
      ? this.getDependency(ast, isCommonJs) 
      : [];
    
    console.log('dependencies -> ', dependencies)
  
  }
  ast(source) {
    return babylon.parse(source, {
      sourceType: 'module'
    })
  }
  getDependency(ast, isCommonJs) {
    let dependencies = [];
    traverse(ast, {
      CallExpression(p) {
        if (!isCommonJs) return; 

        const node = p.node;
        if (node.callee.name === 'require') {
          console.log(node)
          // 函数名替换
          node.callee.name = '__webpack_require__';

          
        }
      },
      ImportDeclaration(p) {
        console.log('🤓️', p.node)
      }
    })

    return {
      dependencies
    }
  }
}

module.exports = Parser;