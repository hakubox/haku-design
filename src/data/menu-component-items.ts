import { AppType, ComponentCategory, PageType, ToolComponentItem } from '@haku-design/core';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { computed } from 'vue';

/** 工具箱配置菜单 */
export const getMenuComponentItems = computed(() => {
  return menuComponentItems.filter(i => !i.appType || i.appType?.includes(editorState.appConfig.appType));
});

export let menuComponentItems: ToolComponentItem[] = [
  {
    title: '单行文本',
    name: 'q-single-line',
    icon: 'iconfont icon-textbox',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '数值',
    name: 'q-number',
    icon: 'iconfont icon-textbox',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '文本组',
    name: 'q-single-line-group',
    icon: 'iconfont icon-shebeiguanli',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '多行文本',
    name: 'q-multiple-line',
    icon: 'iconfont icon-textarea',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '单项选择',
    name: 'q-single-choice',
    icon: 'iconfont icon-check-circle',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '多项选择',
    name: 'q-multiple-choice',
    icon: 'iconfont icon-checkbox',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '下拉选择',
    name: 'q-dropdown',
    icon: 'iconfont icon-dropdownlist',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '日期选择',
    name: 'q-datetime-picker',
    icon: 'iconfont icon-dropdownlist',
    isNew: true,
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '日期范围选择',
    name: 'q-datetime-picker',
    icon: 'iconfont icon-dropdownlist',
    answerType: 'datetime-range',
    isNew: true,
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
    attrs: {
      isRange: true,
      label: '日期范围选择',
      title: '日期范围选择'
    }
  },
  {
    title: '评分',
    name: 'q-score',
    icon: 'iconfont icon-star',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage, PageType.endPage],
  },
  {
    title: '多项评分',
    name: 'q-score-group',
    icon: 'iconfont icon-star',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage, PageType.endPage],
  },
  {
    title: '文件选择',
    name: 'q-file-upload',
    icon: 'iconfont icon-cloud-upload',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '手写板',
    name: 'q-drawing-board',
    icon: 'iconfont icon-drawing-board',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '表格',
    name: 'q-table',
    icon: 'iconfont icon-table',
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '隐藏内容',
    name: 'q-hidden',
    icon: 'iconfont icon-miwen',
    isNew: true,
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '可选择卡片',
    name: 'q-card-picker',
    icon: 'iconfont icon-daibanshixiang',
    isNew: true,
    category: ComponentCategory.normal,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },

  // 布局组件

  {
    title: '流式布局',
    name: 'q-flex',
    icon: 'iconfont icon-wuxupailie',
    category: ComponentCategory.layout,
    isNew: true,
    appType: [AppType.questionnaire],
  },
  // {
  //   title: '中心布局',
  //   name: 'q-center',
  //   icon: 'iconfont icon-wuxupailie',
  //   category: ComponentCategory.layout,
  //   isNew: true,
  //   pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  // },
  {
    title: '折叠面板',
    name: 'q-collapse',
    icon: 'iconfont icon-wuxupailie',
    category: ComponentCategory.layout,
    isNew: true,
    appType: [AppType.questionnaire],
  },
  {
    title: '画布',
    name: 'q-canvas',
    icon: 'iconfont icon-edit',
    category: ComponentCategory.layout,
    isNew: true,
    appType: [AppType.questionnaire],
  },

  // 附加内容

  {
    title: '分页器',
    name: 'q-page-split',
    icon: 'iconfont icon-timeline2',
    category: ComponentCategory.attachment,
    appType: [AppType.questionnaire],
    pageType: [PageType.normalPage],
  },
  {
    title: '文本',
    name: 'q-text',
    icon: 'iconfont icon-font',
    category: ComponentCategory.attachment,
  },
  {
    title: '图片',
    name: 'q-image',
    icon: 'iconfont icon-picture',
    category: ComponentCategory.attachment,
  },
  {
    title: '音频',
    name: 'q-audio',
    icon: 'iconfont icon-guize1',
    category: ComponentCategory.attachment,
  },
  {
    title: '视频',
    name: 'q-video',
    icon: 'iconfont icon-video',
    category: ComponentCategory.attachment,
  },
  {
    title: '网页',
    name: 'q-iframe',
    icon: 'iconfont icon-picture',
    category: ComponentCategory.attachment,
  },

  {
    title: '性别',
    name: 'q-single-choice',
    icon: 'iconfont icon-check-circle',
    category: ComponentCategory.special,
    attrs: {
      label: '性别',
      options: [
        { value: '1', label: '男' },
        { value: '2', label: '女' },
      ],
    },
    pageType: [PageType.normalPage],
  },
];

export const setMenuItems = (items) => {
  menuComponentItems = items;
}