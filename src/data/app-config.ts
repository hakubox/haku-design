import { GeneralProperty } from '@haku-design/core';
import { AppType, ComponentPropertyEditor, PageType, PropertyLayout } from '@haku-design/core';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as globalState } from '@/common/global';
import { createModelId } from '@/tools/common';
import { toast } from '@/common/message';
import { getPropType } from '@/common/app-handle';

/** 获取应用配置属性列表 */
export const getAppConfigPropertys = (appType: AppType): GeneralProperty<any>[] => {
  switch (appType) {
    case AppType.questionnaire:
      return [
        ...formConfigs,
        ...questionnaireConfig,
      ];
    case AppType.canvas:
      return [
        ...formConfigs,
        ...canvasConfig,
      ];
    default:
      return [];
  }
};

/** 应用配置列表 */
export const formConfigs = [
  getPropType({
    name: 'appTitle',
    title: '应用标题',
    placeholder: '应用标题',
    group: 'basic',
    editor: ComponentPropertyEditor.singerLine,
  }),
  getPropType({
    name: 'appVersion',
    title: '版本号',
    placeholder: '版本号',
    group: 'basic',
    editor: ComponentPropertyEditor.label,
  }),
  getPropType({
    name: 'headerTags',
    title: '头部标签',
    placeholder: '头部标签',
    group: 'basic',
    editor: ComponentPropertyEditor.tags,
  }),
  getPropType({
    name: 'headerContent',
    title: '头部说明',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  }),
  getPropType({
    name: 'description',
    title: '应用描述',
    placeholder: '请填写应用描述',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  }),
  getPropType({
    name: 'remark',
    title: '应用备注',
    group: 'basic',
    editor: ComponentPropertyEditor.multiLine,
  }),
  getPropType({
    name: 'background',
    title: '背景',
    group: 'basic',
    layout: PropertyLayout.block,
    editor: ComponentPropertyEditor.background,
  }),
  getPropType({
    name: ['designConfig', 'deviceType'],
    title: '设备类型',
    group: 'basic',
    editor: ComponentPropertyEditor.radioGroup,
    attrs: {
      options: [
        { label: '移动端', value: 'mobile' },
        // { label: '平板', value: 'tablet' },
        { label: 'PC端', value: 'pc' },
      ],
    },
    change({ value }) {
      if (value === 'pc') {
        globalState.isMobile = false;
      } else if (value === 'mobile') {
        globalState.isMobile = true;
      }
      editorService.onPageSize();
    },
  }),
];

/** 画布应用相关配置 */
export const canvasConfig = [
  getPropType({
    name: ['designConfig', 'gridSize'],
    title: '网格大小',
    group: 'basic',
    editor: ComponentPropertyEditor.slider,
    attrs: {
      min: 5,
      max: 50,
      step: 5,
      suffix: 'px'
    },
  }),
  getPropType({
    name: 'size',
    names: [['canvasConfig', 'width'], ['canvasConfig', 'height']],
    title: '尺寸',
    require: false,
    visible: true,
    group: 'canvas',
    editor: ComponentPropertyEditor.numbers,
    attrs: {
      options: [ { label: '宽', prop: 'width', min: 1000 }, { label: '高', prop: 'height', min: 700 } ]
    }
  }),
  getPropType({
    name: ['canvasConfig', 'scale'],
    title: '缩放比',
    group: 'canvas',
    editor: ComponentPropertyEditor.slider,
    attrs: {
      min: 0.5,
      max: 2,
      step: 0.1,
      suffix: '倍'
    }
  }),
];

