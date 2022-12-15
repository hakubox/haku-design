
/** 公式类型 */
export enum FormulaType {
  text = '文本函数',
  math = '数学函数',
  date = '日期函数',
  logic = '逻辑函数',
}

/** 公式参数类型 */
export enum FormulaParamType {
  /** 任意类型 */
  any = 'any',
  /** 字符串 */
  string = 'string',
  /** 数值 */
  number = 'number',
  /** 布尔类型 */
  boolean = 'boolean',
  /** 数组类型 */
  array = 'array',
  /** 数组类型 */
  object = 'object',
}