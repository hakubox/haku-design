import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';
import { Plugin } from 'vite-plugin-cdn-import-async';

const transformIndexHtml = (code) => {
  return code.replace(/__MAIN__/, '/src/main.design.ts');
};

export const config = () => {
  return defineConfig({
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: '/src/',
        }, {
          find: '@user/',
          replacement: '/src/packages/user/',
        }, {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js'
        }
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 4561,
      proxy: {
        '/userapi': {
          target: 'https://bpmtest-userapi.gejinet.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/userapi/, ''),
        },
        '/api': {
          target: 'https://ld-designer.gejinet.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      Plugin({ 
        modules: [ 
          { 
            name: 'echarts',
            var: 'echarts',
            mode: 'defer',
            path: 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js',
          },
          // {
          //   name: 'monaco-editor',
          //   var: 'monaco',
          //   mode: 'defer', // async
          //   path: '',
          // }
          // { 
          //   name: 'lottie-web',
          //   var: 'lottie',
          //   mode: 'defer',// 'defer' 属性将被添加到它的 <script> 标签中。
          //   path: 'https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js',
          // }, { 
          //   name: 'axios',  // 没有 'mode' 的模块参数将被同步加载。
          //   var: 'axios',
          //   path: 'https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js',
          // } 
        ],
      }),
      // Components({
      //   resolvers: [AntDesignVueResolver()],
      // }),
      {
        name: 'demo-transform',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.html')) {
            return { code: transformIndexHtml(code), map: null };
          }
        },
        transformIndexHtml,
      },
      // basicSsl(),
      vue({
        script: {
          defineModel: true
        }
      }),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    define: {
      'process.env': process.env,
    },
    build: {
      rollupOptions: {
        external: ['echarts'],
        output: {
          globals: {
            echarts: 'echarts',
            monaco: 'monaco-editor',
          },
          // paths: {
          //   echarts: 'https://cdn.jsdelivr.net/npm/echarts@5.4.2/+esm'
          // },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // manualChunks(id) { //静态资源分拆打包
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
          //   }
          // },
          manualChunks: {
            // jsonWorker: [`${monacoPrefix}/language/json/json.worker`],
            // cssWorker: [`${monacoPrefix}/language/css/css.worker`],
            // htmlWorker: [`${monacoPrefix}/language/html/html.worker`],
            // tsWorker: [`${monacoPrefix}/language/typescript/ts.worker`],
            // editorWorker: [`${monacoPrefix}/editor/editor.worker`],
          },
        }
      }
    },
    optimizeDeps: {
      exclude: []
    },
  })
};