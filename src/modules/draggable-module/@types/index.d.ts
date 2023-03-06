import { Component } from "@/@types";

/** 对齐线 */
export interface AlignLine {
  /** 方向 */
  // direction: 'horizontal' | 'vertical';
  /** X坐标 */
  x?: number; 
  /** Y坐标 */
  y?: number;
}

/** 简单坐标类 */
export interface Location {
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
}

/** 拖拽组件配置 */
export class RangeSelectConfig {
  /** 当前扫描到的Y坐标 */
  y: number;
  /** 当前扫描到的X坐标 */
  x: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 是否开始正式拖拽 */
  isStart: boolean;
  /** 框选的组件Id列表 */
  componentIds: string[];
  /** 左侧栏宽度 */
  asideWidth: number;
}

/** 拖拽组件配置 */
export class DragConfig {
  /** 当前扫描到的Y坐标 */
  top: number;
  /** 当前扫描到的X坐标 */
  left: number;
  /** 鼠标拖拽的X坐标 */
  mouseX: number;
  /** 鼠标拖拽的Y坐标 */
  mouseY: number;
  /** 拖拽的影子节点 */
  shadowDom?: HTMLElement;
  /** 是否开始预拖拽 */
  isPreDrag: boolean;
  /** 是否开始正式拖拽 */
  isDrag: boolean;
  /** 是否进入放置范围 */
  isDragArea: boolean;
  /** 正在拖拽的组件 */
  component: any;
  /** 记录所有组件开始拖拽坐标（多个组件同时拖拽） */
  startComponentLocs: { id: string, x: number, y: number }[];
  /** 插入索引 */
  insertIndex: number;
  /** 插入的父组件Id（插入最外层时为undefined） */
  insertComponentId?: string;
  /** 插入父组件插槽（组）索引 */
  insertSlotIndex: number;
  /** 移动的源组件Id */
  targetFormComponentId: string;
  /** 拖拽开始坐标 */
  startLoc: Location;
  /** 拖拽开始时的组件坐标 */
  startComponentLoc: Location;
  /** 拖拽结束坐标 */
  endLoc: Location;
  /** 自动吸附坐标 */
  adsorbLoc?: Location;
  /** 是否为已有组件 */
  isExisted: boolean;
  /** 拖拽偏移量（像素） */
  offsetAmount: number;
  /** 是否暂停相关功能（被其他拖拽占用） */
  isPause: boolean;
}

/** 拖拽组件到布局组件参数 */
export class DragLayoutParams {
  /** pageX坐标 */
  pageX: number;
  /** pageY坐标 */
  pageY: number;
  /** 当前扫描的布局组件高度 */
  parentComponentHeight: number;
  /** 当前扫描的布局组件宽度 */
  parentComponentWidth: number;
}

export class DragLayoutReturn {
  /** 当前扫描到的高度 */
  height: number;
  /** 当前扫描到的宽度 */
  width: number;
  /** 是否插入子节点 */
  isInsertInner: boolean;
  /** 是否直接返回（结束拖拽） */
  isReturn: boolean;
}
