import { Component } from './component';
import { PageType } from './enum';

/** 表单下的页面 */
export interface AppPage {
  /** 页面标题 */
  pageTitle: string;
  /** 页面类型 */
  pageType: PageType;
  /** 组件列表 */
  children: Component[];
}
