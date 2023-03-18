import type { Component } from './component';
import { ComponentGroup } from './component-group';

/** 组件快捷工具栏配置 */
export interface ComponentQuickTool {
  /** 标签 */
  label?: string | ((component: Component | ComponentGroup) => string);
  /** 提示文本 */
  tooltip?: string | ((component: Component | ComponentGroup) => string);
  /** 图标 */
  icon?: string | ((component: Component | ComponentGroup) => string);
  /** 文字大小（默认13px） */
  fontSize?: number;
  /** 操作回调函数 */
  callback?: (component: Component | ComponentGroup) => void;
}