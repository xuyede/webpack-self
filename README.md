**webpack的打包速度优化？**

- externals, 不把某些 import 的包打包到 bundle 中，而是在runtime时通过cdn获取
- swc，swc-loader，加快打包js的速度
- esbuild