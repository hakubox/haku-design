import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import vue from '@vitejs/plugin-vue';

const transformIndexHtml = (code) => {
  return code.replace(/__MAIN__/, '/src/main.user.ts')
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
      AlloyImage: 'AlloyImage',
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
}