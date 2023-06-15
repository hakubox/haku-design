
/** 编辑器拖拽节点 */
export interface EditorDragNode {
  /** 拖拽节点Id */
  id: string;
  /** 组件 */
  component: 'item' | 'list';
  /** 子节点 */
  children: EditorDragNode[];
}