const { resolve } = require("path");
const Compilation = require("./Compilation.js");
const { SyncHook, AsyncSeriesHook } = require("tapable");

class Compiler {
  constructor(config) {
    this.config = config;
    // 执行脚本位置
    this.root = process.cwd();

    // 程序全部钩子
    this.hooks = {
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),
      beforeCompile: new AsyncSeriesHook(["compiler"]),
      compile: new SyncHook(["params"]),
    };
  }

  run(callback) {
    // 执行beforeRun钩子的注册事件
    this.hooks.beforeRun.callAsync(this, (err) => {
      if (err) callback(err);

      // 执行run钩子的注册事件，一般为注册 plugins事件
      this.hooks.run.callAsync(this, (err) => {
        if (err) callback(err);

        // 执行编译
        this.compile(callback);
      });
    });
  }

  compile(callback) {
    // 执行beforeCompile钩子的注册事件
    this.hooks.beforeCompile.callAsync({}, (err) => {
      if (err) callback(err);

      // 执行编译的钩子
      this.hooks.compile.call({});

      const { entry } = this.config;
      // 获取编译实例
      const compilation = this.newCompilation();
      // 执行 buildModule函数，根据entry构建模块的依赖和获取主入口的路径
      // 目前支持单文件入口
      compilation.buildModule(
        resolve(this.root, entry) /** modulePath */,
        true /** isEntry */
      );
    });
  }

  newCompilation() {
    const compilation = this.createCompilation();
    return compilation;
  }

  createCompilation() {
    return new Compilation(this);
  }

  buildModule() {}
}

module.exports = Compiler;
