import { ComponentProperty } from './component-property';
import { ComponentOption } from './component-option';
import {
  ComponentCategory,
  ComponentPropertyEditor,
} from '@haku-design/core';
import { ComponentQuickTool, ComponentGroup } from '..';
import { AllLayoutConfig } from './form-panel';


/** 布局类型 */
// export type LayoutType = 'none' | 'flex' | 'center' | 'absolute' | 'table';
// {
//   /** 无布局（直接放置） */
//   none = 'none',
//   /** 流式布局 */
//   flex = 'flex',
//   /** 中心布局 */
//   center = 'center',
//   /** 绝对布局 */
//   absolute = 'absolute',
//   /** 表格布局 */
//   table = 'table',
// }

/** 组件答案类型 */
export type ComponentAnswerType =
  | 'none'
  | 'boolean'
  | 'number'
  | 'number-list'
  | 'text'
  | 'text-list'
  | 'option'
  | 'option-list'
  | 'datetime'
  | 'datetime-range'
  | 'file'
  | 'file-list'
  | 'blob'
  | 'base64'
  | 'array-list'
  | 'variable'
  | 'extrainfo-list';

/** 可拖拽组件 */
export interface Component {
  /** Id */
  id: string;
  /** 组件名 */
  name: string;
  /** 是否为组合 */
  isGroup: false;
  /** 是否（在答题中）不显示 */
  isHidden: boolean;
  /** 是否为表单项（问题 or 装饰） */
  isFormItem: boolean;
  /** 是否为顶级组件 */
  isTopLevel: boolean;
  /** 类型 */
  type: ComponentCategory;
  /** 组件标题 */
  title: string;
  /** 答案类型 */
  answerType?: ComponentAnswerType;
  /** 是否必填 */
  // required: boolean;
  /** 配置 */
  // config: Record<string, any>;
  /** 组件类型（组件tagName） */
  component: string;
  /** 组件属性 */
  attrs: {
    /** 是否锁定 */
    lock: boolean;
    /** 是否显示 */
    visible: boolean;
  } & Record<string, any>;
  /** 组件事件 */
  events?: Record<string, any>;
  /** 默认组件属性编辑器 */
  propertyEditors?: Record<string, ComponentPropertyEditor>;
  /** 额外组件属性编辑器 */
  extraEditors?: Record<string, ComponentPropertyEditor>;
  /** 属性 */
  propertys: ComponentProperty<any>[];
  /** [NEW]子组件属性 */
  childPropertys?: ComponentProperty<any>[];
  /** 子组件 */
  children?: (Component | ComponentGroup)[];
  /** 子组件区域选择器（与插槽无关） */
  childrenSlot?: string;
  /** 子组件区域内容选择器（与插槽无关） */
  childrenContentSlot?: string;
  /** 布局配置 */
  layoutConfig?: AllLayoutConfig;
  /** 备注 */
  remark?: string;
  /** 组件快捷工具栏 */
  quickTools?: ComponentQuickTool[];
  
  /** 当前组件所在插槽索引（普通情况下为undefined，单个内容布局组件下为0） */
  slotIndex?: number;
  /** 当前组件所在插槽名称 */
  slotName?: string;
}