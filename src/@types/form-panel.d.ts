import { Component } from './component';
import { LayoutType } from './enum';
import { LayoutType, ComponentLayout } from './layout-config';

/** 布局配置 */
export type LayoutConfig<T extends LayoutType> = {
  /** 布局类型 */
  layout: T;
  /** 布局配置 */
  layoutDetailConfig: ComponentLayout[T];
};
