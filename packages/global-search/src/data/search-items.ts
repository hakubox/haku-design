import { timeout } from "@haku-design/common";
import { service as globalSearchService } from '../../';
import type { GlobalSearchItem } from "../@types";
import { state as configState, service as configService } from '@haku-design/config';
import { state as editorState, service as editorService } from '@haku-design/editor';
import { state as pluginState, service as pluginService } from '@haku-design/plugin';
import { message } from '@haku-design/common';
import { computed, ref, watch } from "vue";
import Fuse from 'fuse.js';

/** Fuse实例 */
const fuse: Fuse<GlobalSearchItem> = new Fuse([], {
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  keys: [
    "tags",
    { name: 'title', weight: 2 },
    "description",
    "alias",
    "actions.label",
    "crumbs.label",
    "related.label",
  ]
});

/** 快速面包屑列表 */
const quickCrumbs = {
  menu: {
    label: '菜单',
  },
  menu_file: {
    label: '文件',
  },
  menu_app: {
    label: '应用',
  },
  menu_preview: {
    label: '预览',
    goto: () => editorState.isPreview = true
  },
  plugin: {
    label: '插件',
    icon: 'iconfont icon-plugin',
  },
  config: {
    label: '设置',
    tooltip: '打开设置界面',
    goto: () => configService.open()
  },
  configItem: (el: HTMLElement | string, label: string, tooltip: string) => ({
    label,
    tooltip,
    goto: () => configService.open().then(async () => {
      await timeout(500);
      globalSearchService.markElement(el);
    })
  })
};

/** 获取所有搜索项 */
// export const getSearchItems = computed<GlobalSearchItem[]>(() => {
//   return [
//     ...fixedSearchItems.value,
//     ...pluginSearchItems.value,
//   ];
// });

/** 搜索项 */
export const search = (txt: string, count = 100) => {
  return fuse.search(txt, {
    limit: count
  });
}

/** 添加搜索项 */
export const addSearchItem = (...item: GlobalSearchItem[]) => {
  for (let i = 0; i < item.length; i++) {
    fuse.add(item[i]);
  }
}

/** 添加搜索项 */
export const removeSearchItem = (...ids: string[]) => {
  fuse.remove((doc) => {
    if (doc.id) return ids.includes(doc.id);
    else return false;
  });
}

watch(() => pluginState.plugins.length, () => {
  fuse.setCollection([
    ...fixedSearchItems.value,
    ...pluginSearchItems.value,
  ]);
});

/** 插件搜索项 */
export const pluginSearchItems = computed<GlobalSearchItem[]>(() => {
  return pluginState.plugins.map(i => ({
    title: i.title,
    group: 'plugin',
    crumbs: [
      quickCrumbs.plugin,
      {
        label: `${pluginState.typeCategorys[i.pluginType].label}`,
        icon: `${pluginState.typeCategorys[i.pluginType].icon}`,
      },
      {
        label: i.title,
        icon: i.icon,
      },
    ],
    goto: () => {
      message.toast(`插件${i.title}已安装，将跳转到插件详情`);
      console.error(`:> 插件详情页未实装`);
    },
    description: i.description,
    tags: [
      {
        label: () => i.isEnable ? '已安装' : '未安装',
        color: () => i.isEnable ? 'green' : 'red',
      }, {
        label: () => i.version,
        color: '#108ee9',
      }
    ],
    actions: [
      {
        type: 'primary',
        danger:  () => i.isEnable,
        label: () => i.isEnable ? '卸载插件' : '注册插件',
        confirm: () => i.isEnable ? `是否确认卸载「${i.title}」插件？` : `是否确认注册「${i.title}」插件？`,
        action: () => pluginService.togglePlugin(i, !i.isEnable)
      },
    ]
  }));
});

