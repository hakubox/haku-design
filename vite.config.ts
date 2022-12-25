import { defineConfig, loadEnv, type UserConfigExport } from 'vite';
import path, { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import { visualizer } from 'rollup-plugin-visualizer';
import {
  themePreprocessorPlugin,
  themePreprocessorHmrPlugin,
} from '@zougt/vite-plugin-theme-preprocessor';
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
        // 创建动态主题切换
        // themePreprocessorPlugin({
        //   less: {
        //     // 是否启用任意主题色模式，这里不启用
        //     arbitraryMode: false,
        //     // 提供多组变量文件
        //     multipleScopeVars: [
        //       {
        //         scopeName: "theme-default",
        //         // 变量文件内容不应该夹带样式代码，设定上只需存在变量
        //         path: path.resolve("src/assets/less/theme/theme-default/index.lazy.less"),
        //       },
        //       {
        //         scopeName: "theme-dark",
        //         path: path.resolve("src/assets/less/theme/theme-dark/index.lazy.less"),
        //       },
        //     ],
        //     // css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
        //     includeStyleWithColors: [
        //       {
        //         color: "#ffffff",
        //         // 此类颜色的是否跟随主题色梯度变化，默认false
        //         // inGradient: true,
        //       },
        //     ],
        //     // 默认取 multipleScopeVars[0].scopeName
        //     defaultScopeName: "theme-default",
        //     // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        //     extract: true,
        //     // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
        //     outputDir: "",
        //     // 会选取defaultScopeName对应的主题css文件在html添加link
        //     themeLinkTagId: "theme-link-tag",
        //     // "head"||"head-prepend" || "body" ||"body-prepend"
        //     themeLinkTagInjectTo: "head",
        //     // 是否对抽取的css文件内对应scopeName的权重类名移除
        //     removeCssScopeName: false,
        //     // 可以自定义css文件名称的函数
        //     customThemeCssFileName: (scopeName) => scopeName,
        //   },
        // }),
        // // 主题热更新，不得已分开插件，因为需要vite插件顺序enforce
        // themePreprocessorHmrPlugin(),
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
        exclude: [
        ]
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