import { Component } from './component';
import { PropertyGroup } from './property-group';
import { ComponentPropertyEditor, PropertyLayout, ComponentPropertyGroup } from './enum';

/** 通用属性 */
export interface GeneralProperty {
  /** 属性名 */
  name: string | (string | number)[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 属性标题 */
  title: string;
  /** 输入框默认提示 */
  placeholder?: string;
  /** 属性类型 */
  type?: string;
  /** 备注 */
  remark?: string;
  /** 默认值 */
  default?: any;
  /** 是否必填 */
  require?: boolean;
  /** 是否显示 */
  visible?: boolean | ((attrs: Record<string, any>) => boolean);
  /** 是否子级 */
  leaf?: boolean;
  /** 是否为可变属性 */
  isSync?: boolean;
  /** 属性分组 */
  group?: string;
  /** 属性描述 */
  description?: string;
  /** 编辑器 */
  editor: ComponentPropertyEditor;
  /** 初始化（未实装） */
  init?(
    value: any,
    prop: GeneralProperty,
    propMap: Record<string, GeneralProperty>,
    target: Record<string, any>,
  ): void;
  /** 修改属性 */
  change?(
    value: any,
    prop: GeneralProperty,
    propMap: Record<string, GeneralProperty>,
    target: Record<string, any>,
  ): void;
  /** 显示条件 */
  showCondition?(prop: GeneralProperty, propMap: Record<string, GeneralProperty>, target: Record<string, any>): boolean;

  /** 当前属性 */
  attrs?: Record<string, any>;
  /** 属性附加选项 */
  attach?: ComponentPropertyEditor[];
  /** 布局方式，默认为行内布局 */
  layout?: PropertyLayout;
  /** 值格式化函数 */
  format?: (val: any) => any;
  /** 是否全屏 */
  canFullScreen?: boolean;
  /** 属性当前的编辑器 */
  // currentEditor?: ComponentPropertyEditor;

  /** 属性名 */
  names?: string[] | string[][];
  /** 子属性 */
  children?: GeneralProperty[];
}
