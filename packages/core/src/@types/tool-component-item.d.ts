import { ComponentAnswerType, ComponentCategory, PageType, AppType } from '@haku-design/core';

/** 工具箱组件项 */
export declare interface ToolComponentItem {
  /** 组件名称 */
  name: string;
  /** 组件图标 */
  icon: string;
  /** 组件标题 */
  title: string;
  /** 适配页面类型 */
  pageType?: PageType[];
  /** 适配应用类型 */
  appType?: AppType[];
  /** 分组 */
  category: ComponentCategory;
  /** 额外配置属性 */
  attrs?: Record<string, any>;
  /** 是否新组件 */
  isNew?: boolean;
  /** 答案类型 */
  answerType?: ComponentAnswerType;
}
