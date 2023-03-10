import { ComponentCategory, PageType } from '@/@types/enum';
import { ToolComponentItem } from '@/@types/tool-component-item';
import { computed } from 'vue';

/** 工具箱配置菜单 */
export const getMenuComponentItems = computed(() => {
  return menuComponentItems;
});

export let menuComponentItems: ToolComponentItem[] = [
  {
    title: '单行问答题',
    name: 'q-single-line',
    icon: 'iconfont icon-textbox',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '数值填写题',
    name: 'q-number',
    icon: 'iconfont icon-textbox',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '单行问答组',
    name: 'q-single-line-group',
    icon: 'iconfont icon-shebeiguanli',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '多行问答题',
    name: 'q-multiple-line',
    icon: 'iconfont icon-textarea',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '单项选择题',
    name: 'q-single-choice',
    icon: 'iconfont icon-check-circle',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '多项选择题',
    name: 'q-multiple-choice',
    icon: 'iconfont icon-checkbox',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '下拉选择题',
    name: 'q-dropdown',
    icon: 'iconfont icon-dropdownlist',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '日期选择',
    name: 'q-datetime-picker',
    icon: 'iconfont icon-dropdownlist',
    isNew: true,
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '日期范围选择',
    name: 'q-datetime-picker',
    icon: 'iconfont icon-dropdownlist',
    answerType: 'datetime-range',
    isNew: true,
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
    attrs: {
      isRange: true,
      label: '日期范围选择',
      title: '日期范围选择'
    }
  },
  {
    title: '评分题',
    name: 'q-score',
    icon: 'iconfont icon-star',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage, PageType.endPage],
  },
  {
    title: '多项评分题',
    name: 'q-score-group',
    icon: 'iconfont icon-star',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage, PageType.endPage],
  },
  {
    title: '文件上传题',
    name: 'q-file-upload',
    icon: 'iconfont icon-cloud-upload',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '手写题',
    name: 'q-drawing-board',
    icon: 'iconfont icon-drawing-board',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '表格题',
    name: 'q-table',
    icon: 'iconfont icon-table',
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '隐藏题',
    name: 'q-hidden',
    icon: 'iconfont icon-miwen',
    isNew: true,
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },
  {
    title: '可选择卡片',
    name: 'q-card-picker',
    icon: 'iconfont icon-daibanshixiang',
    isNew: true,
    category: ComponentCategory.normal,
    pageType: [PageType.normalPage],
  },

  // 布局组件

  {
    title: '流式布局',
    name: 'q-flex',
    icon: 'iconfont icon-wuxupailie',
    category: ComponentCategory.layout,
    isNew: true,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
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
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },
  {
    title: '画布',
    name: 'q-canvas',
    icon: 'iconfont icon-edit',
    category: ComponentCategory.layout,
    isNew: true,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },

  // 附加内容

  {
    title: '分页器',
    name: 'q-page-split',
    icon: 'iconfont icon-timeline2',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage],
  },
  {
    title: '文本',
    name: 'q-text',
    icon: 'iconfont icon-font',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },
  {
    title: '图片',
    name: 'q-image',
    icon: 'iconfont icon-picture',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },
  {
    title: '音频',
    name: 'q-audio',
    icon: 'iconfont icon-guize1',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },
  {
    title: '视频',
    name: 'q-video',
    icon: 'iconfont icon-video',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage, PageType.startPage, PageType.endPage],
  },
  {
    title: '柱状图',
    name: 'q-chart-bar',
    icon: 'iconfont icon-chart-bar',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage],
  },
  {
    title: '折线图',
    name: 'q-chart-line',
    icon: 'iconfont icon-chart-line',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage],
  },
  {
    title: '饼图',
    name: 'q-chart-pie',
    icon: 'iconfont icon-chart-pie',
    category: ComponentCategory.attachment,
    pageType: [PageType.normalPage],
  },
  {
    title: '完成得分',
    name: 'q-complete-score',
    icon: 'iconfont icon-stars',
    category: ComponentCategory.attachment,
    pageType: [PageType.endPage],
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
  {
    title: '步骤条',
    name: 'q-anx-stepper',
    icon: 'iconfont icon-lianjieliu',
    category: ComponentCategory.special,
  },
  {
    title: '仪表盘',
    name: 'q-anx-practise-score',
    icon: 'iconfont icon-dashboard',
    category: ComponentCategory.special,
  },
  {
    title: '翻页按钮',
    name: 'q-anx-compelete-button',
    icon: 'iconfont icon-change',
    category: ComponentCategory.special,
  },
  {
    title: '视频播放器',
    name: 'q-anx-video',
    icon: 'iconfont icon-video',
    category: ComponentCategory.special,
  },
  {
    title: '音频播放器',
    name: 'q-anx-audio',
    icon: 'iconfont icon-rentijiance',
    category: ComponentCategory.special,
  },
];

export const setMenuItems = (items) => {
  menuComponentItems = items;
}