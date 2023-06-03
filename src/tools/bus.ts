import { Component, ComponentGroup } from "@/@types";
import { HandleType } from "@/common/component-handle";
import { computed, reactive, ref } from "vue";

export const enum GlobalBusType {
  /** 屏幕大小改变 */
  onPageResize = 'on_page_resize',
  /** 在body上的光标松开事件（一般用作拖拽结束） */
  onBodyMouseUp = 'on_body_mouse_up',
  /** 在body上的光标移动事件（一般用作拖拽） */
  onBodyMouseMove = 'on_body_mouse_move',
  /** 点击body元素事件（一般用作弹窗关闭） */
  onBodyMouseDown = 'on_body_click',
  /** 刷新 */
  onRefresh = 'on_refresh',
  /** 属性改变事件 */
  propChange = 'prop_change',
  /** 组件改变事件 */
  componentChange = 'component_change',
  /** 组件的自动大小改变事件 */
  autoSizeChange = 'auto_size_change',
  /** 刷新组件库 */
  refreshShopComponent = 'refresh_shop_component',
  /** 选择变量 */
  variablePickerSelect = 'variable_picker_select',
  /** 变量选择器显示 */
  variablePickerShow = 'variable_picker_show',
  /** 更新变量 */
  updateVariable = 'update_variable',
  /** 监听应用版本切换 */
  versionChange = 'version_change',
  /** 组件操作钩子 */
  componentHandle = 'component_handle',
  /** 背景编辑器修改事件 */
  backgroundEditorChange = 'background_editor_change'
}

export interface GlobalBusEvent {
  [GlobalBusType.onPageResize]: () => void;
  [GlobalBusType.onBodyMouseUp]: (e: MouseEvent) => void;
  [GlobalBusType.onBodyMouseMove]: (e: MouseEvent) => void;
  [GlobalBusType.onBodyMouseDown]: () => void;
  [GlobalBusType.onRefresh]: () => void;
  [GlobalBusType.propChange]: () => void;
  [GlobalBusType.componentChange]: (components: (Component | ComponentGroup)[]) => void;
  [GlobalBusType.autoSizeChange]: (component: Component) => void;
  [GlobalBusType.refreshShopComponent]: () => void;
  [GlobalBusType.variablePickerSelect]: (
    /** 变量名 */
    variable: string
  ) => void;
  [GlobalBusType.variablePickerShow]: (isShow: boolean) => void;
  [GlobalBusType.updateVariable]: () => void;
  [GlobalBusType.versionChange]: () => void;
  [GlobalBusType.componentHandle]: (eventName: HandleType, params, component: Component) => void;
  [GlobalBusType.backgroundEditorChange]: () => void;
}

/** 事件总线 */
export class Bus {
  constructor() {
    // 收集订阅信息,调度中心
    this.list = new Map<GlobalBusType, GlobalBusEvent[GlobalBusType][]>();
    this.isDebug = false;
    this.disabledEventList = reactive([]);
  }

  list: Map<GlobalBusType, GlobalBusEvent[GlobalBusType][]>;

  /** 是否为debug状态 */
  isDebug: boolean;

  /** 禁用事件列表 */
  disabledEventList: GlobalBusType[];

  /** 订阅 */
  $on<T extends GlobalBusType>(name: T, fn: GlobalBusEvent[T]) {
    const _fnArr = this.list.get(name);
    if (!_fnArr) {
      this.list.set(name, [fn]);
      if (this.isDebug) busEvents[name] = [fn];
    } else {
      _fnArr!.push(fn);
      if (this.isDebug) busEvents[name].push(fn);
    }
  }

  /** 发布 */
  $emit<T extends GlobalBusType>(name: T, ...data: Parameters<GlobalBusEvent[T]>): void {
    if (this.disabledEventList.includes(name)) {
      if (this.isDebug) execEvent.value = `[禁用] ${name}: ${0}`;
      return;
    }
    const _fnArr = this.list.get(name);
    if (_fnArr) {
      for (let i = 0; i < _fnArr.length; i++) {
        const _fn = _fnArr[i] as Function;
        _fn(...data);
      }
      if (this.isDebug) execEvent.value = `${name}: ${_fnArr.length}`;
    }
  }

  /** 禁用事件 */
  $disabled<T extends GlobalBusType>(name: T) {
    const _index = this.disabledEventList.indexOf(name);
    if (_index < 0) {
      this.disabledEventList.push(name);
    }
  }

  /** 启用事件 */
  $enable<T extends GlobalBusType>(name: T) {
    const _index = this.disabledEventList.indexOf(name);
    if (_index >= 0) {
      this.disabledEventList.splice(_index, 1);
    }
  }

  /** 取消订阅 */
  $off<T extends GlobalBusType>(name: T, cb?: GlobalBusEvent[T]) {
    if (cb) {
      const _fnList = this.list.get(name);
      if (_fnList?.length) {
        const _fnIndex = _fnList.indexOf(cb);
        if (_fnIndex >= 0) {
          if (this.isDebug) busEvents[name].splice(_fnIndex, 1);
          _fnList.splice(_fnIndex, 1);
          // this.list.set(name, _fnList);
        }
      }
    } else {
      this.list.delete(name);
      if (this.isDebug) delete busEvents[name];
    }
  }
}

const bus = new Bus();

export const execEvent = ref('');

export const busEvents = reactive<Record<string, any>>({});

export default bus;
