const fs = require("fs");
const { relative } = require("path");

class Compilation {
  constructor(compiler) {
    const { config, root } = compiler;
    this.config = config;
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
    // 模块源代码
    let source = this.getSource(modulePath);
    // 模块路径，转化成相对于执行路径的相对路径
    // replace(/\\/g, "/")，为了兼容window端通过relative可能会转成 ./src\index.js
    // /Users/xuyede/Desktop/webpack/src/index.js -> ./src/index.js
    let moduleName = `./${relative(this.root, modulePath).replace(/\\/g, "/")}`;

    if (isEntry) this.entryPath = moduleName;

    console.log(this.entryPath);
  }
}

module.exports = Compilation;
