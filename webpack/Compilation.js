const fs = require("fs");
const ejs = require('ejs');
const Parser = require('./Parser.js');
const { resolve, relative, dirname, join } = require("path");

class Compilation {
  constructor(compiler) {
    const { config, root } = compiler;
    this.config = config;
    // 执行脚本的位置
    this.root = root;
    // 所有的模块
    this.modules = {};
    // 入口文件路径
    this.entryPath = "";
  }

  getSource(modulePath) {
    const content = fs.readFileSync(modulePath, "utf-8");
    return content;
  }

  /**
   * @param { string } entryPath 模块路径 (绝对路径)
   * @param { boolean } isEntry 是否是主入口
   */
  buildModule(modulePath, isEntry) {
    // 获取模块源代码，可以在此处执行loader
    let source = this.getSource(modulePath);
    // 模块路径，转化成相对于执行路径的相对路径
    // replace(/\\/g, "/")，为了兼容window端通过relative可能会转成 ./src\index.js
    // /Users/xuyede/Desktop/webpack/src/index.js -> ./src/index.js
    let moduleName = `./${relative(this.root, modulePath).replace(/\\/g, "/")}`;

    // 保存主文件的路径
    if (isEntry) this.entryPath = moduleName;

    const { hasModule, isCommonJs } = this.regCommonJs(source);
    const parser = this.newParser();
    // ast解析模块代码，获取模块中的相关依赖与源代码【可能是更改过的】
    const { dependencies, sourceCode } = parser.parse(
      source, /** 模块代码 */
      dirname(moduleName),  /** 模块目录名 */
      hasModule,  /** 是否有模块 */
      isCommonJs  /** 是否是commonjs模块 */
    );

    this.modules[moduleName] = sourceCode;
    dependencies.forEach(d => this.buildModule(join(this.root, d), false))
  }


  emit() {
    const { modules, entryPath } = this;
    // 输出路径
    const outputPath = resolve(this.root, this.config.output.path);
    // 输出文件名
    const filePath = resolve(outputPath, this.config.output.filename)
    // 检测是否已有输出路径
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)

    ejs.renderFile(join(__dirname, 'template/output.ejs'), { modules, entryPath })
      .then(code => {
        fs.writeFileSync(filePath, code);
      })
  }

  regCommonJs(source) {
    // 匹配是否有关键字
    const hasKeyword = /require|import/g;
    // 匹配注释 //
    const isAnnotation1 = /^\/\//;
    // 匹配注释 /** */
    const isAnnotation2 = /^\/\*\*(.*)\*\/$/;
    // 以换行符切割主文件代码
    const sources = source.split('\n');
    // 是否有模块引入
    let hasModule = false;
    // 是否是commonjs规范
    let isCommonJs = false;

    for (let i = 0; i < sources.length; i++) {
      // 拦截正式代码
      if (!hasKeyword.test(sources[i])) break;
      
      if (!isAnnotation1.test(sources[i]) && !isAnnotation2.test(sources[i])) {
        hasModule = true;
        isCommonJs = sources[i].indexOf('require') > 0 ? true : false;
      }
    }

    return {
      hasModule, 
      isCommonJs
    };
  }

  newParser() {
    const parser = this.createParser();
    return parser;
  }

  createParser() {
    return new Parser(this);
  }
}

module.exports = Compilation;
