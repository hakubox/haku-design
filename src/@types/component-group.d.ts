import { ComponentCategory } from './component-category';

/** 题目组 */
export interface ComponentGroup {
  /** 组标签 */
  label: String;
  /** 题型列表 */
  components: ComponentCategory[];
}
