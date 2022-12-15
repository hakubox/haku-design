import { GeneralProperty } from '@/@types';
import { ComponentPropertyEditor, ComponentPropertyGroup, PageType, PropertyLayout } from '@/@types/enum';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as globalState } from '@/common/global';
import { createModelId } from '@/tools/common';
import { toast } from '@/common/message';

/** 应用配置列表 */
export const formConfigs: GeneralProperty[] = [
  {
    name: 'appTitle',
    title: '应用标题',
    placeholder: '应用标题',
    group: 'basic',
    editor: ComponentPropertyEditor.singerLine,
  },
  {
    name: 'appVersion',
    title: '应用版本号',
    placeholder: '应用版本号',
    group: 'basic',
    editor: ComponentPropertyEditor.label,
  },
  {
    name: 'headerTags',
    title: '应用头部标签',
    placeholder: '应用头部标签',
    group: 'basic',
    editor: ComponentPropertyEditor.textList,
  },
  {
    name: 'headerContent',
    title: '应用头部说明',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  },
  {
    name: 'description',
    title: '应用描述',
    placeholder: '请填写应用描述',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  },
  {
    name: 'remark',
    title: '应用备注',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  },
  {
    name: 'deviceType',
    title: '设备类型',
    group: 'basic',
    editor: ComponentPropertyEditor.radioGroup,
    attrs: {
      options: [
        { label: '移动端', value: 'mobile' },
        { label: 'PC端', value: 'pc' },
      ],
    },
    change(val) {
      if (val === 'pc') {
        globalState.isMobile = false;
      } else if (val === 'mobile') {
        globalState.isMobile = true;
      }
      editorService.onPageSize();
    },
  },
  {
    name: 'hasScore',
    title: '是否包含评分',
    group: 'basic',
    editor: ComponentPropertyEditor.boolean,
    change() {
      editorService.changeSelectedFormComponent(editorState.currentSelectedComponent, true);
    },
  },
  {
    name: 'ratingList',
    title: '评价列表',
    default: [{ startScore: 0, title: '正常评分' }],
    layout: PropertyLayout.block,
    group: 'basic',
    editor: ComponentPropertyEditor.modelList,
    canFullScreen: true,
    attrs: {
      rowKey: 'id',
      columns: [
        {
          name: 'id',
          title: 'Id',
          editor: ComponentPropertyEditor.singerLine,
          visible: false,
          get default() {
            return createModelId();
          },
          attrs: {},
        },
        { name: 'startScore', width: '100px', title: '起始分', editor: ComponentPropertyEditor.int, attrs: { size: 'small' } },
        { name: 'endScore', width: '100px', title: '截止分', editor: ComponentPropertyEditor.int, attrs: { size: 'small' } },
        {
          name: 'dimension',
          width: '20%',
          title: '维度',
          editor: ComponentPropertyEditor.dropdownList,
          attrs: {
            get options() {
              return [
                { label: '——', value: '' },
                ...editorState.appConfig.dimensionConfig.dimensionList.map((i) => ({
                  label: i.dimensionTitle,
                  value: i.dimensionId,
                })),
              ];
            },
          },
          get visible() {
            return (
              editorState.appConfig?.dimensionConfig?.isOpen &&
              editorState.appConfig?.dimensionConfig?.dimensionList?.length > 0
            );
          },
        },
        { name: 'title', title: '评价标题', editor: ComponentPropertyEditor.singerLine, attrs: {} },
        {
          name: 'description',
          width: '10%',
          title: '描述',
          editor: ComponentPropertyEditor.richtext,
          buttonEditorText: '编辑描述信息',
          attrs: {},
        },
      ],
    },
    showCondition: (prop, propMap, target) => target.hasScore,
  },
  {
    name: 'turnPageMode',
    title: '分页类型',
    group: 'basic',
    editor: ComponentPropertyEditor.dropdownList,
    attrs: {
      options: [
        { label: '默认', value: 'default' },
        { label: '每题一页', value: 'page' },
        { label: '不分页', value: 'no-page' },
      ],
    },
  },
  {
    name: 'showPageProgress',
    title: '是否显示进度',
    default: true,
    group: 'basic',
    editor: ComponentPropertyEditor.boolean,
    attrs: {},
  },
  {
    name: 'showNo',
    title: '是否显示题目序号',
    description: '无标题的题目无法显示序号',
    default: true,
    group: 'basic',
    editor: ComponentPropertyEditor.boolean,
  },
  {
    name: 'useAutoCache',
    title: '自动记录提交信息',
    default: true,
    group: 'basic',
    editor: ComponentPropertyEditor.boolean,
  },
  {
    name: 'autoCacheDuration',
    title: '缓存超时时长',
    default: 3600000,
    group: 'basic',
    editor: ComponentPropertyEditor.duration,
    attrs: { unit: 'hour' },
    showCondition: (prop, propMap, target) => target.useAutoCache,
  },

  {
    name: ['timerConfig', 'isOpen'],
    title: '是否开启记时',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
  },
  {
    name: ['timerConfig', 'isAutoTiming'],
    title: '是否自动记时',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'minDuration'],
    title: '最小经过时长',
    default: 0,
    group: 'time',
    editor: ComponentPropertyEditor.duration,
    attrs: { unit: 'minute' },
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'isEnforceMinDuration'],
    title: '是否强制最小时长',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen && target.timerConfig?.minDuration > 0,
  },
  {
    name: ['timerConfig', 'minDurationTooltip'],
    title: '时长不足提示文本',
    default: '',
    group: 'time',
    editor: ComponentPropertyEditor.multiLine,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen && target.timerConfig?.minDuration > 0,
  },
  {
    name: ['timerConfig', 'timeOutDuration'],
    title: '超时时长',
    default: 2000,
    group: 'time',
    editor: ComponentPropertyEditor.duration,
    attrs: { unit: 'minute' },
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'showTooltip'],
    title: '显示界面提示',
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'timeOutRemind'],
    title: '超时提醒文本',
    group: 'time',
    editor: ComponentPropertyEditor.multiLine,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'timeOutAutoSubmit'],
    title: '超时自动提交',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'remindAdvanceDuration'],
    title: '超时提醒提前时长',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'isOpenSingleQuestion'],
    title: '是否开启单题记时',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen,
  },
  {
    name: ['timerConfig', 'singleQuestionTimeOutDuration'],
    title: '单题超时时长',
    default: 100,
    group: 'time',
    editor: ComponentPropertyEditor.duration,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen && target.timerConfig.isOpenSingleQuestion,
  },
  {
    name: ['timerConfig', 'singleQuestionTimeOutAutoSkip'],
    title: '单题超时自动跳过',
    default: false,
    group: 'time',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.timerConfig?.isOpen && target.timerConfig.isOpenSingleQuestion,
  },

  {
    name: ['dimensionConfig', 'isOpen'],
    title: '是否开启维度',
    default: false,
    group: 'dimension',
    editor: ComponentPropertyEditor.boolean,
  },
  {
    name: ['dimensionConfig', 'dimensionList'],
    title: '维度列表配置',
    default: [],
    layout: PropertyLayout.block,
    group: 'dimension',
    editor: ComponentPropertyEditor.dimension,
    attrs: {},
    showCondition: (prop, propMap, target) => target.dimensionConfig?.isOpen,
  },

  {
    name: ['startPageConfig', 'isOpen'],
    title: '是否开启起始页',
    default: false,
    group: 'page',
    editor: ComponentPropertyEditor.boolean,
    attrs: {
      confirm: (value) => `是否${value ? '关闭' : '开启'}起始页？`,
    },
    change(value) {
      const _index = editorState.pages.findIndex((i) => i.pageType === PageType.startPage);
      if (value) {
        if (_index < 0) {
          editorState.pages.splice(0, 0, { pageTitle: '起始页', pageType: PageType.startPage, children: [] });
          editorState.currentPageIndex++;
        } else toast('起始页已创建', 'warning');
      } else {
        if (_index >= 0) {
          editorState.currentPageIndex--;
          editorState.pages.splice(_index, 1);
        }
      }
    },
  },
  {
    name: ['endPageConfig', 'isOpen'],
    title: '是否开启完成页',
    default: false,
    group: 'page',
    editor: ComponentPropertyEditor.boolean,
    attrs: {
      confirm: (value) => `是否${value ? '关闭' : '开启'}完成页？`,
    },
    change(value) {
      const _index = editorState.pages.findIndex((i) => i.pageType === PageType.endPage);
      if (value) {
        if (_index < 0) {
          editorState.pages.push({ pageTitle: '完成页', pageType: PageType.endPage, children: [] });
        } else toast('完成页已创建', 'warning');
      } else {
        if (_index >= 0) {
          if (editorState.currentPageIndex === editorState.pages.length - 1) {
            editorState.currentPageIndex--;
          }
          editorState.pages.splice(_index, 1);
        }
      }
    },
  },

  {
    name: 'showPageButton',
    title: '是否显示底部按钮',
    default: true,
    group: 'bottom',
    editor: ComponentPropertyEditor.boolean,
    attrs: {},
  },
  {
    name: ['footer', 'submitButtonText'],
    title: '提交按钮文本',
    default: '提交',
    group: 'bottom',
    editor: ComponentPropertyEditor.singerLine,
    showCondition: (prop, propMap, target) => target.showPageButton,
  },
  {
    name: ['footer', 'resetButton'],
    title: '显示重置按钮',
    default: false,
    group: 'bottom',
    editor: ComponentPropertyEditor.boolean,
    showCondition: (prop, propMap, target) => target.showPageButton,
  },
  {
    name: ['footer', 'resetButtonText'],
    title: '重置按钮文本',
    default: '重置',
    group: 'bottom',
    editor: ComponentPropertyEditor.singerLine,
    showCondition: (prop, propMap, target) => target.showPageButton && target.footer.resetButton,
  },
];
