import { Component } from './component';
import { ComponentPropertyEditor, PropertyLayout, ComponentPropertyGroup, AppType } from '../enum';
import { ComponentPropertyMap } from './general-property';

/** 可拖拽组件属性 */
export declare class ComponentProperty<T extends ComponentPropertyEditor> {
  /** 属性名 */
  name: string | string[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 属性标题 */
  title: string;
  /** 属性类型 */
  type?: string;
  /** 备注 */
  remark?: string;
  /** 默认值 */
  default?: ComponentPropertyMap[T]['returnValue'];
  /** 是否必填 */
  require?: boolean;
  /** 是否显示 */
  visible?: boolean;
  /** 是否子级 */
  leaf?: boolean;
  /** 是否为可变属性 */
  isSync?: boolean;
  /** 属性分组 */
  group?: ComponentPropertyGroup;
  /** 属性描述 */
  description?: string;
  /** 编辑器 */
  editor: T;
  /** 修改属性 */
  change?(value: {
    prop: ComponentProperty<T>,
    propMap: Record<string, ComponentProperty<any>>,
    component: Component,
    value: ComponentPropertyMap[T]['returnValue'],
  }): void;
  /** 显示条件 */
  showCondition?(value: {
    prop: ComponentProperty<T>,
    propMap: Record<string, ComponentProperty<any>>,
    component: Component,
    value: ComponentPropertyMap[T]['returnValue'],
  }): boolean;

  /** 当前属性 */
  attrs?: ComponentPropertyMap[T]['attrs'] | {};
  /** 属性附加选项 */
  attach?: Array<ComponentPropertyEditor>;
  /** 布局方式，默认为行内布局 */
  layout?: PropertyLayout;
  /** 值格式化函数 */
  format?: (val: ComponentPropertyMap[T]['returnValue']) => any;


  /** 属性当前的编辑器 */
  // currentEditor?: ComponentPropertyEditor;

  /** 绑定多个属性，会自动忽略name属性 */
  names?: string[];
  /** 子属性 */
  children?: ComponentProperty<any>[];
  /** 排序索引 */
  sort?: number;
  /** 应用类型筛选 */
  appType?: AppType[];
}
