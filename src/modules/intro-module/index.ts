import introJs from 'intro.js';
import 'intro.js/introjs.css';
import './less/index.less';
import { reactive } from 'vue';

/** 提示步骤配置项 */
export interface IntroStep {
  /** 绑定DOM节点 */
  element?: Element | null;
  /** 标题 */
  title?: string;
  /** 内容 */
  intro?: string;
}

/** 引导模块Key */
const IntroStorageKey = '__hakuform__intro__';

/** 引导模块状态 */
export const state = reactive({
  /** 配置项参数，具体配置参考官网文档 https://introjs.com/docs/ */
  options: {
    nextLabel: 'Next »', // '下一步',
    prevLabel: '« Previous', // '上一步',
    doneLabel: 'Done', // '完成',
    showProgress: false,
  },
  /** intro实例 */
  introMap: {} as Record<string, any>,
});

/** 引导模块逻辑 */
export const service = {
  /** 判断引导是否已完成（即不再显示） */
  isComplete(code: string) {
    const _obj = JSON.parse(localStorage.getItem(IntroStorageKey) || '{}');
    return _obj[code] ?? false;
  },
  /** 完成引导 */
  complete(code: string, isComplete: boolean = true) {
    const _obj = JSON.parse(localStorage.getItem(IntroStorageKey) || '{}');
    _obj[code] = isComplete;
    localStorage.setItem(IntroStorageKey, JSON.stringify(_obj));
  },
  /**
   * 开始引导
   * @param {string} code 场景代码
   * @param {IntroStep[]} steps 场景步骤
   * @param {Record<string, any>} config 配置项，具体配置参考官网文档 https://introjs.com/docs/
   */
  start(code: string, steps: IntroStep[], config: Record<string, any> = {}) {
    if (service.isComplete(code)) return;
    return new Promise<void>((resolve, reject) => {
      const _obj = introJs();
      state.introMap[code] = _obj;
      _obj.setOptions({
        ...state.options,
        steps,
        ...config,
      });
      _obj.oncomplete(() => {
        service.complete(code);
        delete state.introMap[code];
        resolve();
      });
      _obj.onexit(() => {
        delete state.introMap[code];
        reject();
      });
      _obj.start();
    });
  },
  /** 关闭引导 */
  exit(code: string, isComplete: boolean = false) {
    if (state.introMap[code]) {
      if (isComplete) service.complete(code);
      state.introMap[code].exit();
    }
  },
  /** 跳转到下一步 */
  nextStep(code: string) {
    if (state.introMap[code]) {
      state.introMap[code].nextStep();
    }
  },
  /** 跳转到上一步 */
  prevStep(code: string) {
    if (state.introMap[code]) {
      state.introMap[code].previousStep();
    }
  },
  /** 跳转到指定步骤 */
  gotoStep(code: string, step: number) {
    if (state.introMap[code]) {
      state.introMap[code].goToStepNumber(step);
    }
  },
};

export default {
  state,
  service
}