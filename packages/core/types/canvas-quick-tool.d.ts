
/** 画布工具项 */
export interface CanvasQuickTool {
  type: 'tool' | 'split';
  /** 标题 */
  title: string;
  /** 图标 */
  icon: string;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否选中（针对可选择项） */
  isChecked?: boolean;
  /** 操作 */
  fn: () => void;
  /** 子工具列表 */
  children?: CanvasQuickTool[];
}