/** 问卷应用相关配置 */
export const questionnaireConfig = [
  getPropType({
    name: ['questionnaireConfig', 'hasScore'],
    title: '开启评分',
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    default: false,
    change() {
      editorService.changeSelectedFormComponent(editorState.currentSelectedComponents, true);
    },
  }),
  getPropType({
    name: ['questionnaireConfig', 'ratingList'],
    title: '评价列表',
    default: [{ startScore: 0, title: '正常评分' }],
    layout: PropertyLayout.block,
    group: 'questionnaire',
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
                ...editorState.appConfig.questionnaireConfig.dimensionConfig.dimensionList.map((i) => ({
                  label: i.dimensionTitle,
                  value: i.dimensionId,
                })),
              ];
            },
          },
          get visible() {
            return (
              editorState.appConfig.questionnaireConfig.dimensionConfig?.isOpen &&
              editorState.appConfig.questionnaireConfig.dimensionConfig?.dimensionList?.length > 0
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
    showCondition: ({ model }) => model.hasScore,
  }),
  getPropType({
    name: ['questionnaireConfig', 'turnPageMode'],
    title: '分页类型',
    group: 'questionnaire',
    editor: ComponentPropertyEditor.dropdownList,
    attrs: {
      options: [
        { label: '默认', value: 'default' },
        { label: '每题一页', value: 'page' },
        { label: '不分页', value: 'no-page' },
      ],
    },
  }),
  getPropType({
    name: ['questionnaireConfig', 'showPageProgress'],
    title: '答题进度',
    default: true,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
  }),
  getPropType({
    name: ['questionnaireConfig', 'showNo'],
    title: '题目序号',
    description: '无标题的题目无法显示序号',
    default: true,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
  }),
  getPropType({
    name: ['questionnaireConfig', 'useAutoCache'],
    title: '自动记录',
    remark: '开启后自动记录所有提交信息',
    default: true,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
  }),
  getPropType({
    name: ['questionnaireConfig', 'autoCacheDuration'],
    title: '缓存超时时长',
    default: 3600000,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.duration,
    attrs: { unit: 'hour' },
    showCondition: ({ model }) => model.useAutoCache,
  }),

  getPropType({
    name: ['questionnaireConfig', 'timerConfig', 'isOpen'],
    title: '记时配置',
    default: false,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    children: [
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'isAutoTiming'],
        title: '自动记时',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'minDuration'],
        title: '最小经过时长',
        default: 0,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.duration,
        attrs: { unit: 'minute' },
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'isEnforceMinDuration'],
        title: '强制最小时长',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen && model.questionnaireConfig.timerConfig?.minDuration > 0,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'minDurationTooltip'],
        title: '时长不足提示',
        default: '',
        group: 'questionnaire',
        editor: ComponentPropertyEditor.multiLine,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen && model.questionnaireConfig.timerConfig?.minDuration > 0,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'timeOutDuration'],
        title: '超时时长',
        default: 2000,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.duration,
        attrs: { unit: 'minute' },
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'showTooltip'],
        title: '界面提示',
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'timeOutRemind'],
        title: '超时提醒',
        group: 'questionnaire',
        editor: ComponentPropertyEditor.multiLine,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'timeOutAutoSubmit'],
        title: '超时提交',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'remindAdvanceDuration'],
        title: '超时提前时长',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'isOpenSingleQuestion'],
        title: '开启单题记时',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'singleQuestionTimeOutDuration'],
        title: '单题超时时长',
        default: 100,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.duration,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen && model.questionnaireConfig.timerConfig.isOpenSingleQuestion,
      }),
      getPropType({
        name: ['questionnaireConfig', 'timerConfig', 'singleQuestionTimeOutAutoSkip'],
        title: '单题超时跳过',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.timerConfig?.isOpen && model.questionnaireConfig.timerConfig.isOpenSingleQuestion,
      }),
    ]
  }),
  

  getPropType({
    name: ['questionnaireConfig', 'dimensionConfig', 'isOpen'],
    title: '维度配置',
    default: false,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    children: [
      getPropType({
        name: ['questionnaireConfig', 'dimensionConfig', 'dimensionList'],
        title: '维度列表配置',
        default: [],
        layout: PropertyLayout.block,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.dimension,
        showCondition: ({ model }) => model.questionnaireConfig.dimensionConfig?.isOpen,
      }),
    ]
  }),

  getPropType({
    name: ['questionnaireConfig', 'startPageConfig', 'isOpen'],
    title: '起始页',
    default: false,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    attrs: {
      confirm: (value) => `是否${value ? '关闭' : '开启'}起始页？`,
    },
    change({ value }) {
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
  }),
  getPropType({
    name: ['questionnaireConfig', 'endPageConfig', 'isOpen'],
    title: '完成页',
    default: false,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    attrs: {
      confirm: (value) => `是否${value ? '关闭' : '开启'}完成页？`,
    },
    change({ value }) {
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
  }),

  getPropType({
    name: ['questionnaireConfig', 'showPageButton'],
    title: '底部按钮',
    default: true,
    group: 'questionnaire',
    editor: ComponentPropertyEditor.boolean,
    attrs: {},
    children: [
      getPropType({
        name: ['questionnaireConfig', 'footer', 'submitButtonText'],
        title: '提交按钮文本',
        default: '提交',
        group: 'questionnaire',
        editor: ComponentPropertyEditor.singerLine,
        showCondition: ({ model }) => model.questionnaireConfig.showPageButton,
      }),
      getPropType({
        name: ['questionnaireConfig', 'footer', 'resetButton'],
        title: '重置按钮',
        default: false,
        group: 'questionnaire',
        editor: ComponentPropertyEditor.boolean,
        showCondition: ({ model }) => model.questionnaireConfig.showPageButton,
      }),
      getPropType({
        name: ['questionnaireConfig', 'footer', 'resetButtonText'],
        title: '重置按钮文本',
        default: '重置',
        group: 'questionnaire',
        editor: ComponentPropertyEditor.singerLine,
        showCondition: ({ model }) => model.questionnaireConfig.showPageButton && model.questionnaireConfig.footer.resetButton,
      }),
    ]
  }),
  
]