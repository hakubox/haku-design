import type { Component } from './component';

/** 组件快捷工具栏配置 */
export interface ComponentQuickTool {
  /** 标签 */
  label?: string | ((component: Component) => string);
  /** 提示文本 */
  tooltip?: string | ((component: Component) => string);
  /** 图标 */
  icon?: string | ((component: Component) => string);
  /** 文字大小（默认13px） */
  fontSize?: number;
  /** 操作回调函数 */
  callback?: (component: Component) => void;
}