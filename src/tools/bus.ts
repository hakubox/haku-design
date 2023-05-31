import { Component, ComponentGroup } from "@/@types";
import { HandleType } from "@/common/component-handle";

export const enum GlobalBusType {
  /** 刷新 */
  onRefresh = 'on_refresh',
  /** 属性改变事件 */
  propChange = 'prop_change',
  /** 组件改变事件 */
  componentChange = 'component_change',
  /** 组件的自动大小改变事件 */
  autoSizeChange = 'auto_size_change',
  /** 新增组件 */
  addShopComponent = 'add_shop_component',
  /** 选择变量 */
  variablePickerSelect = 'variable_picker_select',
  /** 变量选择器显示 */
  variablePickerShow = 'variable_picker_show',
  /** 更新变量 */
  updateVariable = 'update_variable',
  /** 版本切换 */
  versionChange = 'version_change',
  /** 组件操作钩子 */
  componentHandle = 'component_handle',
  /** 背景编辑器修改事件 */
  backgroundEditorChange = 'background_editor_change'
}

export interface GlobalBusEvent {
  [GlobalBusType.onRefresh]: () => void;
  [GlobalBusType.propChange]: () => void;
  [GlobalBusType.componentChange]: (components: (Component | ComponentGroup)[]) => void;
  [GlobalBusType.autoSizeChange]: (component: Component) => void;
  [GlobalBusType.addShopComponent]: () => void;
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

/** Bus */
export class Bus {
  constructor() {
    // 收集订阅信息,调度中心
    this.list = new Map<GlobalBusType, GlobalBusEvent[GlobalBusType][]>();
  }

  list: Map<GlobalBusType, GlobalBusEvent[GlobalBusType][]>;

  /** 订阅 */
  $on<T extends GlobalBusType>(name: T, fn: GlobalBusEvent[T]) {
    const _fnArr = this.list.get(name);
    if (!_fnArr) {
      this.list.set(name, []);
      this.list.get(name)?.push(fn);
    } else {
      _fnArr!.push(fn);
    }
  }

  /** 发布 */
  $emit<T extends GlobalBusType>(name: T, ...data: Parameters<GlobalBusEvent[T]>): void {
    const _fnArr = this.list.get(name);
    if (_fnArr) {
      for (let i = 0; i < _fnArr.length; i++) {
        const _fn = _fnArr[i] as Function;
        _fn(...data);
      }
    }
  }

  /** 取消订阅 */
  $off<T extends GlobalBusType>(name: T) {
    this.list.delete(name);
  }
}

const bus = new Bus();

export default bus;
