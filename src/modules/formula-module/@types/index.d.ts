import { FormulaParamType, FormulaType } from '../type';


/** 公式 */
export interface Formula {
  /** 公式名称 */
  name: string;
  /** 类型 */
  type: FormulaType;
  /** 参数列表 */
  params: FormulaParam[];
  /** 返回值类型 */
  returnType: FormulaParamType;
  /** 简介 */
  summary: string;
  /** 描述 */
  description: string;
  /** 示例 */
  example?: string;
  /** 公式代码 */
  func: function;
}

/** 真实TS类型转换 */
type RealVarType<K = any> = {
  any: any;
  string: string;
  number: number;
  boolean: boolean;
  array: K[];
  object: Record<string, K>;
};

type GetVarType<T extends keyof RealVarType> = RealVarType[T];

type GetVarRequired<T> = T['required'] extends true
  ? GetVarType<T['type']>
  : T['default'] extends GetVarType<T['type']> | (() => GetVarType<T['type']>)
  ? GetVarType<T['type']>
  : GetVarType<T['type']> | undefined;

export type AddFormula = <Params extends FormulaParam[], ReturnValue extends FormulaParamType>(formula: Formula & {
  /** 公式代码 */
  func: (...params: any[]) => RealVarType[ReturnValue];
}) => Formula;

/** 公式参数 */
export interface FormulaParam {
  /** 参数名 */
  name: string;
  /** 参数类型 */
  type: string;
  /** 是否必填 */
  required?: boolean;
  /** 默认值 */
  default?: (() => any) | any;
  /** 描述 */
  description: string;
  /** 是否为扩展参数 */
  isExtend?: boolean;
}