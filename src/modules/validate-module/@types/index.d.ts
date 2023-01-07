/** 校验类型 */
export type ValidateType =
  | 'required'
  | 'enum'
  | 'len'
  | 'min'
  | 'max'
  | 'minlen'
  | 'maxlen'
  | 'pattern'
  | 'type'
  | 'validator'
  | 'whitespace';

/** 校验规则 */
export interface ValidateRule {
  /** 校验类型 */
  validateType: ValidateType;
  /** 校验参数 */
  param?: any;
}

/** 基础校验规则 */
export interface BasicRule {
  /** 枚举值 */
  enum?: string;
  /** 文本长度 */
  len?: number;
  /** 最大值 */
  max?: number;
  /** 最小值 */
  min?: number;
  /** 最大长度 */
  maxlen?: number;
  /** 最小长度 */
  minlen?: number;
  /** 正则表达式校验 */
  pattern?: RegExp;
  /** 校验文案 */
  message?: string;
  /** 内建校验类型 */
  type?: string;
  /** 是否忽略空格 */
  whitespace?: boolean;
  /** 
   * 触发时机
   * @deprecated 暂时不支持
   */
  trigger?: 'blur' | 'change' | ['blur' | 'change'];
  /** 校验前转换函数 */
  transform?: (val: any) => any;
  /** 自定义校验 */
  validator?: (rule, value, callback) => boolean;
}