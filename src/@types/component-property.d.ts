import { Component } from './component';
import { PropertyGroup } from './property-group';
import { ComponentPropertyEditor, PropertyLayout, ComponentPropertyGroup } from './enum';

/** 可拖拽组件属性 */
export declare class ComponentProperty {
  /** 属性名 */
  name: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 属性标题 */
  title: string;
  /** 属性类型 */
  type?: string;
  /** 备注 */
  remark?: string;
  /** 默认值 */
  default?: any;
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
  editor: ComponentPropertyEditor | string;
  /** 修改属性 */
  change?(
    prop: ComponentProperty,
    propMap: Record<string, ComponentProperty>,
    component: Component,
    value: any,
    refs: Record<string, Element>,
  ): void;
  /** 显示条件 */
  showCondition?(
    prop: ComponentProperty,
    propMap: Record<string, ComponentProperty>,
    component: Component,
    value: any,
    refs: Record<string, Element>,
  ): boolean;

  /** 当前属性 */
  attrs?: Record<string, any>;
  /** 属性附加选项 */
  attach?: Array<ComponentPropertyEditor>;
  /** 布局方式，默认为行内布局 */
  layout?: PropertyLayout;
  /** 值格式化函数 */
  format?: (val: any) => any;

  /** 属性当前的编辑器 */
  // currentEditor?: ComponentPropertyEditor;

  /** 绑定多个属性，会自动忽略name属性 */
  names?: string[];
}
