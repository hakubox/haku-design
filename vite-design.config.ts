import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';

const monacoPrefix = `monaco-editor/esm/vs`;

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
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // manualChunks(id) { //静态资源分拆打包
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
          //   }
          // },
          manualChunks: {
            jsonWorker: [`${monacoPrefix}/language/json/json.worker`],
            cssWorker: [`${monacoPrefix}/language/css/css.worker`],
            htmlWorker: [`${monacoPrefix}/language/html/html.worker`],
            tsWorker: [`${monacoPrefix}/language/typescript/ts.worker`],
            editorWorker: [`${monacoPrefix}/editor/editor.worker`],
          },
        }
      }
    },
    optimizeDeps: {
      exclude: []
    },
  })
};