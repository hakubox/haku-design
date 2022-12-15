import { DeviceType, ComponentPropertyEditor, PageType } from '@/@types/enum';
import { AppEventAction } from '@/modules/event-module/@types';
import { state as editorState, service as editorService } from '@/modules/editor-module';
import { state as formFillState, service as formFillService } from '@/modules/form-fill-module';
import { service as variableService } from '@/modules/variable-module';
import { EventActionGroup } from '../enum';
import { toast } from '@/common/message';

/** 事件行为分组 */
export const eventActionGroups: { label: string; value: EventActionGroup }[] = [
  { label: '问卷', value: EventActionGroup.questionnaire },
  { label: '时间', value: EventActionGroup.time },
  { label: '组件', value: EventActionGroup.component },
  { label: '表单分页', value: EventActionGroup.formPage },
  { label: '应用分页', value: EventActionGroup.page },
  { label: '系统', value: EventActionGroup.system },
  { label: '音视频', value: EventActionGroup.media },
];

/** 多媒体组件列表 */
const mediaComponents = ['q-audio', 'q-video', 'q-anx-audio', 'q-anx-video'];

/** 事件行为 */
export const eventActions: AppEventAction[] = [
  {
    title: '跳转到主页',
    name: 'goto-answer-page',
    isGlobal: true,
    group: EventActionGroup.questionnaire,
    config: {},
    attrs: {},
    format: '将跳转到主页',
    action() {
      const _index = editorState.pages.findIndex((i) => i.pageType === PageType.normalPage);
      if (_index >= 0) {
        editorState.currentPageIndex = _index;
      } else {
        toast('未找到主页', 'error');
      }
    },
  },
  {
    title: '跳转到起始页',
    name: 'goto-start-page',
    isGlobal: true,
    group: EventActionGroup.questionnaire,
    config: {},
    attrs: {},
    format: '将跳转到起始页',
    action() {
      const _index = editorState.pages.findIndex((i) => i.pageType === PageType.startPage);
      if (_index >= 0) {
        editorState.currentPageIndex = _index;
      } else {
        toast('未找到起始页', 'error');
      }
    },
  },
  {
    title: '跳转到完成页',
    name: 'goto-end-page',
    isGlobal: true,
    group: EventActionGroup.questionnaire,
    config: {},
    attrs: {},
    format: '将提交表单并跳转到完成页',
    action() {
      formFillService.submitForm().then((d) => {
        if (d.isComplete) {
          editorService.nextAppPage();
        }
      });
    },
  },

  {
    title: '开始记时',
    name: 'time-start',
    isGlobal: true,
    group: EventActionGroup.time,
    config: {},
    attrs: {},
    format: '将开始计时',
    action() {
      formFillService.startTime();
    },
  },
  {
    title: '暂停记时',
    name: 'time-pause',
    isGlobal: true,
    group: EventActionGroup.time,
    config: {},
    attrs: {},
    format: '将暂停计时',
    action() {
      formFillService.pauseTime();
    },
  },
  {
    title: '继续记时',
    name: 'time-resume',
    isGlobal: true,
    group: EventActionGroup.time,
    config: {},
    attrs: {},
    format: '将继续计时',
    action() {
      formFillService.resumeTime();
    },
  },
  {
    title: '完成记时',
    name: 'time-complete',
    isGlobal: true,
    group: EventActionGroup.time,
    config: {},
    attrs: {},
    format: '将完成计时',
    action() {
      formFillService.completeTime();
    },
  },
  {
    title: '重置记时',
    name: 'time-reset',
    isGlobal: true,
    group: EventActionGroup.time,
    config: {},
    attrs: {},
    format: '将重置记时',
    action() {
      formFillService.resetTime();
    },
  },

  {
    title: '显示组件',
    name: 'show',
    isGlobal: false,
    group: EventActionGroup.component,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    format: '将显示{{component}}',
    action(attrs) {
      const _componet = editorService.findComponent(attrs.component);
      if (_componet) {
        _componet.attrs.visible = true;
      } else throw new Error('未查询到组件');
    },
  },
  {
    title: '隐藏组件',
    name: 'hide',
    isGlobal: false,
    group: EventActionGroup.component,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    format: '将隐藏{{component}}',
    action(attrs) {
      const _componet = editorService.findComponent(attrs.component);
      if (_componet) {
        _componet.attrs.visible = false;
      } else throw new Error('未查询到组件');
    },
  },
  {
    title: '组件设置值',
    name: 'setValue',
    isGlobal: true,
    group: EventActionGroup.component,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '30%', attrs: { isFormItem: true } },
      value: { title: '值', required: true, default: '', editor: ComponentPropertyEditor.data, width: '60%' },
    },
    attrs: {},
    format: '将{{component}}的值设为{{value}}',
    action(attrs) {
      formFillService.setFormInfo(attrs.component, attrs.value);
    },
  },
  {
    title: '上一题',
    name: 'prev-component',
    isGlobal: true,
    group: EventActionGroup.component,
    config: {},
    attrs: {},
    format: '将返回上一题',
    action() {
      editorService.nextComponent();
    },
  },
  {
    title: '下一题',
    name: 'next-component',
    isGlobal: true,
    group: EventActionGroup.component,
    config: {},
    attrs: {},
    format: '将跳转到下一题',
    action() {
      editorService.nextComponent();
    },
  },
  {
    title: '跳转到某一题',
    name: 'false',
    isGlobal: true,
    group: EventActionGroup.component,
    config: {
      component: { title: '界面组件', required: true, editor: ComponentPropertyEditor.component, width: '40%' },
    },
    attrs: {},
    format: '将跳转到{{component}}',
    action(attrs) {
      const _index = editorService.findComponentIndex(attrs.component);
      if (_index !== undefined) {
        editorService.gotoComponent(_index);
      }
    },
  },

  {
    title: '上一答题页',
    name: 'prev-page',
    isGlobal: true,
    group: EventActionGroup.formPage,
    config: {},
    attrs: {},
    format: '将返回上一答题页',
    action() {
      editorService.prevPage();
    },
  },
  {
    title: '下一答题页',
    name: 'next-page',
    isGlobal: true,
    group: EventActionGroup.formPage,
    config: {},
    attrs: {},
    format: '将跳转到下一答题页',
    action() {
      editorService.nextPage();
    },
  },
  {
    title: '跳转到__答题页',
    name: 'goto-page',
    isGlobal: true,
    group: EventActionGroup.formPage,
    config: {
      index: { required: true, editor: ComponentPropertyEditor.int, width: '30%' },
    },
    attrs: {},
    format: '将跳转到第{{index}}答题页',
    action(attrs) {
      editorService.gotoPage(attrs.index + 1);
    },
  },

  {
    title: '上一页',
    name: 'prev-app-page',
    isGlobal: true,
    group: EventActionGroup.page,
    config: {},
    attrs: {},
    format: '将返回上一页',
    action() {
      editorService.prevPage();
    },
  },
  {
    title: '下一页',
    name: 'next-app-page',
    isGlobal: true,
    group: EventActionGroup.page,
    config: {},
    attrs: {},
    format: '将跳转到下一页',
    action() {
      editorService.nextPage();
    },
  },
  {
    title: '跳转到__页',
    name: 'goto-app-page',
    isGlobal: true,
    group: EventActionGroup.page,
    config: {
      index: { required: true, editor: ComponentPropertyEditor.int, width: '30%' },
    },
    attrs: {},
    format: '将跳转到{{index}}页',
    action(attrs) {
      editorService.gotoPage(attrs.index + 1);
    },
  },

  {
    title: '弹出提示框',
    name: 'toast',
    isGlobal: true,
    group: EventActionGroup.system,
    config: {
      type: {
        title: '提示框类型',
        required: true,
        default: 'info',
        editor: ComponentPropertyEditor.dropdownList,
        width: '20%',
        attrs: {
          options: [
            { label: '信息', value: 'info' },
            { label: '警告', value: 'warn' },
            { label: '错误', value: 'error' },
          ],
        },
      },
      text: { title: '提示框文本', required: true, default: '', editor: ComponentPropertyEditor.singerLine, width: '50%' },
    },
    attrs: {},
    format: '将弹出{{type}}提示{{text}}',
    action(attrs, config) {
      if (editorState.appConfig.deviceType === DeviceType.pc) {
        toast[attrs.type]({
          message: attrs.text,
        });
      } else {
        toast(attrs.text);
      }
    },
  },

  {
    title: '改变变量',
    name: 'change-variable',
    isGlobal: true,
    group: EventActionGroup.system,
    config: {
      variable: {
        title: '变量',
        required: true,
        editor: ComponentPropertyEditor.variable,
        width: '50%',
        attrs: {},
      },
      value: { title: '值', required: true, default: '', editor: ComponentPropertyEditor.singerLine, width: '40%' },
    },
    attrs: {},
    format: '将设置{{variable}}值为{{value}}',
    action(attrs, config) {
      variableService.setVar(attrs.variable.value, new Function(`return ${attrs.value};`)());
    },
  },

  {
    title: '开始播放',
    name: 'media-start-play',
    isGlobal: false,
    group: EventActionGroup.media,
    config: {
      component: {
        title: '多媒体组件',
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => mediaComponents.includes(component.name),
        },
      },
    },
    attrs: {},
    format: '{{component}}将开始播放',
    action(attrs) {
      const _component = formFillState.componentRefs[attrs.component];
      if (_component) {
        _component?.play();
      } else {
        throw new Error('未查询到对应组件实例');
      }
    },
  },
  {
    title: '暂停播放',
    name: 'media-pause-play',
    isGlobal: false,
    group: EventActionGroup.media,
    config: {
      component: {
        title: '多媒体组件',
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => mediaComponents.includes(component.name),
        },
      },
    },
    attrs: {},
    format: '{{component}}将暂停播放',
    action(attrs) {
      const _component = formFillState.componentRefs[attrs.component];
      if (_component) {
        _component?.pause();
      } else {
        throw new Error('未查询到对应组件实例');
      }
    },
  },
  {
    title: '停止播放',
    name: 'media-stop-play',
    isGlobal: false,
    group: EventActionGroup.media,
    config: {
      component: {
        title: '多媒体组件',
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => mediaComponents.includes(component.name),
        },
      },
    },
    attrs: {},
    format: '{{component}}将停止播放',
    action(attrs) {
      const _component = formFillState.componentRefs[attrs.component];
      if (_component) {
        _component?.stop();
      } else {
        throw new Error('未查询到对应组件实例');
      }
    },
  },
  {
    title: '跳转到__秒',
    name: 'media-goto-location',
    isGlobal: false,
    group: EventActionGroup.media,
    config: {
      component: {
        title: '题目',
        required: true,
        editor: ComponentPropertyEditor.component,
        width: '40%',
        attrs: {
          filter: (component) => mediaComponents.includes(component.name),
        },
      },
      time: { title: '秒数', required: true, editor: ComponentPropertyEditor.int, width: '30%' },
    },
    attrs: {},
    format: '将{{component}}跳转到{{time}}秒',
    action(attrs) {
      const _index = editorState.currentPage.children.findIndex((i) => i.id == attrs.component);
      if (_index >= 0) {
        editorService.gotoComponent(_index);
      }
    },
  },
];
