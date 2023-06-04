/** 数据编辑器的值 */
export interface DataEditorValue {
  /** 数据类型（固定为 data-editor ） */
  dataOrigin: 'data-editor';
  /** 类型 */
  type: 'data-string' | 'data-number' | 'data-boolean' | 'data-date' | 'data-component' | 'data-variable' | 'data-component-option';
  /** 值 */
  value: any;
  /** 额外配置 */
  config: Record<string, any>;
}