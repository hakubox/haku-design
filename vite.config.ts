import { defineConfig, loadEnv, type UserConfigExport } from 'vite';
import path, { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';
import * as dotenv from 'dotenv';

// https://vitejs.dev/config/

if (!process.env.buildMode) process.env.buildMode = 'development';

dotenv.config({ path: '.env' });
dotenv.config({ path: `.env.${process.env.buildMode}` });

const buildProj = process.env.buildProj;

const transformIndexHtml = (code) => {
  switch (buildProj) {
    case 'answer': return code.replace(/__MAIN__/, '/src/main.answer.ts');
    case 'design': return code.replace(/__MAIN__/, '/src/main.design.ts');
  }
};

let config: UserConfigExport;

const monacoPrefix = `monaco-editor/esm/vs`;

switch (buildProj) {
  // 设计端
  case 'design':
    console.log('——设计端编译——');
    config = defineConfig({
      resolve: {
        alias: [
          {
            find: '@/',
            replacement: '/src/',
          }, {
            find: '@answer/',
            replacement: '/src/packages/answer/',
          },
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
        vue(),
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
      define: {
        'process.env': process.env,
        monaco: 'monaco',
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
    });
    break;

  // 用户端
  case 'answer':
    console.log('——用户端编译——');
    config = defineConfig({
      resolve: {
        alias: [
          {
            find: '@/',
            replacement: '/src/',
          }, {
            find: '@answer/',
            replacement: '/src/packages/answer/',
          },
        ],
      },
      server: {
        host: '0.0.0.0',
        port: 4561
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
        vue(),
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
            manualChunks(id) { //静态资源分拆打包
              if (id.includes('node_modules')) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
            }
          }
        }
      }
    });
    break;

    
  // 用户答题组件
  case 'answer-lib':
    console.log('——用户组件编译——');
    config = defineConfig({
      optimizeDeps: {
        exclude: [
        ]
      },
      resolve: {
        alias: [
          {
            find: '@/',
            replacement: '/src/',
          }, {
            find: '@answer/',
            replacement: '/src/packages/answer/',
          },
        ],
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
        // basicSsl(),
        vue(),
        visualizer({
          template: 'treemap',
          open: true,
          gzipSize: true,
          brotliSize: false,
        }),
      ],
      define: {
        'process.env': process.env,
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/packages/answer/index.ts'),
          name: 'AnswerComponent',
          fileName: (format) => `answer-component.${format}.js`
        },
        rollupOptions: {
          external: [
            'vue', 'DesignView'
          ],
          // 静态资源分类打包
          output: {
            globals: {
              vue: 'Vue'
            },
          }
        }
      }
    });
    break;

  default:
    break;
}

export default config;