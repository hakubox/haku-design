import { reactive, computed } from 'vue';
import Schema from 'async-validator';
import type { ValidateRule, ValidateType } from './index.d';

export * from './index.d';

const typeTemplate = '{{%s}}不是一个有效的%s';
/** 校验模块状态 */
export const state = reactive({
  lang: {
    /** 中文 */
    cn: {
      default: '字段验证错误%s',
      required: '请输入%s',
      enum: '%s必须是其中一个[%s]',
      whitespace: '{{%s}}不能为空字符',
      date: {
        format: '{{%s}}日期格式无效',
        parse: '{{%s}}不能转换为日期',
        invalid: '{{%s}}是一个无效日期'
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate
      },
      string: {
        len: '{{%s}}须为%s个字符',
        min: '{{%s}}最少%s个字符',
        max: '{{%s}}最多%s个字符',
        range: '{{%s}}须在%s-%s字符之间'
      },
      number: {
        len: '{{%s}}必须等于%s',
        min: '{{%s}}最小值为%s',
        max: '{{%s}}最大值为%s',
        range: '{{%s}}须在%s-%s之间'
      },
      array: {
        len: '须为%s个%s',
        min: '最少%s个%s',
        max: '最多%s个%s',
        range: '%s数量须在%s-%s之间'
      },
      pattern: {
        mismatch: '{{%s}}模式不匹配%s'
      }
    },
  },
  /** 内建校验类型选项 */
  types: [
    { value: 'any', label: '任意值' },
    { value: 'string', label: '字符串' },
    { value: 'number', label: '数字' },
    { value: 'boolean', label: '布尔/真假' },
    { value: 'method', label: '函数' },
    { value: 'regexp', label: '正则表达式' },
    { value: 'integer', label: '整数' },
    { value: 'float', label: '浮点数' },
    { value: 'array', label: '数组' },
    { value: 'object', label: '对象' },
    { value: 'enum', label: '枚举' },
    { value: 'date', label: '日期' },
    { value: 'url', label: '地址' },
    { value: 'hex', label: 'HEX颜色' },
    { value: 'email', label: '邮箱' },
  ],
  /** 默认规则警告信息 */
  defaultRuleMessage: {
    required: () => `{{label}}不能为空。`,
    enum: () => `{{label}}必须为指定值。`,
    len: () => `{{label}}长度必须为{{value}}位。`,
    min: () => `{{label}}最小不能低于{{value}}。`,
    max: () => `{{label}}最大不能超过{{value}}。`,
    minlen: () => `{{label}}最小不能低于{{value}}位。`,
    maxlen: () => `{{label}}最大不能超过{{value}}位。`,
    pattern: () => `{{label}}格式不正确。`,
    type: () => `{{label}}必须为{{value}}格式。`,
    validator: () => `{{label}}格式不正确。`,
    whitespace: () => ``,
  }
});

/** 校验模块逻辑 */
export const service = {
  /** 根据值类型获取校验类型列表 */
  getRulesByValidateType(validateType: string): ValidateType[] {
    switch (validateType) {
      case 'any': return ['required', 'enum', 'len', 'min', 'max', 'pattern', 'validator', 'whitespace']; //'type',
      case 'text': return ['required', 'enum', 'len', 'min', 'max', 'pattern', 'validator', 'whitespace']; //'type',
      case 'number': return ['required', 'min', 'max', 'validator', 'whitespace'];
      case 'select': return ['required'];
      case 'date': return ['required'];
      case 'upload': return ['required'];
      default: return [];
    }
  },
  /** 校验 */
  validate(val: any, rules: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const validator = new Schema(rules);
      validator.messages(state.lang.cn);
      return validator.validate(val, {
        first: false,
      }, (errors, fields) => {
        if (errors) {
          reject({ errors, fields });
        } else {
          resolve();
        }
      });
    });
  },
  /** 数组转换为对象校验 */
  transformValidate(val: any, rules: Record<ValidateType, any>[], message?: string) {
    return this.validate({ value: val }, {
      value: {
        ...Object.assign({}, ...rules),
        message
      }
    });
  }
};

export default {
  /** 校验模块状态 */
  state,
  /** 校验模块逻辑 */
  service,
};