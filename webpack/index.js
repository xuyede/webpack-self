const config = require("../webpack.config.js");
const Compiler = require("./Compiler.js");

const compiler = new Compiler(config);

// 注册插件
for (const plugin of config.plugins) {
  plugin.apply(compiler);
}

// 启动编译
compiler.run((err) => {
  console.log("run err -> ", err);
});
