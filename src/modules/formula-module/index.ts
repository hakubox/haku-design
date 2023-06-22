import type { Formula, AddFormula, FormulaParam } from './index.d';
import { formulas } from './data/formula';
import { service as variableService } from '@/modules/variable-module';
import { reactive } from 'vue';

export * from './index.d';

/** 公式模块状态 */
export const state = reactive({
  /** 是否已初始化公式组件 */
  initFormulaComponent: false,
  /** 公式列表 */
  formulaList: formulas as Formula[],
});

/** 公式模块逻辑 */
export const service = {
  /** 获取函数头 */
  getTitle(formula: Formula) {
    const formulaParams = Object.entries(formula.params)
      .map(([key, value]) => `${key}: ${value.type}`)
      .join(', ');
    return `${formula.name}(${formulaParams}) => ${formula.returnType}`;
  },
  /** 获取函数的值 */
  getValue(formulaValue: string) {
    try {
      const _vars = {
        ...variableService.getSystemVariableMap(),
        ...variableService.getDataSourceVariableMap(),
      };
      const _formulas = Object.assign([], ...state.formulaList.map(i => ({ [i.name]: i.func })));
      const _re = new Function('__data__', '__formula__', `
        const { ${Object.keys(_vars).join(', ')} } = __data__;
        const { ${state.formulaList.map(i => i.name).join(', ')} } = __formula__;
        return ${formulaValue};
      `)(_vars, _formulas);
      if (typeof _re === 'function') return new Error('不允许返回函数类型的结果');
      return _re;
    } catch(err) {
      return `${err}`;
    }
  }
};

export default {
  state,
  service,
  install() {
    
  }
}