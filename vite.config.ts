// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // 引入 React 插件
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
// CDN加速
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'
// https://vitejs.dev/config/
export default {
  esbuild: {
    drop: ['console', 'debugger']
  },
  css: {
    // 开css sourcemap方便找css
    devSourcemap: true
  },
  // 打包不压缩，有利于学习
  build: {
    // "minify":true,
    // 分包
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // TS默认为ES5,需要手动去tsconfig.json配置 "lib"
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
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
    }),
    importToCDN({
      modules: [
        // {
        //     name: '@toast-ui/react-image-editor',
        //     // 全局变量如Jquery的$
        //     var: 'e',
        //     path: `https://cdn.jsdelivr.net/npm/@toast-ui/react-image-editor@3.15.2/dist/toastui-react-image-editor.min.js`
        // },
        autoComplete('react'),
        autoComplete('react-dom'),
        autoComplete('axios')
      ]
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
}
