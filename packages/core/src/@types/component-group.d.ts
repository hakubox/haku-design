import { Component } from './component';

/** 题目组合 */
export interface ComponentGroup {
  /** Id */
  id: string;
  /** 组件 */
  name: 'ComponentGroup';
  /** 是否为组合 */
  isGroup: true;
  /** 是否为表单项（问题 or 装饰） */
  isFormItem: false;
  /** 组标签 */
  label: string;
  /** 题目组合属性 */
  attrs: {
    /** 是否锁定 */
    lock: boolean;
    /** 是否显示 */
    visible: boolean;
  } & Record<string, any>;
  /** 是否（在答题中）不显示 */
  isHidden: false;
  /** 子组件 */
  children: (Component | ComponentGroup)[];
  /** 当前组件所在插槽索引（普通情况下为undefined，单个内容布局组件下为0） */
  slotIndex?: number;
  /** 当前组件所在插槽名称 */
  slotName?: string;
}
