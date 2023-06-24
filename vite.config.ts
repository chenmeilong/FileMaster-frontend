import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // 引入 React 插件
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger']
  },
  css: {
    // 开css sourcemap方便找css
    devSourcemap: true
  },
  plugins: [
    react(),
    visualizer({
      open: false // 打包完成后自动打开浏览器，显示产物体积报告
    }),
    //考虑兼容性，实际遇到了再看官网用
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ], // 使用 React 插件
  server: {
    // 自动打开浏览器
    open: true,
    proxy: {
      '/api': {
        target: 'https://xxxxxx', // 代理目标地址
        changeOrigin: true, // 改变源地址
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  },
  resolve: {
    // 配置别名
    alias: { '@': path.resolve(__dirname, './src') }
  },
  //打包路径变为相对路径,用liveServer打开,便于本地测试打包后的文件
  base: './'
})
