import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';

export const config = () => {
  return defineConfig({
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
          find: '@user/',
          replacement: '/src/packages/user/',
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
      vue({
        script: {
          defineModel: true
        }
      }),
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
        entry: path.resolve(__dirname, 'src/packages/user/index.ts'),
        name: 'userComponent',
        fileName: (format) => `user-component.${format}.js`
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
}