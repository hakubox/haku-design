import { MainAxisAlignment, CrossAxisAlignment } from '@/@types/enum';

/** 组件布局 */
interface ComponentLayout {
  /** 无布局 */
  none: void;
  /** 流式布局 */
  flex: FlexLayout;
  /** 中心布局（未实现） */
  center: void;
  /** 绝对定位布局 */
  absolute: AbsoluteLayout;
  /** 表格布局 */
  table: TableLayout;
}

/** 基础布局配置 */
export declare interface BasicLayout {
  id?: string;
}

/** Flex布局配置类 */
export declare interface FlexLayout extends BasicLayout {
  /** 类型 */
  direction: 'row' | 'column';
  /** 主轴配置 */
  mainAxisAlignment: MainAxisAlignment;
  /** 次轴配置 */
  crossAxisAlignment: CrossAxisAlignment;
  /** 最大子组件数 */
  maxChildCount: number;
}

/** 绝对定位布局配置类 */
export declare interface AbsoluteLayout extends BasicLayout {
  /** 网格大小 */
  gridSize?: number;
}

/** 绝对定位布局配置类 */
export declare interface TableLayout extends BasicLayout {
  /** 行数 */
  rowCount: number;
  /** 列数 */
  colCount: number;
}
