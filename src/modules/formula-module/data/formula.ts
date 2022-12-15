import type { AddFormula } from '../@types';
import { FormulaParamType, FormulaType } from '../type';

/** 新增公式 */
export const addFormula: AddFormula = (formula) => {
  return formula;``
};

export const formulas = [
  addFormula({
    name: 'LOWER',
    type: FormulaType.text,
    description: ``,
    summary: '将一个文本字符串的所有字母转换为小写形式',
    params: [
      { name: 'text', type: 'string', required: true, description: '文本参数' },
    ],
    returnType: FormulaParamType.boolean,
    func: (text) => `${text}`.toLowerCase(),
  }),
  addFormula({
    name: 'UPPER',
    type: FormulaType.text,
    description: ``,
    summary: '将文本字符串转换成字母全部大写形式',
    params: [
      { name: 'text', type: 'string', required: true, description: '文本参数' },
    ],
    returnType: FormulaParamType.boolean,
    func: (text) => `${text}`.toUpperCase(),
  }),

  addFormula({
    name: 'CONCAT',
    type: FormulaType.logic,
    description: ``,
    summary: '将多个字符文本或单元格中的数据连接在一起',
    params: [
      { name: 'params', type: 'boolean[]', required: true, isExtend: true, description: '参数' },
    ],
    returnType: FormulaParamType.boolean,
    func: (...params) => params.length == 0 ? '' : params.reduce((a, b) => `${a}${b}`),
  }),

  addFormula({
    name: 'ABS',
    type: FormulaType.math,
    description: `<code>ABS</code>函数可以获取一个数的绝对值
用法：<code>ABS</code>(数字)
示例：<code>ABS</code>(-8)可以返回8，也就是-8的绝对值`,
    summary: '返回给定数值的绝对值，即不带符号的数值',
    example: `=SUM(1, 2, 3)`,
    params: [
      { name: 'value', type: 'number', required: true, description: '值' }
    ],
    returnType: FormulaParamType.number,
    func: (value) => Math.abs(value),
  }),
  addFormula({
    name: 'SUM',
    type: FormulaType.math,
    description: `<code>SUM</code>函数可以获取一组数值的总和
用法：<code>SUM</code>(数字1,数字2,...)
示例：<code>SUM</code>(语文成绩,数学成绩, 英语成绩)返回三门课程的总分`,
    summary: '计算所有参数数值之和',
    params: [
      { name: 'numA', type: 'number', required: true, description: '相加数值' },
      { name: 'elseNum', type: 'number[]', required: true, isExtend: true, description: '其他相加数值' }
    ],
    returnType: FormulaParamType.number,
    func: (numA, ...elseNum) => [numA, ...elseNum].reduce((a, b) => a + b),
  }),
  addFormula({
    name: 'AVERAGE',
    type: FormulaType.math,
    description: ``,
    summary: '返回其参数的算术平均值',
    params: [
      { name: 'params', type: 'number[]', required: true, isExtend: true, description: '参数' },
    ],
    returnType: FormulaParamType.number,
    func: (...params: number[]) => params.reduce((a, b) => a + b) / params.length,
  }),

  addFormula({
    name: 'AND',
    type: FormulaType.logic,
    description: ``,
    summary: '检查是否所有参数均为true，如果所有参数值均为true，则返回true',
    params: [
      { name: 'params', type: 'boolean[]', required: true, isExtend: true, description: '参数' },
    ],
    returnType: FormulaParamType.boolean,
    func: (...params) => params.every(i => i === true),
  }),
];
