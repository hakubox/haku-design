import { state as editorState, service as editorService } from '@haku-design/editor';
import { reactive } from 'vue';

/** 序号类型 */
export interface SerialNumberType {
  /** 序号类型名称 */
  name: string;
  /** 格式化函数 */
  format: (index) => string;
}

/** 序号组类型 */
export interface SerialNumberGroupType {
  /** 序号组类型名称 */
  name: string;
  /** 对应序号项 */
  items: string[];
  /** 分割字符 */
  splitChar: string;
  /** 缩进字符 */
  indentLength: string;
}

/** 数字转为阿拉伯数字 */
export const intToRoman = (num: number): string => {
  const map = {
    1: 'I',
    5: 'V',
    10: 'X',
    50: 'L',
    100: 'C',
    500: 'D',
    1000: 'M',
  };
  // 标识位数
  let digits = 1;
  // 结果
  let result = '';
  while (num) {
    const current = num % 10;
    if (current < 4) {
      result = map[digits].repeat(current) + result;
    } else if (current === 4) {
      result = map[digits] + map[digits * 5] + result;
    } else if (current > 4 && current < 9) {
      result = map[digits * 5] + map[digits].repeat(current - 5) + result;
    } else {
      result = map[digits] + map[digits * 10] + result;
    }
    digits *= 10;
    num = Math.trunc(num / 10);
  }
  return result;
};

/** 序号模块状态 */
export const state = reactive({
  /** 序号项列表 */
  serialNumberItemTypeList: [
    {
      name: '1',
      format: (index) => index + 1,
    },
    {
      name: 'a',
      format: (index) => {
        if (index <= 26) return String.fromCharCode(97 + index);
        else {
          const _char = String.fromCharCode(97 + (index % 26));
          const _count = Math.floor(index / 26);
          return _char.repeat(_count);
        }
      },
    },
    {
      name: 'i',
      format: intToRoman,
    },
  ] as SerialNumberType[],
  /** 序号组列表 */
  serialNumberGroupList: [
    {
      name: '类型A',
      items: ['1', 'a', 'i'],
      splitChar: '、',
      indentLength: '  ',
    },
  ] as SerialNumberGroupType[],
});

/** 阿拉伯数字转为数字 */
export const romanToInt = (s: string): number => {
  const map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let index = 0;
  let result = 0;
  const len = s.length;
  while (index < len) {
    const current = map[s[index]];
    result += current;
    if (index > 0) {
      const before = map[s[index - 1]];
      if ((current === 5 || current === 10) && before === 1) {
        result -= 2;
      }
      if ((current === 50 || current === 100) && before === 10) {
        result -= 20;
      }
      if ((current === 500 || current === 1000) && before === 100) {
        result -= 200;
      }
    }
    index++;
  }
  return result;
};

/** 序号模块逻辑 */
export const service = {
  /** 获取题目序号 */
  getQuestionNo(componentId: string) {
    const componentConfig = editorService.findParentComponent(componentId, { ignoreHidden: true, ignoreNotForm: true, appPage: editorState.mainPage });
    if (componentConfig) {
      if (!componentConfig.originComponent.attrs.visible) return '';
      const serialNumberGroup = state.serialNumberGroupList[0];
      const serialNumberItem = state.serialNumberItemTypeList.find(i => i.name === serialNumberGroup.items[componentConfig.level % 3]);
      return `${serialNumberGroup.indentLength.repeat(componentConfig.level)}${serialNumberItem?.format(componentConfig?.index)}${serialNumberGroup.splitChar}`;
    } else {
      return '';
    }
  },
}

export default {
  state,
  service
}