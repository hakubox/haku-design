import { VNode } from "vue";

/** 变量类型 */
export type VariableType = 'string' | 'number' | 'datetime' | 'boolean' | 'list' | 'object';

/** 变量树节点 */
export interface VariableTreeNode {
  /** 变量名 */
  name: string;
  /** 标题 */
  title: string | VNode;
  /** 类型 */
  type: VariableType;
  /** 变量子项 */
  children?: VariableTreeNode[];
  /** 是否可选 */
  selectable?: boolean;
  /** 值 */
  value?: any;
}


const aaa: {
  a: number,
  b: {
    c: number,
  },
  d: [
    f: number,
    g: Number,
  ]
} = {};