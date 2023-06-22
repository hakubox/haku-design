import { Component } from './component';
import { LayoutType } from '../../packages/core/enum';
import { ComponentLayout } from './layout-config';

export type AllLayoutConfig = LayoutConfig<LayoutType.flex> | LayoutConfig<LayoutType.absolute> | LayoutConfig<LayoutType.table>;

/** 布局配置 */
export type LayoutConfig<T extends LayoutType> = {
  /** 布局类型 */
  layout: T;
  /** 布局配置 */
  layoutDetailConfig: ComponentLayout[T];
};
