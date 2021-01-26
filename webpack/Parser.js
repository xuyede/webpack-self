const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { transformFromAst } = require('@babel/core');

const { join, extname } = require('path');

class Parser{
  constructor(compilation) {}
  parse(source, dirname, hasModule, isCommonJs) {
    // 获取代码的ast
    const ast = this.ast(source);
    // 获取代码的依赖，如果有的话
    const { dependencies, sourceCode } =  this.getDependency(ast, dirname, isCommonJs);
    return {
      dependencies, sourceCode
    }
  }
  ast(source) {
    return babylon.parse(source, {
      sourceType: 'module'
    })
  }
  getDependency(ast, dirname, isCommonJs) {
    let dependencies = [];
    traverse(ast, {
      CallExpression(p) {
        if (!isCommonJs) return; 

        const node = p.node;
        if (node.callee.name === 'require') {
          // 函数名替换
          node.callee.name = '__webpack_require__';
          let modulePath = node.arguments[0].value;
          if (!extname(modulePath)) {
            // require('./js/moduleA')
            throw new Error(`没有找到文件 : ${modulePath} , 检查是否加上正确的文件后缀`);
          }
          modulePath = './' + join(dirname, modulePath).replace(/\\/g, '/');
          node.arguments = [t.stringLiteral(modulePath)];
          // 保存模块依赖项
          dependencies.push(modulePath);
        }
      },
      ImportDeclaration(p) {
        console.log('🤓️', p.node)
      }
    })

    // 处理生成的代码，去除注释，去除换行，转义特殊符号
    let sourceCode = this.parseSpecialCharacter(transformFromAst(ast).code);;
    
    return {
      dependencies,
      sourceCode
    }
  }

  parseSpecialCharacter(code) {
    let dealCode = code;

    // 去除注释
    const annotationReg = /\/\/(.)*/g;
    dealCode = dealCode.replace(annotationReg, '');

    // 去除换行符
    const spaceReg = /(\n)*/g;
    dealCode = dealCode.replace(spaceReg, '');

    // 转义 / " '
    const charReg = /\'|\"|\//g;
    dealCode = dealCode.replace(charReg, $ => `\\${$}`);

    return dealCode;
  }
}

module.exports = Parser;