/** 固定搜索项 */
export const fixedSearchItems = ref<GlobalSearchItem[]>([
  {
    title: '打开问卷预览',
    group: 'function',
    crumbs: [
      quickCrumbs.menu_preview,
    ],
    goto: () => editorState.isPreview = true,
    description: '将打开当前问卷的预览页面，可以在预览页面中查看问卷的上线效果。',
  }, 

  {
    title: '切换到普通模式',
    group: 'config',
    crumbs: [
      quickCrumbs.menu_file,
      quickCrumbs.config,
      quickCrumbs.configItem('config-handle-mode', '操作模式', '打开设置界面并高亮操作模式'),
    ],
    goto: () => configState.config.proMode = 'normal',
    description: '将问卷设计器切换至普通模式。普通模式适合非开发人员操作，例如医生、销售等等人员。',
  }, {
    title: '切换到专业模式',
    group: 'config',
    crumbs: [
      quickCrumbs.menu_file,
      quickCrumbs.config,
      quickCrumbs.configItem('config-handle-mode', '操作模式', '打开设置界面并高亮操作模式'),
    ],
    alias: [ '专家模式', '高级模式' ],
    goto: () => configState.config.proMode = 'advanced',
    description: '将问卷设计器切换至专业模式。专业模式包含变量/公式编辑等功能，适合产品及部分开发人员操作。',
  }, {
    title: '切换到工程师模式',
    group: 'config',
    crumbs: [
      quickCrumbs.menu_file,
      quickCrumbs.config,
      quickCrumbs.configItem('config-handle-mode', '操作模式', '打开设置界面并高亮操作模式'),
    ],
    goto: () => configState.config.proMode = 'engineering',
    description: '将问卷设计器切换至工程师模式。专业模式包含前端代码编辑等功能，适合专业开发人员操作。',
  }, {
    title: '样式配置',
    group: 'config',
    crumbs: [
      quickCrumbs.menu_app,
    ],
    goto: () => editorState.showAppStyleDialog = true,
    description: '用于配置当前问卷的基础样式，同时可以编写CSS代码以实现部分定制化UI细节。',
    related: [
      { label: '应用配置', goto: () => editorState.showAppConfigDialog = true },
    ]
  }, {
    title: '应用配置',
    group: 'config',
    crumbs: [
      quickCrumbs.menu_app,
    ],
    goto: () => editorState.showAppConfigDialog = true,
    description: '用于配置当前问卷的基本信息、记时信息及评分功能等功能。',
    related: [
      { label: '样式配置', goto: () => editorState.showAppStyleDialog = true },
    ]
  },

  {
    title: '切换至浅色主题',
    group: 'theme',
    crumbs: [
      quickCrumbs.menu_file,
      { label: '主题', },
    ],
    goto: () => editorService.selectTheme('default', '浅色主题'),
    description: '切换当前主题至浅色主题。',
    related: [
      { label: '切换至深色主题', goto: () => editorService.selectTheme('dark', '深色主题') },
      { label: '切换至半透明主题', goto: () => editorService.selectTheme('translucent', '半透明主题') },
    ]
  }, {
    title: '切换至深色主题',
    group: 'theme',
    crumbs: [
      quickCrumbs.menu_file,
      { label: '主题', },
    ],
    goto: () => editorService.selectTheme('dark', '深色主题'),
    description: '切换当前主题至深色主题。',
    related: [
      { label: '切换至浅色主题', goto: () => editorService.selectTheme('default', '浅色主题') },
      { label: '切换至半透明主题', goto: () => editorService.selectTheme('translucent', '半透明主题') },
    ]
  }, {
    title: '切换至半透明主题',
    group: 'theme',
    crumbs: [
      quickCrumbs.menu_file,
      { label: '主题', },
    ],
    goto: () => editorService.selectTheme('translucent', '半透明主题'),
    description: '切换当前主题至半透明主题。',
    related: [
      { label: '切换至浅色主题', goto: () => editorService.selectTheme('default', '浅色主题') },
      { label: '切换至深色主题', goto: () => editorService.selectTheme('dark', '深色主题') },
    ]
  }, 
]);

fuse.setCollection([
  ...fixedSearchItems.value,
  ...pluginSearchItems.value,
]);