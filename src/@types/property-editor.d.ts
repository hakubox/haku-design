import { Component } from "./component";
import { ComponentGroup } from "./component-group";
import { ComponentProperty } from "./component-property";

/** 属性编辑器 */
export interface PropertyEditor {
  /** 编辑器名称 */
  name: string;
  /** 编辑器描述 */
  description: string;
  /** 编辑器 */
  editor: string;
  /** 值转换器 */
  format?(val: any): any;

  /** 组件名称 */
  component: string;
  /** value属性 */
  model?: string;
  /** HTML */
  html?: string;
  /** 插槽 */
  slot: Record<string, any[]>;
  /** 属性 */
  attrs: Record<string, any>;
  /** 事件 */
  events: Record<string, Function>;
  propAttrs: Record<string, any>;
  /** 是否全屏 */
  canFullScreen?: boolean;
  /** 工具栏 */
  tools?: {
    /** 图标 */
    icon?: string,
    /** 标签 */
    label?: string,
    /** 提示 */
    tooltip?: string,
    /** 点击事件 */
    click: (e: MouseEvent, components: (Component | ComponentGroup)[], property: ComponentProperty) => void,
    /** 是否禁用 */
    disabled?: () => boolean,
    /** 是否隐藏 */
    hidden?: () => boolean,
  }[];
}
