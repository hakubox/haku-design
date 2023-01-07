import { AppEventTrigger } from '@/modules/event-module/@types';
import { state as editorState } from '@/modules/editor-module';
import { ComponentPropertyEditor, PageType } from '@/@types/enum';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { EventTriggerGroup, EventTriggerType } from '../enum';
import { computed } from 'vue';

/** 事件触发分组 */
export const eventTriggerGroups: { label: string; value: EventTriggerGroup }[] = [
  { label: '问卷', value: EventTriggerGroup.questionnaire },
  { label: '时间', value: EventTriggerGroup.time },
  { label: '组件', value: EventTriggerGroup.component },
  { label: '问题分页', value: EventTriggerGroup.page },
  { label: '用户行为', value: EventTriggerGroup.action },
  { label: '系统', value: EventTriggerGroup.system },
  { label: '音视频', value: EventTriggerGroup.media },
];

/** 获取所有事件触发 */
export let getEventTriggers = computed<AppEventTrigger[]>(() => {
  return eventTriggers;
});

/** 事件触发 */
export const eventTriggers: AppEventTrigger[] = [
  {
    title: '跳转到答题页',
    name: 'goto-answer-page',
    isGlobal: true,
    group: EventTriggerGroup.questionnaire,
    type: EventTriggerType.gotoAnswerPage,
    config: {},
    attrs: {},
    hasState: true,
    format: '跳转到起始页',
    condition(attrs, config, target, data) {
      return editorState.currentPage.pageType === PageType.normalPage;
    },
  },
  {
    title: '跳转到起始页',
    name: 'goto-start-page',
    isGlobal: true,
    group: EventTriggerGroup.questionnaire,
    type: EventTriggerType.gotoStartPage,
    config: {},
    attrs: {},
    hasState: true,
    format: '跳转到起始页',
    condition(attrs, config, target, data) {
      return editorState.currentPage.pageType === PageType.startPage;
    },
  },
  {
    title: '跳转到完成页',
    name: 'goto-end-page',
    isGlobal: true,
    group: EventTriggerGroup.questionnaire,
    type: EventTriggerType.gotoEndPage,
    config: {},
    attrs: {},
    hasState: true,
    format: '跳转到完成页',
    condition(attrs, config, target, data) {
      return editorState.currentPage.pageType === PageType.endPage;
    },
  },

  {
    title: '记时',
    name: 'timer',
    isGlobal: true,
    group: EventTriggerGroup.time,
    type: EventTriggerType.timer,
    config: {
      time: { title: '时长（秒）', required: true, width: '150px', editor: ComponentPropertyEditor.duration },
    },
    attrs: {},
    hasState: true,
    format: '计时达到{{time}}秒',
    condition(attrs, config, target, data) {
      return formFillState.timerInfo.duration >= attrs.time * 1000;
    },
  },
  {
    title: '单题记时',
    name: 'single-question-timer',
    isGlobal: true,
    group: EventTriggerGroup.time,
    type: EventTriggerType.timer,
    config: {
      time: { title: '时长（秒）', required: true, width: '150px', editor: ComponentPropertyEditor.duration },
    },
    attrs: {},
    hasState: true,
    format: '每题计时达到{{time}}秒',
    condition(attrs, config, target, data) {
      return formFillState.timerInfo.duration >= attrs.time * 1000;
    },
  },
  {
    title: '开始记时',
    name: 'goto-end-page',
    isGlobal: true,
    group: EventTriggerGroup.time,
    type: EventTriggerType.timeStart,
    config: {},
    attrs: {},
    hasState: true,
    format: '记开始时',
  },
  {
    title: '暂停记时',
    name: 'goto-end-page',
    isGlobal: true,
    group: EventTriggerGroup.time,
    type: EventTriggerType.timePause,
    config: {},
    attrs: {},
    hasState: true,
    format: '记时暂停',
  },

  {
    title: '题显示',
    name: 'showComponent',
    isGlobal: false,
    group: EventTriggerGroup.component,
    type: EventTriggerType.showComponent,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    hasState: true,
    format: '{{component}}显示',
    condition(attrs, config, target, data) {
      return attrs.component == editorState.currentPage.children[editorState.currentFormPageIndex].id;
    },
  },
  {
    title: '题隐藏',
    name: 'hideComponent',
    isGlobal: false,
    group: EventTriggerGroup.component,
    type: EventTriggerType.hideComponent,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    hasState: true,
    format: '{{component}}隐藏',
    condition(attrs, config, target, data) {
      return (
        attrs.component == editorState.currentPage.children[editorState.prevFormPageIndex].id &&
        attrs.component != editorState.currentPage.children[editorState.currentFormPageIndex].id
      );
    },
  },
  {
    title: '值改变',
    name: 'valueChange',
    isGlobal: false,
    group: EventTriggerGroup.component,
    type: EventTriggerType.valueChange,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '30%', attrs: { isFormItem: true } },
      condition: {
        title: '判断条件',
        required: true,
        editor: ComponentPropertyEditor.condition,
        width: '120px',
        attrs: { valueType: 'string' },
      },
      value: { title: '值', required: true, default: '', editor: ComponentPropertyEditor.data, width: '50%' },
    },
    condition: (attrs, config, target, data) => {
      let _val: any = formFillService.getFormInfo(target);
      if (_val?.value?.value && Array.isArray(_val?.value?.value)) {
        _val = (_val?.value?.value ?? ['']).join(',');
      } else {
        _val = _val?.value;
      }
      let _attrValue = attrs.value;
      console.log('当前选项', _attrValue);
      if (_attrValue.dataOrigin === 'data-editor') {
        _attrValue = formFillService.getOriginDataValue(_attrValue);
      }

      switch (attrs.condition) {
        case '=': // 等于
          return _val == _attrValue;
        case '!=': // 不等于
          return _val != _attrValue;
        case 'like': // 包含
          return _val.indexOf(_attrValue) >= 0;
        case 'notlike': // 不包含
          return _val.indexOf(_attrValue) < 0;
        case 'empty': // 为空
          return _val == '';
        case 'notempty': // 不为空
          return _val != '';
        case 'startwith': // 以___开头
          return _val.startsWith(_attrValue);
        case 'endwith': // 以___结尾
          return _val.endsWith(_attrValue);
        default:
          return false;
      }
    },
    attrs: {},
    hasState: true,
    format: '{{component}}{{condition}}{{value}}',
  },
  {
    title: '上一题',
    name: 'prev-component',
    isGlobal: true,
    group: EventTriggerGroup.component,
    type: EventTriggerType.prevComponent,
    config: {},
    attrs: {},
    hasState: false,
    format: '跳转到上一题',
  },
  {
    title: '下一题',
    name: 'next-component',
    isGlobal: true,
    group: EventTriggerGroup.component,
    type: EventTriggerType.nextComponent,
    config: {},
    attrs: {},
    hasState: false,
    format: '跳转到下一题',
  },

  {
    title: '上一页',
    name: 'prev-page',
    isGlobal: true,
    group: EventTriggerGroup.page,
    type: EventTriggerType.prevPage,
    config: {},
    attrs: {},
    hasState: false,
    format: '跳转到上一页',
  },
  {
    title: '下一页',
    name: 'next-page',
    isGlobal: true,
    group: EventTriggerGroup.page,
    type: EventTriggerType.nextPage,
    config: {},
    attrs: {},
    hasState: false,
    format: '跳转到下一页',
  },
  {
    title: '跳转到某一页',
    name: 'goto-page',
    isGlobal: true,
    group: EventTriggerGroup.page,
    type: EventTriggerType.gotoPage,
    config: {
      index: { title: '页数', required: true, editor: ComponentPropertyEditor.int, width: '20%' },
    },
    attrs: {},
    hasState: true,
    format: '跳转到第{{index}}页',
    condition(attrs, config, target) {
      console.log(editorState.currentFormPageIndex == attrs.index - 1);
      return editorState.currentFormPageIndex == attrs.index - 1;
    },
  },

  {
    title: '点击',
    name: 'click',
    isGlobal: false,
    group: EventTriggerGroup.action,
    type: EventTriggerType.click,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    hasState: false,
    format: '点击{{component}}',
  },
  {
    title: '滑动',
    name: 'swipe',
    isGlobal: false,
    group: EventTriggerGroup.action,
    type: EventTriggerType.swipe,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
      direction: {
        title: '滑动方向',
        required: true,
        editor: ComponentPropertyEditor.dropdownList,
        width: '30%',
        default: 'right',
        attrs: {
          options: [
            { label: '上', value: 'up' },
            { label: '下', value: 'down' },
            { label: '左', value: 'left' },
            { label: '右', value: 'right' },
          ]
        }
      },
    },
    attrs: {},
    hasState: true,
    condition(attrs, config, target, data) {
      return data.direction === attrs.direction;
    },
    format: '往{{direction}}滑动{{component}}',
  },
  {
    title: '提交表单前',
    name: 'before-submit',
    isGlobal: true,
    group: EventTriggerGroup.action,
    type: EventTriggerType.beforeSubmitForm,
    config: {},
    attrs: {},
    hasState: false,
    format: '表单提交前',
  },
  {
    title: '提交表单',
    name: 'submit',
    isGlobal: true,
    group: EventTriggerGroup.action,
    type: EventTriggerType.submitForm,
    config: {},
    attrs: {},
    hasState: false,
    format: '表单提交',
  },
  {
    title: '重置表单',
    name: 'reset',
    isGlobal: true,
    group: EventTriggerGroup.action,
    type: EventTriggerType.submitForm,
    config: {},
    attrs: {},
    hasState: false,
    format: '表单重置',
  },

  {
    title: '应用初始化',
    name: 'app-init',
    isGlobal: true,
    group: EventTriggerGroup.system,
    type: EventTriggerType.appInit,
    config: {},
    attrs: {},
    hasState: false,
    format: '应用初始化',
  },
  {
    title: '应用加载完毕',
    name: 'app-loading-complete',
    isGlobal: true,
    group: EventTriggerGroup.system,
    type: EventTriggerType.appLoadingComplete,
    config: {},
    attrs: {},
    hasState: false,
    format: '应用加载完毕',
  },
  {
    title: '应用显示',
    name: 'app-show',
    isGlobal: true,
    group: EventTriggerGroup.system,
    type: EventTriggerType.appShow,
    config: {},
    attrs: {},
    hasState: false,
    format: '应用显示',
  },
  {
    title: '应用隐藏',
    name: 'app-hide',
    isGlobal: true,
    group: EventTriggerGroup.system,
    type: EventTriggerType.appHide,
    config: {},
    attrs: {},
    hasState: false,
    format: '应用隐藏',
  },

  {
    title: '开始播放',
    name: 'start-play',
    isGlobal: false,
    group: EventTriggerGroup.media,
    type: EventTriggerType.startPlay,
    config: {
      component: {
        title: '多媒体组件',
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'].includes(component.name),
        },
      },
    },
    attrs: {},
    hasState: false,
    format: '{{component}}开始播放',
  },
  {
    title: '暂停播放',
    name: 'pause-play',
    isGlobal: false,
    group: EventTriggerGroup.media,
    type: EventTriggerType.pausePlay,
    config: {
      component: {
        title: '多媒体组件', 
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'].includes(component.name),
        },
      },
    },
    attrs: {},
    hasState: false,
    format: '{{component}}暂停播放',
  },
  {
    title: '停止播放',
    name: 'stop-play',
    isGlobal: false,
    group: EventTriggerGroup.media,
    type: EventTriggerType.stopPlay,
    config: {
      component: {
        title: '多媒体组件', 
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'].includes(component.name),
        },
      },
    },
    attrs: {},
    hasState: false,
    format: '{{component}}停止播放',
  },
  {
    title: '加载完播放',
    name: 'loading-complete',
    isGlobal: false,
    group: EventTriggerGroup.media,
    type: EventTriggerType.loadingComplete,
    config: {
      component: {
        title: '多媒体组件', 
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'].includes(component.name),
        },
      },
    },
    attrs: {},
    hasState: false,
    format: '{{component}}加载完播放',
  },
  {
    title: '加载数据中',
    name: 'loading-waiting',
    isGlobal: false,
    group: EventTriggerGroup.media,
    type: EventTriggerType.loadingWaiting,
    config: {
      component: {
        title: '多媒体组件', 
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'].includes(component.name),
        },
      },
    },
    attrs: {},
    hasState: false,
    format: '{{component}}加载数据中',
  },
];
