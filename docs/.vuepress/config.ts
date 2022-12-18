import { defaultTheme, defineUserConfig, viteBundler } from 'vuepress'
import { getDirname, path } from '@vuepress/utils'
import { searchPlugin } from '@vuepress/plugin-search'
import pluginRegisterComponents from '@vuepress/plugin-register-components'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'

// import demoblockPlus from 'vuepress-plugin-demoblock-plus'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  lang: 'zh-CN',
  title: '问卷设计器',
  description: '问卷调查设计器说明文档',
  alias: {
    '@': path.resolve(__dirname, '../../src/'),
    '/src': path.resolve(__dirname, '../../src/'),
  },
  markdown: {
    importCode: {
      // handleImportPath: (str) => str.replace(/^@src/, path.resolve(__dirname, '../../src')),
    }
  },
  plugins: [
    searchPlugin({
      maxSuggestions: 10,
      getExtraFields: (page) => (page.frontmatter.tags ?? []) as string[],
    }),
    pluginRegisterComponents({
      
    }),
    // demoblockPlus({
    //   theme: 'dark-plus',
    //   cssPreprocessor: 'less',
    // }),
    prismjsPlugin({
      preloadLanguages: ['markdown', 'JavaScript', 'html']
    })
  ],
  bundler: viteBundler({
    viteOptions: {
      define: {
        'process.env': {
          'BASE_URL': '',
          'VUE_APP_SERVER_BASEURL': ''
        }
      },
      resolve: {
        alias: [
          { find: /^~@/, replacement: '../../src' },
        ],
      },
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true,
            additionalData: `
@import '@/assets/less/variable.less';
@import '@/assets/less/design-editor.less';
@import '@/packages/answer/assets/less/component.less';`,
          },
        },
      }
    },
    vuePluginOptions: {

    }
  }),
  head: [['link', { rel: 'icon', href: '/img/favicon-32x32.png' }]],
  theme: defaultTheme({
    logo: '/img/logo.png',
    locales: {
      '/zh/': {
        selectLanguageName: '简体中文',
      },
    },
    tip: '信息',
    warning: '警告',
    danger: '错误',
    backToHome: '返回首页',
    navbar: [
      {
        text: '主页',
        link: '/',
      }, {
        text: '使用说明',
        link: '/use',
      }, {
        text: '开发说明',
        link: '/coding',
      }, {
        text: '关于',
        link: '/about',
      },
    ],
    sidebar: {
      '/use': [
        {
          text: '使用说明',
          children: [
            '/use',
            '/use/ui.md',
            '/use/module.md',
            '/use/component.md'
          ]
        }
      ],
      '/coding': [
        {
          text: '开发说明',
          children: [
            '/coding',
            '/coding/install.md'
          ]
        }
      ]
    }
  }),
})